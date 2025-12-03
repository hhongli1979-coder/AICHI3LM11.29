<?php

namespace Modules\Ticket\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class TicketCreatedNotification extends Notification
{
    use Queueable;

    private $ticket;

    /**
     * Create a new notification instance.
     */
    public function __construct($ticket)
    {
        $this->ticket = $ticket;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database','mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable)
    {
        $settings = tx_getSettings();
        if ($settings['activation']['create_notification_enable']) {
            return (new MailMessage)
                ->subject("Ticket #{$this->ticket->ticket_number} Created - Action Required")
                ->line("Ticket #{$this->ticket->ticket_number} has been created.")
                ->line("Please take necessary actions.")
                ->line("Ticket Status: Open")
                ->mailer('ticket_email');
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        //for admin
        $user = User::where('id', $this->ticket->created_by_id)->pluck('name')->first();
        return [
            'title' => __('New Ticket Created'),
            'message' =>  __('A ticket created by '.$user.'. The Ticket Number is #'.$this->ticket->ticket_number.'.'),
            'type' => "ticket"
        ];
    }
}
