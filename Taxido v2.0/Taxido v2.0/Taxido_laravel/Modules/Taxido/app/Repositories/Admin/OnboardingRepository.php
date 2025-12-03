<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\Onboarding;
use Prettus\Repository\Eloquent\BaseRepository;

class OnboardingRepository extends BaseRepository
{
    function model()
    {
        return Onboarding::class;
    }

    public function index($onboardingTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.onboarding.index', ['tableConfig' => $onboardingTable]);
    }   

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {

            $onboarding = $this->model->findOrFail($id);

            $locale = $request['locale'] ?? app()->getLocale();

            if (isset($request['title'])) {
                $onboarding->setTranslation('title', $locale, $request['title']);
            }
            
            if (isset($request['description'])) {
                $onboarding->setTranslation('description', $locale, $request['description']);
            }

            if (isset($request['onboarding_image_id'])) {
                $onboarding->setTranslation('onboarding_image_id', $locale, $request['onboarding_image_id']);
            }

            $data = array_diff_key($request, array_flip(['title', 'description', 'onboarding_image_id']));
            $onboarding->update($data);

            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.onboarding.edit', ['onboarding' => $onboarding->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.onboardings.update_successfully'));
            }

            return to_route('admin.onboarding.index')->with('success', __('taxido::static.onboardings.update_successfully'));     
       
        } catch (Exception $e) {
            
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $onboarding = $this->model->findOrFail($id);
            $onboarding->update(['status' => $status]);

            return json_encode(["resp" => $onboarding]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

}