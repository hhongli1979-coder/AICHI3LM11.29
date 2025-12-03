<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\CancellationReason;
use Prettus\Repository\Eloquent\BaseRepository;

class CancellationReasonRepository extends BaseRepository
{
    public function model()
    {
        return CancellationReason::class;
    }

    public function index($cancellationReasonTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.cancellation-reason.index', ['tableConfig' => $cancellationReasonTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $cancellationReason = $this->model->create([
                'title' => $request->title,
                'for' => $request->for,
                'ride_start' => $request->ride_start,
                'icon_image_id' => $request->icon_image_id,
                'status' => $request->status,
            ]);

            $cancellationReason->icon_image;

            $locale = $request['locale'] ?? app()->getLocale();
            $cancellationReason->setTranslation('title', $locale, $request['title']);


            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.cancellation-reason.edit', [
                    'cancellation_reason' => $cancellationReason->id,
                    'locale' => $locale
                ])->with('success', __('taxido::static.cancellation-reasons.create_successfully'));
            }
    
            return to_route('admin.cancellation-reason.index')->with('success', __('taxido::static.cancellation-reasons.create_successfully'));
            
        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {
            $cancellationReason = $this->model->findOrFail($id);

            $locale = $request['locale'] ?? app()->getLocale();
            $cancellationReason->setTranslation('title', $locale, $request['title']);

            $data = array_diff_key($request, array_flip(['title', 'locale']));
            $cancellationReason->update($data);

            if (isset($request['icon_image_id'])) {   
                $cancellationReason->icon_image()->associate($request['icon_image_id']);
            }

            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.cancellation-reason.edit', [
                    'cancellation_reason' => $cancellationReason->id,
                    'locale' => $locale
                ])->with('success', __('taxido::static.cancellation-reasons.update_successfully'));
            }
    
            return to_route('admin.cancellation-reason.index')->with('success', __('taxido::static.cancellation-reasons.update_successfully'));

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {

            $cancellationReason = $this->model->findOrFail($id);
            $cancellationReason->destroy($id);

            DB::commit();
            return to_route('admin.cancellation-reason.index')->with('success', __('taxido::static.cancellation-reasons.delete_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $cancellationReason = $this->model->findOrFail($id);
            $cancellationReason->update(['status' => $status]);

            return json_encode(["resp" => $cancellationReason]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {
            
            $cancellationReason = $this->model->onlyTrashed()->findOrFail($id);
            $cancellationReason->restore();

            return redirect()->back()->with('success', __('taxido::static.cancellation-reasons.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }
    public function forceDelete($id)
    {
        try {

            $cancellationReason = $this->model->onlyTrashed()->findOrFail($id);
            $cancellationReason->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.cancellation-reasons.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

}