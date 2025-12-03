<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group([], function () {
    Route::any('razorpay/status', 'RazorPayController@status')->name('razorpay.status')->withoutMiddleware([VerifyCsrfToken::class]);
    Route::post('razorpay/webhook', 'RazorPayController@webhook')->name('razorpay.webhook')->withoutMiddleware([VerifyCsrfToken::class]);
});
