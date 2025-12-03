<?php

namespace Modules\Taxido\Http\Traits;

use Exception;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Events\ReferralBonusCreditedEvent;
use Modules\Taxido\Models\Ride;
use Modules\Taxido\Models\Rider;
use Modules\Taxido\Models\Driver;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\ReferralBonus;

trait ReferralTrait
{
  use WalletPointsTrait;

  /**
   * Apply referral code during user registration
   */
  public function applyReferralCode($referralCode, $newUser, string $userType = 'rider'): bool
  {

    try {
      $cabSettings = getTaxidoSettings();
      if (!($cabSettings['activation']['referral_enable'] ?? false)) {
        return false;
      }

      if (!in_array($userType, ['rider', 'driver'])) {
        throw new ExceptionHandler('Invalid user type. Must be rider or driver.', 400);
      }

      if ($newUser->referral_code === $referralCode) {
        throw new ExceptionHandler('You cannot refer yourself.', 400);
      }

      $referrer = null;
      if ($userType === 'rider') {
        $referrer = Rider::where('referral_code', $referralCode)
          ->where('status', true)
          ->first();
      } else {
        $referrer = Driver::where('referral_code', $referralCode)
          ->where('status', true)
          ->first();
      }

      if (!$referrer) {
        throw new ExceptionHandler('Invalid referral code or referrer not found.', 400);
      }

      $referrerType = $referrer instanceof Rider ? 'rider' : 'driver';
      if ($referrerType !== $userType) {
        throw new ExceptionHandler('Referral code belongs to a different user type.', 400);
      }

      $newUser->referred_by_id = $referrer->id;
      $newUser->save();
      ReferralBonus::create([
        'referrer_id' => $referrer->id,
        'referred_id' => $newUser->id,
        'referrer_type' => $userType,
        'referred_type' => $userType,
        'bonus_amount' => 0,
        'referred_bonus_amount' => 0,
        'ride_amount' => 0,
        'referrer_percentage' => 0,
        'referred_percentage' => 0,
        'status' => 'pending',
      ]);

      return true;

    } catch (Exception $e) {

      throw new ExceptionHandler($e->getMessage(), $e->getCode());
    }
  }

  /**
   * Calculate bonus amounts based on ride and settings
   */
  public function calculateBonuses(float $rideAmount, array $settings): array
  {
    try {
      if ($rideAmount <= 0) {
        throw new ExceptionHandler('Ride amount must be greater than zero.', 400);
      }

      $referrerPercentage = $settings['referrer_bonus_percentage'] ?? 10;
      $referredPercentage = $settings['referred_bonus_percentage'] ?? 5;
      $referrerPercentage = max(0, min(100, $referrerPercentage));
      $referredPercentage = max(0, min(100, $referredPercentage));
      $referrerBonus = ($rideAmount * $referrerPercentage) / 100;
      $referredBonus = ($rideAmount * $referredPercentage) / 100;

      $result = [
        'referrer_bonus' => round($referrerBonus, 2),
        'referred_bonus' => round($referredBonus, 2),
        'referrer_percentage' => $referrerPercentage,
        'referred_percentage' => $referredPercentage,
      ];

      return $result;

    } catch (Exception $e) {

      throw new ExceptionHandler($e->getMessage(), $e->getCode());
    }
  }

  /**
   * Check if referred user is eligible for bonus
   */
  public function isEligibleForReferralBonus($user, float $rideAmount): bool
  {
    $userId = $user->id ?? null;
    $userType = $user instanceof Rider ? 'rider' : 'driver';
    try {
      $cabSettings = getTaxidoSettings();
      $referralEnabled = $cabSettings['activation']['referral_enable'] ?? false;
      if (!$referralEnabled) {
        return false;
      }

      $minimumAmount = $cabSettings['referral']['minimum_ride_amount'] ?? 250;
      if ($rideAmount < $minimumAmount) {
        return false;
      }

      if (!$user->referred_by_id) {
        return false;
      }

      $completedStatusId = getRideStatusIdBySlug('completed');
      if ($userType === 'rider') {
        $completedRidesCount = $user->rides()->where('ride_status_id', $completedStatusId)->count();
      } else {
        $completedRidesCount = Ride::where('driver_id', $user->id)
          ->where('ride_status_id', $completedStatusId)
          ->count();
      }

      if ($completedRidesCount > 1) {
        return false;
      }

      $existingBonus = ReferralBonus::where('referred_id', $user->id)
        ->where('referred_type', $userType)
        ->where('status', 'credited')
        ->exists();

      $eligible = !$existingBonus;
      return $eligible;

    } catch (Exception $e) {

      throw new ExceptionHandler($e->getMessage(), $e->getCode());
    }
  }

  /**
   * Credit bonuses to both referrer and referred
   */
  public function creditBonuses($bonus): void
  {
    try {


      $symbol = $bonus?->currency_symbol;
      if ($bonus->referrer_type === 'rider') {
        $this->creditRiderWallet(
          $bonus->referrer_id,
          $bonus->bonus_amount,
          "Referral bonus for referring {$bonus->referred_type} (Ride: {$symbol}{$bonus->ride_amount})"
        );
      } else {
        $this->creditDriverWallet(
          $bonus->referrer_id,
          $bonus->bonus_amount,
          "Referral bonus for referring {$bonus->referred_type} (Ride: {$symbol}{$bonus->ride_amount})"
        );
      }

      if ($bonus->referred_type === 'rider') {
        $this->creditRiderWallet(
          $bonus->referred_id,
          $bonus->referred_bonus_amount,
          "Welcome bonus for being referred by {$bonus->referrer_type} (Ride: {$symbol}{$bonus->ride_amount})"
        );
      } else {
        $this->creditDriverWallet(
          $bonus->referred_id,
          $bonus->referred_bonus_amount,
          "Welcome bonus for being referred by {$bonus->referrer_type} (Ride: {$symbol}{$bonus->ride_amount})"
        );
      }

      $bonus->update([
        'status' => 'credited',
        'credited_at' => now(),
      ]);


      // dispatch(fn() => event(new ReferralBonusCreditedEvent($bonus)))->afterResponse();

    } catch (Exception $e) {

      throw new ExceptionHandler($e->getMessage(), $e->getCode());
    }
  }

  /**
   * Main entry: Credit referral bonus after ride completion
   */
  public function creditReferralBonus($ride, string $referredType = 'rider'): bool
  {

    try {

      if(!$ride) {
        return false;
      }

      $cabSettings = getTaxidoSettings();
      $referralEnabled = $cabSettings['activation']['referral_enable'] ?? false;

      if (!$referralEnabled) {
        return false;
      }


      if($referredType === 'rider') {
        $referredId = $ride->rider_id;
        $referredUser = Rider::find($referredId);
      } else {
        $referredId = $ride->driver_id;
        $referredUser = Driver::find($referredId);
      }

      if (!$referredUser) {
        return false;
      }

      $minimumAmount = $cabSettings['referral']['minimum_ride_amount'] ?? 250;
      $rideAmount = $ride->sub_total;
      if ($rideAmount > 0 && $rideAmount < $minimumAmount) {
        return false;
      }

      if ($rideAmount > 0 && !$this->isEligibleForReferralBonus($referredUser, $rideAmount)) {
        return false;
      }

      $bonus = ReferralBonus::where('referred_id', $referredId)
        ->where('referred_type', $referredType)
        ->where('status', 'pending')
        ->first();

      if (!$bonus) {
        return false;
      }


      if ($rideAmount > 0) {
        $referralSettings = $cabSettings['referral'] ?? [];
        $bonuses = $this->calculateBonuses($rideAmount, $referralSettings);
        $updateData = [
          'bonus_amount' => $bonuses['referrer_bonus'],
          'referred_bonus_amount' => $bonuses['referred_bonus'],
          'ride_amount' => $rideAmount,
          'currency_symbol' => $ride?->currency_symbol ?? getDefaultCurrencySymbol(),
          'referrer_percentage' => $bonuses['referrer_percentage'],
          'referred_percentage' => $bonuses['referred_percentage'],
        ];

        $bonus->update($updateData);
        $this->creditBonuses($bonus);
        return true;
      }

      return false;

    } catch (Exception $e) {

      throw new ExceptionHandler($e->getMessage(), $e->getCode());
    }
  }
}
