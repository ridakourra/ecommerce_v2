<?php

namespace App\Http\Requests;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'payment_method' => ['required', 'string', 'in:' . implode(',', array_keys(Order::PAYMENT_METHODS))],
            'shipping_address' => ['required', 'string', 'min:10'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'shipping_address.min' => 'Please provide a complete shipping address',
            'payment_method.in' => 'Please select a valid payment method',
        ];
    }
}
