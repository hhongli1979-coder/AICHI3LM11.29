<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\HourlyPackage;
use Illuminate\Database\Eloquent\Builder;
use Modules\Taxido\Http\Resources\Riders\HourlyPackageResource;
use Modules\Taxido\Http\Traits\BiddingTrait;
use Modules\Taxido\Repositories\Api\HourlyPackageRepository;

class HourlyPackageController extends Controller
{
    use BiddingTrait;

    public $repository;

    public function  __construct(HourlyPackageRepository $repository)
    {
        $this->authorizeResource(HourlyPackage::class, 'hourly_package', [
            'except' => ['index', 'show'],
        ]);

        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $hourlyPackage = $this->filter($this->repository, $request);
            $hourlyPackage = $hourlyPackage->latest('created_at')->simplePaginate($request->paginate ?? $hourlyPackage?->count() ?: null);
            return HourlyPackageResource::collection($hourlyPackage ?? []);

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
    public function show(HourlyPackage $hourlyPackage)
    {
        return $this->repository->show($hourlyPackage?->id);
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
    public function filter($hourlyPackage, $request)
    {
        if(!$request->zone_id) {
            throw new ExceptionHandler("Zone id is required", 422);
        }

        if ($request->field && $request->sort) {
            $hourlyPackage = $hourlyPackage->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $hourlyPackage = $hourlyPackage->where('status', $request->status);
        }

        if ($request->vehicle_type_id) {
            $vehicle_type_id = $request->vehicle_type_id;
            $hourlyPackage = $hourlyPackage->whereHas('vehicle_types', function (Builder $query) use ($vehicle_type_id) {
                $query->where('vehicle_type_id', $vehicle_type_id);
            });
        }


        return $hourlyPackage;
    }

}
