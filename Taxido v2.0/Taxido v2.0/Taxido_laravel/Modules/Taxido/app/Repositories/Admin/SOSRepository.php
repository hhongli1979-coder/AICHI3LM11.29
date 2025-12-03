<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Modules\Taxido\Models\SOS;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class SOSRepository extends BaseRepository
{
    public function model()
    {
        return SOS::class;
    }

    public function index($SOSTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.sos.index', ['tableConfig' => $SOSTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $sos = $this->model->create([
                'title' => $request->title,
                'country_code' => $request->country_code,
                'phone' => (string) $request->phone,
                'sos_image_id' => $request->sos_image_id,
                'status' => $request->status,
            ]);
            $sos->sos_image;

            if ($request->zones) {
                $sos->zones()->attach($request->zones);
                $sos->zones;
            }

            $locale = $request['locale'] ?? app()->getLocale();
            $sos->setTranslation('title', $locale, $request['title']);
            
            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.sos.edit', ['sos' => $sos->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.soses.create_successfully'));
            }
    
            return to_route('admin.sos.index')->with('success', __('taxido::static.soses.create_successfully'));

        } catch (Exception $e) {
            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
    public function update($request, $id)
    {
        DB::beginTransaction();

        try {
            $sos = $this->model->FindOrFail($id);

            $locale = $request['locale'] ?? app()->getLocale();
            $sos->setTranslation('title', $locale, $request['title']);

            $data = array_diff_key($request, array_flip(['title', 'locale']));
            $sos->update($data);

            if (isset($request['sos_image_id'])) {
                $sos->sos_image()->associate($request['sos_image_id']);
                $sos->sos_image;
            }

            if (isset($request['zones'])){
                $sos->zones()->sync($request['zones']);
                $sos->zones;
            }

            DB::commit();

            $sos = $sos->fresh();

            if (array_key_exists('save', $request)) {
                return to_route('admin.sos.edit', ['sos' => $sos->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.soses.update_successfully'));
            }
    
            return to_route('admin.sos.index')->with('success', __('taxido::static.soses.update_successfully'));

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $sos = $this->model->findOrFail($id);
            $sos->destroy($id);

            return redirect()->route('admin.sos.index')->with('success', __('taxido::static.soses.delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $sos = $this->model->findOrFail($id);
            $sos->update(['status' => $status]);

            return json_encode(["resp" => $sos]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
    public function restore($id)
    {
        try {

            $sos = $this->model->onlyTrashed()->findOrFail($id);
            $sos->restore();

            return redirect()->back()->with('success', __('taxido::static.soses.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $sos = $this->model->onlyTrashed()->findOrFail($id);
            $sos->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.soses.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
