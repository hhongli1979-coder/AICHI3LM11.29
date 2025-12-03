<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class WidgetServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->registerWidget();
    }

    public function registerWidget()
    {
        addWidget(
            'top_blogs',
            __('static.widget.top_blogs'),
            function ($data) {
                return view('admin.widgets.top-blogs');
            },
            [
                'context' => 'normal',
                'priority' => 'low',
            ]
        );
    }
}
