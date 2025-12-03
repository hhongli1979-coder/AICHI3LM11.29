<?php

namespace Modules\Taxido\Http\Resources\Riders;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class RentalVehicleDetailResource  extends BaseResource
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
    $rentalVehicle = [
      'id' => $this->id,
      'name' => $this->name,
      'description' => $this->description,
      'vehicle_type_id' => $this->vehicle_type_id,
      'allow_with_driver' => $this->allow_with_driver,
      'fuel_type' => $this->fuel_type,
      'gear_type' => $this->gear_type,
      'vehicle_speed' => $this->vehicle_speed,
      'mileage' => $this->mileage,
      'interior' => $this->interior,
      'bag_count' => $this->bag_count,
      'is_ac' => $this->is_ac,
      'driver_per_day_charge' => $this->driver_per_day_charge,
      'vehicle_per_day_price' => $this->vehicle_per_day_price,
      'zone_id' => $this->zone_id,
      'vehicle_subtype' => $this->vehicle_subtype,
      'rental_vehicle_galleries' => $this->rental_vehicle_galleries,
      'normal_image' => null,
      'side_view' => null,
      'interior_image' => null,
      'boot_view' => null,
      'front_view' => null,
      'registration_image' => null,
      'allow_with_driver' => $this->allow_with_driver,
      'currency_symbol' => $this->zone?->currency?->symbol,
      'status' => $this->status,
      'charge' => $this->charge,
      'zone_id' => $this->zone_id,
      'zone' => $this->zone,
      'driver' => [
            'name' => $this->driver?->name,
            'driver_profile_image_url' => $this->driver?->profile_image?->original_url,
            'rating_count' => $this->driver?->rating_count,
            'review_count' => $this->driver?->review_count,
        ],
    ];

    if ($this->boot_view) {
      $rentalVehicle['boot_view'] = [
        'id' => $this->boot_view?->id,
        'file_name' => $this->boot_view?->file_name,
        'mime_type' => $this->boot_view?->mime_type,
        'original_url' => $this->boot_view?->original_url,
      ];
    }

    if ($this->interior_image) {
      $rentalVehicle['interior_image'] = [
        'id' => $this->interior_image?->id,
        'file_name' => $this->interior_image?->file_name,
        'mime_type' => $this->interior_image?->mime_type,
        'original_url' => $this->interior_image?->original_url,
      ];
    }

    if ($this->normal_image) {
      $rentalVehicle['normal_image'] = [
        'id' => $this->normal_image?->id,
        'file_name' => $this->normal_image?->file_name,
        'mime_type' => $this->normal_image?->mime_type,
        'original_url' => $this->normal_image?->original_url,
      ];
    }

    if ($this->side_view) {
      $rentalVehicle['side_view'] = [
        'id' => $this->side_view?->id,
        'file_name' => $this->side_view?->file_name,
        'mime_type' => $this->side_view?->mime_type,
        'original_url' => $this->side_view?->original_url,
      ];
    }

    if ($this->front_view) {
      $rentalVehicle['front_view'] = [
        'id' => $this->front_view?->id,
        'file_name' => $this->front_view?->file_name,
        'mime_type' => $this->front_view?->mime_type,
        'original_url' => $this->front_view?->original_url,
      ];
    }

    if ($this->registration_image) {
      $rentalVehicle['registration_image'] = [
        'id' => $this->registration_image?->id,
        'file_name' => $this->registration_image?->file_name,
        'mime_type' => $this->registration_image?->mime_type,
        'original_url' => $this->registration_image?->original_url,
      ];
    }

    return $rentalVehicle;
  }
}
