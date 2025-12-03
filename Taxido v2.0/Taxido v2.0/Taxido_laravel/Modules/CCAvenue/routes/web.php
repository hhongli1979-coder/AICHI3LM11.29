<?php

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;
use Modules\CCAvenue\Http\Controllers\CCAvenueController;

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
    Route::any('ccavenue/webhook', 'CCAvenueController@webhook')->name('ccavenue.webhook')->withoutMiddleware([VerifyCsrfToken::class]);
});
