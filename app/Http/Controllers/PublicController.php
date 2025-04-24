<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PublicController extends Controller
{


    public function home()
    {
        $products = Product::where('status', 'approved')->limit(4)->get();
        return Inertia::render('public/Home', ['products' => $products]);
    }


    public function cartItems()
    {
        return Inertia::render('public/CartItems', [
            'cartItems' => CartItem::with('product')
                ->where('user_id', Auth::id())
                ->get()
        ]);
    }


    public function menu(Request $request)
    {
        $query = Product::query()->with(['category']);

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->category) {
            $query->where('category_id', $request->category);
        }

        if ($request->brand) {
            $query->where('brand', $request->brand);
        }

        if ($request->minPrice) {
            $query->where('price', '>=', $request->minPrice);
        }

        if ($request->maxPrice) {
            $query->where('price', '<=', $request->maxPrice);
        }

        if ($request->sort) {
            match ($request->sort) {
                'price-asc' => $query->orderBy('price'),
                'price-desc' => $query->orderBy('price', 'desc'),
                default => $query->latest(),
            };
        }

        return Inertia::render('public/Menu', [
            'products' => $query->paginate(12)->through(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price, // Ensure price is a number
                'discount' => (float) $product->discount, // Ensure discount is a number
                'image' => $product->image,
                'brand' => $product->brand,
                'category' => [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                ],
            ]),
            'categories' => Category::select('id', 'name')->get(),
            'brands' => Product::distinct()->pluck('brand'),
            'filters' => $request->only(['search', 'category', 'brand', 'minPrice', 'maxPrice', 'sort', 'page']),
        ]);
    }
}
