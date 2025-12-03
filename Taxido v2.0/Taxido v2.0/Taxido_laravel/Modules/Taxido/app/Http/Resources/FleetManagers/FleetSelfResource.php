<?php

namespace Modules\Taxido\Http\Resources\FleetManagers;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class FleetSelfResource  extends BaseResource
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
        $fleetSelf = [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role?->name,
            'email' => $this->email,
            'profile_image_url' => $this->profile_image?->original_url,
            'phone' => $this->phone,
            'is_verified' => $this->is_verified,
            'country_code' => $this->country_code,
            'wallet_balance' => $this->wallet?->balance ?? 0.00,
            'total_fleet_commission' => $this->total_fleet_commission,
            'payment_account' => null,
            'driver_ids' => [],
            'company_address' => $this->address ?? null,
            'documents' => FleetDocumentResource::collection($this->documents ?? [])
        ];

        if($this->payment_account) {
            $fleetSelf['payment_account'] = [
                'paypal_email' => $this->payment_account?->paypal_email,
                'bank_name' => $this->payment_account?->bank_name,
                'bank_holder_name' => $this->payment_account?->bank_holder_name,
                'bank_account_no' => $this->payment_account?->bank_account_no,
                'swift' => $this->payment_account?->swift,
                'routing_number' => $this->payment_account?->routing_number,
            ];
        }

        if($this->fleet_drivers) {
            $fleetSelf['driver_ids'] = $this->fleet_drivers?->pluck('id')?->toArray() ?? [];
        }

        return $fleetSelf;
    }
}
