<?php

namespace Modules\Taxido\Http\Resources\Riders;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;
use Modules\Taxido\Http\Traits\BiddingTrait;

class HourlyPackageResource  extends BaseResource
{
    use BiddingTrait;

    protected $showSensitiveAttributes = true;

    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $hourlyPackage = [
            'id' => $this->id,
            'distance_type' => $this->distance_type,
            'distance' => $this->distance,
            'hour' => $this->hour,
            'vehicle_types' => null,
        ];

        $vehicleTypes = $this->vehicle_types ?? [];
        if(!empty($vehicleTypes)) {
            foreach($vehicleTypes as $vehicleType) {
                $hourlyPackage['vehicle_types'][] = [
                    'id' => $vehicleType?->id,
                    'name' => $vehicleType?->name,
                    'currency_symbol' => getCurrencySymbolByZoneId($request->zone_id),
                    'vehicle_image_url' => $vehicleType?->vehicle_image?->original_url,
                    'vehicle_map_icon_url' => $vehicleType?->vehicle_map_icon?->original_url,
                    'charges' => $this->calHourlyPackageVehicleTypePrice($vehicleType?->id, $this?->id, $request->zone_id),
                    'vehicle_type_zone' => getVehicleTypeZoneById($vehicleType?->id, $request->zone_id)
                ];
            }
        }


        return $hourlyPackage;
    }
}
