<?php

namespace Modules\Taxido\Emails;

use Illuminate\Mail\Mailable;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;

class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;

    /**
     * Create a new message instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Build the message.
     */
    public function build(): self
    {
        return $this->subject('Verify Email')
            ->markdown('taxido::emails.verify-email');
    }
}
