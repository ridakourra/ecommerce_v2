<?php

use App\Http\Controllers\CartItemController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PasswordController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/cart', [CartItemController::class, 'index'])->name('cart.index');
Route::get('/menu', [PublicController::class, 'menu'])->name('menu');
Route::get('/products/{product}', [PublicController::class, 'product'])->name('public.products.show');

Route::get('/test-tsx', function () {
    return Inertia::render('test');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('public.profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('public.profile.update');
    Route::post('profile/password', [ProfileController::class, 'updatePassword'])->name('public.profile.password.update');
    Route::post('profile/destroy', [ProfileController::class, 'destroy'])->name('public.profile.destroy');


    // Create Order
    Route::post('/orders/store', [OrderController::class, 'store'])->name('orders.storeAuth');

    // Cart Items
    Route::post('/cart/add', [CartItemController::class, 'add'])->name('cart.add');
    // Destory Cart Items
    Route::delete('/cart/{productId}', [CartItemController::class, 'destroy'])->name('cart.destroy');
    // Cart Plus
    Route::post('/cart/cart-plus/{cartItem}', [CartItemController::class, 'cartPlus'])->name('cart.cartPlus');
    // Cart Items
    Route::post('/cart/cart-less/{cartItem}', [CartItemController::class, 'cartLess'])->name('cart.cartLess');



    // Get categories
    Route::get('/categories/children/{category?}', [CategoryController::class, 'getCategories'])->name('getCategoriesById');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

require __DIR__ . '/admin.php';
