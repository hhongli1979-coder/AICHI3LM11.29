<?php

namespace App\Http\Controllers\Admin;

use App\Models\Role;
use App\Models\Module;
use App\Tables\RoleTable;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\RoleRepository;
use App\Http\Requests\Admin\CreateRoleRequest;

class RoleController extends Controller
{
    public $repository;

    public function __construct(RoleRepository $repository)
    {
        $this->authorizeResource(Role::class, 'role');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(RoleTable $roleTable)
    {
        return $this->repository->index($roleTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.role.create', ['modules' => $this->getModules()]);
    }

    public function getModules()
    {
        return Module::get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateRoleRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        return view('admin.role.edit', ['role' => $role, 'modules' => $this->getModules()]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        return $this->repository->update($request->all(), isset($role->id) ? $role->id : $request->id);
    }

    /**
     * Update Status the specified resource from storage.
     *
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Role $role)
    {
        return $this->repository->destroy(isset($role->id) ? $role->id : $request->id);
    }

    /**
     * Permanent delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        return $this->repository->forceDelete($id);
    }
}
