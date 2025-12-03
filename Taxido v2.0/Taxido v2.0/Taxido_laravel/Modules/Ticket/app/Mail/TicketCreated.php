<?php

namespace Modules\Ticket\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TicketCreated extends Mailable
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
        if ($settings['activation']['create_notification_enable']) {
            $mail = $this->subject("Ticket #{$this->ticket->ticket_number} Created - Action Required")->markdown('ticket::admin.emails.created');

            if ($this->ticket->media) {
                foreach ($this->ticket->media as $mediaItem) {
                    $mail->attach($mediaItem->getPath(), [
                        'as' => $mediaItem->file_name,
                        'mime' => $mediaItem->mime_type,
                    ]);
                }
            }
            return $mail;
        }
    }
}
