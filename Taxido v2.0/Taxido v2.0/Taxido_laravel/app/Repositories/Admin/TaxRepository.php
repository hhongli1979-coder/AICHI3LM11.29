<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\Tax;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class TaxRepository extends BaseRepository
{
    function model()
    {
        return Tax::class;
    }

    public function index($taxTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }
        return view('admin.tax.index', ['tableConfig' => $taxTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $tax = $this->model->create([
                'name' => $request->name,
                'rate' => $request->rate,
                'status' => $request->status,
            ]);

            $locale = $request['locale'] ?? app()->getLocale();
            $tax->setTranslation('name', $locale, $request['name']);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.tax.edit', ['tax' => $tax->id, 'locale' => $locale])
                        ->with('success', __('static.taxes.create_successfully'));
            }

            return to_route('admin.tax.index')->with('success', __('static.taxes.create_successfully'));

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $tax = $this->model->findOrFail($id);

            $locale = $request['locale'] ?? app()->getLocale();
            $tax->setTranslation('name', $locale, $request['name']);

            $data = array_diff_key($request, array_flip(['name', 'locale']));
            $tax->update($data);

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.tax.edit', ['tax' => $tax->id, 'locale' => $locale])
                    ->with('success', __('static.taxes.update_successfully'));
            }
            
            return redirect()->route('admin.tax.index')->with('success', __('static.taxes.update_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $tax = $this->model->findOrFail($id);
            $tax->destroy($id);

            return redirect()->route('admin.tax.index')->with('success', __('static.taxes.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $tax = $this->model->findOrFail($id);
            $tax->update(['status' => $status]);

            return json_encode(["resp" => $tax]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $tax = $this->model->onlyTrashed()->findOrFail($id);
            $tax->restore();

            return redirect()->back()->with('success', __('static.taxes.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }


    public function forceDelete($id)
    {
        try {

            $tax = $this->model->onlyTrashed()->findOrFail($id);
            $tax->forceDelete();

            return redirect()->back()->with('success', __('static.taxes.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
