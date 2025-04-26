<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        if (Auth::user()->role === 'admin') {
            $categoriesCount = Category::count();
            $productsCount = Product::count();
            $ordersCount = Order::count();
            $usersCount = User::count();
            $totalRevenue = Order::where('payment_status', 'paid')->sum('total_price');
            $recentOrders = Order::latest()->take(5)->with('user')->get();
            $popularProducts = Product::withCount('orderItems')->orderByDesc('order_items_count')->take(5)->get();
            $latestUsers = User::latest()->take(5)->get();

            return Inertia::render('admin/dashboard/DashboardAdmin', [
                'categoriesCount' => $categoriesCount,
                'productsCount' => $productsCount,
                'ordersCount' => $ordersCount,
                'usersCount' => $usersCount,
                'totalRevenue' => $totalRevenue,
                'recentOrders' => $recentOrders,
                'popularProducts' => $popularProducts,
                'latestUsers' => $latestUsers,
            ]);
        } else if (Auth::user()->role === 'seller') {
            $user = Auth::user();
            $productsCount = Product::where('user_id', $user->id)->count();
            $ordersCount = Order::whereHas('items.product.user.details', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->count();
            $totalRevenue = Order::whereHas('items.product.user.details', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->sum('total_price');
            $totalSales = OrderItem::whereHas('product', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->sum('quantity');
            $recentOrders = Order::whereHas('items.product.user.details', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['user', 'items.product'])
            ->latest()
            ->take(5)
            ->get();
            $popularProducts = Product::where('user_id', $user->id)
                ->withCount('orderItems')
                ->orderByDesc('order_items_count')
                ->take(5)
                ->get();

            return Inertia::render('admin/dashboard/DashboardSeller', [
                'productsCount' => $productsCount,
                'ordersCount' => $ordersCount,
                'totalRevenue' => $totalRevenue,
                'totalSales' => $totalSales,
                'recentOrders' => $recentOrders,
                'popularProducts' => $popularProducts,
            ]);
        } else {
            abort(404);
        }
    }
}

// ... existing code ...
