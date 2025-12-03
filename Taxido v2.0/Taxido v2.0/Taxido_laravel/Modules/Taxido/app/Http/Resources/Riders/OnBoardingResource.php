<?php

namespace Modules\Taxido\Http\Resources\Riders;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class OnBoardingResource  extends BaseResource
{
    protected $showSensitiveAttributes = true;

    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'onboarding_image_url' => $this->onboarding_image?->original_url,
        ];
    }
}
