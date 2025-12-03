<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Plan;
use Modules\Taxido\Tables\PlanTable;
use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Admin\PlanRepository;
use Modules\Taxido\Http\Requests\Admin\CreatePlanRequest;
use Modules\Taxido\Http\Requests\Admin\UpdatePlanRequest;

class PlanController extends Controller
{
    public $repository;

    public function __construct(PlanRepository $repository)
    {
        $this->authorizeResource(Plan::class, 'plan');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(PlanTable $planTable)
    {
        return $this->repository->index($planTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.plan.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreatePlanRequest $request)
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
    public function edit(Plan $plan)
    {
        return view('taxido::admin.plan.edit', ['plan' => $plan]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlanRequest $request, Plan $plan)
    {
        return $this->repository->update($request->all(), $plan->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plan $plan)
    {
        return $this->repository->destroy($plan->id);
    }

    /**
     * Change Status of the specified resource.
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
     * Permanently delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        return $this->repository->forceDelete($id);
    }
}
