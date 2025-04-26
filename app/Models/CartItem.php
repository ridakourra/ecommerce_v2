<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'price',
    ];

    protected $appends = ['subtotal'];

    public function getSubtotalAttribute()
    {
        $price = $this->price ?? $this->product->price;
        $discount = $this->product->discount ?? 0;
        return round($price * (1 - $discount / 100) * $this->quantity, 2);
    }

    /**
     * Get the user that owns the cart item.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product that owns the cart item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
