<?php

namespace Modules\Taxido\Providers;

use Modules\Taxido\Events\AddRideRequestEvent;
use Modules\Taxido\Events\RideRequestEvent;
use Modules\Taxido\Events\UpdateRideLocationEvent;
use Modules\Taxido\Listeners\AddRideRequestListener;
use Modules\Taxido\Listeners\RideRequestListener;

use Modules\Taxido\Events\AcceptBiddingEvent;
use Modules\Taxido\Listeners\AcceptBiddingListener;

use Modules\Taxido\Events\CreateWithdrawRequestEvent;
use Modules\Taxido\Listeners\CreateWithdrawRequestListener;

use Modules\Taxido\Events\CreateBidEvent;
use Modules\Taxido\Listeners\CreateBidListener;

use Modules\Taxido\Events\RejectBiddingEvent;
use Modules\Taxido\Listeners\RejectBiddingListener;

use Modules\Taxido\Events\UpdateWithdrawRequestEvent;
use Modules\Taxido\Listeners\UpdateRideLocationListener;
use Modules\Taxido\Listeners\UpdateWithdrawRequestListener;

use Modules\Taxido\Events\SOSAlertEvent;
use Modules\Taxido\Listeners\SOSAlertListener;

use Modules\Taxido\Events\CreateFleetWithdrawRequestEvent;
use Modules\Taxido\Listeners\CreateFleetWithdrawRequestListener;

use Modules\Taxido\Events\NotifyDriverDocStatusEvent;
use Modules\Taxido\Listeners\NotifyDriverDocStatusListener;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

use Modules\Taxido\Events\DriverVerificationEvent;
use Modules\Taxido\Events\RideStatusEvent;
use Modules\Taxido\Events\ReferralBonusCreditedEvent;
use Modules\Taxido\Events\DriverIncentiveLevelCompletedEvent;
use Modules\Taxido\Listeners\DriverVerificationListener;
use Modules\Taxido\Listeners\RideStatusListener;
use Modules\Taxido\Listeners\ReferralBonusCreditedListener;
use Modules\Taxido\Listeners\DriverIncentiveLevelCompletedListener;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event handler mappings for the application.
     *
     * @var array<string, array<int, string>>
     */
    protected $listen = [
        RideRequestEvent::class => [
            RideRequestListener::class
        ],
        AcceptBiddingEvent::class => [
            AcceptBiddingListener::class
        ],
        CreateWithdrawRequestEvent::class => [
            CreateWithdrawRequestListener::class
        ],
        CreateBidEvent::class => [
            CreateBidListener::class
        ],
        RejectBiddingEvent::class => [
            RejectBiddingListener::class
        ],
        UpdateWithdrawRequestEvent::class => [
            UpdateWithdrawRequestListener::class
        ],
        SOSAlertEvent::class => [
            SOSAlertListener::class
        ],
        CreateFleetWithdrawRequestEvent::class => [
            CreateFleetWithdrawRequestListener::class
        ],
        NotifyDriverDocStatusEvent::class => [
            NotifyDriverDocStatusListener::class
        ],
        DriverVerificationEvent::class => [
            DriverVerificationListener::class
        ],
        RideStatusEvent::class => [
            RideStatusListener::class
        ],
        ReferralBonusCreditedEvent::class => [
            ReferralBonusCreditedListener::class
        ],
        DriverIncentiveLevelCompletedEvent::class => [
            DriverIncentiveLevelCompletedListener::class
        ],
        UpdateRideLocationEvent::class => [
            UpdateRideLocationListener::class
        ],
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
