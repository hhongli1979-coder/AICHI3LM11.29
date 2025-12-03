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
    Route::any('mollie/status', 'MollieController@status')->name('mollie.status')->withoutMiddleware([VerifyCsrfToken::class]);
    Route::post('mollie/webhook', 'MollieController@webhook')->name('mollie.webhook')->withoutMiddleware([VerifyCsrfToken::class]);
});
