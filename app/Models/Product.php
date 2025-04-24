<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'status',
        'archived',
        'brand',
        'image',
        'price',
        'discount',
        'stock',
        'category_id',
        'user_id'
    ];



    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function inCart()
    {
        return CartItem::where('product_id', $this->id)->where('user_id', Auth::id())->count();
    }
}
