<?php

namespace Modules\Ticket\Listeners;

use Exception;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Modules\Ticket\Events\TicketStatusEvent;
use Modules\Ticket\Notifications\TicketStatusNotification;
use Modules\Ticket\Mail\TicketStatusUpdate as TicketStatusUpdateMail;

class TicketStatusListener {
    
    /**
     * Handle the event.
     */
    public function handle(TicketStatusEvent $event)
    {
        try {
            // for user
            $settings = tx_getSettings();
            if ($settings['activation']['status_notification_enable']) {
                if (!$event->ticket->created_by_id) {
                    Mail::mailer('ticket_email')->to($event->ticket->email)->send(new TicketStatusUpdateMail($event->ticket));
                } else {
                    $user = User::where('id',$event->ticket->created_by_id)->first();
                    if (isset($user)) {
                        $user->notify(new TicketStatusNotification($event->ticket));
                        $notification = DB::table('notifications')->where('type', TicketStatusNotification::class)->where('notifiable_id', $user->id)->latest()->first();
                        
                        if ($notification) {
                            DB::table('notifications')
                                ->where('id', $notification->id)
                                ->update(['module' => 'ticket']);
                        }
                    }
                }
            }

        } catch (Exception $e) {
            Log::error('Error processing TicketStatusEvent: ' . $e->getMessage());
        }
    }
}