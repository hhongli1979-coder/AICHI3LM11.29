<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Enums\RideStatusEnum;
use Modules\Taxido\Models\RentalVehicle;
use Modules\Taxido\Http\Traits\BiddingTrait;
use Modules\Taxido\Enums\ServiceCategoryEnum;
use Modules\Taxido\Repositories\Api\RentalVehicleRepository;
use Modules\Taxido\Http\Resources\Riders\RentalVehicleResource;
use Modules\Taxido\Http\Requests\Api\UpdateRentalVehicleRequest;
use Modules\Taxido\Http\Requests\Api\CreateRentalVehicleRequest;
use Modules\Taxido\Http\Resources\Riders\RentalVehicleDetailResource;

class RentalVehicleController extends Controller
{
    use BiddingTrait;

    public $repository;

    public function __construct(RentalVehicleRepository $repository)
    {
        $this->authorizeResource(RentalVehicle::class, 'rental_vehicle', ['except' => 'index']);
        $this->repository = $repository;
    }

    public function index(Request $request)
    {
        try {

            $rentalVehicle = $this->filter($this->repository, $request);
            $rentalVehicle = $rentalVehicle->latest('created_at')->simplePaginate($request->paginate ?? $rentalVehicle->count() ?: null);
            return RentalVehicleResource::collection($rentalVehicle ?? []);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function show(Request $request, RentalVehicle $rentalVehicle)
    {
        $rentalVehicle = $this->repository->findOrFail($rentalVehicle?->id);
        $rentalVehicle->charge = $this->calRentalVehicleCharges($request, $rentalVehicle);
        return new RentalVehicleDetailResource($rentalVehicle);
    }

    public function store(CreateRentalVehicleRequest $request)
    {
        return $this->repository->store($request);
    }

    public function edit(string $id)
    {

    }

    public function update(UpdateRentalVehicleRequest $request, RentalVehicle $rentalVehicle)
    {
        return $this->repository->update($request, $rentalVehicle->id);
    }

    public function destroy(RentalVehicle $rentalVehicle)
    {
        return $this->repository->destroy($rentalVehicle->id);
    }

    public function filter($rentalVehicles, $request)
    {
        if (isset($request->start_time)) {
            $startTime = $request->start_time;
            $rideRentalVehicleIds = RentalVehicle::whereHas('rides', function ($rides) use ($startTime) {
                $rides?->where('service_category_id', getServiceCategoryIdBySlug(ServiceCategoryEnum::RENTAL))
                    ?->whereNotIn('ride_status_id', [
                        getRideStatusIdBySlug(RideStatusEnum::COMPLETED),
                        getRideStatusIdBySlug(RideStatusEnum::CANCELLED)
                    ])?->where('end_time', '>=', $startTime);
            })?->pluck('id')?->toArray();

            $rentalVehicles = $rentalVehicles?->whereNotIn('id', $rideRentalVehicleIds);
        }

        $roleName = getCurrentRoleName();
        if ($roleName == RoleEnum::DRIVER) {
            $rentalVehicles = $rentalVehicles->where('driver_id', getCurrentUserId());
        }

        if ($request->field && $request->sort) {
            $rentalVehicles->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $rentalVehicles = $rentalVehicles->where('status', $request->status);
        }

        if (isset($request->lat, $request->lng)) {
            $zones = getZoneByPoint($request->lat, $request->lng);
            if ($zones->isNotEmpty()) {
                $zoneIds = $zones->pluck('id')->toArray();
                $rentalVehicles = $rentalVehicles->whereHas('zone', function ($query) use ($zoneIds) {
                    $query->whereIn('zone_id', $zoneIds);
                });
            }
        }

        if (isset($request->lat, $request->lng)) {
            $zone = getZoneByPoint($request->lat, $request->lng)->first();
            if ($zone) {
                $rentalVehicles = $rentalVehicles->where('zone_id', $zone->id);
            }
        }
        
        if ($request->vehicle_type_id) {
            $rentalVehicles = $rentalVehicles->where('vehicle_type_id', $request->vehicle_type_id);
        }

        return $rentalVehicles;
    }

    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }
}
