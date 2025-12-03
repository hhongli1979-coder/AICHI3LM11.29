<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\VehicleType;
use Illuminate\Database\Eloquent\Builder;
use Modules\Taxido\Repositories\Api\VehicleTypeRepository;
use Modules\Taxido\Http\Resources\Riders\VehicleTypeResource;

class VehicleTypeController extends Controller
{
    public $repository;

    public function __construct(VehicleTypeRepository $repository)
    {
        $this->authorizeResource(VehicleType::class,'vehicleType', ['except' => 'index', 'show']);
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

            $vehicleTypes = $this->filter($this->repository, $request);
            $vehicleTypes = $vehicleTypes->with(['vehicle_map_icon','vehicle_image'])->latest('created_at')->simplePaginate($request->paginate ?? $vehicleTypes->count() ?: null);
            return VehicleTypeResource::collection($vehicleTypes ?? []);

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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return $this->repository->findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
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

    public function filter($vehicleTypes, $request)
    {
        if ($request->field && $request->sort) {
            $vehicleTypes = $vehicleTypes->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $vehicleTypes = $vehicleTypes->where('status', $request->status);
        }

        if ($request->service_id) {
            $service_id = $request->service_id;
            $vehicleTypes = $vehicleTypes->whereHas('services', function (Builder $query) use ($service_id) {
                $query->where('service_id', $service_id);
            });
        }

        if ($request->service_category_id) {
            $service_category_id = $request->service_category_id;
            $vehicleTypes = $vehicleTypes->whereHas('service_categories', function (Builder $query) use ($service_category_id) {
                $query->where('service_category_id', $service_category_id);
            });
        }
        return $vehicleTypes;
    }

    public function getVehicleTypeByLocations(Request $request)
    {
        return $this->repository->getVehicleTypeByLocations($request);
    }
}
