<?php

namespace Modules\Taxido\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class BannerResource  extends BaseResource
{
    protected $showSensitiveAttributes = true;

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
            'order' => $this->order,
            'banner_image_url' => $this->banner_image?->original_url
        ];
    }


}
