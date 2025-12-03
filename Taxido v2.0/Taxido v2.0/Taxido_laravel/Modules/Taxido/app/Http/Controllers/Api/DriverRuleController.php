<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\DriverRule;
use Illuminate\Database\Eloquent\Builder;
use Modules\Taxido\Repositories\Api\DriverRuleRepository;

class DriverRuleController extends Controller
{
    public $repository;

    public function  __construct(DriverRuleRepository $repository)
    {
        $this->authorizeResource(DriverRule::class, 'driverRule', [
            'except' => [ 'index', 'show' ],
        ]);
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $driverRule = $this->filter($this->repository, $request);
            return $driverRule->latest('created_at')->simplePaginate($request->paginate ?? $driverRule->count() ?: null);

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
    public function show(DriverRule $driverRule)
    {
        return $this->repository->show($driverRule?->id);
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
    public function filter($driverRule, $request)
    {
        if ($request->field && $request->sort) {
            $driverRule = $driverRule->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $driverRule = $driverRule->where('status', $request->status);
        }

        if ($request->vehicle_type_id) {
            $vehicle_type_id = $request->vehicle_type_id;
            $driverRule = $driverRule->whereHas('vehicle_types', function (Builder $query) use ($vehicle_type_id) {
                $query->where('vehicle_type_id', $vehicle_type_id);
            });
        }

        return $driverRule;
    }
}
