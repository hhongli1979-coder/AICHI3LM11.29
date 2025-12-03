<?php

namespace Modules\Taxido\Http\Traits;

use Exception;
use Modules\Taxido\Models\Bid;
use Modules\Taxido\Models\SurgePrice;
use Modules\Taxido\Models\VehicleType;
use Modules\Taxido\Enums\ServicesEnum;
use Modules\Taxido\Enums\BidStatusEnum;
use Modules\Taxido\Models\HourlyPackage;
use Modules\Taxido\Models\VehicleTypeZone;
use Modules\Taxido\Models\VehicleSurgePrice;
use Modules\Taxido\Enums\ServiceCategoryEnum;

trait BiddingTrait
{
    public function calHourlyPackageVehicleTypePrice($hourly_package_id, $vehicle_type_id, $zone_id = null)
    {
        $tax = 0;
        $total = 0;
        $subTotal = 0;
        $duration =  0;
        $commission = 0;
        $surgePrice = 0.0;
        $totalDistance = 0;
        $driverCommission = 0;
        $additionalMinuteCharge = 0;
        $additionalWeightCharge = 0.0;
        $additionalDistanceCharge = 0.0;
        $cabSettings = getTaxidoSettings();
        $hourlyPackage = HourlyPackage::findOrFail($hourly_package_id);
        $vehicleTypeZone = VehicleTypeZone::where('vehicle_type_id', $vehicle_type_id)?->where('zone_id', $zone_id)?->first();
        $platform_fee = (float) getPlatformFee();
        $baseFareCharge = (float) $vehicleTypeZone?->base_fare_charge;
        $baseDistance = (float) $vehicleTypeZone?->base_distance;
        $perDistanceCharge = $vehicleTypeZone?->per_distance_charge;
        $perMinuteCharge = $vehicleTypeZone?->per_minute_charge;
        $commissionType = $vehicleTypeZone?->commission_type ?? 'fixed';
        $commissionRate = $vehicleTypeZone?->commission_rate ?? 0;
        if ($vehicleTypeZone) {
            if ($hourlyPackage?->distance) {
                if ($vehicleTypeZone?->zone?->distance_type != $hourlyPackage?->distance_type) {
                    if ($hourlyPackage?->distance_type == 'mile') {
                        if ($vehicleTypeZone->zone?->distance_type == 'km') {
                            $totalDistance = round($hourlyPackage->distance * 1.60934, 2);
                        }
                    } elseif ($hourlyPackage?->distance_type == 'km') {
                        if ($vehicleTypeZone->zone?->distance_type == 'mile') {
                            $totalDistance = round($hourlyPackage?->distance * 0.621371, 2);
                        }
                    }
                } else {
                    $totalDistance = $hourlyPackage->distance;
                }
            }

            if ($hourlyPackage?->hour) {
                $totalDuration = ($hourlyPackage?->hour * 60);
            }

            if ($cabSettings['activation']['additional_distance_charge']) {
                if ($totalDistance > $baseDistance) {
                    $additionalDistanceCharge = (($totalDistance - $baseDistance) * $perDistanceCharge);
                }
            }

            if ($cabSettings['activation']['additional_minute_charge']) {
                if ($totalDuration && $perMinuteCharge) {
                    $additionalMinuteCharge = $perMinuteCharge * $totalDuration;
                }
            }

            $subTotal = $baseFareCharge + $additionalDistanceCharge + $additionalMinuteCharge + $additionalWeightCharge;
            if ($subTotal) {
                if ($vehicleTypeZone?->is_allow_tax) {
                    $taxRate = getTaxRateById($vehicleTypeZone?->tax_id) ?? 0;
                    $platFormSubTotal = $subTotal + $platform_fee;
                    if ($taxRate && $platFormSubTotal) {
                        $tax = (($platFormSubTotal * $taxRate) / 100);
                    }
                }

                $commission = $commissionRate;
                if ($commissionType == 'percentage') {
                    if ($commissionRate) {
                        $commission = (($subTotal * $commissionRate) / 100);
                    }
                }

                $total = $subTotal + $tax + $commission + $platform_fee;
                $driverCommission = $subTotal - $commission;
            }

            return [
                'duration' => $duration,
                'total_distance' => $totalDistance,
                'distance_unit' => $hourlyPackage?->distance_type,
                'base_distance' => $baseDistance,
                'base_fare_charge' => round($baseFareCharge, 2),
                'additional_distance_charge' =>  round($additionalDistanceCharge, 2),
                'additional_minute_charge' => round($additionalMinuteCharge, 2),
                'additional_weight_charge' => round($additionalWeightCharge, 2),
                'platform_fee' => round($platform_fee, 2),
                'sub_total' => round($subTotal, 2),
                'tax' => round($tax, 2),
                'commission' => round($commission, 2),
                'driver_commission' => round($driverCommission, 2),
                'total' => round($total, 2)
            ];
        }
    }

    public function calVehicleTypeZonePrice($rideDistance, $vehicleTypeZone, $request = null)
    {
        $tax = 0;
        $total = 0;
        $subTotal = 0;
        $commission = 0;
        $surgePrice = 0.0;
        $maxBiddingFaireAmount = 0;
        $minBiddingFaireAmount = 0;
        $driverCommission = 0;
        $additionalMinuteCharge = 0;
        $additionalWeightCharge = 0.0;
        $additionalDistanceCharge = 0.0;
        $platform_fee = (float) getPlatformFee();
        $baseFareCharge = (float) $vehicleTypeZone?->base_fare_charge;
        $baseDistance = (float) $vehicleTypeZone?->base_distance;
        $totalDistance = (float) $rideDistance['distance_value'] ?? 0;
        $duration =  $rideDistance['duration'] ?? '0';
        $totalDuration = (int) filter_var($duration, FILTER_SANITIZE_NUMBER_INT) ?? 0;
        $perDistanceCharge = $vehicleTypeZone?->per_distance_charge;
        $perMinuteCharge = $vehicleTypeZone?->per_minute_charge;
        $perWeightCharge = $vehicleTypeZone?->per_weight_charge;
        $commissionType = $vehicleTypeZone?->commission_type ?? 'fixed';
        $commissionRate = $vehicleTypeZone?->commission_rate ?? 0;
        $cabSettings = getTaxidoSettings();
        $preferenceCharge = 0.0;

        if ($request) {
            $service = getServiceById($request?->service_id);
            if ($cabSettings['activation']['surge_price_enable']) {
                if ($request?->current_time) {
                    $surgePrice = $this->getSurgePriceAmount($request?->current_time, $vehicleTypeZone?->zone_id, $vehicleTypeZone?->vehicle_type_id);
                    $baseFareCharge += $surgePrice;
                }
            }

            if ($service?->type == ServicesEnum::PARCEL) {
                if (!$request->weight) {
                    throw new Exception("The weight field cannot be empty for parcel bookings.", 422);
                }

                if ($cabSettings['activation']['additional_weight_charge'] && $request->weight) {
                    $weight = $request->weight;
                    if ($weight) {
                        $additionalWeightCharge = $weight * $perWeightCharge;
                    }
                }
            } elseif ($service?->type == ServicesEnum::CAB) {
                $serviceCategoryType = getServiceCategoryTyeById($request->service_category_id);
                if ($serviceCategoryType == ServiceCategoryEnum::PACKAGE) {
                    if (!$request->hourly_package_id) {
                        throw new Exception("The hourly package id is required.", 422);
                    }

                    $hourlyPackage = HourlyPackage::findOrFail($request->hourly_package_id);
                    if ($hourlyPackage?->distance) {
                        if ($vehicleTypeZone->zone?->distance_type != $hourlyPackage?->distance_type) {
                            if ($hourlyPackage?->distance_type == 'mile') {
                                if ($vehicleTypeZone->zone?->distance_type == 'km') {
                                    $totalDistance = round($hourlyPackage->distance * 1.60934, 2);
                                } elseif ($hourlyPackage?->distance_type == 'km') {
                                    if ($vehicleTypeZone->zone?->distance_type == 'mile') {
                                        $totalDistance = round($hourlyPackage?->distance * 0.621371, 2);
                                    }
                                }
                            }
                        }
                    }

                    if ($hourlyPackage?->hour) {
                        $totalDuration = ($hourlyPackage?->hour * 60);
                    }
                }
            }

            // Calculate preference charge
            if ($request->preferences && is_array($request->preferences)) {
                $assignedPreferences = [];
                foreach ($vehicleTypeZone->preferences as $preference) {
                    $assignedPreferences[$preference->id] = $preference->pivot->price;
                }
                foreach ($request->preferences as $prefId) {
                    if (isset($assignedPreferences[$prefId])) {
                        $preferenceCharge += $assignedPreferences[$prefId];
                    }
                }
            }
        }

        if ($cabSettings['activation']['additional_distance_charge']) {
            if ($totalDistance > $baseDistance) {
                $additionalDistanceCharge = (($totalDistance - $baseDistance) * $perDistanceCharge);
            }
        }

        if ($cabSettings['activation']['additional_minute_charge']) {
            if ($totalDuration && $perMinuteCharge) {
                $additionalMinuteCharge = $perMinuteCharge * $totalDuration;
            }
        }

        if ($cabSettings['activation']['airport_price_enable']) {
            if ($vehicleTypeZone?->is_allow_airport_charge) {
                $airportIds = getAirportByPoints($rideDistance['locations']);
                if (!empty($airportIds)) {
                    $baseFareCharge = $baseFareCharge * $vehicleTypeZone?->airport_charge_rate;
                }
            }
        }

        $subTotal = $baseFareCharge + $additionalDistanceCharge + $additionalMinuteCharge + $additionalWeightCharge;
        if ($subTotal) {
            if ($vehicleTypeZone?->is_allow_tax) {
                $taxRate = getTaxRateById($vehicleTypeZone?->tax_id) ?? 0;
                $platFormSubTotal = $subTotal + $platform_fee;
                if ($taxRate && $platFormSubTotal) {
                    $tax = (($platFormSubTotal * $taxRate) / 100);
                }
            }

            $commission = $commissionRate;
            if ($commissionType == 'percentage') {
                if ($commissionRate) {
                    $commission = (($subTotal * $commissionRate) / 100);
                }
            }

            $total = $subTotal + $tax + $commission + $platform_fee + $preferenceCharge;
            $driverCommission = $subTotal - $commission;
        }

        if ($request) {
            if ((int) $cabSettings['activation']['bidding']) {
                $service = getServiceById($request?->service_id);
                $vehicleType = VehicleType::where('id', $vehicleTypeZone?->vehicle_type_id)->whereNull('deleted_at')?->first();
                $serviceCategory = getServiceCategoryTyeById($request->service_category_id);
                if ($service?->type == ServicesEnum::CAB || $service?->type == ServicesEnum::FREIGHT) {
                    if ($serviceCategory != ServiceCategoryEnum::RENTAL && $serviceCategory != ServiceCategoryEnum::PACKAGE) {
                        $bidFare = $this->getMaxRideFareAmount($total);
                        $minBiddingFaireAmount = $bidFare['min_fare'];
                        $maxBiddingFaireAmount = $bidFare['max_fare'];
                    } elseif ($serviceCategory == ServiceCategoryEnum::PACKAGE) {
                        if ($request->hourly_package_id) {
                            $hourlyPackage = HourlyPackage::findOrFail($request->hourly_package_id);
                            $data = [
                                'distance' => $hourlyPackage->distance,
                                'distance_unit' => $hourlyPackage->distance_type,
                                'hours' => $hourlyPackage->hour,
                                'service_id' => $request->service_id,
                                'service_category_id' => $request->service_category_id,
                                'vehicle_type_id' => $vehicleTypeZone?->vehicle_type_id,
                                'hourly_package_id' => $request->hourly_package_id,
                            ];

                            if ($request instanceof \Illuminate\Database\Eloquent\Model) {
                                foreach ($data as $key => $value) {
                                    $request->setAttribute($key, $value);
                                }
                            } elseif ($request instanceof \Illuminate\Http\Request) {
                                $request->merge($data);
                            }

                            $distanceFairCharges = $this->calDistanceMinMaxCharges($request, $vehicleType);
                            $hourFairCharges = $this->calHourMinMaxCharges($request, $vehicleType);
                            $minBiddingFaireAmount = $distanceFairCharges['min_distance_charge'] + $hourFairCharges['min_hour_charge'];
                            $maxBiddingFaireAmount = $distanceFairCharges['max_distance_charge'] + $hourFairCharges['max_hour_charge'];
                        }
                    }

                } elseif($service?->type == ServicesEnum::PARCEL) {
                    $minBiddingFaireAmount = $total;
                    $maxBiddingFaireAmount = $this->getParcelMinMaxRideFareAmount($total)['max_fare'];
                } elseif($serviceCategory == ServiceCategoryEnum::RENTAL) {

                    $maxBiddingFaireAmount = $total;
                }
            } else {
                $minBiddingFaireAmount = $total;
                $maxBiddingFaireAmount = $total;
            }
        }

        return [
            'duration' => $duration,
            'total_distance' => $totalDistance,
            'distance_unit' => $rideDistance['distance_unit'],
            'base_distance' => $baseDistance,
            'base_fare_charge' => round($baseFareCharge, 2),
            'additional_distance_charge' =>  round($additionalDistanceCharge, 2),
            'additional_minute_charge' => round($additionalMinuteCharge, 2),
            'additional_weight_charge' => round($additionalWeightCharge, 2),
            'platform_fee' => round($platform_fee, 2),
            'preference_charge' => round($preferenceCharge, 2),
            'sub_total' => round($subTotal, 2),
            'tax' => round($tax, 2),
            'commission' => round($commission, 2),
            'driver_commission' => round($driverCommission, 2),
            'total' => round($total, 2),
            'min_bidding_faire_amount' => $minBiddingFaireAmount,
            'max_bidding_faire_amount' => $maxBiddingFaireAmount,
            'peak_zone_charge' => $request->peak_zone_charge ?? 0,

        ];
    }

    public function getSurgePriceAmount($current_time, $zone_id, $vehicle_type_id = null)
    {
        $cabSettings = getTaxidoSettings();
        if ($cabSettings['activation']['surge_price_enable']) {
            if ($current_time) {
                $currentTime = \Carbon\Carbon::parse($current_time ?? now())->format('H:i:s');
                $currentDay = strtolower(now()->format('l'));
                $surgePrice = SurgePrice::where('status', 1)
                    ->where('day', $currentDay)
                    ->where('start_time', '<=', $currentTime)
                    ->where('end_time', '>=', $currentTime)
                    ->value('id');

                if ($surgePrice) {
                    return VehicleSurgePrice::where('surge_price_id', $surgePrice)
                        ->where('zone_id', $zone_id)
                        ->when($vehicle_type_id, fn($query) => $query->where('vehicle_type_id', $vehicle_type_id))
                        ->value('amount') ?? 0;
                }
            }
        }

        return 0;
    }

    public function getMaxRideFareAmount($minAmount)
    {
        $settings = getTaxidoSettings();
        $maxAmount = $minAmount;
        if ((int) $settings['activation']['bidding']) {
            if ($minAmount) {
                $maxBidFareRate = $settings['ride']['max_bidding_fare_driver'];
                if ($maxBidFareRate) {
                    $maxBidFare  = ($minAmount * $maxBidFareRate) / 100;
                    $maxAmount = ($minAmount + $maxBidFare);
                }
            }
        }

        return ["min_fare" => $minAmount, "max_fare" => $maxAmount];
    }

    public function getParcelMinMaxRideFareAmount($minAmount)
    {


        $settings = getTaxidoSettings();
        $maxAmount = $minAmount;
        if ((int) $settings['activation']['bidding']) {
            if ($minAmount) {
                $maxBidFareRate = $settings['ride']['max_bidding_fare_driver'];
                if ($maxBidFareRate) {
                    $maxBidFare  = ($minAmount * $maxBidFareRate) / 100;
                    $maxAmount = ($minAmount + $maxBidFare);
                }
            }
        }



        return ["min_fare" => $minAmount, "max_fare" => $maxAmount];
    }

    public function calRentalVehicleCharges($request, $rentalVehicle)
    {
        $tax = 0;
        $total = 0;
        $subTotal = 0;
        $driverRent = 0;
        $commission = 0;
        $driverCommission = 0;

        $platform_fee = getPlatformFee();
        $driverPerDayCharge = $rentalVehicle?->driver_per_day_charge;
        $vehiclePerDayCharge = $rentalVehicle?->vehicle_per_day_price;
        $vehicleRent = $vehiclePerDayCharge ?? 0;
        if ($request?->no_of_days) {
            $vehicleRent = ((int) $vehiclePerDayCharge * (int) $request?->no_of_days);
            if ((int) $request?->is_with_driver) {
                if ($rentalVehicle?->allow_with_driver) {
                    $driverRent = ((int)$driverPerDayCharge * (int) $request?->no_of_days);
                }
            }
        }

        $subTotal = $vehicleRent + $driverRent;
        $vehicleTypeZone = VehicleTypeZone::where('vehicle_type_id', $rentalVehicle->vehicle_type_id)?->where('zone_id', $rentalVehicle->zone_id)?->first();
        $commissionType = $vehicleTypeZone?->commission_type ?? 'fixed';
        $commissionRate = $vehicleTypeZone?->commission_rate ?? 0;
        $commission = $commissionRate;
        if ($commissionType == 'percentage') {
            if ($commissionRate) {
                $commission = (($subTotal * $commissionRate) / 100);
            }
        }

        if ($vehicleTypeZone?->is_allow_tax) {
            $taxRate = getTaxRateById($vehicleTypeZone?->tax_id) ?? 0;
            $platFormSubTotal = $subTotal + $platform_fee;
            if ($taxRate && $platFormSubTotal) {
                $tax = (($platFormSubTotal * $taxRate) / 100);
            }
        }

        $total = $subTotal + $tax + $commission + $platform_fee;
        $driverCommission = $subTotal - $commission;
        return [
            'no_of_days' => $request?->no_of_days ?? 0,
            'vehicle_per_day_price' => round($vehiclePerDayCharge, 2),
            'driver_per_day_charge' => round($driverPerDayCharge, 2),
            'vehicle_rent' => round($vehicleRent, 2),
            'driver_rent' =>  round($driverRent, 2),
            'platform_fee' => round($platform_fee, 2),
            'total' => round($total, 2),
            'sub_total' => round($subTotal, 2),
            'tax'   => round($tax, 2),
            'commission' => round($commission, 2),
            'driver_commission' => round($driverCommission, 2),
            'total' => round($total, 2)
        ];
    }

    public function isExistsBidAtTime($driver_id, $ride_request_id)
    {
        return Bid::whereNull('deleted_at')?->where('driver_id', $driver_id)
            ?->where('ride_request_id', $ride_request_id)
            ?->whereNull('status')
            ?->exists();
    }

    public function convertKmToMiles($km)
    {
        return round($km * 0.621371, 2);
    }

    public function convertMilesToKm($miles)
    {
        return round($miles * 1.60934, 2);
    }

    public function convertWeightToKg($weight, $unit)
    {
        switch ($unit) {
            case 'gram':
                return $weight / 1000;
            case 'pound':
                return $weight * 0.453592;
            case 'kg':
                return $weight;
            default:
                throw new Exception(__('taxido::static.traits.invalid_weight_unit'), 400);
        }
    }

    public function isOptimumFairAmount($fair_amount, $min_charge, $max_charge)
    {
        return (max(min($fair_amount, $max_charge), $min_charge) == $fair_amount);
    }

    public function calDistanceMinMaxCharges($request, $vehicleType)
    {
        $distance = $request->distance;
        if ($request->distance_unit == 'mile') {
            $distance = $this->convertMilesToKm($distance);
        }

        $minDistanceCharge = round($distance * $vehicleType->min_per_unit_charge, 2);
        $minDistanceCharge = currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), roundNumber($minDistanceCharge));
        $maxDistanceCharge = round($distance * $vehicleType->max_per_unit_charge, 2);
        $maxDistanceCharge = currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), roundNumber($maxDistanceCharge));

        // tax & platform fee
        $minDistanceCharge = $this->additionalCharges($minDistanceCharge, $vehicleType?->id);
        $maxDistanceCharge = $this->additionalCharges($maxDistanceCharge, $vehicleType?->id);
        return [
            'min_distance_charge' => $minDistanceCharge,
            'max_distance_charge' => $maxDistanceCharge,
            'distanceInKm' => $distance
        ];
    }

    public function calWeightMinMaxCharges($request, $vehicleType)
    {
        $weight = $request->weight;
        $unit = $request->weight_unit ?? 'kg';
        if ($request->weight_unit != 'kg') {
            $weight = $this->convertWeightToKg($weight, $unit);
        }

        $minWeightCharge = round($weight * $vehicleType->min_per_weight_charge, 2);
        $minWeightCharge = currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), roundNumber($minWeightCharge));
        $maxWeightCharge = round($weight * $vehicleType->max_per_weight_charge, 2);
        $maxWeightCharge = currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), roundNumber($maxWeightCharge));

        // tax & platform fee
        $minWeightCharge = $this->additionalCharges($minWeightCharge, $vehicleType?->id);
        $maxWeightCharge = $this->additionalCharges($maxWeightCharge, $vehicleType?->id);

        return ['min_weight_charge' => $minWeightCharge, 'max_weight_charge' => $maxWeightCharge, 'weightInKg' => $weight];
    }

    public function additionalCharges($amount = 0, $vehicle_type_id = null)
    {
        $taxRate = getVehicleTaxRate($vehicle_type_id) ?? 0;
        $platform_fee = getPlatformFee() ?? 0;
        return $amount + calTaxRateAmount($amount, $taxRate) + $platform_fee;
    }

    public function calHourMinMaxCharges($request, $vehicleType)
    {
        $reqMinutes = ($request->hours) * 60;
        $minHoursCharge = round($reqMinutes * $vehicleType->min_per_min_charge, 2);
        $minHoursCharge = currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), roundNumber($minHoursCharge));
        $maxHoursCharge = round($reqMinutes * $vehicleType->max_per_min_charge, 2);
        $maxHoursCharge = currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), roundNumber($maxHoursCharge));

        // tax & platform fee
        $minHoursCharge = $this->additionalCharges($minHoursCharge, $vehicleType?->id);
        $maxHoursCharge = $this->additionalCharges($maxHoursCharge, $vehicleType?->id);

        return ['min_hour_charge' => $minHoursCharge, 'max_hour_charge' => $maxHoursCharge, 'hours' => $reqMinutes];
    }

    public function verifyBiddingFairAmount($request, $minAmount = null)
    {
        $settings        = getTaxidoSettings();
        $serviceCategory = getServiceCategoryById($request->service_category_id);
        $vehicleType     = VehicleType::where('id', $request->vehicle_type_id)?->whereNull('deleted_at')?->first();
        $service         = getServiceById($request->service_id);

        if ($service?->type == ServicesEnum::CAB || $service?->type == ServicesEnum::FREIGHT) {
            if (($serviceCategory?->type != ServiceCategoryEnum::RENTAL) &&
                ($serviceCategory?->type != ServiceCategoryEnum::PACKAGE)
            ) {

                $bidFare = $this->getMaxRideFareAmount($minAmount ?? $request->ride_fare);
                $maxAmount = $bidFare["max_fare"] ?? $request->ride_fare;
                $amount = $amount ?? $request->ride_fare;
                if (!$this->isOptimumFairAmount($amount, $minAmount, $maxAmount)) {
                    throw new Exception("The fare amount must be between {$minAmount} and {$maxAmount}.", 400);
                }

                return true;

            } elseif ($serviceCategory?->type == ServiceCategoryEnum::PACKAGE) {

                if ($request->hourly_package_id) {
                    return true;
                }

                throw new Exception(__('taxido::static.traits.hourly_package_required'), 400);
            } elseif ($serviceCategory?->slug == ServiceCategoryEnum::RENTAL) {
                return true;
            }
        } elseif ($service?->type == ServicesEnum::PARCEL) {
            return true;
        }

        throw new Exception(__('taxido::static.traits.invalid_service'), 400);
    }

    public function getHourlyPackageById($id)
    {
        return HourlyPackage::where('id', $id)?->whereNull('deleted_at')?->first();
    }

    // firestore bids
    public function addBidsFirestore(array $bid)
    {
        $rideRequestId = $bid['ride_request_id'];
        $bidId = $bid['id'];
        $bid['ride_id'] = ''; // default

        $this->initializeFireStore();
        $parentRef = $this->firestore->collection('ride_requests')->document($rideRequestId);
        $bidRef = $parentRef->collection('bids')->document($bidId);
        $this->batch->set($bidRef, $bid, ['merge' => true]);
        $this->batch->set($parentRef, [
            'id' => $rideRequestId,
            'has_bids' => true,
            'updated_at' => time()
        ], ['merge' => true]);

        $this->commitBatch();
    }

    public function updateBidStatusFirestore($bid)
    {
        $bidFireStoreData = $this->fireStoreGetDocument("ride_requests/{$bid['ride_request_id']}/bids", $bid['id']) ?? [];
        $driver_id = $bidFireStoreData['driver']['id'] ?? null;
        if ($driver_id) {
            $payload = ['status' => $bid?->status];
            $this->fireStoreUpdateDocument("ride_requests/{$bid['ride_request_id']}/bids", $bid['id'], $payload, true);

            if ($bid?->status == BidStatusEnum::REJECTED) {
                $this->fireStoreDeleteDocument("ride_requests/{$bid['ride_request_id']}/bids", $bid['id']);
            }
        }
    }
}
