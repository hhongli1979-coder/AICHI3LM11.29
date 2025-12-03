<?php

namespace Modules\Ticket\Providers;

use Modules\Ticket\Events\TicketStatusEvent;
use Modules\Ticket\Events\TicketCreatedEvent;
use Modules\Ticket\Events\TicketRepliedEvent;
use Modules\Ticket\Events\TicketAssignedEvent;
use Modules\Ticket\Listeners\TicketStatusListener;
use Modules\Ticket\Listeners\TicketCreatedListener;
use Modules\Ticket\Listeners\TicketRepliedListener;
use Modules\Ticket\Listeners\TicketAssignedListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event handler mappings for the application.
     *
     * @var array<string, array<int, string>>
     */
    protected $listen = [
        TicketCreatedEvent::class => [
            TicketCreatedListener::class,
        ],
        TicketAssignedEvent::class => [
            TicketAssignedListener::class,
        ],
        TicketStatusEvent::class => [
            TicketStatusListener::class
        ],
        TicketRepliedEvent::class => [
            TicketRepliedListener::class
        ]
    ];

    /**
     * Indicates if events should be discovered.
     *
     * @var bool
     */
    protected static $shouldDiscoverEvents = true;

    /**
     * Configure the proper event listeners for email verification.
     *
     * @return void
     */
    protected function configureEmailVerification(): void
    {

    }
}
