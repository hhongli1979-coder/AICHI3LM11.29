<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Enums\ServicesEnum;
use Modules\Taxido\Models\VehicleType;
use Modules\Taxido\Tables\VehicleTypeTable;
use Modules\Taxido\Repositories\Admin\VehicleTypeRepository;
use Modules\Taxido\Http\Requests\Admin\CreateVehicleTypeRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateVehicleTypeRequest;

class VehicleTypeController extends Controller
{
    public $repository;

    public function __construct(VehicleTypeRepository $repository)
    {
        $this->authorizeResource(VehicleType::class, 'vehicle_type', ['except' => 'edit']);
        $this->repository = $repository;
    }

    /**
     * Display a listing of cab the resource.
     */
    public function cabIndex(VehicleTypeTable $vehicleTypeTable)
    {
        request()->merge(['service' => ServicesEnum::CAB]);
        return $this->repository->index($vehicleTypeTable->generate());
    }

    /**
     * Display a listing of freight the resource.
     */
    public function freightIndex(VehicleTypeTable $vehicleTypeTable)
    {
        request()->merge(['service' => ServicesEnum::FREIGHT]);
        return $this->repository->index($vehicleTypeTable->generate());
    }

    /**
     * Display a listing of parcel the resource.
     */
    public function parcelIndex(VehicleTypeTable $vehicleTypeTable)
    {
        request()->merge(['service' => ServicesEnum::PARCEL]);
        return $this->repository->index($vehicleTypeTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function cabCreate()
    {
        request()->merge(['service' => ServicesEnum::CAB]);
        $serviceCategories = getServiceIdByServiceCategories(ServicesEnum::CAB);
        return view('taxido::admin.vehicle-type.create', [
            'serviceCategories' => $serviceCategories,
            'service' => ServicesEnum::CAB,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function parcelCreate()
    {
        request()->merge(['service' => ServicesEnum::PARCEL]);
        $serviceCategories = getServiceIdByServiceCategories(ServicesEnum::PARCEL);
        return view('taxido::admin.vehicle-type.create',
        [
            'serviceCategories' => $serviceCategories,
            'service' => ServicesEnum::PARCEL
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateVehicleTypeRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function freightCreate()
    {
        request()->merge(['service' => ServicesEnum::FREIGHT]);
        $serviceCategories = getServiceIdByServiceCategories(ServicesEnum::FREIGHT);
        return view('taxido::admin.vehicle-type.create', ['serviceCategories' => $serviceCategories,'service' => ServicesEnum::FREIGHT]);
    }

    public function cabEdit(VehicleType $vehicleType)
    {
        request()->merge(['service' => ServicesEnum::CAB]);
        $serviceCategories = getServiceIdByServiceCategories(ServicesEnum::CAB);
        return view('taxido::admin.vehicle-type.edit', [
            'vehicleType' => $vehicleType,
            'serviceCategories' => $serviceCategories,
            'service' => ServicesEnum::CAB,
        ]);
    }

    public function parcelEdit(VehicleType $vehicleType)
    {
        request()->merge(['service' => ServicesEnum::PARCEL]);
        $serviceCategories = getServiceIdByServiceCategories(ServicesEnum::PARCEL);
        return view('taxido::admin.vehicle-type.edit', ['vehicleType' => $vehicleType,'serviceCategories' => $serviceCategories,'service' => ServicesEnum::PARCEL]);
    }

    public function freightEdit(VehicleType $vehicleType)
    {
        request()->merge(['service' => ServicesEnum::FREIGHT]);
        $serviceCategories = getServiceIdByServiceCategories(ServicesEnum::FREIGHT);
        return view('taxido::admin.vehicle-type.edit', ['vehicleType' => $vehicleType,'serviceCategories' => $serviceCategories,'service' => ServicesEnum::FREIGHT]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVehicleTypeRequest $request, VehicleType $vehicleType)
    {
        return $this->repository->update($request->all(), $vehicleType->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VehicleType $vehicleType)
    {
        return $this->repository->destroy($vehicleType->id);
    }

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

}
