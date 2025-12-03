<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Http\Requests\Admin\VehicleInfoDocRequest;
use Modules\Taxido\Http\Requests\Api\FleetVehicleInfoRequest;
use Modules\Taxido\Models\VehicleInfoDoc;
use Modules\Taxido\Tables\VehicleInfoDocTable;
use Modules\Taxido\Repositories\Admin\VehicleInfoDocRepository;

class VehicleInfoDocController extends Controller
{
    public $repository;

    public function __construct(VehicleInfoDocRepository $repository)
    {
        $this->authorizeResource(VehicleInfoDoc::class, 'vehicleInfoDoc');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(VehicleInfoDocTable $vehicleInfoDocTable)
    {
        return $this->repository->index($vehicleInfoDocTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.vehicle-info-doc.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(VehicleInfoDocRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Show the specified resource.
     */
    public function show(VehicleInfoDoc $vehicleInfoDoc)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VehicleInfoDoc $vehicleInfoDoc)
    {
        return view('taxido::admin.vehicle-info-doc.edit', ['vehicleInfoDoc' => $vehicleInfoDoc]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VehicleInfoDoc $vehicleInfoDoc)
    {
        return $this->repository->update($request->all(), $vehicleInfoDoc->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VehicleInfoDoc $vehicleInfoDoc)
    {
        return $this->repository->destroy($vehicleInfoDoc->id);
    }

    /**
     * Change Status the specified resource from storage.
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
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

    public function updateStatus(Request $request, $id)
    {
        return $this->repository->updateStatus($request,$id);
    }

}
