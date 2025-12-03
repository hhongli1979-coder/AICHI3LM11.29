<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here is where you can register admin routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::group(['middleware' => ['localization']], function () {
    Auth::routes(['verify' => false, 'register' => false]);

    Route::group(['middleware' => ['auth'], 'namespace' => 'Admin', 'as' => 'admin.'], function () {

        Route::group(['middleware' => ['demo']], function () {
            // Account
            Route::put('account/profile/update', 'AccountController@updateProfile')->name('account.profile.update');
            Route::put('account/password/update', 'AccountController@updatePassword')->name('account.password.update');

            // Role
            Route::put('role/status/{id}', 'RoleController@status')->name('role.status')->middleware('can:role.edit');
            Route::get('role/force-delete/{id}', 'RoleController@forceDelete')->name('role.forceDelete')->middleware('can:role.destroy');

            // Media
            Route::get('media/force-delete/{id}', 'MediaController@forceDelete')->name('media.forceDelete');
            Route::post('media/deleteAll', 'MediaController@deleteAll')->name('media.deleteAll')->middleware('can:attachment.destroy');
            Route::get('media/export', 'MediaController@export')->name('media.export');

            // Language
            Route::put('language/status/{id}', 'LanguageController@status')->name('language.status')->middleware('can:language.edit');
            Route::put('language/rtl/{id}', 'LanguageController@rtl')->name('language.rtl');
            Route::get('language/force-delete/{id}', 'LanguageController@forceDelete')->name('language.forceDelete')->middleware('can:language.forceDelete');
            Route::get('language/destroy/{language}', 'LanguageController@destroy')->name('language.destroy')->middleware('can:language.destroy');

            // Currency
            Route::get('currency/destroy/{currency}', 'CurrencyController@destroy')->name('currency.destroy')->middleware('can:currency.destroy');
            Route::get('currency/restore/{id}', 'CurrencyController@restore')->name('currency.restore')->middleware('can:currency.restore');
            Route::get('currency/force-delete/{id}', 'CurrencyController@forceDelete')->name('currency.forceDelete')->middleware('can:currency.forceDelete');

            // Menu
            Route::post('menu/delete-item-menu', 'MenuController@deleteItemMenu')->name('deleteItemMenu');
            Route::post('menu/delete-menus', 'MenuController@deleteMenus')->name('deleteMenu');
            Route::post('menu/update-items', 'MenuController@updateItem')->name('updateItem');
        });

        // Dashboard
        Route::get('dashboard', 'DashboardController@index')->name('dashboard.index');

        // Account
        Route::get('account/profile', 'AccountController@profile')->name('account.profile');
        Route::post('logout', 'AccountController@logout')->name('logout');

        // Users
        Route::resource('user', 'UserController', ['except' => ['show', 'destroy']]);
        Route::put('user/status/{id}', 'UserController@status')->name('user.status')->middleware('can:user.edit');
        Route::get('user/destroy/{user}', 'UserController@destroy')->name('user.destroy')->middleware('can:user.destroy');
        Route::get('user/restore/{id}', 'UserController@restore')->name('user.restore')->middleware('can:user.restore');
        Route::get('user/force-delete/{id}', 'UserController@forceDelete')->name('user.forceDelete')->middleware('can:user.forceDelete');
        Route::put('user/{id}/password/update', 'UserController@updatePassword')->name('user.password.update');
        Route::get('user/export', 'UserController@export')->name('user.export')->middleware('can:user.index');
        Route::post('user/import/csv', 'UserController@import')->name('user.import.csv')->middleware('can:user.create');

        // Roles
        Route::resource('role', 'RoleController', ['except' => ['show']]);

        // Media
        Route::resource('media', 'MediaController', ['except' => ['destroy'], 'parameters' => ['media' => 'media']]);
        Route::get('media/ajax/get', 'MediaController@ajaxGetMedia')->name('media.ajax');
        Route::post('media/upload', 'MediaController@uploadImage')->name('media.upload');

        // Blogs
        Route::resource('blog', 'BlogController', ['except' => ['show', 'destroy']]);
        Route::get('blog/slug', 'BlogController@slug')->name('blog.slug');
        Route::put('blog/status/{id}', 'BlogController@status')->name('blog.status')->middleware('can:blog.edit');
        Route::get('blog/destroy/{blog}', 'BlogController@destroy')->name('blog.destroy')->middleware('can:blog.destroy');
        Route::get('blog/restore/{id}', 'BlogController@restore')->name('blog.restore')->middleware('can:blog.restore');
        Route::get('blog/force-delete/{id}', 'BlogController@forceDelete')->name('blog.forceDelete')->middleware('can:blog.forceDelete');
        Route::get('blog/export', 'BlogController@export')->name('blog.export')->middleware('can:blog.index');
        Route::post('blog/import/csv', 'BlogController@import')->name('blog.import.csv')->middleware('can:blog.create');

        // Categories
        Route::resource('category', 'CategoryController', ['except' => ['show']]);
        Route::get('category/slug', 'CategoryController@slug')->name('category.slug');
        Route::post('category/update-orders', 'CategoryController@updateOrders')->name('category.update.orders');

        // Tags
        Route::resource('tag', 'TagController', ['except' => ['show', 'destroy']]);
        Route::put('tag/status/{id}', 'TagController@status')->name('tag.status')->middleware('can:tag.edit');
        Route::get('tag/destroy/{tag}', 'TagController@destroy')->name('tag.destroy')->middleware('can:tag.destroy');
        Route::get('tag/restore/{id}', 'TagController@restore')->name('tag.restore')->middleware('can:tag.restore');
        Route::get('tag/force-delete/{id}', 'TagController@forceDelete')->name('tag.forceDelete')->middleware('can:tag.forceDelete');

        // Pages
        Route::resource('page', 'PageController', ['except' => ['show', 'destroy']]);
        Route::get('page/slug', 'PageController@slug')->name('page.slug');
        Route::put('page/status/{id}', 'PageController@status')->name('page.status');
        Route::get('page/destroy/{page}', 'PageController@destroy')->name('page.destroy')->middleware('can:page.destroy');
        Route::get('page/restore/{id}', 'PageController@restore')->name('page.restore')->middleware('can:page.restore');
        Route::get('page/force-delete/{id}', 'PageController@forceDelete')->name('page.forceDelete')->middleware('can:page.forceDelete');
        Route::get('page/export', 'PageController@export')->name('page.export')->middleware('can:page.index');
        Route::post('page/import/csv', 'PageController@import')->name('page.import.csv')->middleware('can:page.create');

        // Testimonials
        Route::resource('testimonial', 'TestimonialController', ['except' => ['show', 'destroy']]);
        Route::put('testimonial/status/{id}', 'TestimonialController@status')->name('testimonial.status')->middleware('can:testimonial.edit');
        Route::get('testimonial/destroy/{testimonial}', 'TestimonialController@destroy')->name('testimonial.destroy')->middleware('can:testimonial.destroy');
        Route::get('testimonial/restore/{id}', 'TestimonialController@restore')->name('testimonial.restore')->middleware('can:testimonial.restore');
        Route::get('testimonial/force-delete/{id}', 'TestimonialController@forceDelete')->name('testimonial.forceDelete')->middleware('can:testimonial.forceDelete');

        // Faqs
        Route::resource('faq', 'FaqController', ['except' => ['show', 'destroy']]);
        Route::get('faq/destroy/{faq}', 'FaqController@destroy')->name('faq.destroy')->middleware('can:faq.destroy');
        Route::get('faq/restore/{id}', 'FaqController@restore')->name('faq.restore')->middleware('can:faq.restore');
        Route::get('faq/force-delete/{id}', 'FaqController@forceDelete')->name('faq.forceDelete')->middleware('can:faq.forceDelete');

        // Languages
        Route::resource('language', 'LanguageController', ['except' => ['show', 'destroy']]);
        Route::get('language/translate/{id}/{file?}', 'LanguageController@translate')->name('language.translate');
        Route::post('language/translate/{id}/{file}', 'LanguageController@translate_update')->name('language.translate.update');

        // Plugins
        Route::resource('plugin', 'PluginController');
        Route::put('plugin/status/{id}', 'PluginController@status')->name('plugin.status');
        Route::get('module/delete/{id}', 'PluginController@delete')->name('plugin.delete');

        // Settings
        Route::resource('setting', 'SettingController');
        Route::post('/set-theme', 'SettingController@setTheme')->name('set-theme');

        // Menus
        Route::get('menu', 'MenuController@index')->name('menu.index');
        Route::post('menu/menu-items', 'MenuController@getMenuItems')->name('menu.items');
        Route::post('menu/add-custom-menu', 'MenuController@addCustomMenu')->name('addCustomMenu');
        Route::post('menu/delete-item-menu', 'MenuController@deleteItemMenu')->name('deleteItemMenu');
        Route::post('menu/delete-menus', 'MenuController@deleteMenus')->name('deleteMenu');
        Route::post('menu/create-new-menu', 'MenuController@createMenu')->name('createMenu');
        Route::post('menu/generate-menu-control', 'MenuController@generateMenuControl')->name('generateMenuControl');
        Route::post('menu/update-items', 'MenuController@updateItem')->name('updateItem');

        // Taxes
        Route::resource('tax', 'TaxController', ['except' => ['show', 'destroy']]);
        Route::put('tax/status/{id}', 'TaxController@status')->name('tax.status')->middleware('can:tax.edit');
        Route::get('tax/destroy/{tax}', 'TaxController@destroy')->name('tax.destroy')->middleware('can:tax.destroy');
        Route::get('tax/restore/{id}', 'TaxController@restore')->name('tax.restore')->middleware('can:tax.restore');
        Route::get('tax/force-delete/{id}', 'TaxController@forceDelete')->name('tax.forceDelete')->middleware('can:tax.forceDelete');

        // Currencies
        Route::resource('currency', 'CurrencyController', ['except' => ['show', 'destroy']]);
        Route::put('currency/status/{id}', 'CurrencyController@status')->name('currency.status')->middleware('can:currency.edit');
        Route::get('currency/symbol', 'CurrencyController@getSymbol')->name('currency.symbol');

        // Payment Method
        Route::get('payment-methods', 'PaymentMethodController@index')->name('payment-method.index')->middleware('can:payment-method.index');
        Route::post('payment-methods/{payment}', 'PaymentMethodController@update')->name('payment-method.update')->middleware('can:payment-method.edit');
        Route::post('payment-methods/status/{payment}', 'PaymentMethodController@status')->name('payment-method.status')->middleware('can:payment-method.edit');

        // SMS Gateways
        Route::get('sms-gateways', 'SMSGatewayController@index')->name('sms-gateway.index')->middleware('can:sms-gateway.index');
        Route::post('sms-gateways/{sms}', 'SMSGatewayController@update')->name('sms-gateway.update')->middleware('can:sms-gateway.edit');
        Route::post('sms-gateways/status/{sms}', 'SMSGatewayController@status')->name('sms-gateway.status')->middleware('can:sms-gateway.edit');

        // About System
        Route::get('about-system', 'AboutSystemController@index')->name('about-system.index');

        // Notification
        Route::get('notification', 'NotificationController@index')->name('notification.index');
        Route::post('notifications/markAsRead', 'NotificationController@markAsRead')->name('notifications.markAsRead');
        Route::post('notifications/clearAll', 'NotificationController@clearAll')->name('notifications.clearAll');
        Route::get('notification/destroy/{id}', 'NotificationController@destroy')->name('notification.destroy');

        // Landing Page
        Route::resource('landing-page', 'LandingPageController');
        Route::get('robots', 'RobotsController@index')->name('robot.index')->middleware('can:appearance.index');
        Route::post('robots/update', 'RobotsController@update')->name('robot.update')->middleware('can:appearance.edit');
        Route::get('customizations', 'CustomizationController@index')->name('customization.index')->middleware('can:appearance.index');
        Route::post('customizations/store', 'CustomizationController@store')->name('customization.store');
        Route::get('subscribers', 'LandingPageController@getSubscribes')->name('subscribes')->middleware('can:landing_page.index');
        Route::get('sitemap', 'RobotsController@index')->name('sitemap.index')->middleware('can:appearance.index');

        // Notify Templates
        Route::get('email-template', 'EmailTemplateController@index')->name('email-template.index')->middleware('can:email_template.index');
        Route::get('email-template/edit/{slug}', 'EmailTemplateController@edit')->name('email-template.edit')->middleware('can:email_template.edit');
        Route::post('email-template/edit/{slug}', 'EmailTemplateController@update')->name('email-template.update')->middleware('can:email_template.edit');

        // SMS Templates
        Route::get('sms-template', 'SmsTemplateController@index')->name('sms-template.index')->middleware('can:sms_template.index');
        Route::get('sms-template/edit/{slug}', 'SmsTemplateController@edit')->name('sms-template.edit')->middleware('can:sms_template.edit');
        Route::post('sms-template/edit/{slug}', 'SmsTemplateController@update')->name('sms-template.update')->middleware('can:sms_template.edit');

        // Push Notifications Templates
        Route::get('push-notification-template', 'PushNotificationTemplateController@index')->name('push-notification-template.index')->middleware('can:push_notification_template.index');
        Route::get('push-notification-template/edit/{slug}', 'PushNotificationTemplateController@edit')->name('push-notification-template.edit')->middleware('can:push_notification_template.edit');
        Route::post('push-notification-template/edit/{slug}', 'PushNotificationTemplateController@update')->name('push-notification-template.update')->middleware('can:push_notification_template.edit');

        // System Tools
        Route::resource('backup', 'BackupController');
        Route::get('backup/download-db/{id}', 'BackupController@downloadDbBackup')->name('backup.downloadDbBackup');
        Route::get('backup/download-files/{id}', 'BackupController@downloadFilesBackup')->name('backup.downloadFilesBackup');
        Route::get('backup/download-uploads/{id}', 'BackupController@downoadUploadsBackup')->name('backup.downoadUploadsBackup');
        Route::get('backup/restore-backup/{id}', 'BackupController@restoreBackup')->name('backup.restoreBackup')->middleware('can:backup.restore');
        Route::delete('backup/delete-backup/{id}', 'BackupController@deleteBackup')->name('backup.deleteBackup')->middleware('can:backup.destroy');

        // Activity Logs
        Route::get('activity-logs', 'ActivityLogController@index')->name('activity-logs.index')->middleware('can:system-tool.index');
        Route::get('activity-logs/destroy/{id}', 'ActivityLogController@destroy')->name('activity-log.destroy')->middleware('can:system-tool.destroy');
        Route::delete('activity-logs/delete-all', 'ActivityLogController@deleteAll')->name('activity-log.deleteAll')->middleware('can:system-tool.destroy');

        // Cleanup Database
        Route::resource('cleanup-db', 'DatabaseCleanupController');

        Route::get('/clear-cache', function () {
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('view:clear');
            Artisan::call('route:clear');
            Artisan::call('optimize:clear');
            Artisan::call('clear-compiled');
            Artisan::call('storage:link');
            Artisan::call('permission:cache-reset');
            return back()->with('success', 'Cache was successfully cleared.');
        })->name('clear.cache');

        Route::get('language/{locale}', function ($locale) {
            app()->setLocale($locale);
            session()?->put('locale', $locale);
            session()?->put('dir', getLanguageDir($locale));

            return redirect()->back();
        })->name('lang');

        Route::get('set-currency/{currency}', function ($currency) {
            session(['currency' => $currency]);
            return redirect()->back();
        })->name('set.currency');
    });

});
