<?php

namespace Modules\Ticket\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class MessageResource extends BaseResource
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
        $message = [
            'id' => $this->id,
            'ticket_id' => $this->ticket_id,
            'message' => $this->message,
            'created_by_id' => $this->created_by_id,
            'note' => $this->note,
            'created_by' => null,
            'created_at' => $this->created_at,
            'media' => $this->media?->pluck('original_url')?->toArray(),
        ];

        if($this->created_by) {
            $message['created_by'] = [
                'name' => $this->created_by?->name,
                'image_url' => $this->created_by?->profile_image?->original_url ?? null
            ];
        }

        return $message;
    }
}
