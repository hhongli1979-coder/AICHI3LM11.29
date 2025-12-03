<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\SurgePrice;
use Prettus\Repository\Eloquent\BaseRepository;

class SurgePriceRepository extends BaseRepository
{
    public function model()
    {
        return SurgePrice::class;
    }

    public function index($surgePriceTable)
    {   
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.surge-price.index', ['tableConfig' => $surgePriceTable]);
    }


    public function store($request)
    {
        DB::beginTransaction();
        try {   

            $surgePrice = $this->model->create([
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'day' => $request->day,
                'status' => $request->status,
            ]);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.surge-price.edit', [
                    'surge_price' => $surgePrice->id,
                ])->with('success', __('taxido::static.surge_prices.create_successfully'));
            }

            return to_route('admin.surge-price.index')->with('success', __('taxido::static.surge_prices.create_successfully'));


        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        } 
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {

            $surgePrice = $this->model->FindOrFail($id);
            $surgePrice->update($request);

            DB::commit();
            return to_route('admin.surge-price.index')->with('success', __('taxido::static.surge_prices.update_successfully'));

            if (array_key_exists('save', $request)) {
                return to_route('admin.surge-price.edit', ['surge_price' => $surgePrice->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.surge_prices.update_successfully'));
            }

            return to_route('admin.surge-price.index')->with('success', __('taxido::static.surge_prices.update_successfully'));

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {

            $surgePrice = $this->model->findOrFail($id);
            $surgePrice->destroy($id);

            DB::commit();
            return to_route('admin.surge-price.index')->with('success', __('taxido::static.surge_prices.delete_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {
            $surgePrice = $this->model->findOrFail($id);
            $surgePrice->update(['status' => $status]);

            return json_encode(["resp" => $surgePrice]);
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {
            $surgePrice = $this->model->onlyTrashed()->findOrFail($id);
            $surgePrice->restore();

            return redirect()->back()->with('success', __('taxido::static.surge_prices.restore_successfully'));
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {
            $surgePrice = $this->model->onlyTrashed()->findOrFail($id);
            $surgePrice->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.surge_prices.permanent_delete_successfully'));
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}