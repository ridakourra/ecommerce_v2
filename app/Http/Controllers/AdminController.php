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

            return Inertia::render('admin/dashboard/DashboardAdmin', [
                'categoriesCount' => $categoriesCount,
                'productsCount' => $productsCount,
                'ordersCount' => $ordersCount,
                'usersCount' => $usersCount,
            ]);
        } else if (Auth::user()->role === 'seller') {
            $user = Auth::user();

            return Inertia::render('admin/dashboard/DashboardSeller', [
                'productsCount' => Product::where('user_id', $user->id)->count(),
                'ordersCount' => Order::whereHas('items.product', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })->count(),
                'totalRevenue' => Order::whereHas('items.product', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })->sum('total_price'),
                'totalSales' => OrderItem::whereHas('product', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })->sum('quantity'),
            ]);
        } else {
            abort(404);
        }
    }
}
