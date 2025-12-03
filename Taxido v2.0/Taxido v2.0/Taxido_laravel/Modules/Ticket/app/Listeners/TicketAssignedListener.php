<?php

namespace Modules\Ticket\Listeners;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Ticket\Models\Executive;
use Modules\Ticket\Events\TicketAssignedEvent;
use Modules\Ticket\Notifications\TicketAssignedNotification;

class TicketAssignedListener {
    
    /**
     * Handle the event.
     */
    public function handle(TicketAssignedEvent $event)
    {
        try {
            // for assigned executives
            
            $settings = tx_getSettings();
            if ($settings['activation']['assign_notification_enable']) {
                foreach ($event->ticket->assigned_tickets as $assignedUser) {
                    $user = Executive::findOrFail($assignedUser->id);
                    if ($user) {
                        $user->notify(new TicketAssignedNotification($event->ticket));
                        $notification = DB::table('notifications')->where('type', TicketAssignedNotification::class)->where('notifiable_id', $user->id)->latest()->first();
                        
                        if ($notification) {
                            DB::table('notifications')
                                ->where('id', $notification->id)
                                ->update(['module' => 'ticket']);
                        }
                    }
                }
            }

        } catch (Exception $e) {
            Log::error('Error processing TicketAssignedEvent: ' . $e->getMessage());
        }
    }
}