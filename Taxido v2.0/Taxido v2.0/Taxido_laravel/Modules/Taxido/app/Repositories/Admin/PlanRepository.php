<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Modules\Taxido\Models\Plan;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class PlanRepository extends BaseRepository
{
    public function model()
    {
        return Plan::class;
    }

    public function index($planTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.plan.index', ['tableConfig' => $planTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $plan = $this->model->create([
                'name' => $request->name,
                'duration' => $request->duration,
                'description' => $request?->description,
                'price' => $request->price,
                'status' => $request->status,
            ]);

            if ($request->service_categories) {
                $plan->service_categories()->attach($request->service_categories);
                $plan->service_categories;
            }

            $locale = $request['locale'] ?? app()->getLocale();
            $plan->setTranslation('name', $locale, $request['name']);
            $plan->setTranslation('description', $locale, $request['description']);

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.plan.edit', ['plan' => $plan->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.plans.create_successfully'));
            }
    
            return to_route('admin.plan.index')->with('success', __('taxido::static.plans.create_successfully'));
        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {
            $plan = $this->model->findOrFail($id);

            $locale = $request['locale'] ?? app()->getLocale();
            $plan->setTranslation('name', $locale, $request['name']);
            $plan->setTranslation('description', $locale, $request['description']);

            $data = array_diff_key($request, array_flip(['name', 'locale', 'description']));
            $plan->update($data);

            if (isset($request['service_categories'])) {
                $plan->service_categories()->sync($request['service_categories']);
                $plan->service_categories;
            }

            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.plan.edit', ['plan' => $plan->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.plans.update_successfully'));
            }

            return to_route('admin.plan.index')->with('success', __('taxido::static.plans.update_successfully'));

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {

            $plan = $this->model->findOrFail($id);
            $plan->destroy($id);

            DB::commit();
            return to_route('admin.plan.index')->with('success', __('taxido::static.plans.delete_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {
            $plan = $this->model->findOrFail($id);
            $plan->update(['status' => $status]);

            return json_encode(["resp" => $plan]);
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {
            $plan = $this->model->onlyTrashed()->findOrFail($id);
            $plan->restore();

            return redirect()->back()->with('success', __('taxido::static.plans.restore_successfully'));
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {
            $plan = $this->model->onlyTrashed()->findOrFail($id);
            $plan->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.plans.permanent_delete_successfully'));
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
