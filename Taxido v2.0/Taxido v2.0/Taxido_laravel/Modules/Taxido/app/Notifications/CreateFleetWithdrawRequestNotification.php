<?php

namespace Modules\Taxido\Notifications;

use App\Models\User;
use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class CreateFleetWithdrawRequestNotification extends Notification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $fleetWithdrawRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct($fleetWithdrawRequest)
    {
        $this->fleetWithdrawRequest = $fleetWithdrawRequest;
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
        $content      = EmailTemplate::where('slug', 'create-fleet-withdraw-request-admin')->first();
        $fleetManager = $this->fleetWithdrawRequest?->fleet?->name;

        $locale = request()->hasHeader('Accept-Lang') ?
        request()->header('Accept-Lang') :
        app()->getLocale();

        $data = [
            '{{fleet_manager_name}}' => $fleetManager,
            '{{amount}}'             => $this->fleetWithdrawRequest?->amount,
        ];

        $emailContent = str_replace(array_keys($data), array_values($data), $content->content[$locale]);

        return (new MailMessage)
            ->subject($content->title[$locale])
            ->markdown('taxido::emails.email-template', ['content' => $content, 'emailContent' => $emailContent, 'locale' => $locale]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        // For admin
        $fleetManager = User::where('id', $this->fleetWithdrawRequest->fleet_manager_id)->pluck('name')->first();
        $symbol       = getDefaultCurrencyCode();
        return [
            'title'   => "New Fleet Withdraw Request",
            'message' => "A withdrawal request for {$symbol}{$this->fleetWithdrawRequest->amount} has been received from {$fleetManager}.",
            'type'    => "fleet_withdraw",
        ];
    }
}
