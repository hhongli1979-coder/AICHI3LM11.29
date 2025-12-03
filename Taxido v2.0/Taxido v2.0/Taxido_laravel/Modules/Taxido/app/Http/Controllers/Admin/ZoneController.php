<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Zone;
use Modules\Taxido\Tables\ZoneTable;
use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Admin\ZoneRepository;
use Modules\Taxido\Http\Requests\Admin\CreateZoneRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateZoneRequest;

class ZoneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public $repository;

    public function __construct(ZoneRepository $repository)
    {
        $this->authorizeResource(Zone::class, 'zone');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(ZoneTable $zoneTable)
    {
        return $this->repository->index($zoneTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.zone.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateZoneRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(Zone $zone)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Zone $zone)
    {
        $coordinates = $zone->place_points ? json_decode($zone->place_points) : null;
        return view('taxido::admin.zone.edit', ['coordinates' => $coordinates, 'zone' => $zone]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateZoneRequest $request, Zone $zone)
    {
        return $this->repository->update($request->all(), $zone?->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Zone $zone)
    {
        return $this->repository->destroy($zone?->id);
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
}
