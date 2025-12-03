<?php

namespace Modules\Taxido\Notifications;

use Illuminate\Bus\Queueable;
use App\Models\EmailTemplate;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Notifications\Messages\MailMessage;

class RideRequestNotification extends Notification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $driver;
    private $rideRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct($driver ,$rideRequest)
    {
        $this->driver = $driver;
        $this->rideRequest = $rideRequest;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {

        $content = EmailTemplate::where('slug','ride-request-driver')->first();

        $driver = $this->driver->name;
        $locale = request()->hasHeader('Accept-Lang') ?
        request()->header('Accept-Lang') :
        app()->getLocale();

        $data = [
            '{{driver_name}}' => $driver,
            '{{rider_name}}' => $this->rideRequest->rider['name'],
            '{{services}}' => $this->rideRequest->service->name,
            '{{service_category}}' => $this->rideRequest->service_category->name,
            '{{vehicle_type}}' => $this->rideRequest->vehicle_type->name,
            '{{fare_amount}}' => $this->rideRequest->ride_fare,
            '{{distance}}' => $this->rideRequest->distance,
            '{{distance_unit}}' => $this->rideRequest->distance_unit,
            '{{locations}}' => implode("<br>", $this->rideRequest->locations),
            '{{Your Company Name}}' => config('app.name')
        ];
        $emailContent = str_replace(array_keys($data), array_values($data),$content->content[$locale]);


        return (new MailMessage)
                ->subject($content->title[$locale])
                ->markdown('taxido::emails.email-template', ['content' => $content, 'emailContent' => $emailContent ,'locale' => $locale]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => "New Ride Request #{$this->rideRequest->ride_number}",
            'message' => "You have a new ride request from " . $this->driver?->name,
            'type' => 'ride_request',
        ];
    }
}
