<?php

namespace Modules\Taxido\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class SOSResource extends BaseResource
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
            'country_code' => $this->country_code,
            'phone' => $this->phone,
            'sos_image_url' => $this->sos_image?->original_url
        ];
    }
}
