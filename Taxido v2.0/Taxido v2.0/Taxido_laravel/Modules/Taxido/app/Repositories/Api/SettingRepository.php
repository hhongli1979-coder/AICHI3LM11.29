<?php

namespace Modules\Taxido\Repositories\Api;

use Modules\Taxido\Http\Resources\Riders\OnBoardingResource;
use Modules\Taxido\Http\Resources\SettingsResource;
use Modules\Taxido\Models\Onboarding;
use Modules\Taxido\Models\TaxidoSetting;
use Prettus\Repository\Eloquent\BaseRepository;

class SettingRepository extends BaseRepository
{

    function model()
    {
        return TaxidoSetting::class;
    }

    public function index()
    {
        $settings = $this->model->latest('created_at')->first();
        $values = $settings['taxido_values'];
        $splashImage = getMedia($values['setting']['splash_screen_id'] ?? null);
        $driverSplash = getMedia($values['setting']['splash_driver_screen_id'] ?? null);
        $values['setting']['splash_screen_url'] = $splashImage?->original_url;
        $values['setting']['driver_splash_screen_url'] = $driverSplash?->original_url;

        $onBoardings = Onboarding::where('status', true)
            ->when(request()->filled('type'), function ($query) {
                $query->where('type', request()->input('type'));
            })?->get();

        $values['onboarding'] =  OnBoardingResource::collection($onBoardings ?? []);
        $settings['taxido_values'] = $values;
        return new SettingsResource($settings);

    }
}
