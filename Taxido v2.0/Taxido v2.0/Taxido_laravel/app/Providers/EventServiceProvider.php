<?php

namespace App\Providers;

use App\Events\NewUserEvent;
use App\Listeners\NewUserListener;
use Illuminate\Support\ServiceProvider;
use App\Listeners\SpattieBackupsListener;
use Spatie\Backup\Events\BackupZipWasCreated;


class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    
    protected $listen = [
        NewUserEvent::class => [
            NewUserListener::class,
        ],
        BackupZipWasCreated::class => [
            SpattieBackupsListener::class,
        ]
    ];
    
     public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents()
    {
        return false;
    }

}
