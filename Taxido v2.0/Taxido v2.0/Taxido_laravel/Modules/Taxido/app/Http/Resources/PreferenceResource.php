<?php

namespace Modules\Taxido\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class PreferenceResource extends BaseResource
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
            'name' => $this->name,
            'icon_image_url' => $this->icon_image?->original_url,
            'price' => $this->pivot?->price,
        ];
    }
}
