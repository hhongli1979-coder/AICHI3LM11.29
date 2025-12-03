<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Models\PeakZone;
use App\Exceptions\ExceptionHandler;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Prettus\Repository\Eloquent\BaseRepository;
use MatanYadaev\EloquentSpatial\Objects\Polygon;
use MatanYadaev\EloquentSpatial\Objects\LineString;
use Modules\Taxido\Http\Traits\PeakZoneTrait;

class PeakZoneRepository extends BaseRepository
{
    use PeakZoneTrait;

    public function model()
    {
        return PeakZone::class;
    }

    public function index($peakZonesTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.peak-zone.index', ['tableConfig' => $peakZonesTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {


            //

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $peakZone = $this->model->findOrFail($id);
            $locale = $request['locale'] ?? app()->getLocale();
            $request['is_active'] = $request['is_active'] ?? $peakZone->is_active;

            // Include updated_at in the update to ensure proper timestamp handling
            $updateData = [
                'name' => $request['name'],
                'is_active' => $request['is_active'],
                'updated_at' => now()
            ];

            // If deactivating, also set ends_at
            if (!$request['is_active'] && $peakZone->is_active) {
                $updateData['ends_at'] = now();
            }

            $peakZone->update($updateData);

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.peak-zone.edit', ['zone' => $peakZone->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.peakZones.updated'));
            }

            return to_route('admin.peak-zone.index')->with('success', __('taxido::static.peakZones.updated'));

        } catch (Exception $e) {
            DB::rollBack();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $peakZones = $this->model->findOrFail($id);
            $peakZones->destroy($id);

            DB::commit();
            return redirect()->back()->with('success', __('taxido::static.peakZones.deleted'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $peakZones = $this->model->findOrFail($id);

            // Prepare update data with proper timestamps
            $updateData = [
                'is_active' => $status,
                'updated_at' => now()
            ];

            // If deactivating, also set ends_at
            if (!$status && $peakZones->is_active) {
                $updateData['ends_at'] = now();
            }

            $peakZones->update($updateData);

            return json_encode(['resp' => $peakZones]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $peakZones = $this->model->onlyTrashed()->findOrFail($id);
            $peakZones->restore();
            return redirect()->back()->with('success', __('taxido::static.peakZones.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $peakZones = $this->model->findOrFail($id);
            $peakZones->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.peakZones.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function deleteAll($ids)
    {
        DB::beginTransaction();
        try {

            $this->model->whereNot('system_reserve', true)->whereIn('id', $ids)?->delete();

            DB::commit();
            return back()->with('success', __('taxido::static.peakZones.deleted'));
        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
