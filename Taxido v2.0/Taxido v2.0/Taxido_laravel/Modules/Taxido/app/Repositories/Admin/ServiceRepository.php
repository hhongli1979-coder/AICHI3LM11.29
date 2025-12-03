<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Modules\Taxido\Models\Service;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class ServiceRepository extends BaseRepository
{
    function model()
    {
        return Service::class;
    }

    public function index($serviceTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.service.index', ['tableConfig' => $serviceTable]);
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $service = $this->model->findOrFail($id);

            $locale = $request['locale'] ?? app()->getLocale();
            $service->setTranslation('name', $locale, $request['name']);

            $data = array_diff_key($request, array_flip(['name', 'locale']));
            $service->update($data);

            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.service.edit', ['service' => $service->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.services.update_successfully'));
            }
    
            return to_route('admin.service.index')->with('success', __('taxido::static.services.update_successfully'));

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $service = $this->model->findOrFail($id);
            $service->update(['status' => $status]);

            return json_encode(["resp" => $service]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function primary($id, $status)
    {
        try {

            $this->model->query()->update(['is_primary' => false]);
            $service = $this->model->findOrFail($id);
            $service->update(['is_primary' => $status]);

            return json_encode(["resp" => $service]);
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
