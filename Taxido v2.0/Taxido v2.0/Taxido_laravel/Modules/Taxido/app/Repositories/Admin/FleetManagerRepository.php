<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use App\Events\NewUserEvent;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Models\FleetDocument;
use Spatie\Permission\Models\Role;
use Modules\Taxido\Enums\RoleEnum;
use Illuminate\Support\Facades\Hash;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\FleetManager;
use App\Http\Traits\FireStoreTrait;
use Prettus\Repository\Eloquent\BaseRepository;

class FleetManagerRepository extends BaseRepository
{
    use FireStoreTrait;
    protected $role;

    public function model()
    {
        $this->role = new Role();
        return FleetManager::class;
    }

    public function index($fleetManegerTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.fleet-manager.index', ['tableConfig' => $fleetManegerTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try{

            $fleetManager = $this->model->create([
                'name'   => $request->name,
                'email'  => $request->email,
                'country_code' => $request->country_code,
                'profile_image_id' => $request->profile_image_id,
                'phone'  => (string) $request->phone,
                'status' => $request->status,
                'password' => Hash::make($request->password),
            ]);

            $role = $this->role->findOrCreate(RoleEnum::FLEET_MANAGER, 'web');
            $fleetManager->assignRole($role);

            if (! empty($request->address)) {
                $fleetManager->address()->create($request->address);
            }
            if (! empty($request->payment_account)) {
                $fleetManager->payment_account()->create($request->payment_account);
            }

            if ($request->notify) {
                event(new NewUserEvent($fleetManager, $request->password));
            }

            $fleetManager->profile_image;

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.fleet-manager.edit', ['fleet_manager' => $fleetManager->id])
                    ->with('success', __('taxido::static.fleet_managers.create_successfully'));
            }

            return to_route('admin.fleet-manager.index')->with('success', __('taxido::static.fleet_managers.create_successfully'));

        }catch(Exception $e)
        {
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

            $fleetManager = $this->model->findOrFail($id);

            if (isset($request['address'])) {
                $fleetManager->address()->updateOrCreate([], $request['address'] ?? []);
            }

            if (isset($request['payment_account'])) {
                $fleetManager->payment_account()->updateOrCreate([], $request['payment_account'] ?? []);
            }

            if (isset($request['profile_image_id'])) {
                $fleetManager->profile_image()->associate($request['profile_image_id']);
            }

            if ($fleetManager->system_reserve) {
                return redirect()->route('admin.fleet-manager.index')->with('error', __('This fleetManager cannot be update, It is system reserved.'));
            }

            $fleetManager->update($request);

            if (isset($request['role_id'])) {
                $role = $this->role->find($request['role_id']);
                $fleetManager->syncRoles($role);
            }

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.fleet-manager.edit', ['fleet_manager' => $fleetManager->id])
                    ->with('success', __('taxido::static.fleet_managers.update_successfully'));
            }

            return to_route('admin.fleet-manager.index')->with('success', __('taxido::static.fleet_managers.update_successfully'));

        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $fleetManager = $this->model->findOrFail($id);
            $fleetManager->update(['status' => $status]);

            return json_encode(["resp" => $fleetManager]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verify($id, $status)
    {
        DB::beginTransaction();
        try {

            $fleetManager = $this->model->findOrFail($id);
            $fleetManager->update(['is_verified' => $status]);
            if ($status) {
                FleetDocument::where('fleet_manager_id', $id)->update(['status' => 'approved']);
            } else {
                FleetDocument::where('fleet_manager_id', $id)->update(['status' => 'pending']);
            }

            DB::commit();
            $fleetManager = $fleetManager->fresh();
            $data = [
                'is_verified' => (int) $fleetManager?->is_verified
            ];

            $this->fireStoreUpdateDocument('driverTrack', (string) $fleetManager?->id, $data, true);
            return json_encode(["resp" => $fleetManager]);

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $fleetManager = $this->model->findOrFail($id);
            $fleetManager->destroy($id);
            return redirect()->back()->with('success', __('taxido::static.fleet_managers.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $fleetManager = $this->model->onlyTrashed()->findOrFail($id);
            $fleetManager->restore();

            return redirect()->back()->with('success', __('taxido::static.fleet_managers.restore_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $fleetManager = $this->model->onlyTrashed()->findOrFail($id);
            $fleetManager->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.fleet_managers.permanent_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

}
