<?php

namespace App\Listeners;

use App\Events\NewUserEvent;
use App\Notifications\NewUserNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewUserListener implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(NewUserEvent $event): void
    {
        $user = $event->user;
        $password = $event->password;

        if (isset($user)) {
            $user->notify(new NewUserNotification($user, $password));
        }
    }
}
