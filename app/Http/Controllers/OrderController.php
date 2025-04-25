<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use Exception;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query()
            ->with(['user:id,first_name,last_name,email', 'items.product:id,name,price'])
            ->when($request->filled('user'), function ($query) use ($request) {
                $query->where('user_id', $request->user);
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->when($request->filled('payment_status'), function ($query) use ($request) {
                $query->where('payment_status', $request->payment_status);
            })
            ->when($request->has('archived'), function ($query) use ($request) {
                $query->where('archived', $request->archived);
            })
            ->when($request->filled(['from', 'to']), function ($query) use ($request) {
                $query->whereBetween('created_at', [
                    Carbon::parse($request->from)->startOfDay(),
                    Carbon::parse($request->to)->endOfDay()
                ]);
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;
                $query->where(function ($query) use ($search) {
                    $query->whereHas('user', function ($query) use ($search) {
                        $query->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })->orWhere('id', 'like', "%{$search}%");
                });
            });

        // Add sorting
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');
        $query->orderBy($sort, $direction);

        $orders = $query->paginate(10)->withQueryString();

        // Get filter options
        $users = User::select('id', 'first_name', 'last_name')
            ->whereHas('orders')
            ->orderBy('first_name')
            ->get();

        $statuses = [
            ['value' => 'pending', 'label' => 'Pending'],
            ['value' => 'approved', 'label' => 'Approved'],
            ['value' => 'shipped', 'label' => 'Shipped'],
            ['value' => 'delivered', 'label' => 'Delivered'],
            ['value' => 'cancelled', 'label' => 'Cancelled'],
        ];

        $paymentStatuses = [
            ['value' => 'unpaid', 'label' => 'Unpaid'],
            ['value' => 'paid', 'label' => 'Paid'],
            ['value' => 'refunded', 'label' => 'Refunded'],
        ];

        return Inertia::render('orders/Index', [
            'orders' => [
                'data' => $orders->items(),  // Use items() instead of through()
                'meta' => [
                    'total' => $orders->total(),
                    'from' => $orders->firstItem(),
                    'to' => $orders->lastItem(),
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'prev_page_url' => $orders->previousPageUrl(),
                    'next_page_url' => $orders->nextPageUrl(),
                ],
            ],
            'filters' => [
                'users' => $users,
                'statuses' => $statuses,
                'payment_statuses' => $paymentStatuses,
                'current' => [
                    'user' => $request->user,
                    'status' => $request->status,
                    'payment_status' => $request->payment_status,
                    'archived' => $request->archived,
                    'from' => $request->from,
                    'to' => $request->to,
                    'search' => $request->search,
                    'sort' => $sort,
                    'direction' => $direction,
                ],
            ],
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items.product']);

        return Inertia::render('orders/Show', [
            'order' => $order,
        ]);
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->route('orders.index')->with('success', 'Order deleted successfully.');
    }


    public function store(Request $request)
    {

        $validated = $request->validate([
            'payment_method' => ['required', 'string', 'in:cash,card,paypal'],
            'shipping_address' => ['required', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        // Get cart items with products
        $cartItems = CartItem::where('user_id', Auth::id())
            ->with(['product' => function ($query) {
                $query->select('id', 'name', 'price', 'discount', 'stock');
            }])
            ->get();

        // Check if cart is empty
        if ($cartItems->isEmpty()) {
            return back()->with('error', 'Your cart is empty');
        }

        // Validate stock availability
        foreach ($cartItems as $item) {
            if ($item->quantity > $item->product->stock) {
                return back()->with('error', "Not enough stock for {$item->product->name}");
            }
        }

        // Calculate totals
        $subtotal = 0;
        $orderItems = [];

        foreach ($cartItems as $item) {
            $price = $item->product->price;
            $discount = $item->product->discount;
            $discountedPrice = $price - ($price * $discount / 100);
            $itemSubtotal = $discountedPrice * $item->quantity;
            $subtotal += $itemSubtotal;

            $orderItems[] = [
                'product_id' => $item->product_id,
                'price' => $price,
                'quantity' => $item->quantity,
                'subtotal' => $itemSubtotal,
            ];

            // Decrease product stock
            $item->product->decrement('stock', $item->quantity);
        }

        // Calculate shipping discount (if total >= 100)
        $shippingDiscount = $subtotal >= 100 ? 10 : 0;
        $finalPrice = $subtotal - $shippingDiscount;

        // try {
            // Start transaction
            // DB::beginTransaction();

            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'unpaid',
                'total_price' => $subtotal,
                'discount' => $shippingDiscount,
                'final_price' => $finalPrice,
                'shipping_address' => $validated['shipping_address'],
                'notes' => $validated['notes'],
            ]);

            // Create order items
            $order->items()->createMany($orderItems);

            // Clear cart
            CartItem::where('user_id', Auth::id())->delete();

            // Commit transaction
            // DB::commit();

            return redirect()->route('orders.show', $order)
                ->with('success', 'Order created successfully');
        // } catch (Exception $e) {
            // Rollback transaction
        //     DB::rollBack();

        //     return back()->with('error', 'Failed to create order. Please try again.');
        // }
    }
}
