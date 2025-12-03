<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Modules\Taxido\Models\Banner;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class BannerRepository extends BaseRepository
{
    function model()
    {
        return Banner::class;
    }

    public function index($bannerTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.banner.index', ['tableConfig' => $bannerTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();

        try {

            $banner = $this->model->create([
                'title' => $request->title,
                'banner_image_id' => $request->banner_image_id,
                'order' => $request->order,
                'status' => $request->status,
            ]);

            if ($request->services) {
                $banner->services()->attach($request->services);
                $banner->services;
            }

            $locale = $request['locale'] ?? app()->getLocale();
            $banner->setTranslation('banner_image_id', $locale, $request['banner_image_id']);
            $banner->setTranslation('title', $locale, $request['title']);

            DB::commit();
            
            if ($request->has('save')) {
                return to_route('admin.banner.edit', [
                    'banner' => $banner->id,
                    'locale' => $locale
                ])->with('success', __('taxido::static.banners.create_successfully'));
            }
    
            return to_route('admin.banner.index')->with('success', __('taxido::static.banners.create_successfully'));
        
        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $banner = $this->model->findOrFail($id);
            $locale = $request['locale'] ?? app()->getLocale();
            $banner->setTranslation('title', $locale, $request['title']);
            $banner->setTranslation('banner_image_id', $locale, $request['banner_image_id']);
            $data = array_diff_key($request, array_flip(['title', 'locale', 'banner_image_id']));
            $banner->update($data);
            if (isset($request['services'])) {
                $banner->services()->sync($request['services']);
                $banner->services;
            }

            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.banner.edit', ['banner' => $banner->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.banners.update_successfully'));
            }
    
            return to_route('admin.banner.index')->with('success', __('taxido::static.banners.update_successfully'));

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {

            $banner = $this->model->findOrFail($id);
            $banner->destroy($id);

            DB::commit();
            return to_route('admin.banner.index')->with('success', __('taxido::static.banners.delete_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $banner = $this->model->findOrFail($id);
            $banner->update(['status' => $status]);

            return json_encode(["resp" => $banner]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $banner = $this->model->onlyTrashed()->findOrFail($id);
            $banner->restore();

            return redirect()->back()->with('success', __('taxido::static.banners.restore_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $banner = $this->model->onlyTrashed()->findOrFail($id);
            $banner->forceDelete();
            return redirect()?->back()?->with('success', __('taxido::static.banners.permanent_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
