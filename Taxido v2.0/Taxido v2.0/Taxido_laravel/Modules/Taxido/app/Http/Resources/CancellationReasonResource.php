<?php

namespace Modules\Taxido\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class CancellationReasonResource extends BaseResource
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
            'slug' => $this->slug,
            'status' => $this->status,
            'icon_image_url' => $this->icon_image?->original_url,
            'for' => $this->for,
            'ride_start' => $this->ride_start,
        ];
    }
}
