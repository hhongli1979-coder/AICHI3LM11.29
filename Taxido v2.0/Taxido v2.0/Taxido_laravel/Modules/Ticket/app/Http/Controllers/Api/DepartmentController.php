<?php

namespace Modules\Ticket\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Exceptions\ExceptionHandler;
use Modules\Ticket\Models\Department;
use Modules\Ticket\Resources\DepartmentResource;
use Modules\Ticket\Repositories\Api\DepartmentRepository;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public $repository;

    public function __construct(DepartmentRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index(Request $request)
    {
        try {

            $department = $this->filter($this->repository, $request);
            $department = $department->simplePaginate($request->paginate ?? $department->count() ?: null);
            return DepartmentResource::collection($department ?? []);

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
    public function show(Department $department)
    {
        return $this->repository->show($department->id);
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

    public function filter($department, $request)
    {
        if ($request->field && $request->sort) {
            $department = $department->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $department = $department->where('status', $request->status);
        }

        return $department;
    }
}
