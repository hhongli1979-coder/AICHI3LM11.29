<?php

namespace Modules\Taxido\Http\Resources\Drivers;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Rider;
use App\Http\Resources\BaseResource;
use Modules\Taxido\Http\Resources\PreferenceResource;

class RideRequestResource extends BaseResource
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
    $rideRequest = [
      'id' => $this->id,
      'ride_number' => $this->ride_number,
      'locations' => $this->locations,
      'location_coordinates' => $this->location_coordinates,
      'distance' => $this->distance,
      'distance_unit' => $this->distance_unit,
      'weight' => $this->weight,
      'payment_method' => $this->payment_method,
      'ride_fare' => $this->ride_fare,
      'service_id' => $this->service_id,
      'service_category_id' => $this->service_category_id,
      'service' => null,
      'service_category' => null,
      'hourly_packages' => null,
      'hourly_package' => null,
      'start_time' => $this->start_time,
      'end_time' => $this->end_time,
      'cargo_image_url' => $this->cargo_image?->original_url,
      'created_at' => $this->created_at,
      'is_with_driver' => $this->is_with_driver,
      'description' => $this->description,
      'parcel_receiver' => $this->parcel_receiver,
      'parcel_delivered_otp' => $this?->parcel_delivered_otp,
      'rider_id' => $this->rider_id,
      'duration' => $this->duration,
      'additional_distance_charge' => $this->additional_distance_charge,
      'additional_weight_charge' => $this->additional_weight_charge,
      'additional_minute_charge' => $this->additional_minute_charge,
      'tax' => $this->tax,
      'commission' => $this->commission,
      'driver_commission' => $this->driver_commission,
      'bid_extra_amount' => $this->bid_extra_amount,
      'platform_fee' => $this->platform_fee,
      'sub_total' => $this->sub_total,
      'total' => $this->total,
      'driver_rent' => $this->driver_rent,
      'vehicle_rent' => $this->vehicle_rent,
      'currency_symbol' => $this->currency_symbol,
      'no_of_days' => $this->no_of_days,
      'vehicle_per_day_charge' => $this->vehicle_per_day_charge,
      'driver_per_day_charge' => $this->driver_per_day_charge,
      'preference_charge' => $this->preference_charge,
      'preferences' => $this->preferences ?? null,
      'updated_at' => $this->updated_at ?? null,
    ];

    if ($this->service) {
      $rideRequest['service'] = [
        'name' => $this->service?->name,
        'service_type' => $this->service?->type
      ];
    }

    if ($this->service_category) {
      $rideRequest['service_category'] = [
        'name' => $this->service_category?->name,
        'service_category_type' => $this->service_category?->type
      ];
    }

    if ($this->vehicle_type) {
      $rideRequest['vehicle_type'] = [
        'id' => $this->vehicle_type?->id,
        'name' => $this->vehicle_type?->name,
        'base_amount' => $this?->vehicle_type?->base_amount,
        'vehicle_image_url' => $this?->vehicle_type?->vehicle_image?->original_url,
        'vehicle_map_icon_url' => $this?->vehicle_type?->vehicle_map_icon?->original_url,
        'min_per_min_charge' => $this?->vehicle_type?->min_per_min_charge,
        'max_per_min_charge' => $this?->vehicle_type?->max_per_min_charge,
        'max_per_unit_charge' => $this?->vehicle_type?->max_per_unit_charge,
        'min_per_unit_charge' => $this?->vehicle_type?->min_per_unit_charge,
        'min_per_weight_charge' => $this?->vehicle_type->min_per_weight_charge,
        'cancellation_charge' => $this->cancellation_charge,
        'plate_number' => $this->driver?->vehicle_info?->plate_number,
        'color' => $this->driver?->vehicle_info?->color,
        'vehicle_model' => $this->driver?->vehicle_info?->model,
      ];
    }

    if ($this->rider_id) {
      $riderData = null;
      if (isset($this->rider['id'])) {
        $riderData = Rider::where('id', $this->rider['id'])?->first();
      }
      $rideRequest['rider'] = [
        'name' => $this->rider['name'] ?? ($riderData?->name ?? 'Guest - 2'),
        'rating_count' => $riderData?->rating_count ?? 0,
        'reviews_count' => $riderData?->reviews_count ?? 0,
      ];
    }

    if ($this->hourly_packages) {
      $rideRequest['hourly_packages'] = [
        'distance' => $this->hourly_packages?->distance,
        'distance_type' => $this?->hourly_packages?->distance_type,
        'status' => $this?->hourly_packages?->status,
        'hour' => $this?->hourly_packages?->hour,
      ];
    }

    if ($this->rental_vehicle) {
      $rideRequest['rental_vehicle'] = [
        'id' => $this->rental_vehicle?->id,
        'name' => $this->rental_vehicle?->name,
        'interior' => $this->rental_vehicle?->interior,
        'description' => $this->rental_vehicle?->description,
        'vehicle_subtype' => $this->rental_vehicle?->vehicle_subtype,
        'driver_id' => $this->rental_vehicle?->driver_id,
        'vehicle_type_id' => $this->rental_vehicle?->vehicle_type_id,
        'vehicle_per_day_price' => $this->rental_vehicle?->vehicle_per_day_price,
        'driver_per_day_charge' => $this->rental_vehicle?->driver_per_day_charge,
        'normal_image_url' => $this->rental_vehicle?->normal_image?->original_url,
        'front_view_url' => $this->rental_vehicle?->front_view?->original_url,
        'side_view_url' => $this->rental_vehicle?->side_view?->original_url,
        'boot_view_url' => $this->rental_vehicle?->boot_view?->original_url,
        'interior_image_url' => $this->rental_vehicle?->interior_image?->original_url,
        'registration_image' => $this->rental_vehicle?->registration_image?->original_url,
        'fuel_type' => $this->rental_vehicle?->fuel_type,
        'gear_type' => $this->rental_vehicle?->gear_type,
        'vehicle_speed' => $this->rental_vehicle?->vehicle_speed,
        'mileage' => $this->rental_vehicle?->mileage,
        'interior' => $this->rental_vehicle?->interior,
        'bag_count' => $this->rental_vehicle?->bag_count,
        'is_ac' => $this->rental_vehicle?->is_ac,
        'vehicle_subtype' => $this->rental_vehicle?->vehicle_subtype,
        'status' => $this->status,
      ];
    }

    if ($this->driver) {
      $rideRequest['driver'] = [
        'id' => $this->driver?->id,
        'name' => $this?->driver?->name,
        'email' => $this?->driver?->email,
        'review' => $this?->driver?->reviews,
      ];
    }

    if ($this->preferences && $this->preferences->count()) {
      $rideRequest['preferences'] = PreferenceResource::collection($this->preferences);
    }

    return $rideRequest;
  }
}
