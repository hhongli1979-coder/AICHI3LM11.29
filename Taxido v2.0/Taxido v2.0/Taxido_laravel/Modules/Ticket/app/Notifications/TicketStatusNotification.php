<?php

namespace Modules\Ticket\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class TicketStatusNotification extends Notification
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
    public function toMail(object $notifiable): MailMessage
    {
        $settings = tx_getSettings();
        if ($settings['activation']['status_notification_enable']) {
            return (new MailMessage)
                ->subject("Ticket #{$this->ticket->ticket_number} has been {$this->ticket->ticketStatus->name}")
                ->greeting("Hello,")
                ->line("We wanted to provide you with an update regarding your recent ticket, ID. #{$this->ticket->ticket_number}.")
                ->line("Your ticket status has been updated to {$this->ticket->ticketStatus->name}. ")
                ->line('Please feel free to reach out to us if you have any questions or need assistance.')
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
        //for user
        return [
            'title' => __('Ticket status updated!'),
            'message' =>  __("Ticket Update: Your ticket #{$this->ticket->ticket_number} has been updated and current ticket status is in {$this->ticket->ticketStatus->name}"),
            'type' => "ticket",
            'ticket_number' => $this->ticket->ticket_number
        ];
    }
}
