<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\DriverRule;
use Prettus\Repository\Eloquent\BaseRepository;

class DriverRuleRepository extends BaseRepository
{
    function model()
    {
        return DriverRule::class;
    }

    public function index($driverRuleTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.driver-rule.index', ['tableConfig' => $driverRuleTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $driverRule = $this->model->create([
                'title' => $request->title,
                'rule_image_id' => $request->rule_image_id,
                'status' => $request->status,
            ]);

            $driverRule->rule_image;

            if ($request->vehicle_types) {
                $driverRule->vehicle_types()->attach($request->vehicle_types);
                $driverRule->vehicle_types;
            }

            $locale = $request['locale'] ?? app()->getLocale();
            $driverRule->setTranslation('title', $locale, $request['title']);

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.driver-rule.edit', [
                    'driver_rule' => $driverRule->id,
                    'locale' => $locale,
                ])->with('success', __('taxido::static.driver_rules.create_successfully'));
            }

            return to_route('admin.driver-rule.index')->with('success', __('taxido::static.driver_rules.create_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {

            $driverRule = $this->model->FindOrFail($id);

            $locale = $request['locale'] ?? app()->getLocale();
            $driverRule->setTranslation('title', $locale, $request['title']);

            $data = array_diff_key($request, array_flip(['title', 'locale']));
            $driverRule->update($data);

            if (isset($request['rule_image_id'])) {
                $driverRule->rule_image()->associate($request['rule_image_id']);
            }

            if (isset($request['vehicle_types'])) {
                $driverRule->vehicle_types()->sync($request['vehicle_types']);
                $driverRule->vehicle_types;
            }

            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.driver-rule.edit', [
                    'driver_rule' => $driverRule->id,
                    'locale'      => $locale,
                ])->with('success', __('taxido::static.driver_rules.update_successfully'));
            }

            return to_route('admin.driver-rule.index')->with('success', __('taxido::static.driver_rules.update_successfully'));

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $driverRule = $this->model->findOrFail($id);
            $driverRule->destroy($id);

            return redirect()->route('admin.driver-rule.index')->with('success', __('taxido::static.driver_rules.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $driverRule = $this->model->findOrFail($id);
            $driverRule->update(['status' => $status]);

            return json_encode(["resp" => $driverRule]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $driverRule = $this->model->onlyTrashed()->findOrFail($id);
            $driverRule->restore();

            return redirect()->back()->with('success', __('taxido::static.driver_rules.restore_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $driverRule = $this->model->onlyTrashed()->findOrFail($id);
            $driverRule->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.driver_rules.permanent_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

}
