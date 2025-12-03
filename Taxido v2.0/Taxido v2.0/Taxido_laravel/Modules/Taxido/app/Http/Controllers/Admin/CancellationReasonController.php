<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\CancellationReason;
use Modules\Taxido\Tables\CancellationReasonTable;
use Modules\Taxido\Repositories\Admin\CancellationReasonRepository;
use Modules\Taxido\Http\Requests\Admin\CreateCancellationReasonRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateCancellationReasonRequest;

class CancellationReasonController extends Controller
{
    public $repository;

    public function __construct(CancellationReasonRepository $repository)
    {
        $this->authorizeResource(CancellationReason::class, 'cancellation_reason');
        $this->repository = $repository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(CancellationReasonTable $cancellationReasonTable)
    {
        return $this->repository->index($cancellationReasonTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.cancellation-reason.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateCancellationReasonRequest $request)
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
    public function edit(CancellationReason $cancellationReason)
    {
        return view('taxido::admin.cancellation-reason.edit', ['cancellationReason' => $cancellationReason]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCancellationReasonRequest $request, CancellationReason $cancellationReason)
    {
        return $this->repository->update($request->all(), $cancellationReason->id);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CancellationReason $cancellationReason)
    {
        return $this->repository->destroy($cancellationReason->id);
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
