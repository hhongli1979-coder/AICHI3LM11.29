<?php

namespace Modules\Taxido\Events;

use Illuminate\Bus\Queueable;
use Modules\Taxido\Models\Ride;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class AcceptBiddingEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $ride;

    /**
     * Create a new event instance.
     */
    public function __construct(Ride $ride)
    {
        $this->ride = $ride;
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
