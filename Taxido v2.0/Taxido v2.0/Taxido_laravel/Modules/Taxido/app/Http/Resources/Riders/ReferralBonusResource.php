<?php

namespace Modules\Taxido\Http\Resources\Riders;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class ReferralBonusResource  extends BaseResource
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
    $referralBonus = [
      'id' => $this->id,
      'referrer_bonus_amount' => $this->bonus_amount,
      'referred_bonus_amount' => $this->referred_bonus_amount,
      'ride_amount' => $this->ride_amount,
      'referrer_percentage' => $this->referrer_percentage,
      'referred_percentage' => $this->referred_percentage,
      'referrer_type' => $this->referrer_type,
      'referred_type' => $this->referred_type,
      'status' => $this->status,
      'credited_at' => $this->credited_at,
      'referrer' => null,
      'referred' => null,
    ];

    if($this->referred) {
      $referralBonus['referred'] = [
        'id' => $this->referred?->id ?? null,
        'name' => $this->referred?->name,
        'profile_image_url' =>  $this->referred?->profile_image?->original_url ?? null,
      ];
    }

    if($this->referrer) {
      $referralBonus['referrer'] = [
        'id' => $this->referrer?->id ?? null,
        'name' => $this->referrer?->name,
        'profile_image_url' =>  $this->referrer?->profile_image?->original_url ?? null,
      ];
    }

    return $referralBonus;
  }
}
