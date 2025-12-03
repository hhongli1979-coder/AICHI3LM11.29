<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\FleetManager;
use Modules\Taxido\Tables\FleetManagerTable;
use Modules\Taxido\Repositories\Admin\FleetManagerRepository;
use Modules\Taxido\Http\Requests\Admin\CreateFleetManagerRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateFleetManagerRequest;

class FleetManagerController extends Controller
{
    private $repository;

    public function __construct(FleetManagerRepository $repository)
    {
        $this->authorizeResource(FleetManager::class, 'fleet_manager');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(FleetManagerTable $fleetManagerTable)
    {
        return $this->repository->index($fleetManagerTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.fleet-manager.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateFleetManagerRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Show the specified resource.
     */
    public function show(FleetManager $fleetManager)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FleetManager $fleetManager)
    {
        return view('taxido::admin.fleet-manager.edit', ['fleetManager' => $fleetManager]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFleetManagerRequest $request, FleetManager $fleetManager)
    {
        return $this->repository->update($request->all(), $fleetManager->id);
    }

    /**
     * Update Status the specified resource from storage.
     *
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }

    public function verify(Request $request, $id)
    {
        return $this->repository->verify($id, $request->status);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FleetManager $fleetManager)
    {
        return $this->repository->destroy($fleetManager->id);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        return $this->repository->restore($id);
    }

    /**
     * Permanent delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        return $this->repository->forceDelete($id);
    }
}
