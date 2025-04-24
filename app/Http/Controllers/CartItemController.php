<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartItemController extends Controller
{
    public function index()
    {
        $cartItems = CartItem::with('product')->get();
        return Inertia::render('public/CartItems', [
            'cartItems' => $cartItems,
        ]);
    }

    public function update(Request $request, $id)
    {
        $cartItem = CartItem::findOrFail($id);
        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return back();
    }

    public function destroy($productId)
    {
        $cartItem = CartItem::where('product_id', $productId)->where('user_id', Auth::id())->first();
        $cartItem->delete();

        return back();
    }

    public function add(Request $request)
    {
        $existingCartItem = CartItem::where('product_id', $request->product_id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingCartItem) {
            $existingCartItem->quantity += $request->quantity;
            $existingCartItem->save();
        } else {
            $cartItem = CartItem::create([
                'product_id' => $request->product_id,
                'user_id' => Auth::id(),
                'quantity' => $request->quantity,
                'price' => 0
            ]);

            $cartItem->price = $cartItem->product->price;
            $cartItem->save();
        }

        return back();
    }

    public function cartPlus(Request $request, CartItem $cartItem)
    {
        if ($cartItem->product->stock > $cartItem->quantity) {
            $cartItem->quantity += 1;
            $cartItem->save();
        }
        return back();
    }

    public function cartLess(Request $request, CartItem $cartItem)
    {
        if ($cartItem->quantity > 1) {
            $cartItem->quantity -= 1;
            $cartItem->save();
        }
        return back();
    }
}
