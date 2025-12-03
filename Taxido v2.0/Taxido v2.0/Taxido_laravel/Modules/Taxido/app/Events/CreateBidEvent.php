<?php

namespace Modules\Taxido\Events;

use Modules\Taxido\Models\Ride;
use Modules\Taxido\Models\Driver;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class CreateBidEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $ride;
    public $bidAmount;
    public $driver;

    /**
     * Create a new event instance.
     */
    public function __construct(Ride $ride, Driver $driver, $bidAmount)
    {
        $this->ride = $ride;
        $this->driver = $driver;
        $this->bidAmount = $bidAmount;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {

    }
}
