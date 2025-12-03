<?php

namespace Modules\Taxido\Notifications;

use App\Models\User;
use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Notifications\Messages\MailMessage;

class CreateWithdrawRequestNotification extends Notification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $withdrawRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct($withdrawRequest)
    {
        $this->withdrawRequest = $withdrawRequest;
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

        $content = EmailTemplate::where('slug','create-withdraw-request-admin')->first();
        $driver = $this->withdrawRequest?->driver?->name;

        $locale = request()->hasHeader('Accept-Lang') ?
        request()->header('Accept-Lang') :
        app()->getLocale();

        $data = [
            '{{driver_name}}' => $driver,
            '{{amount}}'=> $this->withdrawRequest?->amount,
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
        //for admin
        $driver = User::where('id', $this->withdrawRequest->driver_id)->pluck('name')->first();
        $symbol = getDefaultCurrencyCode();
        return [
            'title' => "New Withdraw Request",
            'message' =>  "A withdrawal request for {$symbol}{$this->withdrawRequest->amount} has been received from a {$driver}.",
            'type' => "withdraw",
        ];
    }
}
