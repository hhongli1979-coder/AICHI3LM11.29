<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\HourlyPackage;
use Prettus\Repository\Eloquent\BaseRepository;

class HourlyPackageRepository extends BaseRepository
{
    function model()
    {
        return HourlyPackage::class;
    }

    public function index($hourlyPackageTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.hourly-package.index', ['tableConfig' => $hourlyPackageTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try{
           
            $hourlyPackage = $this->model->create([
                'distance'=> $request->distance,
                'hour' => $request->hour,
                'distance_type' => $request->distance_type,
                'status' => $request->status,
            ]);

            if ($request->vehicle_types) {
                $hourlyPackage->vehicle_types()->attach($request->vehicle_types);
                $hourlyPackage->vehicle_types;
            }

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.hourly-package.edit', [
                    'hourly_package' => $hourlyPackage->id,
                ])->with('success', __('taxido::static.hourly_package.create_successfully'));
            }

            return to_route('admin.hourly-package.index')->with('success', __('taxido::static.hourly_package.create_successfully'));

        }catch(Exception $e)
        {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
    public function update($request, $id)
    {
        DB::beginTransaction();

        try {

            $hourlyPackage = $this->model->FindOrFail($id);
            $hourlyPackage->update($request);

            if (isset($request['vehicle_types'])) {
                $hourlyPackage->vehicle_types()->sync($request['vehicle_types']);
                $hourlyPackage->vehicle_types;
            }

            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.hourly-package.edit', ['hourly_package' => $hourlyPackage->id])
                    ->with('success', __('taxido::static.hourly_package.update_successfully'));
            }

            return to_route('admin.hourly-package.index')->with('success', __('taxido::static.hourly_package.update_successfully'));

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {

            $hourlyPackage = $this->model->findOrFail($id);
            $hourlyPackage->destroy($id);

            DB::commit();
            return to_route('admin.hourly-package.index')->with('success', __('taxido::static.hourly_package.delete_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $hourlyPackage = $this->model->findOrFail($id);
            $hourlyPackage->update(['status' => $status]);

            return json_encode(["resp" => $hourlyPackage]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $hourlyPackage = $this->model->onlyTrashed()->findOrFail($id);
            $hourlyPackage->restore();

            return redirect()->back()->with('success', __('taxido::static.hourly_package.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
    public function forceDelete($id)
    {
        try {

            $hourlyPackage = $this->model->onlyTrashed()->findOrFail($id);
            $hourlyPackage->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.hourly_package.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

}
