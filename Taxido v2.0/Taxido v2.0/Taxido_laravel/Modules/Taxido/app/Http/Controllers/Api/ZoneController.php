<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Zone;
use App\Http\Controllers\Controller;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\VehicleType;
use Modules\Taxido\Repositories\Api\ZoneRepository;
use Modules\Taxido\Http\Resources\Riders\ZoneResource;

class ZoneController extends Controller
{
    public $repository;

    public function __construct(ZoneRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $zones = $this->filter($this->repository, $request);
            $zones = $zones->latest('created_at')->simplePaginate($request->paginate ?? $zones->count());
            return ZoneResource::collection($zones ?? []);

        } catch(Exception $e) {

            throw new ExceptionHandler($e->getMessage(),$e->getCode());
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
    public function store(Request $request)
    {
        //
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
    public function edit(Zone $zone)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function filter($zones, $request)
    {
        if (isset($request->status)) {
            $zones = $zones->where('status', $request->status);
        }

        if (isset($request->vehicle_type_id)) {
            $vehicleId = $request->vehicle_type_id;
            $vehicleTypeZones = VehicleType::where('id', $vehicleId)?->with('zones:id')?->first();
            $zoneIds = $vehicleTypeZones->zones?->pluck('id');
            $zones = $zones->whereIn('id', $zoneIds);
        }

        return $zones;
    }

    public function getZoneIds(Request $request)
    {
        return $this->repository->getZoneIds($request);
    }
}
