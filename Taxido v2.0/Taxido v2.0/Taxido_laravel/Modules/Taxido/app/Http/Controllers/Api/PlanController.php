<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Plan;
use App\Http\Controllers\Controller;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Http\Requests\Api\PurchasePlanRequest;
use Modules\Taxido\Repositories\Api\PlanRepository;

class PlanController extends Controller
{
    public $repository;

    public function  __construct(PlanRepository $repository)
    {
        $this->authorizeResource(Plan::class, 'plan', [
            'except' => ['index', 'show'],
        ]);
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {

            $plan = $this->filter($this->repository, $request);
            return $plan->latest('created_at')->simplePaginate($request->paginate ?? $plan->count() ?: null);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Plan $plan)
    {
        return $this->repository->show($plan?->id);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function purchase(PurchasePlanRequest $request)
    {
        return $this->repository->purchase($request);
    }

    public function verifyIsExpiredSubscriptions()
    {
        return $this->repository->verifyIsExpiredSubscriptions();
    }

    public function filter($plan, $request)
    {
        if ($request->field && $request->sort) {
            $plan = $plan->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $plan = $plan->where('status', $request->status);
        }

        return $plan;
    }
}
