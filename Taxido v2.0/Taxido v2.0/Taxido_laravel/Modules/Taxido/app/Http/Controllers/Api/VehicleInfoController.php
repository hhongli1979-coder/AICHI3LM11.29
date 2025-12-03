<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\VehicleInfo;
use Modules\Taxido\Repositories\Api\VehicleInfoRepository;
use Modules\Taxido\Http\Requests\Api\FleetVehicleInfoRequest;
use Modules\Taxido\Http\Resources\FleetManagers\VehicleInfoResource;
use Modules\Taxido\Http\Resources\Riders\VehicleTypeResource;

class VehicleInfoController extends Controller
{
    public $repository;

    public function __construct(VehicleInfoRepository $repository)
    {
        // $this->authorizeResource(VehicleInfo::class,'vehicleInfo', ['except' => 'index', 'show']);
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {

            $vehicleInfo = $this->filter($this->repository, $request);
            $vehicleInfo= $vehicleInfo->latest('created_at')->simplePaginate($request->paginate ?? $vehicleInfo->count() ?: null);
            return VehicleInfoResource::collection($vehicleInfo?? []);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FleetVehicleInfoRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(VehicleInfo $vehicleInfo)
    {
        return $this->repository->show($vehicleInfo?->id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VehicleInfo $vehicleInfo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FleetVehicleInfoRequest $request, VehicleInfo $vehicleInfo)
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
     * Change Status the specified resource from storage.
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }

    public function filter($vehicleInfo, $request)
    {
        $roleName = getCurrentRoleName();
        if ($roleName == RoleEnum::FLEET_MANAGER) {
            $vehicleInfo = $vehicleInfo->where('fleet_manager_id', getCurrentUserId());
        }

        if ($request->field && $request->sort) {
            $vehicleInfo = $vehicleInfo->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $vehicleInfo = $vehicleInfo->where('status', $request->status);
        }

        return $vehicleInfo;
    }
}
