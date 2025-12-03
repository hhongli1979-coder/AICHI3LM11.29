<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Http\Resources\FleetManagers\DriverResource;
use Modules\Taxido\Models\Driver;
use Modules\Taxido\Repositories\Api\DriverRepository;

class DriverController extends Controller
{
    public $repository;

    public function __construct(DriverRepository $repository)
    {
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

            $drivers = $this->filter($this->repository->whereNull('deleted_at'), $request);
            $drivers = $drivers->latest('created_at')->simplePaginate($request->paginate ?? $drivers->count() ?: null);
            return DriverResource::collection($drivers?? []);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function show(Driver $driver)
    {
        return $this->repository->show($driver?->id);
    }

    public function fleetDriverRegister(Request $request)
    {
        return $this->repository->fleetDriverRegister($request);
    }

    public function fleetDriverUpdate(Request $request)
    {
        return $this->repository->fleetDriverUpdate($request);
    }

    public function fleetDriverDelete(Driver $driver)
    {
        return $this->repository->fleetDriverDelete($driver?->id);
    }

    public function driverZone(Request $request)
    {
        return $this->repository->driverZone($request);
    }

    public function getNearestDrivers(Request $request)
    {
        return $this->repository->getNearestDrivers($request);
    }

    public function getAmbulance(Request $request)
    {
        return $this->repository->getAmbulance($request);
    }

    public function filter($drivers,$request)
    {
        $roleName = getCurrentRoleName();
        if ($roleName == RoleEnum::FLEET_MANAGER) {
            $drivers = $drivers->where('fleet_manager_id', getCurrentUserId());
        }

        if ($request->zones) {
            $zoneIds = explode(',', $request->zones);
            $drivers = $drivers->whereHas('zones', function (Builder $query) use ($zoneIds) {
                $query->whereIn('zone_id', $zoneIds);
            });
        }

        if ($request->is_online) {
            $drivers = $drivers->where('is_online', $request->is_online);
        }

        if ($request->is_on_ride) {
            $drivers = $drivers->where('is_on_ride', $request->is_on_ride);
        }

        return $drivers;
    }

}
