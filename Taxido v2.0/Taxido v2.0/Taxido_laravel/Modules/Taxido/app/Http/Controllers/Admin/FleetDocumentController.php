<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\FleetDocument;
use Modules\Taxido\Tables\FleetDocumentTable;
use Modules\Taxido\Repositories\Admin\FleetDocumentRepository;

class FleetDocumentController extends Controller
{
    public $repository;

    public function __construct(FleetDocumentRepository $repository)
    {
        $this->authorizeResource(FleetDocument::class, 'fleet_document');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(FleetDocumentTable $fleetDocumentTable)
    {
        return $this->repository->index($fleetDocumentTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.fleet-document.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Show the specified resource.
     */
    public function show(FleetDocument $fleetDocument)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FleetDocument $fleetDocument)
    {
        return view('taxido::admin.fleet-document.edit', ['fleetDocument' => $fleetDocument]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FleetDocument $fleetDocument)
    {
        return $this->repository->update($request->all(), $fleetDocument->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FleetDocument $fleetDocument)
    {
        return $this->repository->destroy($fleetDocument->id);
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

    public function updateStatus(Request $request, $id)
    {
        return $this->repository->updateStatus($request,$id);
    }


}
