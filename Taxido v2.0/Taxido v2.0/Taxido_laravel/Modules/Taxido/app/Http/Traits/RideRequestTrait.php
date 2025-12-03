<?php

namespace Modules\Taxido\Http\Traits;

use Exception;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\Ride;
use Modules\Taxido\Models\Rider;
use Modules\Taxido\Models\Driver;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\FireStoreTrait;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\RideRequest;
use Modules\Taxido\Models\VehicleType;
use Modules\Taxido\Enums\ServicesEnum;
use Modules\Taxido\Enums\RideStatusEnum;
use Illuminate\Database\Eloquent\Builder;
use Modules\Taxido\Models\VehicleTypeZone;
use Modules\Taxido\Enums\ServiceCategoryEnum;
use Modules\Taxido\Enums\RoleEnum as EnumsRoleEnum;
use Modules\Taxido\Http\Resources\Drivers\RideRequestResource;

trait RideRequestTrait
{
    use BiddingTrait, RideTrait, FireStoreTrait;

    public function verifyRideWalletBalance($rider_id)
    {
        $roleName = getCurrentRoleName();
        if ($roleName == EnumsRoleEnum::RIDER) {
            $rider_id = $rider_id ?? getCurrentUserId();
        }
        $rider = Rider::findOrFail($rider_id);
        if ($rider?->wallet?->balance < 0) {
            throw new Exception(__('taxido::static.rides.negative_wallet_balance'), 400);
        }
        return true;
    }

    public function getNoOfDaysAttribute($start_date, $end_date)
    {
        if ($start_date && $end_date) {
            return Carbon::parse($start_date)->diffInDays(Carbon::parse($end_date));
        }
        return 0;
    }

    public function verifyVehicleType($request)
    {
        $vehicleType = VehicleType::where('id', $request->vehicle_type_id)?->whereNull('deleted_at')?->first();
        if (!in_array($request?->service_id, [$vehicleType?->service_id])) {
            throw new Exception(__('taxido::static.rides.service_not_allow_for_vehicle', ['vehicleType' => $vehicleType?->name]), 400);
        }
        $allowed = $vehicleType?->service_categories()->pluck('service_category_id')?->toArray();
        if (!in_array($request?->service_category_id, $allowed ?? [])) {
            throw new Exception(__('taxido::static.rides.category_not_allow_for_vehicle', ['vehicleType' => $vehicleType?->name]), 400);
        }
        return true;
    }

    public function getZoneRideDistance($locations)
    {
        $origin = head($locations);
        $zone = getZoneByPoint($origin['lat'], $origin['lng'])?->first();
        $rideDistance = calculateRideDistance($locations, $zone?->distance_type) ?? null;
        if ($zone && $rideDistance) {
            return (object) ['zone' => $zone, 'ride_distance' => $rideDistance];
        }
        return null;
    }

    public function findIdleDrivers($rideRequest)
    {
        try {
            $drivers = [];
            if (count($rideRequest->location_coordinates ?? [])) {
                if (!in_array($rideRequest?->service_category?->type, [ServiceCategoryEnum::RENTAL, ServiceCategoryEnum::SCHEDULE])) {
                    $coordinate = head($rideRequest->location_coordinates);
                    $zones = getDriverZoneByPoint($coordinate['lat'], $coordinate['lng'])?->pluck('id')?->toArray();
                    if (!count($zones)) {
                        throw new Exception(__('taxido::static.rides.ride_requests_not_accepted'), 400);
                    }
                    $rideRequest?->zones()?->attach($zones);

                    $vehicleTypeId = $rideRequest->vehicle_type_id;
                    $driverIds = Driver::whereNull('deleted_at')?->where('is_verified', true)?->where('service_id', $rideRequest->service_id);
                    $driverIds = $driverIds->whereHas('vehicle_info', function (Builder $vehicleInfo) use ($vehicleTypeId) {
                        $vehicleInfo->where('vehicle_type_id', $vehicleTypeId);
                    });

                    if (!$rideRequest->preferences?->isEmpty()) {

                        $preferenceIds = $rideRequest->preferences()->pluck('preference_id')->toArray();
                        $driverIds = $driverIds->whereRelation('preferences', function ($driver) use ($preferenceIds) {
                            $driver->WhereIn('preference_id', $preferenceIds);
                        });
                    }

                    $taxidoSettings = getTaxidoSettings();
                    $minWalletBalance = $taxidoSettings['wallet']['driver_min_wallet_balance'] ?? 0;
                    $driverIds = $driverIds->whereHas('wallet', function (Builder $wallet) use ($minWalletBalance) {
                        $wallet->where('balance', '>=', $minWalletBalance);
                    });
    
                    if (in_array(getServiceCategoryTyeById($rideRequest->service_category_id), [ServiceCategoryEnum::RENTAL, ServiceCategoryEnum::PACKAGE])) {
                        $driverIds = $driverIds?->where('service_category_id', $rideRequest->service_category_id);
                    }

                    $driverIds = $driverIds?->pluck('id')?->toArray() ?? [];
                    $drivers = null;

                    $drivers = $this->findNearestDrivers($coordinate['lat'], $coordinate['lng'], $driverIds);
                    if (!count($drivers)) {
                        throw new Exception(__('taxido::static.rides.no_driver_available'), 400);
                    }
                    $rideRequest?->drivers()?->attach($drivers);
                }
            }
            return $drivers;
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function createCabRideRequest($request)
    {
        DB::beginTransaction();
        try {

            $serviceCategory = getServiceCategoryById($request->service_category_id);
            if ($serviceCategory?->type == ServiceCategoryEnum::SCHEDULE && $request->start_time) {
                $hours = getTaxidoSettings()['ride']['schedule_min_hour_limit'] ?? 0;
                if ($hours && Carbon::parse($request->start_time)->lte(now()->addHours($hours))) {
                    throw new Exception("Scheduled rides must be at least {$hours} hours from now.", 422);
                }

            }

            if ($this->verifyVehicleType($request)) {
                $zoneRideDistance = $this->getZoneRideDistance($request->location_coordinates);
                if (!$zoneRideDistance) {
                    throw new Exception("Ride distance not calculate, please try again.", 422);
                }

                $vehicleTypeZone = VehicleTypeZone::where('vehicle_type_id', $request->vehicle_type_id)
                    ->where('zone_id', $zoneRideDistance?->zone?->id)->first();

                $peakZone = $this->getPeakZones($request->location_coordinates);

                Log::info("Ride Request Trait PeakZone", ["peakzone" => $peakZone]);
                if ($peakZone) {
                    $peakZone->refresh();
                    // Double-check that the peak zone is still active
                    if (!$peakZone->isActiveNow()) {
                        $peakZone = null;
                    }
                }
                $isPeakZone = $peakZone?->zone_id == $zoneRideDistance?->zone?->id;

                if ($serviceCategory?->type == ServiceCategoryEnum::PACKAGE && $request->hourly_package_id) {
                    $charges = $this->calHourlyPackageVehicleTypePrice($request->hourly_package_id, $request->vehicle_type_id, $zoneRideDistance?->zone?->id);
                } else {
                    $charges = $this->calVehicleTypeZonePrice($zoneRideDistance?->ride_distance, $vehicleTypeZone, $request);
                    if ($isPeakZone) {
                        $peakZoneCharge = (($zoneRideDistance?->zone?->peak_price_increase_percentage ?? 0) * $charges['base_fare_charge']) / 100;
                        $charges['base_fare_charge'] += $peakZoneCharge;
                        $charges['peak_zone_charge'] = $peakZoneCharge;
                    } else {
                        $charges['peak_zone_charge'] = 0;
                    }
                }

                $total = $charges['total'];
                if ((int) getTaxidoSettings()['activation']['bidding'] && $request->ride_fare >= $total) {
                    $total = $request->ride_fare;
                }

                $roleName = getCurrentRoleName();
                $rider = $request->new_rider ?? getCurrentRider();
                $rider_id = $rider?->id ?? $request->rider_id;
                if($roleName != RoleEnum::RIDER && $roleName != RoleEnum::DRIVER) {
                    $rider = Rider::where('id', $request->rider_id)?->whereNull('deleted_at')->first();
                }

                if(!$rider) {
                    throw new Exception("Rider not found!", 404);
                }

                if ($this->verifyRideWalletBalance($rider_id)) {
                    $rideRequest = RideRequest::create([
                        'ride_number' => 100000 + ((RideRequest::max('id') + 1) + Ride::max('id') + 1),
                        'rider_id' => $rider_id,
                        'payment_method' => $request->payment_method ?? 'cash',
                        'vehicle_type_id' => $request->vehicle_type_id,
                        'service_id' => $request->service_id,
                        'service_category_id' => $request->service_category_id,
                        'rider' => $rider,
                        'description' => $request->description,
                        'duration' => $zoneRideDistance?->ride_distance['duration'] ?? $request?->duration,
                        'distance' => $zoneRideDistance?->ride_distance['distance_value'] ?? $request?->distance,
                        'distance_unit' => $zoneRideDistance?->ride_distance['distance_unit'] ?? $request?->distance_unit,
                        'ride_fare' => $charges['base_fare_charge'] ?? 0,
                        'additional_distance_charge' => $charges['additional_distance_charge'] ?? 0,
                        'additional_minute_charge' => $charges['additional_minute_charge'] ?? 0,
                        'additional_weight_charge' => $charges['additional_weight_charge'] ?? 0,
                        'tax' => $charges['tax'] ?? 0,
                        'commission' => $charges['commission'] ?? 0,
                        'driver_commission' => $charges['driver_commission'] ?? 0,
                        'platform_fee' => $charges['platform_fee'] ?? 0,
                        'preference_charge' => $charges['preference_charge'] ?? 0,
                        'sub_total' => $charges['sub_total'] ?? 0,
                        'total' => $total,
                        'locations' => $request->locations,
                        'currency_symbol' => $zoneRideDistance?->zone?->currency?->symbol,
                        'location_coordinates' => $request->location_coordinates,
                        'hourly_package_id' => $request->hourly_package_id,
                        'weight' => $request->weight,
                        'parcel_receiver' => $request->parcel_receiver,
                        'parcel_delivered_otp' => rand(1000, 9999),
                        'start_time' => $request->start_time,
                        'bid_extra_amount' => $total - $charges['total'],
                        'no_of_days' => $this->getNoOfDaysAttribute($request?->start_time, $request?->end_time),
                        'is_peak_zone' => $isPeakZone,
                        'peak_zone_id' => $peakZone?->id ?? null,
                        'peak_zone_charge' => $charges['peak_zone_charge'] ?? 0,
                    ]);

                    if ($request->hasFile('cargo_image')) {
                        $attachment = createAttachment();
                        $attachment_id = addMedia($attachment, $request->file('cargo_image'))?->id;
                        $rideRequest->cargo_image_id = $attachment_id;
                        $rideRequest->save();
                    }

                    if ($request->preferences && is_array($request->preferences)) {
                        $rideRequest->preferences()->attach(array_filter($request->preferences));
                    }

                    DB::commit();
                    $rideRequest = $rideRequest->refresh();

                    $drivers = [];
                    if (!($request->driver_assign == 'manual' && $request->driver)) {
                        $drivers = $this->findIdleDrivers($rideRequest);
                    } elseif ($request->driver_assign == 'manual' && $request->driver) {
                        $drivers = [$request->driver];
                    }

                    $rideRequest->ride_status_activities()->create([
                        'status' => $serviceCategory?->type == ServiceCategoryEnum::SCHEDULE ? RideStatusEnum::SCHEDULED : RideStatusEnum::REQUESTED,
                        'changed_at' => now(),
                    ]);

                    $resource = new RideRequestResource($rideRequest);
                    $data = $resource->toArray(request());
                    $data['status'] = RideStatusEnum::REQUESTED;
                    $this->addRideRequestFireStore($data, $drivers);
                    return [
                        'id' => $rideRequest->id,
                        'data' => new RideRequestResource($rideRequest),
                        'drivers' => $drivers
                    ];
                }
            }

            throw new Exception("Selected vehicle type not valid.", 404);

        } catch (Exception $e) {

            DB::rollback();

            Log::error("Error in RideRequestTrait : ".$e->getMessage());
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getIdleDrivers(array $drivers, $queueDriverIds = [])
    {
        if (empty($drivers)) {
            return [
                'current_driver_id' => null,
                'eligible_driver_ids' => null,
                'queue_driver_id' => null,
            ];
        }

        $current = Arr::random($drivers);
        $index = array_search($current, $drivers);
        unset($drivers[$index]);

        return [
            'current_driver_id' => $current,
            'eligible_driver_ids' => !empty($drivers) ? array_values($drivers) : null,
            'queue_driver_id' => !empty($queueDriverIds) ? $queueDriverIds : null,
        ];
    }

    public function addRideRequestFireStore($rideRequest, $drivers)
    {
        $taxidoSettings = getTaxidoSettings();
        $serviceType = getServiceTyeById($rideRequest['service_id']);
        $serviceCategoryType = getServiceCategoryTyeById($rideRequest['service_category_id']);

        $rideRequest['is_bidding'] = (string) $taxidoSettings['activation']['bidding'];
        $rideRequest['driver_ride_request_accept_time'] = (string) ($taxidoSettings['ride']['ride_request_time_driver'] ?? '30');
        $rideRequest['driver_amb_rent_ride_req_time'] = (string) ($taxidoSettings['ride']['rental_ambulance_request_time'] ?? '30');

        switch ($serviceType) {
            case ServicesEnum::CAB:
            case ServicesEnum::FREIGHT:
            case ServicesEnum::PARCEL:
                $this->handleCabFreightParcel($rideRequest, $drivers, $serviceCategoryType, $taxidoSettings);
                break;
            case ServicesEnum::AMBULANCE:
                $this->handleAmbulance($rideRequest, $drivers);
                break;
        }
    }

    private function handleCabFreightParcel($rideRequest, $drivers, $serviceCategoryType, $taxidoSettings)
    {
        if (in_array($serviceCategoryType, [ServiceCategoryEnum::RIDE, ServiceCategoryEnum::INTERCITY, ServiceCategoryEnum::SCHEDULE, ServiceCategoryEnum::PACKAGE])) {
            $taxidoSettings['activation']['bidding']
                ? $this->handleBiddingMode($rideRequest, $drivers)
                : $this->handleNonBiddingMode($rideRequest, $drivers, 'instantRide');
        } elseif ($serviceCategoryType == ServiceCategoryEnum::RENTAL) {
            $this->handleRentalMode($rideRequest, $drivers);
        }
    }

    private function handleBiddingMode($rideRequest, $drivers)
    {
        $rideRequestId = $rideRequest['id'];
        $rideRequest['driverIds'] = $drivers;
        $rideRequest = json_decode(json_encode($rideRequest), true);
        $this->fireStoreAddDocument('ride_requests', $rideRequest, $rideRequestId);

        if (empty($drivers)) {
            return $rideRequest;
        }

        $batchOperations = [];
        $newRideEntry = [
            'id' => (string) $rideRequestId,
            'driver_id' => null
        ];

        foreach ($drivers as $driverId) {
            $entry = $newRideEntry;
            $entry['driver_id'] = (string) $driverId;

            $batchOperations[] = [
                'type' => 'update',
                'collection' => 'driver_ride_requests',
                'documentId' => (string) $driverId,
                'data' => [
                    'ride_requests' => \Google\Cloud\Firestore\FieldValue::arrayUnion([$entry])
                ]
            ];
        }

        $this->fireStoreBatchWrite($batchOperations);
        return $rideRequest;
    }

    private function handleNonBiddingMode($rideRequest, $drivers, $subCollectionName)
    {
        $idle = $this->getIdleDrivers($drivers);
        $allDrivers = array_values(array_unique(array_merge(
            $idle['eligible_driver_ids'] ?? [],
            [$idle['current_driver_id']]
        )));

        $mainData = $rideRequest;
        $mainData['driverIds'] = $allDrivers;
        $mainData['current_driver_id'] = $idle['current_driver_id'];

        $subData = [
            'status' => 'pending',
            'current_driver_id' => $idle['current_driver_id'],
            'eligible_driver_ids' => $idle['eligible_driver_ids'],
            'queue_driver_id' => $idle['queue_driver_id'],
            'rejected_driver_ids' => []
        ];

        $mainData = json_decode(json_encode($mainData), true);
        $this->fireStoreAddDocument('ride_requests', $mainData, $rideRequest['id']);
        $subData = json_decode(json_encode($subData), true);
        $this->fireStoreAddDocument(
            "ride_requests/{$rideRequest['id']}/{$subCollectionName}",
            $subData,
            $rideRequest['id']
        );

        if ($idle['current_driver_id']) {
            $payload = [
                'ride_requests' => [
                    [
                        'id' => (string) $rideRequest['id'],
                        'driver_id' => (string) $idle['current_driver_id'],
                    ]
                ]
            ];

            $this->fireStoreAddDocument('driver_ride_requests', $payload, $idle['current_driver_id']);
        }
    }

    private function handleRentalMode($rideRequest, $drivers)
    {
        $driver_id = head($drivers);
        $mainData = $rideRequest;
        $mainData['driverIds'] = [$driver_id];

        $mainData = json_decode(json_encode($mainData), true);
        $this->fireStoreAddDocument('ride_requests', $mainData, $rideRequest['id']);
        $this->fireStoreAddDocument(
            "ride_requests/{$rideRequest['id']}/rental_requests",
            ['status' => 'pending', 'driver_id' => $driver_id],
            $rideRequest['id']
        );


        $payload = [
            'ride_requests' => [
                [
                    'id' => (string) $rideRequest['id'],
                    'driver_id' => $driver_id,
                ]
            ]
        ];

        $this->fireStoreAddDocument('driver_ride_requests', $payload, $driver_id);
    }

    private function handleAmbulance($rideRequest, $drivers)
    {
        $driver_id = head($drivers);
        $mainData = $rideRequest;
        $mainData['driverIds'] = [$driver_id];

        $mainData = json_decode(json_encode($mainData), true);
        $this->fireStoreAddDocument('ride_requests', $mainData, $rideRequest['id']);
        $this->fireStoreAddDocument(
            "ride_requests/{$rideRequest['id']}/ambulance_requests",
            ['status' => 'pending', 'driver_id' => $driver_id],
            $rideRequest['id']
        );

        $payload = [
            'ride_requests' => [
                [
                    'id' => (string) $rideRequest['id'],
                    'driver_id' => $driver_id,
                ]
            ]
        ];

        $this->fireStoreAddDocument('driver_ride_requests', $payload, $driver_id);
    }
}
