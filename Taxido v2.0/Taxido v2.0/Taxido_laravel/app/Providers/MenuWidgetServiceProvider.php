<?php

namespace App\Providers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;
use Nwidart\Modules\Facades\Module;

class MenuWidgetServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind('widgetDirectories', function ($app) {
            $corePath = base_path('resources/views/admin');
            if (File::exists($corePath)) {
                $coreDirectories = array_map(
                    'realpath',
                    File::directories($corePath)
                );
            }

            $widgets = [];
            $directories = $coreDirectories;
            foreach($directories as $dir) {
                if (File::isDirectory($dir)) {
                    foreach(File::allFiles($dir) as $file) {
                        if (basename($file) === 'widget.blade.php') {
                            $widgets[] = $this->getWidgetResourcePath($file->getPathname());
                        }
                    }
                }
            }

            return $widgets;
        });
    }

    function getWidgetResourcePath($basePath) {
        $viewsDir = "/resources/views/";
        $viewsPosition = strpos($basePath, $viewsDir);
        $relativePath = substr($basePath, $viewsPosition + strlen($viewsDir));
        $widget = str_replace(['/', '.blade.php'], ['.', ''], $relativePath);
        return $widget;
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {

    }
}
