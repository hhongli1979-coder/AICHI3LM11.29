<?php

namespace Modules\Taxido\Http\Resources\Riders;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class ServiceResource  extends BaseResource
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
      'is_primary' => $this->is_primary,
      'description' => $this->description,
      'status' => $this->status,
      'service_image_url' => $this->service_image?->original_url,
      'service_icon_url' => $this->service_icon?->original_url,
      'service_categories' => ServiceCategoryResource::collection($this->service_categories ?? []),
    ];
  }
}
