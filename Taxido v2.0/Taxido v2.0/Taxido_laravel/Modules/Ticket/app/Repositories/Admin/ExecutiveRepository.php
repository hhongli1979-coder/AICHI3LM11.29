<?php

namespace Modules\Ticket\Repositories\Admin;

use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Modules\Ticket\Enums\RoleEnum;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Hash;
use Modules\Ticket\Models\Executive;
use Prettus\Repository\Eloquent\BaseRepository;

class ExecutiveRepository extends BaseRepository
{
    protected $role;

    function model()
    {
        $this->role = new Role();
        return Executive::class;
    }

    public function index($executiveTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('ticket::admin.executive.index', ['tableConfig' => $executiveTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $executive = $this->model->create([
                'name' => $request->name,
                'email' => $request->email,
                'country_code' => $request->country_code,
                'phone' => (string) $request->phone,
                'status' => $request->status,
                'profile_image_id' => $request->profile_image_id,
                'password' => Hash::make($request->password),
            ]);

            $role = $this->role->findOrCreate(RoleEnum::Executive, 'web');
            $executive->assignRole($role);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.executive.edit', ['executive' => $executive->id])
                        ->with('success', __('ticket::static.executive.create_successfully'));
            }

            return to_route('admin.executive.index')->with('success', __('ticket::static.executive.create_successfully'));

        } catch (Exception $e){

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

            $executive = $this->model->findOrFail($id);
            $executive->update($request);

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.executive.edit', ['executive' => $executive->id])
                    ->with('success', __('ticket::static.executive.update_successfully'));
            }

            return to_route('admin.executive.index')->with('success', __('ticket::static.executive.update_successfully'));

        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $executive = $this->model->findOrFail($id);
            $executive->update(['status' => $status]);

            return json_encode(["resp" => $executive]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $executive = $this->model->findOrFail($id);
            $executive->destroy($id);
            return to_route('admin.executive.index')->with('success', __('ticket::static.executive.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $executive = $this->model->onlyTrashed()->findOrFail($id);
            $executive->restore();

            return to_route('admin.executive.index')->with('success', __('ticket::static.executive.restore_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $executive = $this->model->onlyTrashed()->findOrFail($id);
            $executive->forceDelete();

            return to_route('admin.executive.index')->with('success', __('ticket::static.executive.permanent_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
