<?php

namespace Modules\Taxido\Events;

use Modules\Taxido\Models\Incentive;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

/**
 * Event dispatched when a driver completes an incentive level
 * and receives the corresponding bonus.
 *
 * Integration Guide:
 * Dispatch this event after successfully marking an incentive as achieved
 * and crediting the bonus:
 *
 * Example:
 * ```php
 * use Modules\Taxido\Events\DriverIncentiveLevelCompletedEvent;
 *
 * // After marking incentive as achieved and crediting bonus
 * event(new DriverIncentiveLevelCompletedEvent($incentive));
 * ```
 *
 * Expected dispatch point: After incentive level completion and bonus credit
 */
class DriverIncentiveLevelCompletedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Incentive $incentive;

    /**
     * Create a new event instance.
     *
     * @param Incentive $incentive The incentive that was completed
     */
    public function __construct(Incentive $incentive)
    {
        $this->incentive = $incentive;
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
