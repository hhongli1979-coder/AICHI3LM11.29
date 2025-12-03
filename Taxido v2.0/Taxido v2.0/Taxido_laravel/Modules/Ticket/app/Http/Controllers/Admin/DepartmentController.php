<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Ticket\Enums\RoleEnum;
use Modules\Ticket\Models\Executive;
use App\Http\Controllers\Controller;
use Modules\Ticket\Models\Department;
use Modules\Ticket\Tables\DepartmentTable;
use Modules\Ticket\Repositories\Admin\DepartmentRepository;
use Modules\Ticket\Http\Requests\Admin\CreateDepartmentRequest;
use Modules\Ticket\Http\Requests\Admin\UpdateDepartmentRequest;

class DepartmentController extends Controller
{
    private $repository;

    public function __construct(DepartmentRepository $repository)
    {
        $this->authorizeResource(Department::class, 'department');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(DepartmentTable $departmentTable)
    {
        return $this->repository->index($departmentTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = Executive::role(RoleEnum::Executive)->where('status', true)->whereNull('deleted_at')->get();
        return view('ticket::admin.department.create', ['users' => $users]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateDepartmentRequest $request)
    {
        return $this->repository->store($request);
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
    public function edit(Department $department)
    {
        return $this->repository->edit($department->id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDepartmentRequest $request, Department $department)
    {
        return $this->repository->update($request->all(), $department->id);
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
