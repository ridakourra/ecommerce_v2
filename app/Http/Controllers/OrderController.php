<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(Request $request)
    {

        $user = Auth::user();
        $query = Order::query()
            ->with(['items.product', 'user']);

        if ($user->isSeller()) {
            $productIds = $user->products()->pluck('id');

            $query->whereHas('items', function ($q) use ($productIds) {
                $q->whereIn('product_id', $productIds);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('archived')) {
            $query->where('archived', $request->archived);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('shipping_address', 'like', "%$search%")
                    ->orWhere('notes', 'like', "%$search%");
            });
        }

        $query->orderBy('created_at', 'desc');

        $orders = $query->paginate(15);
        return inertia('orders/Index', [
            'orders' => $orders,
            'filters' => $request->only([
                'status',
                'payment_status',
                'payment_method',
                'user_id',
                'archived',
                'search'
            ]),
            'filterOptions' => [
                'users' => User::select('id', 'first_name', 'last_name')->get(),
                'statuses' => Order::select('status')->distinct()->pluck('status'),
                'payment_statuses' => Order::select('payment_status')->distinct()->pluck('payment_status'),
                'payment_methods' => Order::select('payment_method')->distinct()->pluck('payment_method'),
            ],
        ]);
    }

    public function show(Order $order)
    {
        $user = Auth::user();

        // If user is admin, show all order details
        if ($user->isAdmin()) {
            $order->load(['items.product.user', 'user']);

            return inertia('orders/Show', [
                'order' => $order,
            ]);
        }

        // If user is seller, only show their products in the order
        if ($user->isSeller()) {
            $productIds = $user->products()->pluck('id');

            // Check if seller has any products in this order
            $related = $order->items()->whereIn('product_id', $productIds)->exists();
            if (!$related) {
                abort(403);
            }

            // Load the order with only the seller's products
            $order->load(['user']);

            // Filter order items to only include seller's products
            $sellerItems = $order->items()->whereIn('product_id', $productIds)->with('product.user')->get();

            // Calculate seller's subtotal
            $sellerSubtotal = $sellerItems->sum('subtotal');

            return inertia('orders/Show', [
                'order' => $order,
                'sellerItems' => $sellerItems,
                'sellerSubtotal' => $sellerSubtotal,
                'isSellerView' => true
            ]);
        }

        // For other users (like customers viewing their own orders)
        $order->load(['items.product.user', 'user']);

        return inertia('orders/Show', [
            'order' => $order,
        ]);
    }

    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
            'status' => ['required', 'string', 'in:pending,processing,shipped,delivered,cancelled'],
        ]);

        $order = Order::findOrFail($validated['order_id']);
        $order->update(['status' => $validated['status']]);

        return back()->with('success', 'Order status updated successfully');
    }

    public function updatePaymentStatus(Request $request)
    {
        $validated = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
            'payment_status' => ['required', 'string', 'in:pending,paid,failed,refunded'],
        ]);

        $order = Order::findOrFail($validated['order_id']);
        $order->update(['payment_status' => $validated['payment_status']]);

        return back()->with('success', 'Payment status updated successfully');
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'payment_method' => ['required', 'string', 'in:' . implode(',', array_keys(Order::PAYMENT_METHODS))],
            'shipping_address' => ['required', 'string', 'min:10'],
            'notes' => ['nullable', 'string'],
        ]);


        return DB::transaction(function () use ($validated) {
            // Get cart items
            $cartItems = CartItem::where('user_id', Auth::id())
                ->with('product')
                ->get();

            if ($cartItems->isEmpty()) {
                throw ValidationException::withMessages([
                    'cart' => ['Your cart is empty']
                ]);
            }

            // Calculate totals
            $subtotal = $cartItems->sum('subtotal');
            $shippingCost = $subtotal >= 100 ? 0 : 10; // Move to config
            $total = $subtotal + $shippingCost;

            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_method'] === 'cash' ? 'pending' : 'paid',
                'shipping_address' => $validated['shipping_address'],
                'notes' => $validated['notes'],
                'total_price' => $total,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'discount' => 0, // Calculate if needed
            ]);

            // Create order items
            foreach ($cartItems as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'price' => $item->product->price,
                    'quantity' => $item->quantity,
                    'subtotal' => $item->subtotal,
                ]);

                // Update product stock
                $item->product->decrement('stock', $item->quantity);
            }

            // Clear cart
            CartItem::where('user_id', Auth::id())->delete();

            return redirect()
                ->route('home')
                ->with('success', 'Order placed successfully');
        });
    }


    public function destroy(Order $order)
    {
        $order->delete();
        return back()->with('success', 'Order deleted successfully');
    }
    public function archive(Request $request)
    {
        $validated = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
            'archived' => ['required', 'boolean'],
        ]);
        $order = Order::findOrFail($validated['order_id']);
        $order->update(['archived' => $validated['archived']]);
        return back()->with('success', 'Order archived successfully');
    }
}
