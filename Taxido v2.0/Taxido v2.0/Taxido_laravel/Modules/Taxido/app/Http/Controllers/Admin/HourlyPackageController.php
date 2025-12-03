<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\VehicleType;
use Modules\Taxido\Models\HourlyPackage;
use Illuminate\Database\Eloquent\Builder;
use Modules\Taxido\Enums\ServiceCategoryEnum;
use Modules\Taxido\Tables\HourlyPackageTable;
use Modules\Taxido\Repositories\Admin\HourlyPackageRepository;
use Modules\Taxido\Http\Requests\Admin\CreateHourlyPackageRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateHourlyPackageRequest;

class HourlyPackageController extends Controller
{
    public $repository;

    public function __construct(HourlyPackageRepository $repository)
    {
        $this->authorizeResource(HourlyPackage::class, 'hourly_package');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(HourlyPackageTable $hourlyPackageTable)
    {
        return $this->repository->index($hourlyPackageTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $vehicleTypes = $this->getHourlyPackageVehicles();
        return view('taxido::admin.hourly-package.create', ['vehicleTypes' => $vehicleTypes]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateHourlyPackageRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(HourlyPackage $hourlyPackage)
    {
        $vehicleTypes = $this->getHourlyPackageVehicles();
        return view('taxido::admin.hourly-package.edit', ['hourlyPackage' => $hourlyPackage, 'vehicleTypes' => $vehicleTypes]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHourlyPackageRequest $request, HourlyPackage $hourlyPackage)
    {
        return $this->repository->update($request->all(), $hourlyPackage->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HourlyPackage $hourlyPackage)
    {
        return $this->repository->destroy($hourlyPackage->id);
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

    public function getHourlyPackageVehicles()
    {
        $vehicleTypes = VehicleType::where('status', true);
        $service_category_id = getServiceCategoryIdBySlug(ServiceCategoryEnum::PACKAGE);
        $vehicleTypes = $vehicleTypes->whereHas('service_categories', function (Builder $query) use ($service_category_id) {
            $query->where('service_category_id', $service_category_id);
        })?->get(['id', 'name']);

        return $vehicleTypes;
    }
}
