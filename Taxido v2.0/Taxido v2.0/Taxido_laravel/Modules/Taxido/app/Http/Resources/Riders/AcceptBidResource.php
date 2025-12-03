<?php

namespace Modules\Taxido\Http\Resources\Riders;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class AcceptBidResource  extends BaseResource
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
    $ride = [
      'id' => $this->id,
      'ride_number' => $this->ride_number,
      'coupon_total_discount' => $this->coupon_total_discount,
      'rider' => [
        'id' => $this->rider['id'] ?? null,
        'name' => $this->rider['name'],
        'email' =>  $this->rider['email'],
        'country_code' => $this->rider['country_code'],
        'phone' =>  $this->rider['phone'],
        'profile_image_url' =>  $this->rider['profile_image_url'] ?? null,
      ],
      'driver' => [
        'id' => $this->driver?->id,
        'name' => $this->driver?->name,
        'email' =>  $this->driver?->email,
        'country_code' => $this->driver?->country_code,
        'phone' =>  $this->driver?->phone,
        'profile_image_url' =>  $this->driver?->profile_image?->original_url ?? null,
        'review_count' => $this->driver?->review_count,
        'rating_count' => $this->driver?->rating_count,
      ],
      'vehicle_info' => [
        'vehicle_type_id' => $this->vehicle_type_id,
        'name' => $this->driver?->vehicle_info?->name,
        'description' => $this->driver?->vehicle_info?->description,
        'model' => $this->driver?->vehicle_info?->model,
        'plate_number' => $this->driver?->vehicle_info?->plate_number,
      ],
      'vehicle_type' => [
        'id' => $this->vehicle_type?->id,
        'name' => $this->vehicle_type?->name,
        'vehicle_image_url' => $this->vehicle_type?->vehicle_image?->original_url,
        'vehicle_map_icon_url' => $this->vehicle_type?->vehicle_map_icon?->original_url,
        'vehicle_model' => $this->vehicle_info?->model,
        'plate_number' => $this->vehicle_info?->plate_number,
        'vehicle_type_id' => $this->vehicle_type_id,
      ],
      'otp' => $this->otp,
      'distance' => $this->distance,
      'distance_unit' => $this->distance_unit,
      'locations' => $this->locations,
      'location_coordinates' => $this->location_coordinates,
      'service_category_type' => $this->service_category?->type,
      'service_type' => $this->service?->type,

      'ride_status' => [
        'id' => $this?->ride_status?->id,
        'name' => $this->ride_status?->name,
        'slug' => $this->ride_status?->slug,
      ],
      'currency_symbol' => $this->currency_symbol,
      'is_otp_verified' => $this->is_otp_verified,
      'parcel_delivered_otp' => $this->parcel_delivered_otp,
      'ride_fare' => $this->ride_fare,
      'driver_tips' => $this->driver_tips,
      'tax' => $this->tax,
      'sub_total' => $this->sub_total,
      'total' => $this->total,
      'platform_fees' => $this->platform_fees,
      'processing_fee' => $this->processing_fee,
      'driver_per_day_charge' => $this->driver_per_day_charge,
      'invoice_url' => $this->invoice_url,
      'payment_method' => $this->payment_method,
      'payment_mode' => $this->payment_mode,
      'payment_status' => $this->payment_status,
      'is_with_driver' => $this->is_with_driver,
      'start_time' => $this->start_time,
      'end_time' => $this->end_time
    ];

    return $ride;
  }
}
