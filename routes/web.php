<?php

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Main\PaymentController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


Route::get('/payment/success', [PaymentController::class, 'success'])->name('checkout-success');
Route::get('/payment/cancel', [PaymentController::class, 'success'])->name('checkout-cancel');

Route::any('{catchall}', [Controller::class, 'firstLoader'])->where("catchall", ".*");