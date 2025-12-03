<?php

namespace Modules\Taxido\Http\Resources\Riders;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class BidResource  extends BaseResource
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
            'id' => $this->id,
            'ride_request_id' => $this->ride_request_id,
            'amount' => $this->amount,
            'status' => $this->status,
            'service_category_type' => $this->service_category?->type,
            'created_at' => $this->created_at,
            'driver' => [
                'id' => $this->driver?->id,
                'name' => $this->driver?->name,
                'profile_image_url' => $this->driver?->profile_image?->original_url,
                'rating_count' => $this->driver?->rating_count,
                'review_count' => $this->driver?->review_count,
            ],
            'vehicle_info' => [
                'vehicle_type_id' => $this->driver?->vehicle_info?->vehicle_type_id,
                'vehicle_type_image_url' => $this->driver?->vehicle_info?->vehicle?->vehicle_image?->original_url,
                'vehicle_type_map_icon_url' => $this->driver?->vehicle_info?->vehicle?->vehicle_map_icon?->original_url,
                'name' => $this->driver?->vehicle_info?->name,
                'description' => $this->driver?->vehicle_info?->description,
                'plate_number' => $this->driver?->vehicle_info?->plate_number,
                'color' => $this->driver?->vehicle_info?->color,
                'model' => $this->driver?->vehicle_info?->model,
                'seat' => $this->driver?->vehicle_info?->seat,
            ]
        ];
    }
}
