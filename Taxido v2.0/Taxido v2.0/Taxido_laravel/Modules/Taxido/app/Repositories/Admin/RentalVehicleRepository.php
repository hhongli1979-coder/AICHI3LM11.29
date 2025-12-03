<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Enums\RoleEnum;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Enums\RequestEnum;
use App\Enums\RoleEnum as BaseRoleEnum;
use Modules\Taxido\Models\RentalVehicle;
use Prettus\Repository\Eloquent\BaseRepository;
class RentalVehicleRepository extends BaseRepository
{
    function model()
    {
        return RentalVehicle::class;
    }

    public function index($rentalVehicleTable)
    {
        return view('taxido::admin.rental-vehicle.index',['tableConfig' => $rentalVehicleTable]);
    }

    public function store($request)
    {
         DB::beginTransaction();
        try {

            $interior = implode(',',$request?->interior);
            $driverId = getCurrentRoleName() == RoleEnum::DRIVER ? getCurrentDriver()?->id : $request->driver_id;
            $verified_status = getCurrentRoleName() == BaseRoleEnum::ADMIN ? RequestEnum::APPROVED : RequestEnum::PENDING;
            $rentalVehicle =  $this->model->create([
                'name' => $request->name,
                'description' => $request->description,
                'vehicle_type_id'=> $request->vehicle_type_id,
                'normal_image_id'=> $request->normal_image_id,
                'front_view_id' => $request->front_view_id,
                'side_view_id' => $request->side_view_id,
                'boot_view_id' => $request->boot_view_id,
                'interior_image_id' => $request->interior_image_id,
                'registration_image_id' => $request->registration_image_id,
                'vehicle_per_day_price' => $request->vehicle_per_day_price,
                'allow_with_driver' => $request->allow_with_driver,
                'driver_per_day_charge' => $request->driver_per_day_charge,
                'vehicle_subtype' => $request->vehicle_subtype,
                'fuel_type' => $request->fuel_type,
                'gear_type' => $request->gear_type,
                'vehicle_speed' => $request->vehicle_speed,
                'mileage' => $request->mileage,
                'interior' => $interior,
                'status' => $request->status,
                'registration_no' =>$request?->registration_no,
                'driver_id' => $driverId,
                'verified_status' => $verified_status,
                'zone_id' => $request->zone_id,
                'commission_type' => $request->commission_type,
                'commission_rate' => $request->commission_rate,
            ]);

            $locale = $request['locale'] ?? app()->getLocale();
            $rentalVehicle->setTranslation('name', $locale, $request['name']);
            $rentalVehicle->setTranslation('description', $locale, $request['description']);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.rental-vehicle.edit', [$rentalVehicle->id,'locale' => $locale])->with('success', __('taxido::static.rental_vehicle.create_successfully'));
            }

            return to_route('admin.rental-vehicle.index')->with('success', __('taxido::static.rental_vehicle.create_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage() , $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $rentalVehicle = $this->model->findOrFail($id);
            $locale = $request['locale'] ?? app()->getLocale();
            if (isset($request['name'])) {
                $rentalVehicle->setTranslation('name', $locale, $request['name']);
            }

            if (isset($request['description'])) {
                $rentalVehicle->setTranslation('description', $locale, $request['description']);
            }

            $rentalVehicle->interior = implode(',', $request['interior']);
            $data = array_diff_key($request, array_flip([
                'name', 'description', 'locale','interior'
            ]));

            $rentalVehicle->update($data);
            if (isset($request['normal_image_id'])) {
                $rentalVehicle->normal_image()->associate($request['normal_image_id']);
            }

            if (isset($request['side_view_id'])) {
                $rentalVehicle->side_view()->associate($request['side_view_id']);
            }

            if (isset($request['interior_image_id'])) {
                $rentalVehicle->interior_image()->associate($request['interior_image_id']);
            }

            if (isset($request['boot_view_id'])) {
                $rentalVehicle->boot_view()->associate($request['boot_view_id']);
            }

            if (isset($request['front_view_id'])) {
                $rentalVehicle->front_view()->associate($request['front_view_id']);
            }

            if (isset($request['vehicle_type_id'])) {
                $rentalVehicle->vehicle_type()->associate($request['vehicle_type_id']);
            }

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.rental-vehicle.edit', [$rentalVehicle->id,'locale' => $locale])?->with('success', __('taxido::static.rental_vehicle.update_successfully'));
            }

            return to_route('admin.rental-vehicle.index')?->with('success', __('taxido::static.rental_vehicle.update_successfully'));

        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {

            $rentalVehicle = $this->model->findOrFail($id);
            $rentalVehicle->destroy($id);

            DB::commit();
            return to_route('admin.rental-vehicle.index')->with('success', __('taxido::static.rental_vehicle.delete_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $rentalVehicle = $this->model->findOrFail($id);
            $rentalVehicle->update(['status' => $status]);

            return json_encode(["resp" => $rentalVehicle]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $rentalVehicle = $this->model->onlyTrashed()->findOrFail($id);
            $rentalVehicle->restore();

            return redirect()->back()->with('success', __('taxido::static.rental_vehicle.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
    public function forceDelete($id)
    {
        try {

            $rentalVehicle = $this->model->onlyTrashed()->findOrFail($id);
            $rentalVehicle->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.rental_vehicle.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function RentalVehicleFilter($request)
    {
        if ($request->vehicleId) {
            $rentalVehicles = $this->model->where('vehicle_type_id', $request->vehicleId)->pluck('name' ,'id');
        }

        if (!$rentalVehicles) {
            return response()->json([], 404);
        }

        return response()->json($rentalVehicles);
    }
}
