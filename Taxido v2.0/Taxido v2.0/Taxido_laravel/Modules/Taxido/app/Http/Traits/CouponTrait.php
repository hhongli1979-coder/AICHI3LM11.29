<?php

namespace Modules\Taxido\Http\Traits;

use Exception;
use Carbon\Carbon;
use Modules\Taxido\Models\Ride;
use Modules\Taxido\Models\Coupon;
use Modules\Taxido\Models\VehicleTypeZone;

trait CouponTrait
{
  public function getCoupon($code)
  {
    return Coupon::where([['code', 'LIKE', '%' . $code . '%'], ['status', true]])
      ->orWhere('id', 'LIKE', '%' . $code . '%')
      ->whereNull('deleted_at')
      ->first();
  }

  public function updateCouponUsage($coupon_id)
  {
    return Coupon::findOrFail($coupon_id)->decrement('usage_per_coupon');
  }

  public function isApplicable($coupon, $request)
  {
    $service_id = $request?->service_id ?? null;
    $vehicle_type_id = $request?->vehicle_type_id ?? null;
    if($request->ride_id) {
      $ride = Ride::findOrFail($request->ride_id);
      $service_id = $ride?->service_id;
      $vehicle_type_id = $ride?->vehicle_type_id;
    }

    if($service_id) {
      $selectedServiceIds = $coupon?->services()?->pluck('service_id')?->toArray();
      if (!in_array($service_id, $selectedServiceIds ?? [])) {
        throw new Exception(__("#{$coupon?->code} code not applicable selected service."), 422);
      }
    }

    if($vehicle_type_id) {
      $selectedVehicleTypeIds = $coupon?->vehicle_types()?->pluck('vehicle_type_id')?->toArray();
      if (!in_array($vehicle_type_id, $selectedVehicleTypeIds ?? [])) {
        throw new Exception(__("#{$coupon?->code} code not applicable for selected vehicle type."), 422);
      }
    }

    return true;
  }

  public function isValidCoupon($coupon, $request)
  {
    $ride = null;
    if (couponIsEnable()) {
      $rider_id = getCurrentUserId();
      if($request->ride_id) {
        $ride = Ride::findOrFail($request->ride_id);
        if ($ride) {
          $amount = $ride?->total;
        }
      }

      if(!$ride) {
        $locations = $request->locations;
        $originLat = head($locations)['lat'];
        $originLng = head($locations)['lng'];
        $zone = getZoneByPoint($originLat, $originLng)?->first();
        $rideDistance = calculateRideDistance($locations, $zone?->distance_type);
        if($request->vehicle_type_id) {
          $vehicleTypeZone = VehicleTypeZone::where('vehicle_type_id', $request->vehicle_type_id)?->where('zone_id', $zone?->id)?->first();
          $charge = $this->calVehicleTypeZonePrice($rideDistance, $vehicleTypeZone, $request);
        }

        $amount = $charge['total'] ?? 0;
      }

      if ($coupon && $this->isValidSpend($coupon, $amount)) {
        if ($this->isCouponUsable($coupon, $rider_id) && $this->isNotExpired($coupon)) {
          if (!$coupon?->is_apply_all) {
            if ($this->isApplicable($coupon, $request)) {
              return $amount;
            }
          }
          return $amount;
        }
      }

      throw new Exception(__('taxido::static.coupons.to_apply_coupon', [
        'code' => $coupon->code,
        'min_ride_fare' => $coupon->min_ride_fare
      ]), 422);
    }

    throw new Exception(__('taxido::static.coupons.coupon_feature_disabled'), 422);
  }

  public function isCouponUsable($coupon, $rider)
  {
    if (!$coupon->is_unlimited) {
      if ($coupon->usage_per_customer) {
        if (!$rider) {
          throw new Exception(__('taxido::static.coupons.login_required', [
            'code' => $coupon->code
          ]), 422);
        }

        $getCountUsedPerRider = $this->getCountUsedPerRider($coupon->id, $rider);
        if ($coupon->usage_per_customer <= $getCountUsedPerRider) {
          throw new Exception(__('taxido::static.coupons.coupon_max_usage_reached', [
            'couponCode' => $coupon->code,
            'usagePerCustomer' => $coupon->usage_per_customer
          ]), 422);
        }
      }

      if ($coupon->usage_per_coupon <= 0) {
        throw new Exception(__('taxido::static.coupons.usage_limit_reached', ['code' => $coupon->code, 'usage' => $coupon->usage_per_coupon]), 422);
      }
    }
    return true;
  }

  public function getCountUsedPerRider($coupon_id, $rider_id)
  {
    return Ride::where([['rider_id', $rider_id], ['coupon_id', $coupon_id]])?->count();
  }

  public function isValidSpend($coupon, $amount)
  {
    return $amount >= $coupon->min_ride_fare;
  }

  public function isNotExpired($coupon)
  {
    if ($coupon->is_expired) {
      if (!$this->isOptimumDate($coupon)) {
        throw new Exception(__(
          'taxido::static.coupons.date_range',
          ['code' => $coupon->code, 'start_date' => $coupon->start_date, 'end_date' => $coupon->end_date]
        ), 422);
      }
    }

    return true;
  }

  public function isOptimumDate($coupon)
  {
    $currentDate = Carbon::now()->format('Y-m-d');
    if (max(min($currentDate, $coupon->end_date), $coupon->start_date) == $currentDate) {
      return true;
    }

    return false;
  }

  public function fixedDiscount($subtotal, $couponAmount)
  {
    if ($subtotal >= $couponAmount && $subtotal > 0) {
      return $couponAmount;
    }

    return 0;
  }

  public function percentageDiscount($subtotal, $couponAmount)
  {
    if ($subtotal >= $couponAmount && $subtotal > 0) {
      return ($subtotal * $couponAmount) / 100;
    }

    return 0;
  }
}
