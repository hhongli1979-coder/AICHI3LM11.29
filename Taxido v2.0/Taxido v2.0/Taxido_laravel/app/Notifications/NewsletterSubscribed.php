<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class NewsletterSubscribed extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $email)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $appName = config('app.name');
        $supportEmail = config('mail.from.address');

        return (new MailMessage)
            ->subject("Welcome to {$appName} Newsletter!")
            ->greeting("Hi there,")
            ->line("Thank you for subscribing to the {$appName} newsletter.")
            ->line("We're excited to have you on board! You’ll now receive updates, promotions, and news directly to your inbox.")
            ->line("**Subscription Email:** {$this->email}")
            ->line("If you did not subscribe or wish to unsubscribe, please ignore this message or contact us.")
            ->line("For any inquiries, feel free to reach out at: {$supportEmail}")
            ->salutation("Warm regards,\nThe {$appName} Team");
    }
}

