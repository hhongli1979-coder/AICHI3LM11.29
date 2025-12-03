<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class CountriesResource  extends BaseResource
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
      'calling_code' => $this->calling_code,
      'flag' => $this->flag,
    ];
  }
}
