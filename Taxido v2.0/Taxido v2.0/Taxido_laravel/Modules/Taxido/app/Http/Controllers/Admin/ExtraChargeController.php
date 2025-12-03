<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\ExtraCharge;
use Modules\Taxido\Tables\ExtraChargeTable;
use Modules\Taxido\Repositories\Admin\ExtraChargeRepository;

class ExtraChargeController extends Controller
{
    public $repository;

    public function __construct(ExtraChargeRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(ExtraChargeTable $planTable)
    {
        return $this->repository->index($planTable->generate());
    }

     /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.extra-charge.create');
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
    public function show(ExtraCharge $extraCharge)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExtraCharge $extraCharge)
    {
        return view('taxido::admin.extra-charge.edit', ['extraCharge' => $extraCharge]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ExtraCharge $extraCharge)
    {
        return $this->repository->update($request->all(), $extraCharge->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExtraCharge $extraCharge)
    {
        return $this->repository->destroy($extraCharge->id);
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