<?php

namespace App\Providers;

use App\Services\Guardian;

use App\Enums\RoleEnum;
use App\Facades\WMenu;
use App\Models\Plugin;
use App\Observers\PluginObserver;
use App\Services\BadgeResolver;
use App\Services\WidgetManager;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Spatie\Translatable\Facades\Translatable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind('Menu', function () {
            return new WMenu();
        });

        $this->app->singleton(WidgetManager::class, function () {
            return new WidgetManager();
        });

        $this->app->singleton(BadgeResolver::class, function () {
            return new BadgeResolver();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Guardian::bootApplication();
        Paginator::useBootstrap();
        Plugin::observe(PluginObserver::class);
        Translatable::fallback(fallbackAny: true, );
        JsonResource::withoutWrapping();
        Model::automaticallyEagerLoadRelationships();

        Gate::before(function ($user, $ability) {
            return $user->hasRole(RoleEnum::ADMIN) ? true : null;
        });
    }
}
