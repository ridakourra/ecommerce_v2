<?php

use App\Http\Controllers\CartItemController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PasswordController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/cart', [CartItemController::class, 'index'])->name('cart.index');
Route::get('/menu', [PublicController::class, 'menu'])->name('menu');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('public.profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('public.profile.update');
    Route::post('profile/password', [ProfileController::class, 'updatePassword'])->name('public.profile.password.update');
    Route::post('profile/destroy', [ProfileController::class, 'destroy'])->name('public.profile.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

require __DIR__ . '/admin.php';
