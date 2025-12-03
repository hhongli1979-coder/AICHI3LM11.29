<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\ServiceCategory;
use Prettus\Repository\Eloquent\BaseRepository;

class ServiceCategoryRepository extends BaseRepository
{
    function model()
    {
        return ServiceCategory::class;
    }

    public function index($serviceCategoryTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.service-category.index', ['tableConfig' => $serviceCategoryTable]);
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {
            $serviceCategory = $this->model->FindOrFail($id);
            $locale = $request['locale'] ?? app()->getLocale();
            if (isset($request['name'])) {
                $serviceCategory->setTranslation('name', $locale, $request['name']);
            }

            if (isset($request['description'])) {
                $serviceCategory->setTranslation('description', $locale, $request['description']);
            }

            $data = array_diff_key($request, array_flip(['name', 'description', 'locale']));
            $serviceCategory->update($data);

            if (isset($request['service_category_image_id'])) {
                $serviceCategory->service_category_image()->associate($request['service_category_image_id']);
                $serviceCategory->service_category_image;
            }

            if (isset($request['services'])){
                $serviceCategory->services()->sync($request['services']);
                $serviceCategory->services;
            }

            DB::commit();

            return to_route(getServiceCategoryIndexRoute($request['req_service']))->with('success', __('taxido::static.service_categories.update_successfully'));
            
        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }   

    public function status($id, $status)
    {
        try {

            $serviceCategory = $this->model->findOrFail($id);
            $serviceCategory->update(['status' => $status]);

            return json_encode(["resp" => $serviceCategory]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }

    }
}
