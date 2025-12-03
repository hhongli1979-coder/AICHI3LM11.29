<?php

namespace Modules\Taxido\Events;

use Modules\Taxido\Models\ReferralBonus;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

/**
 * Event dispatched when a referral bonus is credited to a referrer
 * after their referred user completes their first ride.
 *
 * Integration Guide:
 * Dispatch this event after successfully crediting a referral bonus:
 *
 * Example:
 * ```php
 * use Modules\Taxido\Events\ReferralBonusCreditedEvent;
 *
 * // After crediting the referral bonus
 * event(new ReferralBonusCreditedEvent($referralBonus));
 * ```
 *
 * Expected dispatch point: After referral bonus credit operation completes
 */
class ReferralBonusCreditedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public ReferralBonus $referralBonus;

    /**
     * Create a new event instance.
     *
     * @param ReferralBonus $referralBonus The referral bonus that was credited
     */
    public function __construct(ReferralBonus $referralBonus)
    {
        $this->referralBonus = $referralBonus;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [];
    }
}
