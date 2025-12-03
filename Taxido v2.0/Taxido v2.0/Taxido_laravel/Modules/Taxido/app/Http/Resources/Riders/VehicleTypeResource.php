<?php

namespace Modules\Taxido\Http\Resources\Riders;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;
use Modules\Taxido\Http\Resources\PreferenceResource;

class VehicleTypeResource extends BaseResource
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
        $vehicleType = [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'slug' => $this->slug,
            'currency_symbol' => $this->currency_symbol,
            'currency_code' => $this->currency_code,
            'max_seat' => $this->max_seat,
            'seat' => $this->max_seat,
            'vehicle_image_url' => $this->vehicle_image?->original_url,
            'vehicle_map_icon_url' => $this->vehicle_map_icon?->original_url,
            'vehicle_type_zone' => [],
            'charges' => $this->charges ?? [],
        ];

        if ($this->vehicle_type_zone) {
            $vehicleType['vehicle_type_zone']['id'] = $this->vehicle_type_zone?->id;
            $vehicleType['vehicle_type_zone']['vehicle_type_id'] = $this->vehicle_type_zone?->vehicle_type_id;
            $vehicleType['vehicle_type_zone']['zone_id'] = $this->vehicle_type_zone?->zone_id;
            $vehicleType['vehicle_type_zone']['base_fare_charge'] = $this->vehicle_type_zone?->base_fare_charge;
            $vehicleType['vehicle_type_zone']['base_distance'] = $this->vehicle_type_zone?->base_distance;
            $vehicleType['vehicle_type_zone']['per_distance_charge'] = $this->vehicle_type_zone?->per_distance_charge;
            $vehicleType['vehicle_type_zone']['per_minute_charge'] = $this->vehicle_type_zone?->per_minute_charge;
            $vehicleType['vehicle_type_zone']['per_weight_charge'] = $this->vehicle_type_zone?->per_weight_charge;
            $vehicleType['vehicle_type_zone']['waiting_charge'] = $this->vehicle_type_zone?->waiting_charge;
            $vehicleType['vehicle_type_zone']['free_waiting_time_before_start_ride'] = $this->vehicle_type_zone?->free_waiting_time_before_start_ride;
            $vehicleType['vehicle_type_zone']['free_waiting_time_after_start_ride'] = $this->vehicle_type_zone?->free_waiting_time_after_start_ride;
            $vehicleType['vehicle_type_zone']['cancellation_charge_for_rider'] = $this->vehicle_type_zone?->cancellation_charge_for_rider;
            $vehicleType['vehicle_type_zone']['cancellation_charge_for_driver'] = $this->vehicle_type_zone?->cancellation_charge_for_driver;
            $vehicleType['vehicle_type_zone']['commission_type'] = $this->vehicle_type_zone?->commission_type;
            $vehicleType['vehicle_type_zone']['commission_rate'] = $this->vehicle_type_zone?->commission_rate;
            $vehicleType['vehicle_type_zone']['airport_charge_rate'] = $this->vehicle_type_zone?->airport_charge_rate;
            $vehicleType['vehicle_type_zone']['tax_id'] = $this->vehicle_type_zone?->tax_id;
            $vehicleType['vehicle_type_zone']['is_allow_airport_charge'] = $this->vehicle_type_zone?->is_allow_airport_charge;
            $vehicleType['vehicle_type_zone']['preferences'] = $this->vehicle_type_zone?->preferences ?? [];
        }

        if($this->vehicle_type_zone?->preferences) {
            $vehicleType['vehicle_type_zone']['preferences'] = PreferenceResource::collection($this->vehicle_type_zone?->preferences);
        }

        return $vehicleType;
    }
}
