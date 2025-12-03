<?php

namespace Modules\Taxido\Listeners;

use Exception;
use App\Models\SmsTemplate;
use Modules\Taxido\Models\Driver;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Events\RejectBiddingEvent;
use Modules\Taxido\Notifications\RejectBiddingNotification;

class RejectBiddingListener
{
    /**
     * Handle the event.
     */
    public function handle(RejectBiddingEvent $event): void
    {

        try {

            $driver = Driver::where('id', $event->bid?->driver_id)->first();
            if(isset($driver)) {
                sendNotifyMail($driver, new RejectBiddingNotification($event->bid));
                $sendTo = ('+'.$driver?->country_code.$driver?->phone);
                sendSMS($sendTo, $this->getSMSMessage($event->bid));
                $message = "Your Bid Has Been Rejected";
                $this->sendPushNotification("user_".$driver?->id, $event);
            }

        } catch (Exception $e){

            Log::error("RejectBiddingListener.".$e?->getMessage());
        }
    }

    public function getSMSMessage($event)
    {
        $locale = request()->hasHeader('Accept-Lang') ? request()->header('Accept-Lang') : app()->getLocale();
        $slug =  'bid-status-driver';
        $content = SmsTemplate::where('slug', $slug)->first();

        if ($content) {

        $data = [
            '{{driver_name}}' => $event?->driver?->name,
            '{{rider_name}}' => $event?->ride_request?->rider['name'],
            '{{bid_status}}' => $event?->status,
            '{{Your Company Name}}' => config('app.name')
        ];

        $message = str_replace(array_keys($data), array_values($data), $content?->content[$locale]);

        } else {

            $message = "Your Bid Has Been ".$event?->status.".";
        }

        return $message;
    }

    public function sendPushNotification($topic, $event)
    {
        try {

            if (!$topic) return;
            $riderName = $event->ride_request?->rider['name'] ?? 'the rider';
            $title = "❌ Bid Rejected";
            $body = "Your bid for {$riderName}'s ride has been rejected. 😔 Better luck next time! Keep bidding! 💪";

            $notification = [
                'message' => [
                    'topic' => $topic,
                    'notification' => [
                        'title' => $title,
                        'body' => $body,
                        'image' => '',
                    ],
                    'data' => [
                        'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                        'type' => 'service_request',
                    ],
                ],
            ];

            pushNotification($notification);

        } catch(Exception $e) {

            Log::error("sendPushNotification".$e?->getMessage());
        }
    }
}
