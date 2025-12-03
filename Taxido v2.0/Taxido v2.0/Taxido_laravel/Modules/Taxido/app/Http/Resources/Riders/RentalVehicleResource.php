<?php

namespace Modules\Taxido\Http\Resources\Riders;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class RentalVehicleResource extends BaseResource
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
            'description' => $this->description,
            'vehicle_type_id' => $this->vehicle_type_id,
            'normal_image_url' => $this->normal_image?->original_url,
            'allow_with_driver' => $this->allow_with_driver,
            'fuel_type' => $this->fuel_type,
            'gear_type' => $this->gear_type,
            'vehicle_speed' => $this->vehicle_speed,
            'mileage' => $this->mileage,
            'is_ac' => $this->is_ac,
            'bag_count' => $this->bag_count,
            'driver_per_day_charge' => $this->driver_per_day_charge,
            'vehicle_per_day_price' => $this->vehicle_per_day_price,
            'vehicle_subtype' => $this->vehicle_subtype,
            'status' => $this->status,
            'currency_symbol' => $this->zones?->currency?->symbol,
            'driver' => [
                'name' => $this->driver?->name,
                'driver_profile_image_url' => $this->driver?->profile_image?->original_url,
                'rating_count' => $this->driver?->rating_count,
                'review_count' => $this->driver?->review_count,
            ],
        ];
    }
}
