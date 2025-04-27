<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(?Category $category = null)
    {
        $categories = Category::where('parent_id', null)->get();
        $index = 1;

        if ($category) {
            // dd($category);
            if ($category->parent_id !== null && $category->parent->parent_id === null) {
                // Level 3
                $categories = Category::where('parent_id', $category->id)->with(['parent.parent'])->get();
                $index = 3;
            } else {
                // Level 2
                $categories = Category::where('parent_id', $category->id)->with(['parent.parent'])->get();
                $index = 2;
            }
        }


        return Inertia::render('categories/Index', [
            'categories' => $categories,
            'index' => $index
        ]);
    }


    public function store(Request $req)
    {
        $vars = $req->validate([
            'name' => ['required'],
            'description' => ['nullable'],
            'flag' => ['nullable', 'image', 'mimes:png,jpg,webp,jpeg'],
            'parent_id' => ['nullable']
        ]);

        if ($req->hasFile('flag')) {
            $vars['flag'] = $req->file('flag')->store('flags', 'public');
        }
        Category::create($vars);
        return back();
    }


    public function update(Request $req, Category $category)
    {

        $vars = $req->validate([
            'name' => ['required'],
            'description' => ['nullable'],
            'flag' => ['nullable']
        ]);


        if ($category->flag && $req->hasFile('flag')) {
            Storage::disk('public')->delete($category->flag);
            $vars['flag'] = $req->file('flag')->store('flags', 'public');
        }

        $category->update($vars);

        return back();
    }


    public function destroy(Category $category)
    {
        if ($category->flag) {
            Storage::disk('public')->delete($category->flag);
        }

        $category->delete();

        return back();
    }













    public function getCategories(Request $req, Category $category)
    {
        return response()->json(['categories' => Category::where('parent_id', $category->id)->get()]);
    }
}
