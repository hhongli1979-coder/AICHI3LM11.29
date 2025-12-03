<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NewUserNotification extends Notification
{
    use Queueable;

    private $user;

    private $password;

    /**
     * Create a new notification instance.
     */
    public function __construct($user, $password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail','database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to '.env('APP_NAME'))
            ->greeting('Hello ' . $this->user->name . ',')
            ->line('Welcome to our platform! We are excited to have you on board.')
            ->line('Here are your login details:')
            ->line('Email: ' . $this->user->email)
            ->line('Password: '. $this->password)
            ->action('Login Now', url('/login'))
            ->line('For security reasons, please change your password after logging in.')
            ->line('Thank you for joining us!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => "Welcome to ".env('APP_NAME'),
            'message' => "Welcome to our platform! Please find your login details in the email we've sent.",
            'type' => "new_user"
        ];
    }
}
