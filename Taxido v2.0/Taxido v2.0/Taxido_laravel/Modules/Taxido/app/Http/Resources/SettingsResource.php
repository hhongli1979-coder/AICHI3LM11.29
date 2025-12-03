<?php

namespace Modules\Taxido\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\BaseResource;

class SettingsResource extends BaseResource
{
  protected $showSensitiveAttributes = true;

  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    $values = $this['taxido_values'];
    return [
      'taxido_values' => [
        'general' => [
          'greetings' => $values['general']['greetings'] ?? null,
          'footer_branding_hashtag' => $values['general']['footer_branding_hashtag'] ?? null,
          'footer_branding_attribution' => $values['general']['footer_branding_attribution'] ?? null,
          'ambulance_image' => asset($values['general']['ambulance_image']),
          'ambulance_map_icon' => asset($values['general']['ambulance_map_icon'])
        ],
        'setting' => [
          'app_version' => $values['setting']['app_version'] ?? null,
          'driver_app_version' => $values['setting']['driver_app_version'] ?? null,
          'splash_screen_url' => $values['setting']['splash_screen_url'] ?? null,
          'driver_splash_screen_url' => $values['setting']['driver_splash_screen_url'] ?? null,
          'rider_privacy_policy' => $values['setting']['rider_privacy_policy'] ?? null,
          'driver_privacy_policy' => $values['setting']['driver_privacy_policy'] ?? null,
        ],
        'location' => [
          'map_provider' => $values['location']['map_provider'] ?? null,
          'radius_per_second' => $values['location']['radius_per_second'] ?? null,
          'google_map_api_key' => $values['location']['google_map_api_key'] ?? null,
        ],
        'activation' => $values['activation'] ?? null,
        'onboarding' => $values['onboarding'] ?? null,
        'driver_commission' => $values['driver_commission'] ?? null,
        'wallet' => $values['wallet'] ?? null,
        'ride' => $values['ride'] ?? null,
        'referral' => $values['referral'] ?? null,
        'ads' => $values['ads'] ?? null,
      ]
    ];
  }
}
