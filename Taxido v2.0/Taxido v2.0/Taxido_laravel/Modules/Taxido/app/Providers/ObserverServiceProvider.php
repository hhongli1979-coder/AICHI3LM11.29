<?php

namespace Modules\Taxido\Providers;

use Modules\Taxido\Models\Ride;
use Illuminate\Support\ServiceProvider;
use Modules\Taxido\Observers\RideObserver;

class ObserverServiceProvider extends ServiceProvider
{
  public function boot(): void
  {
    Ride::observe(RideObserver::class);
  }
}
