<?php

namespace Modules\Ticket\Providers;

use Exception;
use Modules\Ticket\Console\Piping;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;
use Illuminate\Console\Scheduling\Schedule;
use Modules\Ticket\Console\UpdateDateCommand;

class TicketServiceProvider extends ServiceProvider
{
    protected string $moduleName = 'Ticket';

    protected string $moduleNameLower = 'ticket';

    /**
     * Boot the application events.
     */
    public function boot(): void
    {
        $this->registerMailConfiguration();
        $this->registerCommandSchedules();
        $this->registerTranslations();
        $this->registerConfig();
        $this->registerViews();
        $this->loadMigrationsFrom(module_path($this->moduleName, 'database/migrations'));
        $this->loadFiles();
        if ($this->shouldRegisterAdminUi()) {
            $this->registerWidget();
            $this->registerQuickLinks();
        }
    }

    public function loadFiles(): void
    {
        $helperFile = __DIR__ . '/../Helpers/helper.php';
        if (file_exists($helperFile)) {
            require_once $helperFile;
        }
    }

    public function registerMailConfiguration(): void
    {
        // Add ticket mail configuration here
        Config::set('mail.mailers.ticket_email', [
            'transport' => 'smtp',
            'host' => env('TICKET_MAIL_HOST'),
            'port' => env('TICKET_MAIL_PORT'),
            'encryption' => env('TICKET_MAIL_ENCRYPTION'),
            'username' => env('TICKET_MAIL_USERNAME'),
            'password' => env('TICKET_MAIL_PASSWORD'),
            'timeout' => null,
        ]);
    }

    /**
     * Register the service provider.
     */
    public function register(): void
    {
        $this->app->register(EventServiceProvider::class);
        $this->app->register(RouteServiceProvider::class);
        $this->registerCommands();
    }

    /**
     * Register commands in the format of Command::class
     */
    protected function registerCommands(): void
    {
        $this->commands([
            Piping::class,
            UpdateDateCommand::class
        ]);
    }

    /**
     * Register command Schedules.
     */
    protected function registerCommandSchedules(): void
    {
        $this->app->booted(function () {
            $schedule = $this->app->make(Schedule::class);
            $schedule->command('command:piping')->everyMinute();
        });
    }

    /**
     * Register translations.
     */
    public function registerTranslations(): void
    {
        $langPath = resource_path('lang/modules/' . $this->moduleNameLower);
        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, $this->moduleNameLower);
            $this->loadJsonTranslationsFrom($langPath);
        } else {
            $this->loadTranslationsFrom(module_path($this->moduleName, 'lang'), $this->moduleNameLower);
            $this->loadJsonTranslationsFrom(module_path($this->moduleName, 'lang'));
        }
    }

    /**
     * Register config.
     */
    protected function registerConfig(): void
    {
        $this->publishes([module_path($this->moduleName, 'config/config.php') => config_path($this->moduleNameLower . '.php')], 'config');
        $this->mergeConfigFrom(module_path($this->moduleName, 'config/config.php'), $this->moduleNameLower);
    }

    /**
     * Register views.
     */
    public function registerViews(): void
    {
        $viewPath = resource_path('views/modules/' . $this->moduleNameLower);
        $sourcePath = module_path($this->moduleName, 'resources/views');

        $this->publishes([$sourcePath => $viewPath], ['views', $this->moduleNameLower . '-module-views']);

        $this->loadViewsFrom(array_merge($this->getPublishableViewPaths(), [$sourcePath]), $this->moduleNameLower);

        $componentNamespace = str_replace('/', '\\', config('modules.namespace') . '\\' . $this->moduleName . '\\' . ltrim(config('modules.paths.generator.component-class.path'), config('modules.paths.app_folder', '')));
        Blade::componentNamespace($componentNamespace, $this->moduleNameLower);
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array<string>
     */
    public function provides(): array
    {
        return [];
    }

    /**
     * @return array<string>
     */
    private function getPublishableViewPaths(): array
    {
        $paths = [];
        foreach (config('view.paths') as $path) {
            if (is_dir($path . '/modules/' . $this->moduleNameLower)) {
                $paths[] = $path . '/modules/' . $this->moduleNameLower;
            }
        }

        return $paths;
    }

    public function registerWidget()
    {
        try {

            addWidget(
                'tickets',
                __('ticket::static.widget.tickets'),
                function ($data) {
                    return view('ticket::admin.widgets.recent-tickets');
                },
                [
                    'context' => 'normal',
                    'priority' => 'high',
                ]
            );
        } catch (Exception $e) {

            // throw $e;
        }
    }

    public function registerQuickLinks()
    {
        try {

            add_quick_link(('ticket::static.ticket.support_ticket'), 'admin.ticket.index', 'ri-ticket-2-line', 'ticket.index');

        } catch (Exception $e) {

            throw $e;
        }
    }

    protected function shouldRegisterAdminUi(): bool
    {
        if ($this->app->runningInConsole()) {
            return false;
        }

        $request = request();
        if ($request->expectsJson() || $request->isJson() || $request->wantsJson()) {
            return false;
        }

        return true;
    }
}
