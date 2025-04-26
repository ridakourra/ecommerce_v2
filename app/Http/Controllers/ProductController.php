<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use function PHPUnit\Framework\returnSelf;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()
            ->with(['category', 'user']);

        // Search by name
        if ($request->filled('search')) {
            // dump('Search');
            $query->where('name', 'like', "%" . $request->search . "%");
        }

        // Filter by creator
        if ($request->filled('creator')) {
            // dump('Creator');
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('id', $request->creator);
            });
        }

        // Filter by archived
        if ($request->filled('archived')) {
            // dump('archived');
            $query->where('archived', $request->archived);
        }

        // Filter by status
        if ($request->filled('status')) {
            // dump('status');
            $query->where('status', $request->status);
        }

        // Filter by brand
        if ($request->filled('brand')) {
            // dump('brand');
            $query->where('brand', 'like', "%{$request->brand}%");
        }

        // Filter by category
        if ($request->filled('category')) {
            // dump('category');
            $query->where('category_id', $request->category);
        }

        if (Auth::user()->role === 'seller') {
            $products = $query->where('user_id', Auth::id())->paginate(10)->withQueryString();
        } else {
            $products = $query->paginate(10)->withQueryString();
        }

        // Get additional data for filters
        $creators = User::has('products')->get(['id', 'first_name', 'last_name']);
        $categories = Category::whereNotNull('parent_id')
            ->whereHas('parent', function ($q) {
                $q->whereNotNull('parent_id');
            })->get();
        $brands = Product::distinct()->pluck('brand');

        return Inertia::render('products/Index', [
            'products' => $products,
            'filters' => [
                'creators' => $creators,
                'categories' => $categories,
                'brands' => $brands,
                'statuses' => ['pending', 'approved', 'rejected', 'inactive', 'active']
            ],
        ]);
    }

    public function create()
    {
        $departments = Category::where('parent_id', null)->get();
        return Inertia::render('products/Create', ['departments' => $departments]);
    }



    public function show(Product $product)
    {
        return Inertia::render('products/Show', [
            'product' => $product->load(['category.parent.parent', 'user'])
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'brand' => ['required', 'string', 'max:255'],
            'image' => ['required', 'image', 'max:2048'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'stock' => ['required', 'integer', 'min:0'],
            'type' => ['required', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
        ]);

        $path = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
        }

        Product::create([
            'name' => $validated['name'],
            'brand' => $validated['brand'],
            'category_id' => $validated['type'],
            'user_id' => Auth::id(),
            'image' => $path,
            'price' => $validated['price'],
            'discount' => $validated['discount'] ?? null,
            'stock' => $validated['stock'],
            'description' => $validated['description']
        ]);

        return to_route('products.index');
    }

    public function edit(Product $product)
    {
        $type = Category::find($product->category_id);
        $category = $type->parent;
        $department = $category->parent;

        $departments = Category::where('parent_id', null)->get();
        $categories = $department->children;
        $types = $category->children;

        return Inertia::render('products/Edit', [
            'product' => $product,
            'departments' => [
                'data' => $departments,
                'selected' => $department->id
            ],
            'categories' => [
                'data' => $categories,
                'selected' => $category->id
            ],
            'types' => [
                'data' => $types,
                'selected' => $type->id
            ],
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'brand' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:2048'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'stock' => ['required', 'integer', 'min:0'],
            'type' => ['required', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
        ]);

        $path = $product->image;
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $path = $request->file('image')->store('products', 'public');
        }

        $product->update([
            'name' => $validated['name'],
            'brand' => $validated['brand'],
            'category_id' => $validated['type'],
            'image' => $path,
            'price' => $validated['price'],
            'discount' => $validated['discount'] ?? null,
            'stock' => $validated['stock'],
            'description' => $validated['description']
        ]);

        return to_route('products.index');
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return to_route('products.index');
    }





    // Approve product
    public function approveProduct(Request $request, Product $product)
    {
        if (Auth::user()->role !== 'admin') {
            return abort(403);
        }
        
        $product->status = 'approved';
        $product->save();
        return back();
    }
}
