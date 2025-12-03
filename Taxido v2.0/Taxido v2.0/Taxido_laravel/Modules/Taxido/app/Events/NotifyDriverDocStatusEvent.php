<?php

namespace Modules\Taxido\Events;

use App\Models\User;
use Illuminate\Queue\SerializesModels;
use Modules\Taxido\Models\DriverDocument;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class NotifyDriverDocStatusEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $driver;
    
    public $document;

    public function __construct(User $driver, DriverDocument $document)
    {
        $this->driver = $driver;
        $this->document = $document;
    }
}
