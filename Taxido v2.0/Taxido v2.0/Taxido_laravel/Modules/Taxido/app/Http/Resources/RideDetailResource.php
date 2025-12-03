<?php

namespace Modules\Taxido\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;
use Modules\Taxido\Models\Preference;

class RideDetailResource extends BaseResource
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
            'uuid'=> $this->uuid,
            'ride_number' => $this->ride_number,
            'vehicle_type_id' => $this->vehicle_type_id,
            'locations' => $this->locations,
            'location_coordinates' => $this->location_coordinates,
            'tax' => $this->tax,
            'platform_fees' => $this->platform_fees,
            'ride_fare' => $this->ride_fare,
            'bid_extra_amount' => $this->bid_extra_amount,
            'sub_total' => $this->sub_total,
            'total' => $this->total,
            'commission' => $this->commission,
            'driver_commission' => $this->driver_commission,
            'preference_charge' => $this->preference_charge,
            'additional_distance_charge' => $this->additional_distance_charge,
            'additional_weight_charge' => $this->additional_weight_charge,
            'additional_minute_charge' => $this->additional_minute_charge,
            'rider_cancellation_charge' => $this->rider_cancellation_charge,
            'driver_cancellation_charge' => $this->driver_cancellation_charge,
            'waiting_charges'  => $this->waiting_charges,
            'waiting_total_times'  => $this->waiting_total_times,
            'distance' => $this->distance,
            'distance_unit' => $this->distance_unit,
            'otp' => $this->otp,
            'created_at' => $this->created_at,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'service_id' => $this->service_id,
            'vehicle_per_day_price' => $this->vehicle_per_day_price,
            'driver_per_day_charge' => $this->driver_per_day_charge,
            'driver_rent' => $this->driver_rent,
            'vehicle_rent' => $this->vehicle_rent,
            'processing_fee' => $this->processing_fee,
            'cancellation_reason' => $this->cancellation_reason,
            'service_category_id' => $this->service_category_id,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'ride_status' => $this->ride_status?->name,
            'hourly_packages' => null,
            'vehicle_model' => $this->driver?->vehicle_info?->model,
            'plate_number' => $this->driver?->vehicle_info?->plate_number,
            'weight' => $this->weight,
            'driver_tips' => $this->driver_tips,
            'invoice_url' => $this->invoice_url,
            'invoice_id' => $this->invoice_id,
            'is_with_driver' => $this->is_with_driver,
            'assigned_driver' => $this->assigned_driver,
            'description' => $this->description,
            'currency_symbol' => $this?->currency_symbol,
            'parcel_receiver' => $this->parcel_receiver,
            'parcel_delivered_otp' => $this?->parcel_delivered_otp,
            'cargo_image_url' => $this?->cargo_image?->original_url,
            'riderReview' => $this->riderReview ?? null,
            'driverReview' => $this->driverReview ?? null,
            'preferences' => $this->preferences ?? null,
            'updated_at' => $this->updated_at,
            'total_extra_charge' => $this->total_extra_charge,
            'extra_charges'=> $this->extra_charges ?? null,
            'track_url' =>  $this->uuid ? route('front.cab.ride.track', ['track_id' => $this->uuid]) : null,
            'rider' => [
                'id' => $this->rider['id'] ?? null,
                'name' => $this->rider['name'] ?? null,
                'email' => $this->rider['email'] ?? null,
                'phone' => $this->rider['phone'] ?? null,
                'country_code' => $this->rider['country_code'] ?? null,
                'profile_image_url' =>  $this->rider['profile_image_url'] ?? null,
            ],
            'driver' => [
                'id' => $this->driver?->id,
                'name' => $this->driver?->name,
                'email' => $this->driver?->email,
                'phone' => $this->driver?->phone,
                'country_code' => $this->driver?->country_code,
                'profile_image_url' => $this->driver?->profile_image?->original_url,
                'rating_count' => $this->driver?->rating_count,
                'review_count' => $this->driver?->review_count,
            ],
            'vehicle_type' => [
                'id' => $this->vehicle_type?->id,
                'name' => $this->vehicle_type?->name,
                'vehicle_image_url' => $this->vehicle_type?->vehicle_image?->original_url,
                'vehicle_map_icon_url' => $this->vehicle_type?->vehicle_map_icon?->original_url,
                'vehicle_model' => $this->driver?->vehicle_info?->model,
                'plate_number' => $this->driver?->vehicle_info?->plate_number,
                'color' => $this->driver?->vehicle_info?->color,
                'vehicle_type_id' => $this->vehicle_type_id,
            ],
            'service' => [
                'name' => $this->service?->name,
                'slug' => $this->service?->slug,
                'service_type'=> $this->service?->type,
            ],
            'service_category' => [
                'name' => $this->service_category?->name,
                'slug' => $this->service_category?->slug,
                'service_category_type'=> $this->service_category?->type,
            ],
            'ride_status' => [
                'name' => $this->ride_status?->name,
                'slug' => $this->ride_status?->slug,
            ],
        ];

        if ($this->hourly_packages) {
            $ride['hourly_packages'] = [
                'distance' => $this->hourly_packages?->distance,
                'distance_type' => $this?->hourly_packages?->distance_type,
                'status' => $this?->hourly_packages?->status,
                'hour' => $this?->hourly_packages?->hour,
            ];
        }

        if($this->rental_vehicle) {
            $ride['rental_vehicle'] = [
              'id' => $this->rental_vehicle?->id,
              'name' => $this->rental_vehicle?->name,
              'description' => $this->rental_vehicle?->description,
              'vehicle_subtype' => $this->rental_vehicle?->vehicle_subtype,
              'driver_id' => $this->rental_vehicle?->driver_id,
              'vehicle_type_id' => $this->rental_vehicle?->vehicle_type_id,
              'vehicle_per_day_price' => $this->rental_vehicle?->vehicle_per_day_price,
              'driver_per_day_charge' => $this->rental_vehicle?->driver_per_day_charge,
              'normal_image_url' => $this->normal_image?->original_url,
              'front_view_url' => $this->front_view?->original_url,
              'side_view_url' => $this->side_view?->original_url,
              'boot_view_url' => $this->boot_view?->original_url,
              'interior_image_url' => $this->interior_image?->original_url,
              'registration_image' => $this->registration_image?->original_url,
            ];
        }

        if ($this->preferences && $this->preferences->count()) {
            $ride['preferences'] = PreferenceResource::collection($this->preferences);
        }

        return $ride;
    }
}
