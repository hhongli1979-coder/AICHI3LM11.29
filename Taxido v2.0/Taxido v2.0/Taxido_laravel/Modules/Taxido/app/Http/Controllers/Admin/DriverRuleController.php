<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\DriverRule;
use Modules\Taxido\Tables\DriverRuleTable;
use Modules\Taxido\Repositories\Admin\DriverRuleRepository;
use Modules\Taxido\Http\Requests\Admin\UpdateDocumentRequest;
use Modules\Taxido\Http\Requests\Admin\CreateDriverRuleRequest;

class DriverRuleController extends Controller
{
    public $repository;

    public function __construct(DriverRuleRepository $repository)
    {
        $this->authorizeResource(DriverRule::class, 'driver_rule');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(DriverRuleTable $driverRuleTable)
    {
        return $this->repository->index($driverRuleTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.driver-rule.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateDriverRuleRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Show the specified resource.
     */
    public function show(DriverRule $driverRule)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DriverRule $driverRule)
    {
        return view('taxido::admin.driver-rule.edit', ['driverRule' => $driverRule]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocumentRequest $request, DriverRule $driverRule)
    {
        return $this->repository->update($request->all(), $driverRule->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DriverRule $driverRule)
    {
        return $this->repository->destroy($driverRule->id);
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
