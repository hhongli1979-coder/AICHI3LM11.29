<?php

namespace Modules\Taxido\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Notifications\Messages\MailMessage;

class CreateBidNotification extends Notification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $ride;
    private $bidAmount;
    private $driver;
    /**
     * Create a new notification instance.
     */
    public function __construct($ride,$bidAmount,$driver)
    {
        $this->ride = $ride;
        $this->bidAmount = $bidAmount;
        $this->driver = $driver;
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
            ->subject('New Bid Submitted')
            ->line('A driver has submitted a bid for your ride.')
            ->line('Ride ID: ' . $this->ride->id)
            ->line('Driver Name: ' . $this->driver->name)
            ->line('Bid Amount: $' . number_format($this->bidAmount, 2))
            ->action('View Ride Details', $this->ride->id)
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'New Bid Submitted',
            'message' => '',
            'type' => 'bid'
        ];
    }
}
