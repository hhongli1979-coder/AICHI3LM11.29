<?php

namespace Modules\Ticket\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class TicketResource extends BaseResource
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
      'ticket_number' => $this->ticket_number,
      'profile_image_url' => $this->user?->profile_image?->original_url,
      'created_at' =>  $this->created_at,
      'subject' => $this->subject,
      'department' => [
        'id' => $this->department?->id,
        'name' => $this->department?->name,
      ],
      'priority' => [
        'id' => $this->priority?->id,
        'name' => $this->priority?->name,
        'color' => $this->priority?->color,
      ],
      'ticketStatus' => [
        'name' => $this->ticketStatus?->name
      ],
      'messages' => MessageResource::collection($this?->messages)
    ];
  }
}
