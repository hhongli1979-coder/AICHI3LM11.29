<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Taxido\Models\SOS;
use Modules\Taxido\Tables\SOSTable;
use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Admin\SOSRepository;
use Modules\Taxido\Http\Requests\Admin\CreateSOSRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateSOSRequest;

class SOSController extends Controller
{
    public $repository;

    public function __construct(SOSRepository $repository)
    {
        $this->authorizeResource(SOS::class, 'sos');
        $this->repository = $repository;
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index(SOSTable $SOSTable)
    {
        return $this->repository->index($SOSTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.sos.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateSOSRequest $request)
    {
        return $this->repository->store($request);
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
    public function edit(SOS $sos)
    {
        return view('taxido::admin.sos.edit', ['sos' => $sos]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSOSRequest $request, SOS $sos)
    {
        return $this->repository->update($request->all(),$sos->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SOS $sos)
    {
        return $this->repository->destroy($sos->id);
    }

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
