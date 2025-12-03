<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\VehicleInfo;
use Modules\Taxido\Tables\VehicleInfoTable;
use Modules\Taxido\Repositories\Admin\VehicleInfoRepository;

class VehicleInfoController extends Controller
{
    public $repository;

    public function __construct(VehicleInfoRepository $repository)
    {
        // $this->authorizeResource(VehicleInfo::class, 'vehicleInfo');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(VehicleInfoTable $vehicleInfoTable)
    {
        request()->merge(['is_verified' => true]);
        return $this->repository->index($vehicleInfoTable->generate());
    }

    public function getUnverifiedVehicles(VehicleInfoTable $vehicleInfoTable)
    {
        request()->merge(['is_verified' => false]);
        return $this->repository->getUnverifiedVehicles($vehicleInfoTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.vehicle-info.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Show the specified resource.
     */
    public function show(VehicleInfo $vehicleInfo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VehicleInfo $vehicleInfo)
    {
        return $this->repository->edit($vehicleInfo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VehicleInfo $vehicleInfo)
    {
        return $this->repository->update($request->all(), $vehicleInfo->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VehicleInfo $vehicleInfo)
    {
        return $this->repository->destroy($vehicleInfo->id);
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

    public function verify(Request $request, $id)
    {
        return $this->repository->verify($id, $request->status);
    }

    public function vehicleInfoDocument($id)
    {
        return to_route('admin.vehicleInfoDoc.index', ['vehicle_info_id' => $id]);
    }
}


