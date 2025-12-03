<?php

namespace Modules\Taxido\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Taxido\Models\TaxidoSetting;

class TaxidoSettingSeeder extends Seeder
{
        /**
         * Run the database seeds.
         *
         * @return void
         */
        public function run()
        {
                $values = [
                        'general' => [
                                'footer_branding_hashtag' => '#GoTaxido',
                                'footer_branding_attribution' => '❤️ Made by Pixelstrap',
                                'greetings' => [
                                        'Hello',
                                        '<p>🌈 Let’s make today productive and successful! 🏆</p>',
                                ]
                        ],
                        'ride' => [
                                'ride_request_time_driver' => 30,
                                'rental_ambulance_request_time' => 30,
                                'increase_amount_range' => 10,
                                'weight_unit' => 'kg',
                                'find_driver_time_limit' => 3,
                                'schedule_ride_request_lead_time' => 15,
                                'driver_max_online_hours' => 12,
                                'bidding_request_time_limit' => 10,
                                'min_intracity_radius' => 30000,
                                'max_bidding_fare_driver' => 10,
                                'parcel_weight_limit' => 10,
                                'country_code' => 1,
                                'distance_unit' => 'km',
                                'schedule_min_hour_limit' => 3,
                                'maximum_seat' => 10,
                        ],
                        'activation' => [
                                'coupon_enable' => '1',
                                'driver_subscription' => '1',
                                'driver_verification' => '1',
                                'fleet_verification' => '1',
                                'fleet_vehicle_verification' => '1',
                                'online_payments' => '1',
                                'cash_payments' => '1',
                                'rider_wallet' => '1',
                                'ride_otp' => '1',
                                'parcel_otp' => '1',
                                'driver_tips' => '1',
                                'referral_enable' => '1',
                                'bidding' => '1',
                                'force_update' => '1',
                                'airport_price_enable' => '1',
                                'surge_price_enable' => '1',
                                'peak_zone_enable' => '1',
                                'driver_incentive_enable' => '1',
                                'additional_minute_charge' => '1',
                                'additional_distance_charge' => '1',
                                'additional_weight_charge' => '1',
                                'sos_enable' => '1',
                                'full_address_location' => '1'
                        ],
                        'wallet' => [
                                'wallet_denominations' => 50,
                                'tip_denominations' => 50,
                                'driver_min_wallet_balance' => 10
                        ],
                        'driver_commission' => [
                                'min_withdraw_amount' => 500,
                                'status' => '0',
                                'fleet_commission_type' => 'percentage',
                                'fleet_commission_rate' => 10,
                                'ambulance_per_km_charge' => 1,
                                'ambulance_commission_type' => 'percentage',
                                'ambulance_commission_rate' => 20,
                                'ambulance_per_minute_rate' => 10,
                        ],
                        'referral' => [
                                'minimum_ride_amount' => '100',
                                'referrer_bonus_percentage' => 10,
                                'referred_bonus_percentage' => 5,
                        ],
                        'location' => [
                                'google_map_api_key' => '',
                                'map_provider' => 'google_map',
                                'radius_meter' => '3000',
                                'radius_per_second' => '10',
                        ],
                        'ads' => [
                                'native_enable' => '1',
                                'android_google_ads_id' => null,
                                'ios_google_ads_id' => null,
                                'native_ios_unit_id' => null,
                                'native_android_unit_id' => null
                        ],
                        'setting' => [
                               'driver_app_version' => env('APP_VERSION'),
                               'app_version' => env('APP_VERSION'),
                               'splash_screen_id' => getAttachmentId('splash.png'),
                               'splash_driver_screen_id' => getAttachmentId('splash_driver.png'),
                               'rider_privacy_policy' => null,
                               'driver_privacy_policy' => null,
                        ],
                ];

                TaxidoSetting::updateOrCreate(['taxido_values' => $values]);
        }
}
