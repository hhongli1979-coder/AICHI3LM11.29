<?php

namespace Modules\Taxido\Listeners;

use Exception;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Events\DriverVerificationEvent;
use Modules\Taxido\Notifications\DriverVerifiedNotification;

class DriverVerificationListener
{
    /**
     * Handle the event.
     *
     * @param DriverVerificationEvent $event
     */
    public function handle(DriverVerificationEvent $event): void
    {
        try {

            $driver = $event->driver;
            $message = "Your document has '{$event->status}' status";
            $this->sendPushNotification("user_".$driver->id, $driver);
            if ($driver) {
                sendNotifyMail($driver, new DriverVerifiedNotification($driver, $event->status));
            }

        } catch (Exception $e) {

            Log::error('Driver Verification Listener' . $e->getMessage());
        }
    }

    public function sendPushNotification($topic, $message)
    {
        try {

            if ($topic) {
                $locale = request()->hasHeader('Accept-Lang') ? request()->header('Accept-Lang') : app()->getLocale();
                $notification = [
                    'message' => [
                        'topic' => $topic,
                        'notification' => [
                            'title' => 'Document Status Updated',
                            'body' => $message,
                            'image' => '',
                        ],
                        'data' => [
                            'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                            'type' => 'driver_document_status',
                        ],
                    ],
                ];

                pushNotification($notification);
            }

        } catch(Exception $e) {

            Log::error($e?->getMessage());
        }
    }
}
