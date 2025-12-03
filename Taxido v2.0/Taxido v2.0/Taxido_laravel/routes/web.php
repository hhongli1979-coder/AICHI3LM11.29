<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;


Route::group(['middleware' => ['localization' , 'maintenance'], 'namespace' => 'Front'], function () {

    // Home
    Route::get('/', 'HomeController@index')->name('home');

    // Blog
    Route::get('blog/{slug}', 'BlogController@getBlogBySlug')->name('blog.slug');
    Route::get('blogs', 'BlogController@index')->name('web.blog.index');
    Route::get('page/{slug}', 'PageController@getPageBySlug')->name('page.slug');
    Route::get('pages', 'PageController@index')->name('web.page.index');
    Route::get('/sitemap.xml', 'SitemapController@generate');

    // Languages
    Route::get('language/{locale}', function ($locale) {
        app()->setLocale($locale);
        session()->put('locale', $locale);
        session()->put('front-locale', $locale);
        return redirect()->back();
    })->name('lang');

    Route::post('/newsletter','SubscribesController@store')->name('newsletter');
    Route::post('/set-theme', 'HomeController@setTheme')->name('set-theme');
});

// Clear Cache
Route::get('/clear-cache', function () {
    Artisan::call('view:clear');
    Artisan::call('cache:clear');
    Artisan::call('route:clear');
    Artisan::call('storage:link');
    Artisan::call('config:clear');
    Artisan::call('config:cache');
    Artisan::call('clear-compiled');
    Artisan::call('optimize:clear');
    Artisan::call('permission:cache-reset');
    return redirect()->back();
})->name('clear-cache');


Route::get('language/{locale}', function ($locale) {
    app()->setLocale($locale);
    session()->put('locale', $locale);
    session()->put('front-locale', $locale);
    return redirect()->back();
})->name('lang');
