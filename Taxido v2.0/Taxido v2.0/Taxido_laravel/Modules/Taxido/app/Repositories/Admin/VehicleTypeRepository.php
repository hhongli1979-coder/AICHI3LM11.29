<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Modules\Taxido\Models\Zone;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\Service;
use Modules\Taxido\Models\VehicleType;
use Prettus\Repository\Eloquent\BaseRepository;

class VehicleTypeRepository extends BaseRepository
{
    public function model()
    {
        Zone::class;
        return VehicleType::class;
    }

    public function index($vehicleTypeTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.vehicle-type.index', ['tableConfig' => $vehicleTypeTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $isAllZones = (bool) $request->input('is_all_zones', 0);

            $serviceSlug = $request->input('service');
            $service = Service::where('slug', $serviceSlug)->first();

            $vehicleType = $this->model->create([
                'name'                => $request->name,
                'max_seat'            => $request->max_seat,
                'vehicle_image_id'    => $request->vehicle_image_id,
                'vehicle_map_icon_id' => $request->vehicle_map_icon_id,
                'status'              => $request->status,
                'is_all_zones'        => $isAllZones,
                'service_id'          => $service->id,
            ]);

            $zoneIdsToAttach = $isAllZones ? Zone::pluck('id')->toArray() : ($request->zones ?? []);
            $zoneIdsToAttach = is_array($zoneIdsToAttach) ? $zoneIdsToAttach : [];
            $vehicleType->zones()->attach($zoneIdsToAttach);

            if (! empty($request->serviceCategories)) {
                $vehicleType->service_categories()->attach($request->serviceCategories);
            }

            $locale = $request['locale'] ?? app()->getLocale();
            $vehicleType->setTranslation('name', $locale, $request['name']);

            DB::commit();

            if ($request->has('save')) {
                return redirect()->route(getVehicleEditRoute(), [
                    'vehicleType' => $vehicleType->id,
                    'service'     => $serviceSlug,
                ])->with('success', __('taxido::static.vehicle_types.create_successfully'));
            }
            return to_route(getVehicleIndexRoute($request->req_service))->with('success', __('taxido::static.vehicle_types.create_successfully'));

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $vehicleType = $this->model->findOrFail($id);
            $locale      = $request['locale'] ?? app()->getLocale();
            $vehicleType->setTranslation('name', $locale, $request['name']);
            $vehicleType->setTranslation('description', $locale, $request['description']);
            $data = array_diff_key($request, array_flip(['name', 'locale', 'description']));
            $vehicleType->update($data);

            if (isset($request['vehicle_image_id'])) {
                $vehicleType->vehicle_image()->associate($request['vehicle_image_id']);
            }

            if (isset($request['vehicle_map_icon_id'])) {
                $vehicleType->vehicle_map_icon()->associate($request['vehicle_map_icon_id']);
            }

            $isAllZones    = $request['is_all_zones'] ?? false;
            $zoneIdsToSync = $isAllZones ? Zone::pluck('id')->toArray() : ($request['zones'] ?? []);
            $vehicleType->zones()->sync(is_array($zoneIdsToSync) ? $zoneIdsToSync : []);

            if (! empty($request['services'])) {
                $vehicleType->services()->associate($request['services']);
            }

            if (! empty($request['serviceCategories'])) {
                $vehicleType->service_categories()->sync($request['serviceCategories']);
            }

            DB::commit();

            $serviceSlug = $request['req_service'];
            if (array_key_exists('save', $request)) {
                return redirect()->route(getVehicleEditRoute(), [
                    'vehicleType' => $vehicleType->id,
                    'service'     => $serviceSlug,
                ])->with('success', __('taxido::static.vehicle_types.update_successfully'));
            }

            return to_route(getVehicleIndexRoute($serviceSlug))
                ->with('success', __('taxido::static.vehicle_types.update_successfully'));

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }


    public function destroy($id)
    {
        try {

            $vehicleType = $this->model->findOrFail($id);
            $vehicleType->destroy($id);

            return redirect()->back()->with('success', __('taxido::static.vehicle_types.delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $vehicleType = $this->model->findOrFail($id);
            $vehicleType->update(['status' => $status]);

            return json_encode(["resp" => $vehicleType]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function restore($id)
    {
        try {

            $vehicleType = $this->model->onlyTrashed()->findOrFail($id);
            $vehicleType->restore();

            return redirect()->back()->with('success', __('taxido::static.vehicle_types.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function forceDelete($id)
    {
        try {

            $vehicleType = $this->model->onlyTrashed()->findOrFail($id);
            $vehicleType->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.vehicle_types.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

}
