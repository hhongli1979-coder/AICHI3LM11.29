<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\ExtraCharge;
use Prettus\Repository\Eloquent\BaseRepository;

class ExtraChargeRepository extends BaseRepository
{
    public function model()
    {
        return ExtraCharge::class;
    }

    public function index($extraChargeTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }
        return view('taxido::admin.extra-charge.index', ['tableConfig' => $extraChargeTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $this->model->create([
                'title' => $request->title,
                'status' => $request->status,
            ]);

            DB::commit();
            return to_route('admin.extra-charge.index')->with('success', __('taxido::static.extra_charges.create_successfully'));

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $extraCharge = $this->model->findOrFail($id);
            $extraCharge->update($request);

            DB::commit();
            return redirect()->route('admin.extra-charge.index')->with('success', __('taxido::static.extra_charges.update_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $extraCharge = $this->model->findOrFail($id);
            $extraCharge->destroy($id);

            return redirect()->route('admin.extra-charge.index')->with('success', __('taxido::static.extra_charges.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $extraCharge = $this->model->findOrFail($id);
            $extraCharge->update(['status' => $status]);

            return json_encode(["resp" => $extraCharge]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $extraCharge = $this->model->onlyTrashed()->findOrFail($id);
            $extraCharge->restore();

            return redirect()->back()->with('success', __('taxido::static.extra_charges.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $extraCharge = $this->model->onlyTrashed()->findOrFail($id);
            $extraCharge->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.extra_charges.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function deleteAll($ids)
    {
        try {

            return $this->model->whereIn('id', $ids)->delete();

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
