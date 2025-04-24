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
        $products = Product::where('status', 'approved')
            ->limit(4)
            ->get()
            ->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price,
                'discount' => (float) $product->discount,
                'image' => $product->image,
                'inCart' => Auth::check() ?
                    CartItem::where('user_id', Auth::id())
                    ->where('product_id', $product->id)
                    ->exists() :
                    false
            ]);
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

        // Get current user's cart items
        $userCartItems = Auth::check()
            ? CartItem::where('user_id', Auth::id())->pluck('product_id')->toArray()
            : [];

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
                'price' => (float) $product->price,
                'discount' => (float) $product->discount,
                'image' => $product->image,
                'brand' => $product->brand,
                'inCart' => in_array($product->id, $userCartItems),
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

    public function product(Product $product)
    {
        $userCartItems = Auth::check()
            ? CartItem::where('user_id', Auth::id())->pluck('product_id')->toArray()
            : [];

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get()
            ->map(fn($related) => [
                'id' => $related->id,
                'name' => $related->name,
                'price' => (float) $related->price,
                'discount' => (float) $related->discount,
                'image' => $related->image,
                'brand' => $related->brand,
                'inCart' => in_array($related->id, $userCartItems),
                'category' => [
                    'id' => $related->category->id,
                    'name' => $related->category->name,
                ],
            ]);

        return Inertia::render('public/Product', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price,
                'discount' => (float) $product->discount,
                'image' => $product->image,
                'brand' => $product->brand,
                'inCart' => in_array($product->id, $userCartItems),
                'category' => [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                ],
            ],
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
