<?php

namespace App\Providers;

use Exception;
use Illuminate\Support\ServiceProvider;
class QuickLinkServiceProvider extends ServiceProvider
{
    protected $quickLinks = [];
    protected static bool $bootedOnce = false;

    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton('quickLinks', function () {
            return [];
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        if (self::$bootedOnce) {
            return;
        }
        self::$bootedOnce = true;
        $this->registerQuickLinks();
    }

    public function registerQuickLinks()
    {
        try {



            add_quick_link('static.landing_pages.landing_page_title', 'admin.landing-page.index', 'ri-pages-line', 'landing_page.index');
            add_quick_link('static.settings.settings', 'admin.setting.index', 'ri-settings-4-line', 'setting.index');

        } catch (Exception $e) {

            // throw $e;
        }
    }
}
