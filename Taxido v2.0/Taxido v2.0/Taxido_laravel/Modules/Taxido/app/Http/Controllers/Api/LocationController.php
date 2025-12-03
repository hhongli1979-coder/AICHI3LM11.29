<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use App\Enums\RoleEnum;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Location;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Api\LocationRepository;

class LocationController extends Controller
{
    public $repository;

    public function  __construct(LocationRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $locations = $this->filter($this->repository, $request);
            return $locations->latest()->paginate($request->paginate ?? $locations->count() ?: null);

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
        return $this->repository->store($request);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function show(Request $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Location $location)
    {
        return $this->repository->update($request->all(), $location?->id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Location $location)
    {
        return $this->repository->destroy($location?->id);
    }

    public function filter($locations)
    {
        $roleName = getCurrentRoleName();
        if ($roleName != RoleEnum::ADMIN) {
            $locations = $locations->where('rider_id', getCurrentUserId());
        }

        return $locations;
    }
}
