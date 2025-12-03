<?php

namespace Modules\Taxido\Events;

use Illuminate\Queue\SerializesModels;
use Modules\Taxido\Models\WithdrawRequest;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class CreateWithdrawRequestEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $withdrawRequest;

    /**
     * Create a new event instance.
     */
    public function __construct(WithdrawRequest $withdrawRequest)
    {

        $this->withdrawRequest = $withdrawRequest;
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
