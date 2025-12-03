<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\Preference;
use Prettus\Repository\Eloquent\BaseRepository;

class PreferenceRepository extends BaseRepository
{
    function model()
    {
        return Preference::class;
    }

    public function index($preferenceTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.preference.index', ['tableConfig' => $preferenceTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();

        try {

            $preference = $this->model->create([
                'name' => $request->name,
                'icon_image_id' => $request->icon_image_id,
                'status' => $request->status,
            ]);

            $locale = $request['locale'] ?? app()->getLocale();
            $preference->setTranslation('name', $locale, $request['name']);

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.preference.edit', [
                    'preference' => $preference->id,
                    'locale' => $locale
                ])->with('success', __('taxido::static.preferences.create_successfully'));
            }

            return to_route('admin.preference.index')->with('success', __('taxido::static.preferences.create_successfully'));

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {


            $preference = $this->model->findOrFail($id);
            $locale = $request['locale'] ?? app()->getLocale();
            $preference->setTranslation('name', $locale, $request['name']);
            $data = array_diff_key($request, array_flip(['name', 'locale']));
            $preference->update($data);

            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.preference.edit', ['banner' => $preference->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.preferences.update_successfully'));
            }

            return to_route('admin.preference.index')->with('success', __('taxido::static.preferences.update_successfully'));

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {

            $preference = $this->model->findOrFail($id);
            $preference->destroy($id);

            DB::commit();
            return to_route('admin.preference.index')->with('success', __('taxido::static.preferences.delete_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $preference = $this->model->findOrFail($id);
            $preference->update(['status' => $status]);

            return json_encode(["resp" => $preference]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $preference = $this->model->onlyTrashed()->findOrFail($id);
            $preference->restore();

            return redirect()->back()->with('success', __('taxido::static.preferences.restore_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $preference = $this->model->onlyTrashed()->findOrFail($id);
            $preference->forceDelete();
            return redirect()?->back()?->with('success', __('taxido::static.preferences.permanent_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
