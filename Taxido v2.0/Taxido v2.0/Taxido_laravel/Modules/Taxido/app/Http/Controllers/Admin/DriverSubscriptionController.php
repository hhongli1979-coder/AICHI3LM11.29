<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Modules\Taxido\Models\DriverSubscription;
use Modules\Taxido\Tables\DriverSubscriptionTable;
use Modules\Taxido\Repositories\Admin\DriverSubscriptionRepository;

class DriverSubscriptionController extends Controller
{
    public $repository;

    public function __construct(DriverSubscriptionRepository $repository)
    {
        $this->authorizeResource(DriverSubscription::class, 'subscription');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(DriverSubscriptionTable $driverSubscriptionTable)
    {
        return $this->repository->index($driverSubscriptionTable->generate());
    }
}
