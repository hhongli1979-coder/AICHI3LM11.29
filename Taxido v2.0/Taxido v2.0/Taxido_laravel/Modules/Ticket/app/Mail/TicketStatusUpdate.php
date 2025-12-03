<?php

namespace Modules\Ticket\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TicketStatusUpdate extends Mailable
{
    use Queueable, SerializesModels;

    public $ticket;

    /**
     * Create a new message instance.
     */
    public function __construct($ticket)
    {
        $this->ticket = $ticket;
    }

     /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $settings = tx_getSettings();
        if ($settings['activation']['status_notification_enable']) {
            return $this->subject("Ticket #{$this->ticket->ticket_number} has been {$this->ticket->ticketStatus->name}")->markdown('ticket::admin.emails.status');
        }
    }
}