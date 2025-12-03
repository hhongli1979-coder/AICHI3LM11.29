<?php

namespace Modules\Taxido\Notifications;

use App\Enums\RoleEnum;
use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Modules\Taxido\Models\Ride;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Notifications\Messages\MailMessage;
use Modules\Taxido\Enums\RoleEnum as EnumsRoleEnum;

class AcceptBiddingNotification extends Notification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $ride;
    private $roleName;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ride $ride, $roleName)
    {
        $this->ride = $ride;
        $this->roleName = $roleName;
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
    public function toMail(object $notifiable)
    {

        switch ($this->roleName) {
            case RoleEnum::ADMIN:
                return $this->toAdminMail();
            case EnumsRoleEnum::DRIVER:
                return $this->toDriverMail();
        }
    }

    public function toAdminMail(): MailMessage
    {
        $content = EmailTemplate::where('slug','create-ride-admin')->first();
        $locale = request()->hasHeader('Accept-Lang') ?
        request()->header('Accept-Lang') :
        app()->getLocale();

        $data = [
            '{{driver_name}}' => $this->ride->driver->name,
            '{{ride_number}}' => $this->ride->ride_number,
            '{{rider_name}}' => $this->ride->rider['name'],
            '{{rider_phone}}' => $this->ride->rider['phone'],
            '{{vehicle_type}}' => $this->ride->vehicle_type->name,
            '{{services}}' => $this->ride->service->name,
            '{{service_category}}' => $this->ride->service_category->name,
            '{{fare_amount}}' => $this->ride?->ride_fare,
            '{{distance}}' => $this->ride?->distance,
            '{{distance_unit}}' => $this->ride?->distance_unit,
            '{{Your Company Name}}' => config('app.name')
        ];
        $emailContent = str_replace(array_keys($data), array_values($data),$content->content[$locale]);
        return (new MailMessage)
            ->subject($content->title[$locale])
            ->markdown('taxido::emails.email-template', ['content' => $content, 'emailContent' => $emailContent ,'locale' => $locale]);
    }

    public function toDriverMail(): MailMessage
    {
        $content = EmailTemplate::where('slug','create-ride-driver')->first();
        $locale = request()->hasHeader('Accept-Lang') ?
        request()->header('Accept-Lang') :
        app()->getLocale();

        $data = [
            '{{driver_name}}' => $this->ride->driver->name,
            '{{ride_number}}' => $this->ride->ride_number,
            '{{rider_name}}' => $this->ride->rider['name'],
            '{{rider_phone}}' => $this->ride->rider['phone'],
            '{{vehicle_type}}' => $this->ride->vehicle_type->name,
            '{{services}}' => $this->ride->service->name,
            '{{service_category}}' => $this->ride->service_category->name,
            '{{fare_amount}}' => $this->ride->ride_fare,
            '{{distance}}' => $this->ride->distance,
            '{{distance_unit}}' => $this->ride->distance_unit,
            '{{Your Company Name}}' => config('app.name')
        ];
        $emailContent = isset($content->content[$locale])
        ? str_replace(array_keys($data), array_values($data), $content->content[$locale])
        : 'A New Ride Has Been Created.';

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
        $title = "";
        $message = "";
        switch ($this->roleName) {
            case RoleEnum::ADMIN:
                $message = "The status of ride ID {$this->ride->ride_number} has been updated.";
                $title = "Ride Status Updated";
                break;
            case EnumsRoleEnum::DRIVER:
                $message = "Your fare for ride ID {$this->ride->ride_number} has been accepted.";
                $title = "Fare Accepted";
                break;
        }
        return [
            'title' => $title,
            'message' => $message,
            'type' => 'ride'
        ];
    }
}
