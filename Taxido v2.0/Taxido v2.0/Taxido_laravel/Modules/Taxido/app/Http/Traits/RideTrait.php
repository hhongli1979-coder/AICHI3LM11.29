<?php

namespace Modules\Taxido\Http\Traits;

use Exception;
use Carbon\Carbon;
use Modules\Taxido\Models\Bid;
use Modules\Taxido\Models\Driver;
use Modules\Taxido\Models\Ride;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use App\Http\Traits\FireStoreTrait;
use Modules\Taxido\Models\RideRequest;
use Modules\Taxido\Enums\ServicesEnum;
use Modules\Taxido\Models\VehicleType;
use Modules\Taxido\Enums\BidStatusEnum;
use Modules\Taxido\Enums\RideStatusEnum;
use Modules\Taxido\Models\HourlyPackage;
use Modules\Taxido\Models\RentalVehicle;
use Modules\Taxido\Enums\ServiceCategoryEnum;
use Modules\Taxido\Http\Resources\RideDetailResource;
use Str;

trait RideTrait
{
    use BiddingTrait, FireStoreTrait, PeakZoneTrait;

    public function calRideFairAmount($request)
    {
        $settings = getTaxidoSettings();
        $service = getServiceById($request->service_id);
        $serviceCategory = getServiceCategoryById($request->service_category_id);
        $vehicleType = VehicleType::where('id', $request->vehicle_type_id)?->whereNull('deleted_at')?->first();
        $base_amount = currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), roundNumber($vehicleType?->base_amount));
        if ($service?->type == ServicesEnum::CAB || $service?->type == ServicesEnum::FREIGHT) {
            if (
                in_array($serviceCategory?->type, [
                    ServiceCategoryEnum::RIDE,
                    ServiceCategoryEnum::SCHEDULE,
                    ServiceCategoryEnum::INTERCITY,
                ]) || $service?->slug == ServicesEnum::FREIGHT
            ) {
                if (!((int) $settings['activation']['bidding']) || !($request->expectsJson())) {
                    $distanceCharges = $this->calDistanceMinMaxCharges($request, $vehicleType);
                    if ($base_amount >= $distanceCharges['min_distance_charge']) {
                        return $base_amount;
                    }

                    return $distanceCharges['min_distance_charge'];
                }
            }

            if ($serviceCategory?->type == ServiceCategoryEnum::PACKAGE) {
                if (!(int) $settings['activation']['bidding'] || !($request->expectsJson())) {
                    $hourlyPackage = HourlyPackage::where('id', $request->hourly_package_id)?->where('status', true)?->first();
                    if ($hourlyPackage) {
                        $request?->merge([
                            'distance' => $hourlyPackage->distance,
                            'distance_unit' => $hourlyPackage->distance_type,
                            'hours' => $hourlyPackage->hour,
                        ]);

                        $distanceFairCharges = $this->calDistanceMinMaxCharges($request, $vehicleType);
                        $hourFairCharges = $this->calHourMinMaxCharges($request, $vehicleType);
                        $minPackageCharge = $distanceFairCharges['min_distance_charge'] + $hourFairCharges['min_hour_charge'];
                        if ($base_amount >= $minPackageCharge) {
                            return $base_amount;
                        }

                        return $minPackageCharge;
                    }
                }
            }

            if ($serviceCategory?->type == ServiceCategoryEnum::RENTAL) {
                $rentalVehicle = RentalVehicle::where('id', $request->rental_vehicle_id)?->whereNull('deleted_at')?->first();
                if ($rentalVehicle) {
                    $start_date = Carbon::parse($request->start_time);
                    $end_date = Carbon::parse($request->end_time);
                    $no_of_days = ceil($start_date->diffInDays($end_date));
                    if ($request->is_with_driver) {
                        return $rentalVehicle?->vehicle_per_day_price * $no_of_days + $rentalVehicle->driver_per_day_charge * $no_of_days;
                    }
                    return $rentalVehicle?->vehicle_per_day_price * $no_of_days;
                }
            }

        } elseif ($service?->type == ServicesEnum::PARCEL) {
            if (!((int) $settings['activation']['bidding']) || !($request->expectsJson())) {
                $distanceCharges = $this->calDistanceMinMaxCharges($request, $vehicleType);
                $weightCharges = $this->calWeightMinMaxCharges($request, $vehicleType);
                $charge = $distanceCharges['min_distance_charge'] + $weightCharges['min_weight_charge'];
                if ($base_amount >= $charge) {
                    return $base_amount;
                }
                return $charge;
            }
        } elseif ($service?->type == ServicesEnum::AMBULANCE) {

            $distance = $request->distance;
            if ($request->distance_unit == 'mile') {
                $distance = $this->convertMilesToKm($distance);
            }
            $ambulance_per_km_charge = $settings['driver_commission']['ambulance_per_km_charge'];
            if ($ambulance_per_km_charge <= 0 || !$ambulance_per_km_charge) {
                $ambulance_per_km_charge = 1;
            }

            $charge = round($distance * $ambulance_per_km_charge, 2);
            $charge = currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), roundNumber($charge));
            return $charge;
        }

        return $request->ride_fare ?? $base_amount;
    }

    public function getPlatformFees($settings)
    {
        $platform_fees = 0;
        if (isset($settings['activation']['platform_fees'])) {
            if ($settings['activation']['platform_fees']) {
                $platform_fees = $settings['general']['platform_fees'] ?? 0;
            }
        }
        return $platform_fees;
    }

    public function findNearestDrivers($requestLat, $requestLng, $driverIds = [])
    {
        $settings = getTaxidoSettings();
        $radiusMeter = $settings['location']['radius_meter'];
        $requestLat = (float) $requestLat;
        $requestLng = (float) $requestLng;
        $filters = [
            ['is_online', '==', '1'],
            ['is_verified', '==', 1],
            ['is_on_ride', '==', '0'],
        ];

        $driverDocs = $this->fireStoreQueryCollection('driverTrack', $filters);
        $driversWithDistance = [];
        foreach ($driverDocs as $doc) {
            if (isset($doc['lat']) && isset($doc['lng']) && isset($doc['id'])) {
                $driverId = (int) $doc['id'];
                $driverLat = (float) $doc['lat'];
                $driverLng = (float) $doc['lng'];
                $distance = calculateDistance(
                    $requestLat,
                    $requestLng,
                    $driverLat,
                    $driverLng
                );

                if ($distance <= (float) $radiusMeter) {
                    $driversWithDistance[] = [
                        'id' => $driverId,
                        'distance' => $distance,
                    ];
                }
            }
        }

        if (count($driverIds)) {
            $filteredDrivers = [];
            foreach ($driversWithDistance as $driverDistance) {
                if (isset($driverDistance['id'])) {
                    if (in_array($driverDistance['id'], $driverIds)) {
                        $filteredDrivers[] = $driverDistance;
                    }
                }
            }

            $driversWithDistance = $filteredDrivers;
        }

        usort($driversWithDistance, fn($a, $b) => $a['distance'] <=> $b['distance']);
        return array_map(fn($driver) => $driver['id'], $driversWithDistance);
    }

    public function isTodayRentalRideAlreadyAccepted($rideRequest)
    {
        if ($rideRequest) {
            $endTime = Carbon::parse($rideRequest->end_time)->startOfDay();
            $rentalVehicleRides = Ride::whereNull('deleted_at')
                    ?->where('driver_id', getCurrentUserId())
                    ?->where('rental_vehicle_id', $rideRequest?->rental_vehicle_id)
                    ?->whereNotIn('ride_status_id', getRideStatusIdsBySlugs([RideStatusEnum::COMPLETED, RideStatusEnum::CANCELLED]))
                    ?->whereDate('end_time', '<=', Carbon::parse($endTime)->toDateString())?->get();

            if ($rentalVehicleRides?->isEmpty()) {
                return true;
            }

            return false;
        }

        throw new Exception(__('taxido::static.rides.rental_ride_request_not_found'), 400);
    }

    public function createRide($request, $bid = null)
    {
        DB::beginTransaction();
        try {

            $ride_request_id = null;
            if (isset($request['ride_request_id'])) {
                $ride_request_id = $request['ride_request_id'];
            }

            if (!is_array($request) && !is_null($request)) {
                $ride_request_id = $request->ride_request_id;
            }

            if ($bid) {
                $ride_request_id = $bid?->ride_request_id;
            }

            $rideRequest = RideRequest::findOrFail($ride_request_id);
            $formattedLocations = $rideRequest->locations;
            if ($rideRequest) {
                $settings = cache()->remember('taxido_settings', 360, function () {
                    return getTaxidoSettings();
                });
                $bid = $rideRequest?->getAcceptedBid();
                if ($bid?->amount && $rideRequest?->total) {
                    $bidExtraAmount = (abs($bid?->amount - $rideRequest?->total) + $rideRequest?->bid_extra_amount);
                    $rideRequest->bid_extra_amount = $bidExtraAmount;
                    $rideRequest->total = $bid?->amount ?? $rideRequest?->total;
                }

                $driver_id = $bid?->driver_id ?? getCurrentDriver()?->id;
                $driver = Driver::findOrFail($driver_id);
                if (
                    !((int) $settings['activation']['bidding']) ||
                    $rideRequest?->service_category?->type === ServiceCategoryEnum::RENTAL ||
                    $rideRequest?->service?->type == ServicesEnum::AMBULANCE
                ) {
                    if ($rideRequest?->service_category?->type === ServiceCategoryEnum::RENTAL) {
                        if (!$this->isTodayRentalRideAlreadyAccepted($rideRequest)) {
                            throw new Exception(__('taxido::static.rides.this_rental_vehicle_already_booked'), 400);
                        }
                    }
                    if (!$driver) {
                        throw new Exception(__('taxido::static.rides.only_driver_can_accept_ride_request_directly'), 400);
                    }

                    $driver_id = $driver?->id;
                }

                $ride = Ride::create([
                    'uuid' => Str::uuid()->toString(),
                    'ride_number' => $rideRequest?->ride_number,
                    'ambulance_id' => $rideRequest?->ambulance_id,
                    'rider_id' => $rideRequest?->rider_id,
                    'service_id' => $rideRequest?->service_id,
                    'service_category_id' => $rideRequest?->service_category_id,
                    'hourly_package_id' => $rideRequest?->hourly_package_id,
                    'rental_vehicle_id' => $rideRequest?->rental_vehicle_id,
                    'vehicle_type_id' => $rideRequest?->vehicle_type_id,
                    'start_time' => $rideRequest?->start_time,
                    'end_time' => $rideRequest?->end_time,
                    'no_of_days' => $rideRequest?->no_of_days,
                    'is_with_driver' => $rideRequest?->is_with_driver,
                    'assign_type' => $request?->assign_type ?? null,
                    'assigned_driver' => $request?->assigned_driver ?? null,
                    'vehicle_per_day_price' => $rideRequest?->vehicle_per_day_price,
                    'driver_per_day_charge' => $rideRequest?->driver_per_day_charge,
                    'vehicle_rent' => $rideRequest?->vehicle_rent,
                    'driver_rent' => $rideRequest?->driver_rent,
                    'driver_id' => $driver_id,
                    'rider' => $rideRequest?->rider,
                    'otp' => rand(1000, 9999),
                    'locations' => $formattedLocations,
                    'location_coordinates' => $rideRequest?->location_coordinates,
                    'duration' => $rideRequest?->duration,
                    'distance' => $rideRequest?->distance,
                    'distance_unit' => $rideRequest?->distance_unit,
                    'payment_method' => $rideRequest?->payment_method,
                    'currency_symbol' => $rideRequest?->currency_symbol,
                    'description' => $rideRequest?->description,
                    'cargo_image_id' => $rideRequest?->cargo_image_id,
                    'ride_status_id' => getRideStatusIdByName(RideStatusEnum::ACCEPTED),
                    'ride_fare' => $rideRequest?->ride_fare,
                    'tax' => $rideRequest?->tax,
                    'preference_charge' => $rideRequest?->preference_charge ?? 0,
                    'weight' => $rideRequest?->weight,
                    'parcel_delivered_otp' => $rideRequest?->parcel_delivered_otp,
                    'parcel_receiver' => $rideRequest->parcel_receiver,
                    'platform_fees' => $rideRequest?->platform_fee,
                    'sub_total' => $rideRequest?->sub_total,
                    'total' => $rideRequest?->total,
                    'additional_distance_charge' => $rideRequest?->additional_distance_charge ?? 0,
                    'additional_minute_charge' => $rideRequest?->additional_minute_charge ?? 0,
                    'additional_weight_charge' => $rideRequest?->additional_weight_charge ?? 0,
                    'driver_commission' => $rideRequest?->driver_commission ?? 0,
                    'commission' => $rideRequest?->commission ?? 0,
                    'bid_extra_amount' => $rideRequest?->bid_extra_amount ?? 0,
                    'invoice_id' => uniqid()
                ]);

                $zoneIds = $rideRequest?->zones()?->pluck('zone_id')->toArray();
                $ride->zones()->attach($zoneIds);

                if ($rideRequest?->preferences && $rideRequest?->preferences->count()) {
                    $preferenceIds = $rideRequest?->preferences()->pluck('preference_id')->toArray();
                    $ride->preferences()->attach($preferenceIds);
                }

                $bids = Bid::where('ride_request_id', $rideRequest->id)->whereNull('deleted_at')->pluck('id')->toArray();
                $ride->bids()->attach($bids);
                DB::commit();
                if (!$settings['activation']['ride_otp']) {
                    $ride->update([
                        'is_otp_verified' => true,
                        'ride_status_id' => getRideStatusIdByName(RideStatusEnum::STARTED),
                        'start_time' => $request['start_time'] ?? null,
                    ]);
                    $ride->ride_status;
                }

                if ($bid) {
                    $bid?->update([
                        'ride_id' => $ride?->id,
                    ]);

                    $rejectedBids = Bid::where('ride_request_id', $bid?->ride_request_id)?->whereNot('id', $bid?->id);
                    if ($rejectedBids) {
                        foreach ($rejectedBids as $rejBid) {
                            if ($rejBid) {
                                $rejBid->update(['status' => BidStatusEnum::REJECTED]);
                            }
                        }
                    }
                }

                $rideRequest?->ride_status_activities()?->create([
                    'status' => RideStatusEnum::ACCEPTED,
                ]);

                $rideRequest?->ride_status_activities()?->update([
                    'ride_id' => $ride?->id,
                ]);

                $ride = $ride->refresh();
                $driver = getDriverById($ride?->driver_id);
                if ($rideRequest?->service_category?->type != ServiceCategoryEnum::SCHEDULE) {
                    $driver?->update([
                        'is_on_ride' => true,
                    ]);
                }

                $driver = $driver?->refresh();
                $data = [
                    'driver_name' => $driver?->name,
                    'is_verified' => $driver?->is_verified,
                    'is_on_ride' => (string) ($driver?->is_on_ride ?? '0'),
                    'profile_image_url' => $driver?->profile_image?->original_url,
                    'rating_count' => $driver?->rating_count,
                    'review_count' => $driver?->review_count,
                    'phone' => $driver?->phone,
                    'country_code' => $driver?->country_code ?? null,
                    'model' => $driver?->vehicle_info?->model ?? null,
                    'plate_number' => $driver?->vehicle_info?->plate_number ?? null,
                    'ride_id' => $ride?->id,
                    'vehicle_type_map_icon_url' => $driver?->vehicle_info?->vehicle?->vehicle_map_icon?->original_url ?? null,
                ];

                if ($driver?->id) {
                    $this->optimizeRideAcceptanceFirestore($rideRequest, $ride, $driver, $bid);
                }

                return $ride;
            }

            throw new Exception(__('taxido::static.rides.ride_request'), 400);

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    private function optimizeRideAcceptanceFirestore($rideRequest, $ride, $driver, $bid = null)
    {
        $this->initializeFireStore();

        $rideRequestId = $rideRequest->id;
        $driverId = $driver->id;
        $rideId = $ride->id;

        $batch = $this->batch;
        $driverData = [
            'driver_name' => $driver->name,
            'is_verified' => $driver->is_verified,
            'is_on_ride' => '1',
            'profile_image_url' => $driver->profile_image?->original_url,
            'rating_count' => $driver->rating_count,
            'review_count' => $driver->review_count,
            'phone' => $driver->phone,
            'country_code' => $driver->country_code,
            'model' => $driver->vehicle_info?->model,
            'plate_number' => $driver->vehicle_info?->plate_number,
            'vehicle_type_map_icon_url' => $driver->vehicle_info?->vehicle?->vehicle_map_icon?->original_url,
            'ride_id' => $rideId,
        ];
        $batch->set(
            $this->firestore->collection('driverTrack')->document($driverId),
            $driverData,
            ['merge' => true]
        );

        $commonUpdate = [
            'ride_id' => $rideId,
            'status' => RideStatusEnum::ACCEPTED,
            'current_driver_id' => $driverId,
            'queue_driver_id' => null,
            'eligible_driver_ids' => null,
            'rejected_driver_ids' => null,
        ];

        $taxidoSettings = getTaxidoSettings();
        if(!$taxidoSettings['activation']['bidding'] && (getServiceTyeById($rideRequest->service_id) == ServicesEnum::CAB &&
            in_array(getServiceCategoryTyeById($rideRequest->service_category_id),[
                ServiceCategoryEnum::RIDE,
                ServiceCategoryEnum::INTERCITY,
                ServiceCategoryEnum::PACKAGE,
            ])) ) {
            $batch->set(
                $this->firestore->collection("ride_requests/{$rideRequestId}/instantRide")->document($rideRequestId),
                $commonUpdate,
                ['merge' => true]
            );
        }

        if (getServiceTyeById($rideRequest->service_id) == ServicesEnum::AMBULANCE) {
            $batch->set(
                $this->firestore->collection("ride_requests/{$rideRequestId}/ambulance_requests")->document($rideRequestId),
                $commonUpdate,
                ['merge' => true]
            );
        }

        if ($rideRequest->service_category?->type == ServiceCategoryEnum::RENTAL) {
            $batch->set(
                $this->firestore->collection("ride_requests/{$rideRequestId}/rental_requests")->document($rideRequestId),
                $commonUpdate,
                ['merge' => true]
            );
        }

        if ($bid && $taxidoSettings['activation']['bidding']) {
            $batch->set(
                $this->firestore->collection("ride_requests/{$rideRequestId}/bids")->document($bid->id),
                ['ride_id' => $rideId],
                ['merge' => true]
            );
        }

        $rideRequestDoc = $this->firestore->collection('ride_requests')->document($rideRequestId);
        $snapshot = $rideRequestDoc->snapshot();
        if ($snapshot->exists() && !empty($snapshot->get('driverIds'))) {
            $driverIds = $snapshot->get('driverIds');
            foreach ($driverIds as $id) {
                $batch->delete(
                    $this->firestore->collection('driver_ride_requests')->document((string) $id)
                );
            }
        }

        $ride = new RideDetailResource($ride);
        $ride = json_decode(json_encode($ride), true);
        $batch->set($this->firestore->collection('rides')->document($rideId), $ride);
        $batch->set($this->firestore->collection("ride_requests")->document($rideRequestId), ['status' => RideStatusEnum::ACCEPTED, 'ride_id' => $rideId], ['merge' => true]);

        $this->commitBatch();
    }
}
