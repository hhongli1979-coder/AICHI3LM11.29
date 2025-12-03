<?php

namespace Modules\Taxido\Listeners;

use Exception;
use App\Models\User;
use App\Enums\RoleEnum;
use App\Models\SmsTemplate;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Events\CreateWithdrawRequestEvent;
use Modules\Taxido\Notifications\CreateWithdrawRequestNotification;

class CreateWithdrawRequestListener
{
    /**
     * Handle the event.
     */
    public function handle(CreateWithdrawRequestEvent $event)
    {
        try {

            $admin = User::role(RoleEnum::ADMIN)->first();
            if (isset($admin)) {
                sendNotifyMail($admin, new CreateWithdrawRequestNotification($event->withdrawRequest));
                $sendTo = ('+'.$admin?->country_code.$admin?->phone);
                sendSMS($sendTo, $this->getSMSMessage($event));
                $message = "A New Withdraw Request Has Been created ";
            }

        } catch (Exception $e) {

            Log::error("CreateWithdrawRequestListener.".$e?->getMessage());
        }
    }

    public function getSMSMessage($event)
    {
        $locale = request()->hasHeader('Accept-Lang') ? request()->header('Accept-Lang') : app()->getLocale();
        $slug = 'create-withdraw-request-admin';
        $content = SmsTemplate::where('slug', $slug)->first();
        $driver = User::where('id', $event->withdrawRequest->driver_id)->first();
        if ($content) {
            $data = [
                '{{driver_name}}' => $driver?->name,
                '{{amount}}'=> $event->withdrawRequest?->amount,
            ];

            $message = str_replace(array_keys($data), array_values($data), $content?->content[$locale]);

        } else {
            $message = "A new Withdraw Request has been created.";
        }

        return $message;
    }
}
