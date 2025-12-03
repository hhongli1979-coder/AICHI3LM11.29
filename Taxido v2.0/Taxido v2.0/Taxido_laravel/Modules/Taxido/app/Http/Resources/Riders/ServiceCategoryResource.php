<?php

namespace Modules\Taxido\Http\Resources\Riders;

use App\Http\Resources\BaseResource;
use Illuminate\Http\Request;

class ServiceCategoryResource extends BaseResource
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
      'slug' => $this->slug,
      'service_id' => $this->service_id,
      'type' => $this->type,
      'service_type' => $this->service?->type,
      'service_category_image_url' => $this->service_category_image?->original_url,
    ];
  }
}
