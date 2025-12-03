<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\FleetWithdrawRequest;
use Modules\Taxido\Tables\FleetWithdrawRequestTable;
use Modules\Taxido\Http\Requests\Admin\CreateFleetWithdrawRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateFleetWithdrawRequest;
use Modules\Taxido\Repositories\Admin\FleetWithdrawRequestRepository;

class FleetWithdrawRequestController extends Controller
{
    public $repository;

    public function __construct(FleetWithdrawRequestRepository $repository)
    {
        $this->authorizeResource(FleetWithdrawRequest::class, 'fleet_withdraw_request');
        $this->repository = $repository;
    }

    public function index(FleetWithdrawRequestTable $fleetWithdrawRequestTable)
    {
        try {
            return $this->repository->index($fleetWithdrawRequestTable->generate());
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function store(Request $request)
    {
        return $this->repository->store($request);
    }

    public function show(FleetWithdrawRequest $fleetWithdrawRequest)
    {
        return $this->repository->show($fleetWithdrawRequest->id);
    }

    public function update(Request $request, FleetWithdrawRequest $fleetWithdrawRequest)
    {
        return $this->repository->update($request->all(), $fleetWithdrawRequest->id);
    }

    public function status(Request $request, $id)
    {
        return $this->repository->status($request->status, $id);
    }
}
