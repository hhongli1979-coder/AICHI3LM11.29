<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Airport;
use App\Http\Controllers\Controller;
use Modules\Taxido\Tables\AirportTable;
use Modules\Taxido\Repositories\Admin\AirportRepository;
use Modules\Taxido\Http\Requests\Admin\UpdateAirportRequest;

class AirportController extends Controller
{
    public $repository;

    public function __construct(AirportRepository $repository)
    {
        $this->authorizeResource(Airport::class,'airport');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(AirportTable $airportTable)
    {
        return $this->repository->index($airportTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.airport.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(Airport $airport)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Airport $airport)
    {
        return view('taxido::admin.airport.edit', ['airport' => $airport]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAirportRequest $request, Airport $airport)
    {
        return $this->repository->update($request->all(), $airport->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Airport $airport)
    {
        return $this->repository->destroy($airport->id);
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
