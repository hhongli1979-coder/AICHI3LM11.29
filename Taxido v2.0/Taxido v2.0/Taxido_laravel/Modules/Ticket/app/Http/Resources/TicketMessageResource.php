<?php

namespace Modules\Ticket\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class TicketMessageResource extends BaseResource
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
            'ticket_number' => $this->ticket_number,
            'subject' => $this->subject,
            'status' => $this->status,
            'note' => $this->note,
            'messages' => MessageResource::collection($this->messages),
        ];
    }
}
