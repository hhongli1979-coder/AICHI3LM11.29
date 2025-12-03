<?php

namespace Modules\Taxido\Listeners;

use Exception;
use App\Models\User;
use App\Models\SmsTemplate;
use Modules\Taxido\Models\Driver;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Events\UpdateWithdrawRequestEvent;
use Modules\Taxido\Notifications\UpdateWithdrawRequestNotification;

class UpdateWithdrawRequestListener
{
    public function handle(UpdateWithdrawRequestEvent $event): void
    {
        try {

            $driver = User::where('id', $event->withdrawRequest->driver_id)->first();
            if (isset($driver)) {
                $this->sendPushNotification("user_".$driver->id, $event->withdrawRequest);
                sendNotifyMail($driver, new UpdateWithdrawRequestNotification($event->withdrawRequest));
                $sendTo = ('+'.$driver?->country_code.$driver?->phone);
                sendSMS($sendTo, $this->getSMSMessage($event->withdrawRequest));
                $message = "A Withdraw Request  Status Has Been Updated";
            }

        } catch (Exception $e) {

            Log::error("Update WithdrawRequest Listener.".$e?->getMessage());
        }
    }

    public function getSMSMessage($event)
    {
        $locale = request()->hasHeader('Accept-Lang') ? request()->header('Accept-Lang') : app()->getLocale();
        $slug = 'update-withdraw-request-driver';
        $content = SmsTemplate::where('slug', $slug)?->first();
        $driver = Driver::where('id', $event->driver_id)?->first();

        if ($content) {
            $data = [
                '{{driver_name}}' => $driver?->name,
                '{{amount}}'=> $event->amount,
                '{{status}}' => $event->status,
            ];

            $message = str_replace(array_keys($data), array_values($data), $content?->content[$locale]);

        } else {

            $message = "A new Withdraw Request has been created.";
        }

        return $message;
    }

    public function sendPushNotification($topic, $withdrawRequest)
    {
        try {

            if ($topic) {
                $statusEmoji = $withdrawRequest->status === 'approved' ? '✅' : '❌';
                $title = "{$statusEmoji} Withdrawal Status: " . ucfirst($withdrawRequest->status);
                $body = $withdrawRequest->status === 'approved'
                    ? "🎉 Woohoo! Your withdrawal of ₹{$withdrawRequest->amount} has been approved. 💸💳"
                    : "😔 Oops! Your withdrawal request of ₹{$withdrawRequest->amount} was rejected. Please try again or contact support. 📞";

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
            }

        } catch(Exception $e) {

            Log::error("sendPushNotification.".$e?->getMessage());
        }
    }
}
