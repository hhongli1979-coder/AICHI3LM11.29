<?php

namespace Modules\Taxido\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Modules\Taxido\Models\FleetWithdrawRequest;
use Illuminate\Broadcasting\InteractsWithSockets;

class CreateFleetWithdrawRequestEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $fleetWithdrawRequest;

    /**
     * Create a new event instance.
     */
    public function __construct(FleetWithdrawRequest $fleetWithdrawRequest)
    {
        $this->fleetWithdrawRequest = $fleetWithdrawRequest;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return [];
    }
}