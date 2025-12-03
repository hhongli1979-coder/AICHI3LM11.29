<?php

namespace Modules\Taxido\Http\Resources\Riders;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class SelfResource  extends BaseResource
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
            'email' => $this->email,
            'phone' => $this->phone,
            'country_code' => $this->country_code,
            'profile_image_id' => $this->profile_image_id,
            'referral_code'     => $this->referral_code,
            'profile_image_url' => $this->profile_image?->original_url,
            'total_active_rides' => $this->total_active_rides,
            'rating_count' => $this->rating_count,
            'review_count' => $this->review_count,
            'active_rides_ids' => getActiveRidesIds(),
        ];
    }
}
