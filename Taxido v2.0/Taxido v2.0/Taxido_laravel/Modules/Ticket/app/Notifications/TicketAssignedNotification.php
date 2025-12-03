<?php

namespace Modules\Ticket\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class TicketAssignedNotification extends Notification
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
        if ($settings['activation']['assign_notification_enable']) {
            return (new MailMessage)
                ->subject("Ticket #{$this->ticket->ticket_number} Assign - Action Required")
                ->line("Ticket #{$this->ticket->ticket_number} has been assign to you.")
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
        //for assigner
        return [
            'title' => __('Ticket Assigned'),
            'message' =>  __('The Ticket #'.$this->ticket->ticket_number. $this->ticket->note),
            'type' => "ticket"
        ];
    }
}
