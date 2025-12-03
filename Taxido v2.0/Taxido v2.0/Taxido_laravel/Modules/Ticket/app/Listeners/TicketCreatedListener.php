<?php

namespace Modules\Ticket\Listeners;

use Exception;
use App\Models\User;
use App\Enums\RoleEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Ticket\Events\TicketCreatedEvent;
use Modules\Ticket\Notifications\TicketCreatedNotification;

class TicketCreatedListener {
    
    /**
     * Handle the event.
     */
    public function handle(TicketCreatedEvent $event)
    {
        try {
            // for admin
            $settings = tx_getSettings();
            if ($settings['activation']['create_notification_enable']) {
                $admin = User::role(RoleEnum::ADMIN)->first();
                if (isset($admin)) {

                    // $admin->notify(new TicketCreatedNotification($event->ticket));

                    $notification = DB::table('notifications')->where('type', TicketCreatedNotification::class)->where('notifiable_id', $admin->id)->latest()->first();
                    
                    if ($notification) {
                        DB::table('notifications')
                            ->where('id', $notification->id)
                            ->update(['module' => 'ticket']);
                    }
                }
            }

        } catch (Exception $e) {
            Log::error('Error processing TicketCreatedEvent: ' . $e->getMessage());
        }
    }
}