<?php

namespace Modules\Taxido\Http\Resources\Drivers;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;
use Modules\Taxido\Http\Resources\PreferenceResource;

class DriverSelfResource  extends BaseResource
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
        $driverSelf = [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role?->name,
            'email' => $this->email,
            'profile_image_url' => $this->profile_image?->original_url,
            'profile_image_id' => $this->profile_image_id,
            'phone' => $this->phone,
            'is_verified' => $this->is_verified,
            'country_code' => $this->country_code,
            'is_online' => $this->is_online,
            'referral_code'     => $this->referral_code,
            'active_rides_ids' => getActiveRidesIds(),
            'total_active_rides' => $this->total_active_rides,
            'total_pending_rides' => $this->total_pending_rides,
            'total_complete_rides' => $this->total_complete_rides,
            'total_cancel_rides' => $this->total_cancel_rides,
            'service_id' => $this->service_id,
            'wallet_balance' => $this->wallet?->balance ?? 0.00,
            'total_driver_commission' => $this->total_driver_commission,
            'service_category_id' => $this->service_category_id,
            'rating_count' => $this->rating_count,
            'review_count' => $this->review_count,
            'preferences' => [],
            'vehicle_info' => [
                'vehicle_type_id' => $this->vehicle_info?->vehicle_type_id,
                'vehicle_type_image_url' => $this->vehicle_info?->vehicle?->vehicle_image?->original_url,
                'vehicle_type_map_icon_url' => $this->vehicle_info?->vehicle?->vehicle_map_icon?->original_url,
                'name' => $this->ambulance?->name,
                'description' => $this->ambulance?->description,
                'plate_number' => $this->vehicle_info?->plate_number,
                'color' => $this->vehicle_info?->color,
                'model' => $this->vehicle_info?->model,
                'seat' => $this->vehicle_info?->seat,
            ],
            'payment_account' => [
                'paypal_email' => $this->payment_account?->paypal_email,
                'bank_name' => $this->payment_account?->bank_name,
                'bank_holder_name' => $this->payment_account?->bank_holder_name,
                'bank_account_no' => $this->payment_account?->bank_account_no,
                'swift' => $this->payment_account?->swift,
                'routing_number' => $this->payment_account?->routing_number,
            ],
            'fleet_manager' => [
                'name' => $this->fleet_manager?->name,
                'email' => $this->fleet_manager?->email,
                'phone' => $this->fleet_manager?->phone,
                'profile_image_url' => $this->fleet_manager?->profile_image?->original_url,
            ],
            'documents' => DriverDocumentResource::collection($this->documents ?? [])
        ];

        if($this->preferences) {
            $driverSelf['preferences'] = PreferenceResource::collection($this->preferences);
        }

        return $driverSelf;
    }
}
