<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Tables\UserTable;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\RoleRepository;
use App\Repositories\Admin\UserRepository;
use App\Http\Requests\Admin\CreateUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;

class UserController extends Controller
{
    private $role;

    private $repository;

    public function __construct(RoleRepository $roleRepository, UserRepository $repository)
    {
        $this->authorizeResource(User::class, 'user');
        $this->repository = $repository;
        $this->role = $roleRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(UserTable $userTable)
    {
        return $this->repository->index($userTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.user.create', ['roles' => $this->role?->get()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateUserRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Show the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return view('admin.user.edit', ['user' => $user, 'roles' => $this->role->get()]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        return $this->repository->update($request->all(), $user->id);
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
    public function destroy(User $user)
    {
        return $this->repository->destroy($user->id);
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

    public function export(Request $request)
    {
        return $this->repository->export($request);
    }
    
    public function import(Request $request)
    {
        return $this->repository->import($request);
    }

}
