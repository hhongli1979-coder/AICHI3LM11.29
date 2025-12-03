<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Support\Arr;
use App\Events\NewUserEvent;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Enums\RoleEnum;
use Spatie\Permission\Models\Role;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Hash;
use Modules\Taxido\Models\Dispatcher;
use Prettus\Repository\Eloquent\BaseRepository;

class DispatcherRepository extends BaseRepository
{
    protected $role;

    public function model()
    {
        $this->role = new Role();
        return Dispatcher::class;
    }

    public function index($dispatcherTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.dispatcher.index', ['tableConfig' => $dispatcherTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $dispatcher = $this->model->create([
                'name'         => $request->name,
                'email'        => $request->email,
                'country_code' => $request->country_code,
                'phone'        => (string) $request->phone,
                'status'       => $request->status,
                'password'     => Hash::make($request->password),
            ]);

            
            if (!empty($request->zones)) {
                $dispatcher->zones()->attach($request->zones);
            }

            $role = $this->role->findOrCreate(RoleEnum::DISPATCHER, 'web');
            $dispatcher->assignRole($role);

            if ($request->notify) {
                event(new NewUserEvent($dispatcher, $request->password));
            }

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.dispatcher.edit', [
                    'dispatcher' => $dispatcher->id,
                ])->with('success', __('taxido::static.dispatchers.create_successfully'));
            }

            return to_route('admin.dispatcher.index')->with('success', __('taxido::static.dispatchers.create_successfully'));


        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {
            $request = Arr::except($request, ['password']);
            if (isset($request['phone'])) {
                $request['phone'] = (string) $request['phone'];
            }

            $dispatcher = $this->model->findOrFail($id);

            if ($dispatcher->system_reserve) {
                return redirect()->route('admin.dispatcher.index')->with('error', __('This dispatcher cannot be update, It is system reserved.'));
            }

            $dispatcher->update($request);
            $dispatcher->address;

            if (isset($request['role_id'])) {
                $role = $this->role->find($request['role_id']);
                $dispatcher->syncRoles($role);
            }

            if (!empty($request['zones'])) {
                $dispatcher->zones()->sync($request['zones']);
            }

            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.dispatcher.edit', [
                    'dispatcher' => $dispatcher->id,
                ])->with('success', __('taxido::static.dispatchers.update_successfully'));
            }

            return to_route('admin.dispatcher.index')->with('success', __('taxido::static.dispatchers.update_successfully'));

        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $dispatcher = $this->model->findOrFail($id);
            $dispatcher->update(['status' => $status]);

            return json_encode(["resp" => $dispatcher]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $dispatcher = $this->model->findOrFail($id);
            $dispatcher->destroy($id);
            return redirect()->back()->with('success', __('taxido::static.dispatchers.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $dispatcher = $this->model->onlyTrashed()->findOrFail($id);
            $dispatcher->restore();

            return redirect()->back()->with('success', __('taxido::static.dispatchers.restore_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $dispatcher = $this->model->onlyTrashed()->findOrFail($id);
            $dispatcher->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.dispatchers.permanent_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

}
