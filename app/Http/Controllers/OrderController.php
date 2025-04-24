<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query()->with(['user', 'items.product']);

        // فلترة حسب المستخدم
        if ($request->filled('user')) {
            $query->where('user_id', $request->user);
        }

        // فلترة حسب الحالة
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // فلترة حسب حالة الدفع
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // فلترة حسب الأرشفة
        if ($request->has('archived')) {
            $query->where('archived', $request->archived);
        }

        // فلترة حسب تاريخ الإنشاء
        if ($request->filled('from') && $request->filled('to')) {
            $query->whereBetween('created_at', [$request->from, $request->to]);
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        // بيانات إضافية للفلاتر
        $users = User::select('id', 'first_name', 'last_name')->get();

        return Inertia::render('orders/Index', [
            'orders' => $orders,
            'filters' => [
                'users' => $users,
                'statuses' => ['pending', 'approved', 'shipped', 'delivered', 'cancelled'],
                'payment_statuses' => ['unpaid', 'paid', 'refunded'],
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
}
