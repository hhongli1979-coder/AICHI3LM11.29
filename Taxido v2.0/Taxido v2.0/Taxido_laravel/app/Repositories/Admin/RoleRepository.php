<?php

namespace App\Repositories\Admin;

use Exception;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class RoleRepository extends BaseRepository
{
    function model()
    {
        return Role::class;
    }

    public function index($roleTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('admin.role.index', ['tableConfig' => $roleTable]);
    }

    public function show($id)
    {
        try {

            return $this->model->with('permissions')->findOrFail($id);

        } catch (Exception $e){

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function store($request)
    {
        DB::beginTransaction();

        try {

            $role = $this->model->create(['guard_name' => 'web', 'name'=> $request->name]);
            $role->givePermissionTo($request->permissions);

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.role.edit', $role->id)->with('success', __('static.roles.create_successfully'));
            }

            return redirect()->route('admin.role.index')->with('success', __('static.roles.create_successfully'));

        } catch (Exception $e){

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {

            $role = $this->model->findOrFail($id);
            if ($role->system_reserve) {
                return redirect()->route('admin.role.index')->with('error', __('static.roles.system_reserved_update'));
            }

            $role->syncPermissions($request['permissions']);
            $role->update($request);

            DB::commit();
            return redirect()->route('admin.role.index')->with('success', __('static.roles.update_successfully'));

        } catch (Exception $e){

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function status($id, $status)
    {
        try {

            $role = $this->model->findOrFail($id);
            $role->update(['status' => $status]);

            return json_encode(["resp" => $role]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {

            $role = $this->model->findOrFail($id);
            if ($role->system_reserve) {
                return redirect()->route('admin.role.index')->with('error', __('static.roles.system_reserved_delete'));
            }
            $role->forceDelete();

            DB::commit();
            return redirect()->route('admin.role.index')->with('success', __('static.roles.delete_successfully'));

        } catch (Exception $e){

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $role = $this->model->findOrFail($id);
            if ($role->system_reserve) {
                return redirect()->route('admin.role.index')->with('error', __('static.roles.system_reserved_delete'));
            }

            $role = $this->model->findOrFail($id);
            $role->forceDelete();

            return redirect()->back()->with('success', __('static.roles.delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
