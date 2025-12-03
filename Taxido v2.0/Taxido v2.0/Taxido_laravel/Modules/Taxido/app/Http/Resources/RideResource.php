<?php

namespace Modules\Taxido\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class RideResource  extends BaseResource
{
    protected $showSensitiveAttributes = true;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $ride = [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'ride_number' => $this->ride_number,
            'vehicle_type_id' => $this->vehicle_type_id,
            'locations' => $this->locations,
            'location_coordinates' => $this->location_coordinates,
            'tax' => $this->tax,
            'platform_fees' => $this->platform_fees,
            'ride_fare' => $this->ride_fare,
            'sub_total' => $this->sub_total,
            'total' => $this->total,
            'commission' => $this->commission,
            'driver_commission' => $this->driver_commission,
            'additional_distance_charge' => $this->additional_distance_charge,
            'additional_weight_charge' => $this->additional_weight_charge,
            'additional_minute_charge' => $this->additional_minute_charge,
            'rider_cancellation_charge' => $this->rider_cancellation_charge,
            'driver_cancellation_charge' => $this->driver_cancellation_charge,
            'preference_charge' => $this->preference_charge,
            'waiting_charges'  => $this->waiting_charges,
            'waiting_total_times'  => $this->waiting_total_times,
            'bid_extra_amount' => $this->bid_extra_amount,
            'distance' => $this->distance,
            'description' => $this->description,
            'distance_unit' => $this->distance_unit,
            'otp' => $this->otp,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'service_id' => $this->service_id,
            'cancellation_reason' => $this->cancellation_reason,
            'service_category_id' => $this->service_category_id,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'invoice_id' => $this->invoice_id,
            'driver' => null,
            'vehicle_type' => null,
            'service' => null,
            'service_category' => null,
            'ride_status' => null,
            'vehicle_model' => $this->driver?->vehicle_info?->model,
            'plate_number' => $this->driver?->vehicle_info?->plate_number,
            'weight' => $this->weight,
            'parcel_receiver' => $this->parcel_receiver,
            'parcel_delivered_otp' => $this?->parcel_delivered_otp,
            'cargo_image_url' => $this?->cargo_image?->original_url,
            'currency_symbol' => $this?->currency_symbol,
            'total_extra_charge'  => $this->total_extra_charge,
            'driver_rent' => $this->driver_rent,
            'vehicle_rent' => $this->vehicle_rent,
            'riderReview' => $this->riderReview ?? null,
            'driverReview' => $this->driverReview ?? null,
            'preferences' => null,
            'extra_charges'=> $this->extra_charges ?? null,
            'track_url' => $this->uuid ? route('front.cab.ride.track', ['track_id' => $this->uuid]) : null
        ];

        if ($this->driver) {
            $ride['driver'] = [
                'id' => $this->driver?->id,
                'name' => $this->driver?->name,
                'email' => $this->driver?->email,
                'phone' => $this->driver?->phone,
                'country_code' => $this->driver?->country_code,
                'driver_profile_image_url' => $this->driver?->profile_image?->original_url,
                'rating_count' => $this->driver?->rating_count,
                'review_count' => $this->driver?->review_count,
            ];
        }

        if ($this->rider) {
            $ride['rider'] = [
                'id' => $this->rider['id'] ?? null,
                'name' => $this->rider['name'] ?? null,
                'email' => $this->rider['email'] ?? null,
                'phone' => $this->rider['phone'] ?? null,
                'country_code' => $this->rider['country_code'] ?? null,
                'rating_count' => $this->rider['rating_count'] ?? null,
                'reviews_count' => $this->rider['reviews_count'] ?? null,
            ];
        }

        if ($this->hourly_packages) {
            $ride['hourly_packages'] = [
                'distance' => $this->hourly_packages?->distance,
                'distance_type' => $this?->hourly_packages?->distance_type,
                'status' => $this?->hourly_packages?->status,
                'hour' => $this?->hourly_packages?->hour,
            ];
        }

        if ($this->vehicle_type) {
            $ride['vehicle_type'] = [
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
                 'vehicle_model' => $this->driver?->vehicle_info?->model,
                'plate_number' => $this->driver?->vehicle_info?->plate_number,
                'color' => $this->driver?->vehicle_info?->color,
                'vehicle_type_id' => $this->vehicle_type_id,
            ];
        }

        if ($this->service) {
            $ride['service'] = [
                'name' => $this->service?->name,
                'slug' => $this->service?->slug,
                'service_type' => $this->service?->type
            ];

            if ($this->service?->type === 'ambulance') {
                $ride['ambulance_image_url'] = asset('images/ambulance-1.png');
            }
        }

        if ($this->service_category) {
            $ride['service_category'] = [
                'name' => $this->service_category?->name,
                'slug' => $this->service_category?->slug,
                'service_category_type' => $this->service_category?->type
            ];
        }

        if ($this->ride_status) {
            $ride['ride_status'] = [
                'name' => $this->ride_status?->name,
                'slug' => $this->ride_status?->slug
            ];
        }

        if ($this->preferences && $this->preferences->count()) {
            $ride['preferences'] = PreferenceResource::collection($this->preferences);
        }

        return $ride;
    }
}
