<?php

namespace Modules\Taxido\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class SOSAlertNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $ride;
    private $sos;

    public function __construct($ride, $sos)
    {
        $this->ride = $ride;
        $this->sos  = $sos;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('🚨 SOS Alert Triggered')
            ->greeting('Attention Required!')
            ->line('An SOS alert was triggered during a ride.')
            ->line('Ride ID: #' . $this->ride->ride_number)
            ->line('Coordinates: Latitude ' . $this->sos->location_coordinates['lat'] . ', Longitude ' . $this->sos->location_coordinates['lng'])
            ->action('View SOS Details', url('/admin/sos-alerts/' . $this->sos->id))
            ->line('Please respond immediately.');
    }

    public function toArray($notifiable): array
    {
        return [
            'title'   => 'SOS Alert Triggered',
            'message' => '🚨 SOS alert triggered during ride #' . $this->ride->ride_number . '. Immediate attention required.',
            'type'    => 'sos_alert',
        ];
    }
}
