<?php

namespace Modules\Taxido\Listeners;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Events\SOSAlertEvent;
use Modules\Taxido\Notifications\SOSAlertNotification;

class SOSAlertListener
{
    public function handle(SOSAlertEvent $event): void
    {
        $user = User::find($event->ride->user_id);
        if ($user) {
            sendNotifyMail($user, new SOSAlertNotification($event->ride, $event->sos));
        }

        $admins = User::whereHas('roles', fn($q) => $q->where('name', 'admin'))->get();
        foreach ($admins as $admin) {
            sendNotifyMail($admin, new SOSAlertNotification($event->ride, $event->sos));
        }
    }
}
