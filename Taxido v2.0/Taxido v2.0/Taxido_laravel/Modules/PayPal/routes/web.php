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
    Route::any('paypal/status', 'PayPalController@status')->name('paypal.status')->withoutMiddleware([VerifyCsrfToken::class]);
    Route::post('paypal/webhook', 'PayPalController@webhookHandler')->name('paypal.webhook')->withoutMiddleware([VerifyCsrfToken::class]);
});
