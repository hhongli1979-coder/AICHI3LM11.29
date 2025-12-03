<?php

namespace Modules\Taxido\Listeners;

use Exception;
use App\Models\User;
use App\Enums\RoleEnum;
use App\Models\SmsTemplate;
use App\Models\PushNotificationTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Events\CreateFleetWithdrawRequestEvent;
use Modules\Taxido\Notifications\CreateFleetWithdrawRequestNotification;

class CreateFleetWithdrawRequestListener
{
    /**
     * Handle the event.
     */
    public function handle(CreateFleetWithdrawRequestEvent $event)
    {
        try {
            $admin = User::role(RoleEnum::ADMIN)->first();
            if (isset($admin)) {
                sendNotifyMail($admin, new CreateFleetWithdrawRequestNotification($event->fleetWithdrawRequest));
                $sendTo = ('+'.$admin?->country_code.$admin?->phone);
                sendSMS($sendTo, $this->getSMSMessage($event));
                $message = "A New Fleet Withdraw Request Has Been Created";
            }
        } catch (Exception $e) {

            Log::error("CreateFleetWithdrawRequestListener.". $e?->getMessage());
        }
    }

    public function getSMSMessage($event)
    {
        $locale = request()->hasHeader('Accept-Lang') ? request()->header('Accept-Lang') : app()->getLocale();
        $slug = 'create-fleet-withdraw-request-admin';
        $content = SmsTemplate::where('slug', $slug)->first();
        $fleetManager = User::where('id', $event->fleetWithdrawRequest->fleet_manager_id)->first();

        if ($content) {
            $data = [
                '{{fleet_manager_name}}' => $fleetManager?->name,
                '{{amount}}' => $event->fleetWithdrawRequest?->amount,
            ];
            $message = str_replace(array_keys($data), array_values($data), $content?->content[$locale]);
        } else {
            $message = "A new Fleet Withdraw Request has been created.";
        }

        return $message;
    }
}
