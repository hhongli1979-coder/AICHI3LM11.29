<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Api Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//Authentication
Route::post('/login', 'AuthController@adminLogin');
Route::post('/login/number','AuthController@login_with_numb');
Route::post('/forgot-password', 'AuthController@forgotPassword');
Route::post('/verify-token', 'AuthController@verifyToken');
Route::post('/update-password','AuthController@updatePassword');
Route::post('/verify-otp','AuthController@verify_auth_token');
Route::post('/logout','AuthController@logout');

Route::group(['middleware' => ['auth:sanctum'], 'as' => 'api.'], function () {

    // Account
    Route::get('self','AccountController@self');
    Route::put('updateProfile','AccountController@updateProfile');
    Route::put('updatePassword','AccountController@updatePassword');

    // Settings
    Route::get('settings','SettingController@index');
});
