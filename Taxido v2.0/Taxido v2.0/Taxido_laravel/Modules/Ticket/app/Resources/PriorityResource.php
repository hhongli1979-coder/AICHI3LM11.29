<?php

namespace Modules\Ticket\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class PriorityResource extends BaseResource
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
      'slug' => $this->slug,
      'status' => $this->status,
    ];
  }
}
