<?php

namespace Modules\Taxido\Repositories\Admin;

use Modules\Taxido\Models\DriverSubscription;
use Prettus\Repository\Eloquent\BaseRepository;


class DriverSubscriptionRepository extends BaseRepository
{
    function model()
    {
        return DriverSubscription::class;
    }

    public function index($driverSubscriptionTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.driver-subscription.index', ['tableConfig' => $driverSubscriptionTable]);
    }
}