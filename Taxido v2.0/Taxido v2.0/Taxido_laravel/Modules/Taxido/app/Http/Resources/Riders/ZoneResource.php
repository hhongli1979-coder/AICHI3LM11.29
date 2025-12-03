<?php

namespace Modules\Taxido\Http\Resources\Riders;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class ZoneResource  extends BaseResource
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
            'name' => $this->name,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'currency_symbol' => $this->currency?->symbol,
            'code' => $this->currency?->code,
        ];
    }
}
