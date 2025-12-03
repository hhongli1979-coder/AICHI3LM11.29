<?php

namespace Modules\Taxido\Http\Resources\FleetManagers;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;
use Modules\Taxido\Http\Resources\Drivers\DocumentResource;

class FleetDocumentResource  extends BaseResource
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
            'status' => $this->status,
            'expired_at' => $this->expired_at,
            'document_image_url' => $this->document_image?->original_url,
            'document' => new DocumentResource($this->document ?? []),
        ];
    }
}
