<?php

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;
use Modules\FlutterWave\Http\Controllers\FlutterWaveController;

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
    Route::any('flutterwave/webhook', 'FlutterWaveController@webhook')->name('flutterwave.webhook')->withoutMiddleware([VerifyCsrfToken::class]);
});
