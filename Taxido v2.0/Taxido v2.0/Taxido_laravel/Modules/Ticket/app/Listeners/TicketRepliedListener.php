<?php

namespace Modules\Ticket\Listeners;

use Exception;
use App\Models\User;
use Modules\Ticket\Enums\RoleEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Ticket\Events\TicketRepliedEvent;
use Modules\Ticket\Notifications\TicketRepliedNotification;

class TicketRepliedListener {
    
    /**
     * Handle the event.
     */
    public function handle(TicketRepliedEvent $event)
    {
        try {
            // for admin
            $settings = tx_getSettings();
            if ($settings['activation']['replied_notification_enable']) {
                $admin = User::role(RoleEnum::ADMIN)->first();
                if (isset($admin)) {

                    $admin->notify(new TicketRepliedNotification($event->message));

                    $notification = DB::table('notifications')->where('type', TicketRepliedNotification::class)->where('notifiable_id', $admin->id)->latest()->first();
                    
                    if ($notification) {
                        DB::table('notifications')
                            ->where('id', $notification->id)
                            ->update(['module' => 'ticket']);
                    }
                }
            }
        } catch (Exception $e) {
            Log::error('Error processing TicketRepliedEvent: ' . $e->getMessage());
        }
    }
}