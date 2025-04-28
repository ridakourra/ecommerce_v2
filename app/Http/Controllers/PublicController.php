<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Category;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home(Request $request)
    {
        $products = Product::where('status', 'approved')
            ->where('stock', '>', 0)
            ->limit(5)
            ->get()
            ->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price,
                'discount' => (float) $product->discount,
                'image' => $product->image,
                'in_cart' => Auth::check() ?
                    CartItem::where('user_id', Auth::id())
                    ->where('product_id', $product->id)
                    ->exists() :
                    false
            ]);


        $bestProducts = OrderItem::select('product_id', DB::raw('COUNT(*) as total_sales'))
            ->groupBy('product_id')
            ->orderByDesc('total_sales')
            ->with('product.inCart')
            ->whereHas('product', function ($q) use ($request) {
                $q->where('stock', '>', 0);
                $q->where('status', 'approved');
            })
            ->limit(5)
            ->get();


        return Inertia::render('public/Home', ['products' => $products, 'bestProducts' => $bestProducts]);
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
        /**
         * name
         * brand
         * 
         * price [min - max]
         * 
         * categories [dep - cat - typ]
         * 
         * get data of brand
         * get data of categories
         */
        $query = Product::query()->where('stock', '>', 0)->with('inCart');


        // name
        if ($request->filled('name')) {
            $query->where('name', 'like', "%{$request->name}%");
        }
        // brand
        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }
        // price min
        if ($request->filled('minPrice')) {
            $query->where('price', '>=', $request->minPrice);
        }
        // price max
        if ($request->filled('maxPrice')) {
            $query->where('price', '<=', $request->maxPrice);
        }
        // department
        if ($request->filled('department')) {
            $query->whereHas('category.parent.parent', function ($q) use ($request) {
                $q->where('id', $request->department);
            });
        }
        // category
        if ($request->filled('category')) {
            $query->whereHas('category.parent', function ($q) use ($request) {
                $q->where('id', $request->category);
            });
        }
        // type
        if ($request->filled('type')) {
            $query->where('category_id', $request->type);
        }


        // brands
        $brands = [];
        foreach (Product::all() as $product) {
            if (!in_array($product->brand, $brands)) {
                $brands[] = $product->brand;
            }
        }


        $products = $query->paginate(20)->withQueryString();
        return Inertia::render('public/Menu', ['products' => $products, 'brands' => $brands, 'filters' => $request->only([
            'name',
            'brand',
            'minPrice',
            'minPrice',
            'department',
            'category',
            'type'
        ])]);
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
                'in_cart' => in_array($related->id, $userCartItems),
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
                'in_cart' => in_array($product->id, $userCartItems),
                'cart' => CartItem::where('product_id', $product->id)->where('user_id', Auth::id())->first(),
                'category' => [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                ],
            ],
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
