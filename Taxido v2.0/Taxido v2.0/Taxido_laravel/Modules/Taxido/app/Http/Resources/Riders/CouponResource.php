<?php

namespace Modules\Taxido\Http\Resources\Riders;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class CouponResource extends BaseResource
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
            'id'  => $this->id,
            'title' => $this->title,
            'description'  => $this->description,
            'code'  => $this->code,
            'type'  => $this->type,
            'amount'  => $this->amount,
            'is_expired' => $this->is_expired,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'services' => $this->services->map(function ($service) {
                return [
                    'id'   => $service->id,
                    'name' => $service->name,
                    'status' => $service->status,
                ];
            }),
            'vehicle_types' => $this->vehicle_types?->map(function($vehicleTypes){
                return [
                    'id'   => $vehicleTypes->id,
                    'name' => $vehicleTypes->name,
                     'status' => $vehicleTypes->status,
                ];
            }),

        ];
    }
}
