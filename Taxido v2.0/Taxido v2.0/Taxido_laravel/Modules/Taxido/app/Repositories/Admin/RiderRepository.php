<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Carbon\Carbon;
use App\Events\NewUserEvent;
use Illuminate\Support\Arr;
use Modules\Taxido\Models\Rider;
use Spatie\Permission\Models\Role;
use Modules\Taxido\Enums\RoleEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Hash;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class RiderRepository extends BaseRepository
{
    protected $role;

    public function model()
    {
        $this->role = new Role();
        return Rider::class;
    }

    public function index($riderTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.rider.index', ['tableConfig' => $riderTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $rider = $this->model->create([
                'name'    => $request->name,
                'email'    => $request->email,
                'country_code' => $request->country_code,
                'phone'    => (string) $request->phone,
                'status'  => $request->status,
                'password'  => Hash::make($request->password),
                'profile_image_id' => $request->profile_image_id
            ]);

            $role = $this->role->findOrCreate(RoleEnum::RIDER, 'web');
            $rider->assignRole($role);

            if ($request->notify) {
                event(new NewUserEvent($rider, $request->password));
            }

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.rider.edit', ['rider' => $rider->id])
                        ->with('success', __('taxido::static.riders.create_successfully'));
            }

            return to_route('admin.rider.index')->with('success', __('taxido::static.riders.create_successfully'));

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

            $rider = $this->model->findOrFail($id);

            if ($rider->system_reserve) {
                return redirect()->route('admin.rider.index')->with('error', __('This rider cannot be update, It is system reserved.'));
            }

            $rider->update($request);
            $rider->address;
            if (isset($request['role_id'])) {
                $role = $this->role->find($request['role_id']);
                $rider->syncRoles($role);
            }

            if (isset($request['profile_image_id'])) {
                $rider->profile_image()->associate($request['profile_image_id']);
            }

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.rider.edit', ['rider' => $rider->id])
                    ->with('success', __('taxido::static.riders.update_successfully'));
            }

            return to_route('admin.rider.index')->with('success', __('taxido::static.riders.update_successfully'));
        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $rider = $this->model->findOrFail($id);
            $rider->update(['status' => $status]);
            if ($status != 1) {
                $rider->tokens()->update([
                'expires_at' => Carbon::now(),
                ]);
            }

            return json_encode(["resp" => $rider]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $rider = $this->model->findOrFail($id);
            $rider->destroy($id);
            return redirect()->back()->with('success', __('taxido::static.riders.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $rider = $this->model->onlyTrashed()->findOrFail($id);
            $rider->restore();

            return redirect()->back()->with('success', __('taxido::static.riders.restore_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $rider = $this->model->onlyTrashed()->findOrFail($id);
            $rider->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.riders.permanent_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
