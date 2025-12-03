<?php

namespace Modules\Ticket\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class TicketRepliedNotification extends Notification
{
    use Queueable;

    private $replied;

    /**
     * Create a new notification instance.
     */
    public function __construct($replied)
    {
        $this->replied = $replied;
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
        if ($settings['activation']['replied_notification_enable']) {
        return (new MailMessage)
            ->subject("Ticket #{$this->replied->ticket->ticket_number} Replied")
            ->line("Ticket #{$this->replied->ticket->ticket_number} has been replied by {$this->replied->created_by->name}.")
            ->line("Taken necessary actions.")
            ->line("Ticket Status: {$this->replied->ticket->ticketStatus->name}")
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
        return [
            'title' => __('New Ticket Replied'),
            'message' =>  __('A ticket replied by '.$this->replied->created_by->name.'. The Ticket Number is #'.$this->replied->ticket->ticket_number.'.'),
            'type' => "ticket"
        ];
    }
}
