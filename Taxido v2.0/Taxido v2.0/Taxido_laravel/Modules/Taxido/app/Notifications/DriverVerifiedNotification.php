<?php

namespace Modules\Taxido\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Modules\Taxido\Models\DriverDocument;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Notifications\Messages\MailMessage;
use Modules\Taxido\Models\Driver;

class DriverVerifiedNotification extends Notification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $driver;

    public $status;

    public function __construct(Driver $driver, string $status)
    {
        $this->driver = $driver;
        $this->status = $status;
    }

    public function via(object $notifiable): array
    {
        $channels = ['mail', 'database'];
        if ($this->getFcmToken($notifiable)) {
            $this->sendPushNotification($notifiable);
        }

        return $channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mailMessage = (new MailMessage)
            ->subject($this->getSubject())
            ->greeting("Dear {$this->driver?->name},")
            ->line($this->getMainMessage());

        if ($this->status === 'rejected') {
            $mailMessage->line('Please update your documents and resubmit for verification.');
        }

        return $mailMessage;
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->getSubject(),
            'message' => $this->getMainMessage(),
            'type' => 'driver_verification',
        ];
    }

    private function getSubject(): string
    {
        return $this->status === 'approved'
            ? 'Driver Verification Approved'
            : 'Driver Verification Update Required';
    }

    private function sendPushNotification($notifiable)
    {
        $payload = [
            'message' => [
                'token' => $this->getFcmToken($notifiable),
                'notification' => [
                    'title' => $this->getSubject(),
                    'body' => $this->getMainMessage(),
                    'image' => '',
                ],
                'data' => [
                    'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                    'type' => 'driver_verification',
                ],
            ],
        ];

        pushNotification($payload);
    }

    private function getFcmToken($notifiable)
    {
        return $this->driver?->fcm_token ?? null;
    }

    /**
     * Get the main message based on verification status.
     */
    private function getMainMessage(): string
    {
        return $this->status === 'approved'
            ? 'Congratulations! Your driver documents have been successfully verified. You can now start accepting rides.'
            : 'We regret to inform you that your driver documents could not be verified at this time.';
    }
}
