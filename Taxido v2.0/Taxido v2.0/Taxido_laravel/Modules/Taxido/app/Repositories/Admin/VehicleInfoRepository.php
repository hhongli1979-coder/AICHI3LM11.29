<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\VehicleInfo;
use Modules\Taxido\Models\VehicleInfoDoc;
use Prettus\Repository\Eloquent\BaseRepository;

class VehicleInfoRepository extends BaseRepository
{
    function model()
    {
        return VehicleInfo::class;
    }

    public function index($tableConfig)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        $title = request()->has('is_verified') && request('is_verified')
            ? __('taxido::static.drivers.verified_drivers')
            : __('taxido::static.drivers.unverified_drivers');

        return view('taxido::admin.vehicle-info.index', ['tableConfig' => $tableConfig, 'title' => $title]);
    }

    public function getUnverifiedVehicles($tableConfig)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        $title =  __('taxido::static.drivers.unverified_drivers');
        return view('taxido::admin.vehicle-info.index', ['tableConfig' => $tableConfig, 'title' => $title]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $taxidoSettings = getTaxidoSettings();
            $fleetVehicleIsVerified = 0;
            if (! $taxidoSettings['activation']['fleet_vehicle_verification']) {
                $fleetVehicleIsVerified = 1;
            }

            $this->model->create([
                'name' => $request->name,
                'fleet_manager_id' => $request->fleet_manager_id,
                'vehicle_type_id' => $request->vehicle_type_id,
                'plate_number' => $request->plate_number,
                'color' => $request->color,
                'model' => $request->model,
                'model_year' => $request->model_year,
                'is_verified' => $fleetVehicleIsVerified
            ]);

            DB::commit();
            return to_route('admin.vehicle-info.verified')->with('success', __('taxido::static.fleet_vehicle_documents.create_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function edit($vehicleInfo)
    {
        return view('taxido::admin.vehicle-info.edit', ['vehicleInfo' => $vehicleInfo]);
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $vehicle = $this->model->findOrFail($id);
            $vehicle->update($request);

            DB::commit();
            return to_route('admin.vehicle-info.verified')->with('success', __('taxido::static.fleet_vehicle_documents.update_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {

            $vehicle = $this->model->findOrFail($id);
            $vehicle->delete();

            DB::commit();
            return to_route('admin.vehicle-info.verified')->with('success', __('taxido::static.fleet_vehicle_documents.delete_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        DB::beginTransaction();
        try {

            $vehicle = $this->model->onlyTrashed()->findOrFail($id);
            $vehicle->restore();

            DB::commit();
            return redirect()->back()->with('success', __('taxido::static.fleet_vehicle_documents.restore_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        DB::beginTransaction();
        try {

            $vehicle = $this->model->onlyTrashed()->findOrFail($id);
            $vehicle->forceDelete();

            DB::commit();
            return redirect()->back()->with('success', __('taxido::static.fleet_vehicle_documents.permanent_delete_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verify($id, $status)
    {
        DB::beginTransaction();

        try {

            $vehicleInfo = $this->model->findOrFail($id);
            $vehicleInfo->update(['is_verified' => $status]);
            if ($status) {
               VehicleInfoDoc::where('vehicle_info_id', $id)->update(['status' => 'approved']);
            } else {
                VehicleInfoDoc::where('vehicle_info_id', $id)->update(['status' => 'pending']);
            }

            DB::commit();
            $vehicleInfo = $vehicleInfo->refresh();
            return json_encode(["resp" => $vehicleInfo]);

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}


