<?php

namespace Modules\Taxido\Observers;

use Modules\Taxido\Models\Ride;

class RideObserver
{
    /**
     * Handle the Ride "created" event.
     */
    public function created(Ride $ride): void {}

    /**
     * Handle the Ride "updated" event.
     */
    public function updated(Ride $ride): void {
        if(request()->status) {
            $ride->ride_status_activities()->updateOrCreate(['status' => request()->status], [
                'status' => request()->status,
                'changed_at' => now(),
            ]);
        }
    }

    /**
     * Handle the Ride "deleted" event.
     */
    public function deleted(Ride $ride): void {}

    /**
     * Handle the Ride "restored" event.
     */
    public function restored(Ride $ride): void {}

    /**
     * Handle the Ride "force deleted" event.
     */
    public function forceDeleted(Ride $ride): void {}
}
