<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Api Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group(['middleware' => ['localization']], function () {

    // Countries & States
    Route::apiResource('country', 'CountryController', ['only' => ['index', 'show']]);
    Route::get('/get-country-id', 'CountryController@getCountryId');

    // Authentication
    Route::post('/login', 'AuthController@login');
    Route::post('/register', 'AuthController@register');
    Route::get('/get-sms-methods', 'AuthController@getAllSMSMethods');
    Route::post('/verify-token', 'AuthController@verifyToken');
    Route::post('/login/number', 'AuthController@login_with_numb');
    Route::post('/forgot-password', 'AuthController@forgotPassword');
    Route::post('/update-password', 'AuthController@updatePassword');
    Route::post('/verify-otp', 'AuthController@verify_auth_token');
    Route::post('/check-validation', 'AuthController@checkUserValidation');
    Route::post('/logout', 'AuthController@logout');

    // Settings
    Route::get('settings', 'SettingController@index');

    // Currencies
    Route::apiResource('currency', 'CurrencyController', ['only' => ['index', 'show']]);

    // Languages
    Route::apiResource('language', 'LanguageController', ['only' => ['index', 'show']]);
    Route::get('translate/{file}', 'LanguageController@translate');

    // Pages
    Route::apiResource('page', 'PageController', ['only' => ['index', 'show']]);
    Route::get('page/slug/{slug}', 'PageController@getPagesBySlug');

    // Categories
    Route::apiResource('category', 'CategoryController', ['only' => ['index', 'show']]);
    Route::get('category/slug/{slug}', 'CategoryController@getCategoryBySlug');

    // Tags
    Route::apiResource('tag', 'TagController', ['only' => ['index', 'show']]);

    // Blogs
    Route::apiResource('blog', 'BlogController', ['only' => ['index', 'show']]);
    Route::get('blog/slug/{slug}', 'BlogController@getBlogBySlug');

    Route::group(['middleware' => ['auth:sanctum'], 'as' => 'api.'], function () {

        // Account
        Route::get('self', 'AccountController@self');
        Route::put('updateProfile', 'AccountController@updateProfile');
        Route::put('updatePassword', 'AccountController@updatePassword');
        Route::delete('deleteAccount', 'AccountController@deleteAccount');

        // Notifications
        Route::get('notifications', 'NotificationController@index');
        Route::delete('notifications/{id}', 'NotificationController@destroy');
        Route::put('notifications/markAsRead', 'NotificationController@markAsRead');

        // Payment Methods
        Route::get('payment-methods', 'PaymentMethodController@index');
    });
});

