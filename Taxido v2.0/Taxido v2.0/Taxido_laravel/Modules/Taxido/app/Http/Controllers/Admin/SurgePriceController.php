<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\SurgePrice;
use Modules\Taxido\Tables\SurgePriceTable;
use Modules\Taxido\Repositories\Admin\SurgePriceRepository;

class SurgePriceController extends Controller
{
    public $repository;

    public function __construct(SurgePriceRepository $repository)
    {
        $this->authorizeResource(SurgePrice::class, 'surge_price');
        $this->repository = $repository;
    }   

    /**
     * Display a listing of the resource.
     */
    public function index(SurgePriceTable $surgePriceTable)
    {
        return $this->repository->index($surgePriceTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.surge-price.create');
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
    public function show(SurgePrice $surgePrice)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SurgePrice $surgePrice)
    {
        return view('taxido::admin.surge-price.edit', ['surgePrice' => $surgePrice]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SurgePrice $surgePrice)
    {
        return $this->repository->update($request->all(), $surgePrice->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SurgePrice $surgePrice)
    {
        return $this->repository->destroy($surgePrice->id);
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
