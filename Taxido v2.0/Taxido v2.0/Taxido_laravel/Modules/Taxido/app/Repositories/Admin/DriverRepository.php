<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use App\Events\NewUserEvent;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Driver;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Models\VehicleInfoDoc;
use Spatie\Permission\Models\Role;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\Service;
use App\Exceptions\ExceptionHandler;
use App\Http\Traits\FireStoreTrait;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;
use Modules\Taxido\Models\DriverDocument;
use Modules\Taxido\Exports\DriversExport;
use Prettus\Repository\Eloquent\BaseRepository;
use Modules\Taxido\Events\DriverVerificationEvent;

class DriverRepository extends BaseRepository
{
    use FireStoreTrait;

    protected $role;

    function model()
    {
        $this->role = new Role();
        return Driver::class;
    }

    public function index($driverTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }
        $title = request()->has('is_verified')
        ? __('taxido::static.drivers.verified_drivers')
        : __('taxido::static.drivers.unverified_drivers');

        return view('taxido::admin.driver.index', ['tableConfig' => $driverTable, 'title' => $title]);
    }

    public function getUnverifiedDrivers($driverTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }
        $title = __('taxido::static.drivers.unverified_drivers');
        return view('taxido::admin.driver.index', ['tableConfig' => $driverTable, 'title' => $title]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $location = !empty($request->location) ? json_decode($request->location, true) : null;
            $driver = $this->model->create([
                'name' => $request->name,
                'email' => $request->email,
                'country_code' => $request->country_code,
                'phone' => (string) $request->phone,
                'status' => $request->status,
                'is_online' => $request->is_online,
                'location' => $location,
                'password'     => Hash::make($request->password),
                'profile_image_id' => $request->profile_image_id,
                'service_id' => $request->service_id,
                'service_category_id' => $request->service_category_id,
                'fleet_manager_id' => $request->fleet_manager_id,
                'is_verified' => $request->is_verified,
            ]);

            $role = $this->role->findOrCreate(RoleEnum::DRIVER, 'web');

            $driver->assignRole($role);
            if (!empty($request->address)) {
                $driver->address()->create($request->address);
            }

            if (!empty($request->vehicle_info)) {
                $driver->vehicle_info()->create($request->vehicle_info);
            }

            if (!empty($request->payment_account)) {
                $driver->payment_account()->create($request->payment_account);
            }

            $ambulanceServiceId = $this->getAmbulanceServiceId();
            if (!empty($request->ambulance) && $request->service_id == $ambulanceServiceId) {
                $driver->ambulance()->create($request->ambulance);
            }

            if ($request->notify) {
                event(new NewUserEvent($driver, $request->password));
            }

            $this->updateDriverInFirebase($driver, $request);

            $driver->profile_image;

            DB::commit();

            return to_route('admin.driver.index')->with('success', __('taxido::static.drivers.create_successfully'));

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

            if (isset($request['location'])) {
                $request['location'] = json_decode($request['location'], true);
            }

            $driver = $this->model->findOrFail($id);
            $driver->update($request);

            if (isset($request['profile_image_id'])) {
                $driver->profile_image()->associate($request['profile_image_id']);
            }

            $ambulanceServiceId = $this->getAmbulanceServiceId();
            if (isset($request['vehicle_info']) && $request['service_id'] != $ambulanceServiceId) {
                $driver->vehicle_info()->updateOrCreate([], $request['vehicle_info'] ?? []);
            }

            if (isset($request['address'])) {
                $driver->address()->updateOrCreate([], $request['address'] ?? []);
            }

            if (isset($request['payment_account'])) {
                $driver->payment_account()->updateOrCreate([], $request['payment_account'] ?? []);
            }

            if (isset($request['ambulance']) && $request['service_id'] == $ambulanceServiceId) {
                $driver->ambulance()->updateOrCreate([], $request['ambulance']);
            } elseif ($request['service_id'] != $ambulanceServiceId && $driver->ambulance) {
                $driver->ambulance()->delete();
            }

            $this->updateDriverInFirebase($driver, $request);

            DB::commit();
            $driver = $driver->fresh();

            return to_route('admin.driver.index')->with('success', __('taxido::static.drivers.update_successfully'));


        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    private function getAmbulanceServiceId()
    {
        return Service::where('type', 'ambulance')->value('id') ?? 0;
    }

    protected function updateDriverInFirebase($driver, $request): void
    {
        try {

            if($driver) {
                $firebaseData = [
                    'driver_id'   => (string) $driver->id,
                    'driver_name' => $driver->name,
                    'phone' => $driver->phone,
                    'is_online'   => $driver->is_online ? "1" : "0",
                    'service_id' => $driver->service_id,
                    'service_category_id' => $driver->service_category_id,
                    'vehicle_type_id' => $driver->vehicle_type_id,
                    'fleet_manager_id'  => $driver->fleet_manager_id,
                    'is_verified' => $driver->is_verified ? 1 : 0,
                    'is_on_ride' => $driver->is_on_ride ? "1" : "0",
                    'status'      => $driver->status ? "1" : "0",
                ];

                if ($driver->profile_image) {
                    $firebaseData['profile_image_url'] = $driver?->profile_image?->original_url;
                }

                if ($driver?->vehicle_info) {
                    $firebaseData['model']         = $driver?->vehicle_info?->model;
                    $firebaseData['vehicle_model'] = $driver?->vehicle_info?->model;
                    if ($driver->vehicle_info->vehicle) {
                        $firebaseData['vehicle_name'] = $driver?->vehicle_info->vehicle?->name;
                        $firebaseData['vehicle_map_icon_url'] = $driver?->vehicle_info?->vehicle?->vehicle_map_icon?->original_url;
                        $firebaseData['vehicle_type_id'] = $driver?->vehicle_info?->vehicle?->id;
                    }
                } elseif ($request->vehicle_info) {
                    $firebaseData['model']         = $request?->vehicle_info['model'] ?? null;
                    $firebaseData['vehicle_model'] = $request?->vehicle_info['model'] ?? null;
                    if ($request?->vehicle_info['vehicle_type_id']) {
                        $vehicleType  = \Modules\Taxido\Models\VehicleType::find($request?->vehicle_info['vehicle_type_id']);
                        $firebaseData['vehicle_map_icon_url'] = $vehicleType?->vehicle_map_icon_url ?? null;
                    }
                }

                $location = $driver->location ?? ($request->location ? json_decode($request?->location, true) : null);
                if ($location && isset($location[0]['lat']) && isset($location[0]['lng'])) {
                    $firebaseData['lat'] = $location[0]['lat'];
                    $firebaseData['lng'] = $location[0]['lng'];
                }

                $this->fireStoreUpdateDocument('driverTrack', (string) $driver->id, $firebaseData, true);
            }

        } catch (Exception $e) {

            throw new ExceptionHandler("Failed to update driver in Firebase: {$e->getMessage()}", $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $driver = $this->model->findOrFail($id);
            $driver->update(['status' => $status]);
            if ($status != 1) {
                $driver->tokens()->update([
                    'expires_at' => Carbon::now(),
                ]);
            }

            return json_encode(["resp" => $driver]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $driver = $this->model->findOrFail($id);
            $driver->destroy($id);
            $this->fireStoreDeleteDocument('driverTrack', (string) $id);

            return redirect()->back()->with('success', __('taxido::static.drivers.delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $driver = $this->model->onlyTrashed()->findOrFail($id);
            $driver->restore();

            return redirect()->back()->with('success', __('taxido::static.drivers.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $driver = $this->model->onlyTrashed()->findOrFail($id);
            $driver->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.drivers.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verify($id, $status)
    {
        DB::beginTransaction();

        try {

            $driver = $this->model->findOrFail($id);
            $driver->update(['is_verified' => $status]);
            if ($status) {
               DriverDocument::where('driver_id', $id)->update(['status' => 'approved']);
            } else {
                DriverDocument::where('driver_id', $id)->update(['status' => 'pending']);
            }

            DB::commit();
            $driver = $driver->fresh();
            $data = [
                'is_verified' => (int) $driver?->is_verified
            ];

            $this->fireStoreUpdateDocument('driverTrack', (string) $driver?->id, $data, true);
            return json_encode(["resp" => $driver]);

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function export(Request $request)
    {
        try {
            $allowedFormats = ['xlsx', 'xls', 'csv'];

            $format = $request->input('format', 'xlsx');

            if (!in_array($format, $allowedFormats)) {
                $format = 'xlsx';
            }
            $date = now()->format('Y-m-d');
            $fileName = "drivers_list_{$date}.{$format}";

            return Excel::download(new DriversExport, $fileName);

        } catch (Exception $e) {
            throw new Exception("Export failed: " . $e->getMessage(), $e->getCode());
        }
    }
}
