<?php

namespace App\Http\Controllers\Admin;

use App\Models\Tax;
use App\Tables\TaxTable;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\TaxRepository;
use App\Http\Requests\Admin\CreateTaxRequest;
use App\Http\Requests\Admin\UpdateTaxRequest;

class TaxController extends Controller
{
   public $repository;

    public function __construct(TaxRepository $repository)
    {
        $this->authorizeResource(Tax::class, 'tax');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(TaxTable $taxTable)
    {
        return $this->repository->index($taxTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.tax.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateTaxRequest $request)
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
    public function edit(Tax $tax)
    {
        return view('admin.tax.edit', ['tax' => $tax]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaxRequest $request, Tax $tax)
    {
        return $this->repository->update($request->all(), $tax->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tax $tax)
    {
        return $this->repository->destroy($tax->id);
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
