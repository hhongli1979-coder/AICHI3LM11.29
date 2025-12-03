<?php

namespace Modules\Taxido\Events;

use Modules\Taxido\Models\Bid;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class RejectBiddingEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $bid;

    /**
     * Create a new event instance.
     */
    public function __construct(Bid $bid)
    {
        $this->bid = $bid;
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
