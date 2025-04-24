<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $categoriesCount = Category::count();
        $productsCount = Product::count();
        $ordersCount = Order::count();
        $usersCount = User::count();

        return Inertia::render('admin/Dashboard', [
            'categoriesCount' => $categoriesCount,
            'productsCount' => $productsCount,
            'ordersCount' => $ordersCount,
            'usersCount' => $usersCount,
        ]);
    }
}
