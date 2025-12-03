<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Taxido\Models\PeakZone;
use Modules\Taxido\Tables\ZoneTable;
use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Admin\PeakZoneRepository;
use Modules\Taxido\Http\Requests\Admin\CreatePeakZoneRequest;
use Modules\Taxido\Http\Requests\Admin\UpdatePeakZoneRequest;
use Modules\Taxido\Tables\PeakZoneTable;

class PeakZoneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public $repository;

    public function __construct(PeakZoneRepository $repository)
    {
        $this->authorizeResource(PeakZone::class, 'peakZone');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(PeakZoneTable $peakZoneTable)
    {
        return $this->repository->index($peakZoneTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.peak-zone.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreatePeakZoneRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(PeakZone $peakZone)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PeakZone $peakZone)
    {
        $coordinates = $peakZone->place_points ? json_decode($peakZone->place_points) : null;
        return view('taxido::admin.peak-zone.edit', ['coordinates' => $coordinates, 'peakZone' => $peakZone]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePeakZoneRequest $request, PeakZone $peakZone)
    {
        return $this->repository->update($request->all(), $peakZone?->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PeakZone $peakZone)
    {
        return $this->repository->destroy($peakZone?->id);
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
