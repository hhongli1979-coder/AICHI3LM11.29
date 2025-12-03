<?php

namespace Modules\Taxido\Listeners;

use Exception;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Events\ReferralBonusCreditedEvent;
use Modules\Taxido\Notifications\ReferralBonusCreditedNotification;
use Modules\Taxido\Models\ReferralBonus;

class ReferralBonusCreditedListener
{
    /**
     * Handle the event.
     *
     * @param ReferralBonusCreditedEvent $event
     */
    public function handle(ReferralBonusCreditedEvent $event): void
    {
        try {
            $referralBonus = $event->referralBonus;

            // Determine referrer type and retrieve referrer model
            $referrer = $referralBonus->referrer;
            $roleName = $referralBonus->referrer_type; // 'rider' or 'driver'

            $language = $referrer->language ?? app()->getLocale();

            // sendNotifyMail($referrer, new ReferralBonusCreditedNotification($referralBonus, $roleName, $language));

            $topic = "user_{$referrer->id}";
            $this->sendPushNotification($topic, $roleName, $referralBonus);

        } catch (Exception $e) {
            Log::error('ReferralBonusCreditedListener: ' . $e->getMessage(), [
                'referral_bonus_id' => $referralBonus->id ?? null,
                'referrer_id' => $referralBonus->referrer_id ?? null,
                'referrer_type' => $referralBonus->referrer_type ?? null,
                'exception' => $e
            ]);
        }
    }

    /**
     * Send push notification to the referrer
     *
     * @param string $topic
     * @param string $role
     * @param ReferralBonus $referralBonus
     */
    private function sendPushNotification(string $topic, string $role, ReferralBonus $referralBonus): void
    {
        try {
            if (empty($topic)) {
                Log::warning('ReferralBonusCreditedListener: Empty topic for push notification');
                return;
            }

            $message = $this->getNotificationMessage($role, $referralBonus);
            $notification = [
                'message' => [
                    'topic' => $topic,
                    'notification' => [
                        'title' => $message['title'],
                        'body' => $message['body'],
                        'image' => '',
                    ],
                    'data' => [
                        'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                        'type' => 'referral_bonus',
                    ],
                ],
            ];

            // Call pushNotification helper function
            pushNotification($notification);

        } catch (Exception $e) {
            Log::error('ReferralBonusCreditedListener: Push notification failed', [
                'topic' => $topic,
                'referral_bonus_id' => $referralBonus->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Get notification message based on role and referral bonus
     *
     * @param string $role
     * @param ReferralBonus $referralBonus
     * @return array
     */
    private function getNotificationMessage(string $role, ReferralBonus $referralBonus): array
    {
        $bonusAmount = number_format($referralBonus->referrer_bonus_amount, 2);
        $referredType = ucfirst($referralBonus->referred_type);
        $referredName = $referralBonus->referred?->name ?? 'User';

        // Different messages for rider vs driver referrers
        if ($role === 'rider') {
            return [
                'title' => '🎉 Referral Bonus Earned!',
                'body' => "Congrats! You earned {$bonusAmount} for referring {$referredName} ({$referredType})! 💰🚀",
            ];
        } else {
            return [
                'title' => '💰 Referral Bonus Credited!',
                'body' => "Great job! {$bonusAmount} added to your wallet for referring a {$referredType}! 🎊🚗",
            ];
        }
    }
}
