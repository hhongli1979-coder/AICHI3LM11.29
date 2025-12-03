<?php

namespace Modules\Taxido\Notifications;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class RejectBiddingNotification extends Notification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The bid instance.
     */
    protected $bids;

    /**
     * Create a new notification instance.
     */
    public function __construct($bids)
    {
        $this->bids = $bids; // Assign the passed bid object to $bids
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
        $content = EmailTemplate::where('slug', 'bid-status-driver')->first();
        $locale = request()->hasHeader('Accept-Lang')
            ? request()->header('Accept-Lang')
            : app()->getLocale();

        $driver = $this->bids->driver?->name;

        $data = [
            '{{driver_name}}' => $driver,
            '{{rider_name}}' => $this->bids?->ride_request?->rider['name'],
            '{{bid_status}}' => $this->bids?->status,
            '{{Your Company Name}}' => config('app.name'),
        ];

        $emailContent = str_replace(array_keys($data), array_values($data), $content->content[$locale]);

        return (new MailMessage)
            ->subject($content->title[$locale])
            ->markdown('taxido::emails.email-template', [
                'content' => $content,
                'emailContent' => $emailContent,
                'locale' => $locale,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Bid Rejected',
            'message' => 'Your bid for bid ID ' . $this->bids->id . ' has been rejected.',
            'type' => 'bid',
        ];
    }
}
