<?php

namespace Modules\Taxido\Http\Resources\Drivers;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class DocumentResource  extends BaseResource
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
            'slug' => $this->slug,
            'type' => $this->type,
            'is_required' => $this->is_required,
            'need_expired_date' => $this->need_expired_date,
            'status' => $this->status
        ];
    }
}
