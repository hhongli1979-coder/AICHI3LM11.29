<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\DriverDocument;
use Modules\Taxido\Tables\DriverDocumentTable;
use Modules\Taxido\Repositories\Admin\DriverDocumentRepository;
use Modules\Taxido\Http\Requests\Admin\CreateDriverDocumentRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateDriverDocumentRequest;

class DriverDocumentController extends Controller
{
    public $repository;

    public function __construct(DriverDocumentRepository $repository)
    {
        $this->authorizeResource(DriverDocument::class, 'driver_document');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(DriverDocumentTable $driverDocumentTable)
    {
        return $this->repository->index($driverDocumentTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.driver-document.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateDriverDocumentRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Show the specified resource.
     */
    public function show(DriverDocument $driverDocument)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DriverDocument $driverDocument)
    {
        return view('taxido::admin.driver-document.edit', ['driverDocument' => $driverDocument]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDriverDocumentRequest $request, DriverDocument $driverDocument)
    {
        return $this->repository->update($request->all(), $driverDocument->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DriverDocument $driverDocument)
    {
        return $this->repository->destroy($driverDocument->id);
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
