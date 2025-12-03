<?php

namespace Modules\Ticket\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TicketReplied extends Mailable
{
    use Queueable, SerializesModels;

    public $contact;

    /**
     * Create a new message instance.
     */
    public function __construct($contact)
    {
        $this->contact = $contact;
    }

     /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $settings = tx_getSettings();
        if ($settings['activation']['replied_notification_enable']) {
            $mail = $this->subject("Ticket #{$this->contact->ticket->ticket_number} Replied")->markdown('ticket::admin.emails.replied');

            if ($this->contact->media) {
                foreach ($this->contact->media as $mediaItem) {
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