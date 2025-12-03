<?php

namespace Modules\Taxido\Listeners;

use Exception;
use App\Models\User;
use Modules\Taxido\Events\CreateBidEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Notifications\CreateBidNotification;

class CreateBidListener
{
    /**
     * Handle the event.
     *
     * @param CreateBidEvent $event
     */
    public function handle(CreateBidEvent $event): void
    {
        try {

            $user = User::find($event->ride->user_id);
            if ($user) {
                sendNotifyMail($user, new CreateBidNotification($event->ride, $event->bidAmount, $event->driver));
            }

        } catch (Exception $e) {

            Log::error("CreateBidListener.". $e?->getMessage());
        }
    }
}
