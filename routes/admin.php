<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::prefix('/admin')->middleware(['auth', 'verified', 'staff'])->group(function () {

    // Admin pages
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    Route::middleware('admin')->group(function () {
        // Users
        Route::resource('users', UserController::class);
        Route::patch('/users/{user}/password', [UserController::class, 'updatePassword'])->name('users.update-password');
        Route::post('/users/{user}/avatar', [UserController::class, 'updateAvatar'])->name('users.update-avatar');

        // Categories
        # Index of Category Main
        Route::get('/categories/{category?}', [CategoryController::class, 'index'])->name('categories.index');
        # Store
        Route::post('/categories/store', [CategoryController::class, 'store'])->name('categories.store');
        # Udpate
        Route::post('/categories/{category}/update', [CategoryController::class, 'update'])->name('categories.update');
        # Delete
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');



        # Approve product
        Route::post('/products/{product}/approve', [ProductController::class, 'approveProduct'])->name('products.update.approved');
    });
    // Get categories
    Route::get('/categories/children/{category}', [CategoryController::class, 'getCategories'])->name('getCategoriesById');

    // Products
    # Index
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    # Create
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    # Show
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
    # Store
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    # Edit
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    # Update
    Route::post('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    # Delete
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Orders
    Route::resource('orders', OrderController::class)->only(['index', 'show', 'destroy']);
    Route::put('/orders/update-status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
    Route::put('/orders/update-payment-status', [OrderController::class, 'updatePaymentStatus'])->name('orders.updatePaymentStatus');
});