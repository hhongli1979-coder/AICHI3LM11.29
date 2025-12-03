<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use App\Enums\RoleEnum;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Models\Ride;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Models\Ambulance;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\RideRequest;
use Modules\Taxido\Enums\ServicesEnum;
use Modules\Taxido\Enums\RideStatusEnum;
use Modules\Taxido\Models\RentalVehicle;
use Modules\Taxido\Events\RideStatusEvent;
use Modules\Taxido\Events\RideRequestEvent;
use Modules\Taxido\Enums\ServiceCategoryEnum;
use Prettus\Repository\Eloquent\BaseRepository;
use Modules\Taxido\Http\Traits\RideRequestTrait;
use Modules\Taxido\Enums\RoleEnum as EnumsRoleEnum;
use Modules\Taxido\Http\Resources\RideDetailResource;
use Modules\Taxido\Http\Resources\Drivers\RideRequestResource;

class RideRequestRepository extends BaseRepository
{
    use RideRequestTrait;

    public function model()
    {
        return RideRequest::class;
    }

    public function store($request)
    {
        try {

            $request->merge(['current_time' => $request?->current_time ?? now(env('APP_TIMEZONE'))?->format('H:i:s')]);
            return $this->createCabRideRequest($request);

        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $roleName = getCurrentRoleName();
            $rideRequest = $this->model->findOrFail($id);

            if ($roleName != RoleEnum::ADMIN && $roleName != EnumsRoleEnum::DRIVER) {
                if ($rideRequest?->created_by_id != getCurrentUserId()) {
                    throw new Exception(__('taxido::static.rides.update_permission'), 400);
                }
            }

            if (isset($request['drivers'])) {
                $rideRequest->drivers()->sync($request['drivers']);
            }

            $shouldCancel = isset($request['status']) && $request['status'] == RideStatusEnum::CANCELLED;

            if ($shouldCancel) {
                $rideRequest->ride_status_activities()->create([
                    'status' => $request['status'],
                    'changed_at' => now(),
                ]);
            }

            DB::commit();
            if (function_exists('fastcgi_finish_request')) {
                fastcgi_finish_request();
            }


            if ($shouldCancel) {
                $this->cancelRideRequestInFirestoreBackground($rideRequest->id);
            }

            return response()->json(['id' => $rideRequest->id]);

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Cancel ride in Firestore (background) – keeps ALL your original logic
     */
    private function cancelRideRequestInFirestoreBackground($rideRequestId)
    {
        try {
            $response = $this->fireStoreGetDocument("ride_requests", $rideRequestId);

            if (empty($response)) {
                Log::warning("Ride request not found in Firestore", ['id' => $rideRequestId]);
                return;
            }

            $driverIds = $response['driverIds'] ?? [];
            if (!empty($driverIds) && is_array($driverIds)) {
                foreach ($driverIds as $driverId) {
                    try {
                        $this->fireStoreDeleteDocument('driver_ride_requests', $driverId);
                    } catch (Exception $e) {
                        Log::warning("Failed to delete driver_ride_requests/{$driverId}", ['error' => $e->getMessage()]);
                    }
                }
            }

            $subCollections = $this->fireStoreListSubCollections("ride_requests", $rideRequestId) ?? [];
            foreach ($subCollections as $collection) {
                $subPath = "ride_requests/{$rideRequestId}/{$collection}";
                $doc = $this->fireStoreGetDocument($subPath, $rideRequestId);

                if (empty($doc)) {
                    continue;
                }

                $updateData = ['status' => RideStatusEnum::CANCELLED];

                switch ($collection) {
                    case 'instantRide':
                        $currentDriverId = $doc['current_driver_id'] ?? null;
                        if ($currentDriverId) {
                            try {
                                $this->fireStoreDeleteDocument('driver_ride_requests', $currentDriverId);
                            } catch (Exception $e) {
                            }
                        }
                        $updateData += [
                            'queue_driver_id' => null,
                            'eligible_driver_ids' => null,
                            'rejected_driver_ids' => null,
                            'current_driver_id' => $currentDriverId,
                        ];
                        break;

                    case 'ambulance_requests':
                    case 'rental_requests':
                        $currentDriverId = $doc['driver_id'] ?? null;
                        if ($currentDriverId) {
                            try {
                                $this->fireStoreDeleteDocument('driver_ride_requests', $currentDriverId);
                            } catch (Exception $e) {
                            }
                        }
                        break;

                    case 'bids':
                        break;
                }

                try {

                    $this->fireStoreUpdateDocument($subPath, $rideRequestId, $updateData, true);

                } catch (Exception $e) {

                   Log::warning("Failed to update subcollection {$collection}", ['error' => $e->getMessage()]);
                }
            }

            try {

                $this->fireStoreUpdateDocument("ride_requests", $rideRequestId, [
                    'status' => RideStatusEnum::CANCELLED,
                    'current_driver_id' => null,
                    'driverIds' => null,
                ]);

            } catch (Exception $e) {

                Log::warning("Failed to update main ride_requests", ['error' => $e->getMessage()]);
            }

        } catch (Exception $e) {
           Log::error('Firestore cancellation failed', [
                'ride_request_id' => $rideRequestId,
                'error' => $e->getMessage()
            ]);
        }
    }
    public function destroy($id)
    {
        try {
            $this->model->findOrFail($id)->delete();
            $this->runAfterResponse(fn() => $this->fireStoreDeleteDocument('ride_requests', $id));
            return response()->json(['success' => true]);
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function accept($request)
    {
        try {
            $driver = getCurrentDriver();
            if (!$driver) {
                throw new Exception(__('taxido::static.rides.only_driver_can_accept_ride_request_directly'), 400);
            }

            $ride = $this->createRide($request);
            $this->runAfterResponse(fn() => $this->fireStoreUpdateDocument("ride_requests", $request->ride_request_id, [
                'status' => 'accepted',
                'accepted_driver_id' => $driver->id
            ]));

            return new RideDetailResource($ride);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function reject($request)
    {
        DB::beginTransaction();
        try {
            $driver = getCurrentDriver();
            $ride_request_id = $request->ride_request_id;
            if (!$driver || !$ride_request_id) {
                throw new Exception(__('taxido::static.rides.invalid_request'), 400);
            }

            $rideRequest = RideRequest::findOrFail($ride_request_id);
            $rideRequest->ride_status_activities()->create([
                'status' => RideStatusEnum::REJECTED,
                'changed_at' => now(),
            ]);

            DB::commit();

            $this->runAfterResponse(fn() => $this->rejectRideInFirestore($ride_request_id, $driver->id));

            return response()->json([
                'message' => __('taxido::static.rides.ride_rejected_successfully'),
                'ride_request_id' => $ride_request_id
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    private function rejectRideInFirestore($ride_request_id, $driver_id)
    {
        $doc = $this->fireStoreGetDocument("ride_requests/{$ride_request_id}/instantRide", $ride_request_id) ?? [];
        $rejected = $doc['rejected_driver_ids'] ?? [];
        $rejected[] = $driver_id;

        $eligible = $doc['eligible_driver_ids'] ?? [];
        $queue = $doc['queue_driver_id'] ?? [];
        $idle = $this->getIdleDrivers($eligible, $queue);

        if ($idle['current_driver_id']) {
            $this->fireStoreUpdateDocument("ride_requests/{$ride_request_id}/instantRide", $ride_request_id, [
                'current_driver_id' => $idle['current_driver_id'],
                'rejected_driver_ids' => $rejected,
                'queue_driver_id' => $idle['queue_driver_id'],
                'eligible_driver_ids' => $idle['eligible_driver_ids'],
            ]);
        } else {
            $this->fireStoreUpdateDocument("ride_requests", $ride_request_id, [
                'status' => RideStatusEnum::CANCELLED
            ]);
        }
    }

    public function rental($request)
    {
        DB::beginTransaction();
        try {
            if ($this->verifyVehicleType($request)) {
                $rider_id = $request->rider_id ?? getCurrentUserId();
                if ($this->verifyRideWalletBalance($rider_id)) {
                    $formattedLocations = $request->locations;
                    $no_of_days = $this->getNoOfDaysAttribute($request->start_time, $request->end_time);
                    $request->no_of_days = $no_of_days;
                    $rentalVehicle = RentalVehicle::findOrFail($request->rental_vehicle_id);
                    $symbol = $rentalVehicle?->zone?->currency?->symbol ?? getDefaultCurrencySymbol();
                    $charges = $this->calRentalVehicleCharges($request, $rentalVehicle);
                    $rideRequest = $this->model->create([
                        'rider_id' => $rider_id,
                        'ride_number' => 100000 + ((RideRequest::max('id') + 1) + Ride::max('id') + 1),
                        'payment_method' => $request->payment_method,
                        'vehicle_type_id' => $request->vehicle_type_id,
                        'service_id' => $request->service_id,
                        'service_category_id' => $request->service_category_id,
                        'rider' => $request->new_rider ?? getCurrentRider(),
                        'description' => $request->description,
                        'locations' => $formattedLocations,
                        'location_coordinates' => $request->location_coordinates,
                        'is_with_driver' => $request?->is_with_driver,
                        'start_time' => $request->start_time,
                        'end_time' => $request->end_time,
                        'currency_symbol' => $symbol,
                        'rental_vehicle_id' => $request->rental_vehicle_id,
                        'no_of_days' => $no_of_days,
                        'driver_per_day_charge' => $charges['driver_per_day_charge'] ?? 0,
                        'vehicle_per_day_charge' => $charges['vehicle_per_day_charge'] ?? 0,
                        'driver_rent' => $charges['driver_rent'] ?? 0,
                        'vehicle_rent' => $charges['vehicle_rent'] ?? 0,
                        'platform_fee' => $charges['platform_fee'] ?? 0,
                        'tax' => $charges['tax'] ?? 0,
                        'total' => $charges['total'] ?? 0,
                        'sub_total' => $charges['sub_total'] ?? 0,
                        'commission' => $charges['commission'] ?? 0,
                        'driver_commission' => $charges['driver_commission'] ?? 0,
                    ]);

                    $coordinate = head($request->location_coordinates);
                    $zones = getZoneByPoint($coordinate['lat'], $coordinate['lng'])?->pluck('id')?->toArray();
                    $rideRequest?->zones()?->attach($zones);

                    $driver_id = $rideRequest?->rental_vehicle?->driver_id;
                    $rideRequest?->drivers()?->attach([$driver_id]);

                    DB::commit();
                    dispatch(fn() => event(new RideRequestEvent($rideRequest)))->afterResponse();

                    $rideRequest?->ride_status_activities()?->create([
                        'status' => RideStatusEnum::REQUESTED,
                        'changed_at' => now(),
                    ]);

                    $this->runAfterResponse(function () use ($rideRequest, $driver_id) {
                        $resource = new RideRequestResource($rideRequest);
                        $data = $resource->toArray(request());
                        $this->addRideRequestFireStore($data, [$driver_id]);
                    });

                    return response()->json(['id' => $rideRequest->id, 'data' => new RideRequestResource($rideRequest), 'drivers' => $driver_id]);
                }
            }
        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function ambulance($request)
    {
        try {
            DB::beginTransaction();
            $rider_id = $request->rider_id ?? getCurrentUserId();
            $ambulance = Ambulance::with('driver')->find($request->ambulance_id);
            $driverTrack = $this->fireStoreGetDocument('driverTrack', $ambulance->driver_id);
            if (!$driverTrack || !$driverTrack['is_online']) {
                throw new Exception(__('taxido::static.rides.ambulance_not_found'), 400);
            }

            $ride_locations = array_merge($request->location_coordinates, [
                [
                    'lat' => $driverTrack['lat'],
                    'lng' => $driverTrack['lng']
                ]
            ]);

            $zoneRideDistance = $this->getZoneRideDistance($ride_locations);
            $resDistance = $zoneRideDistance?->ride_distance;
            $settings = getTaxidoSettings();
            $perKm = $settings['driver_commission']['ambulance_per_km_charge'] ?? 1;
            $perMin = $settings['driver_commission']['ambulance_per_minute_charge'] ?? 0;
            $duration = (int) filter_var($resDistance['duration'] ?? '0', FILTER_SANITIZE_NUMBER_INT);
            $additional_min_charge = $duration * $perMin;
            $rideFare = ($resDistance['distance_value'] ?? 0) * $perKm;
            $subTotal = $rideFare + $additional_min_charge;
            $commissionRate = $settings['driver_commission']['ambulance_commission_rate'] ?? 0;
            $commission = ($subTotal * $commissionRate) / 100;
            $platform_fee = (float) getPlatformFee();
            $total = $subTotal + $commission + $platform_fee;
            $symbol = $zoneRideDistance?->zone?->currency?->symbol;

            $rideRequest = $this->model->create([
                'ride_number' => 100000 + ((RideRequest::max('id') + 1) + Ride::max('id') + 1),
                'rider_id' => $rider_id,
                'ambulance_id' => $request->ambulance_id,
                'service_id' => $request->service_id,
                'rider' => $request->new_rider ?? getCurrentRider(),
                'ride_fare' => $rideFare,
                'additional_minute_charge' => $additional_min_charge,
                'duration' => $resDistance['duration'] ?? '0',
                'description' => $request->description,
                'locations' => $request->locations,
                'location_coordinates' => $ride_locations,
                'currency_symbol' => $symbol,
                'distance' => $resDistance['distance_value'] ?? 0,
                'distance_unit' => $resDistance['distance_unit'] ?? null,
                'platform_fee' => $platform_fee,
                'sub_total' => $subTotal,
                'total' => $total,
                'commission' => $commission,
                'driver_commission' => $subTotal - $commission,
            ]);

            $coordinate = head($request->location_coordinates);
            $zones = getZoneByPoint($coordinate['lat'], $coordinate['lng'])?->pluck('id')?->toArray();
            $rideRequest?->zones()?->attach($zones);
            $rideRequest?->drivers()?->attach([$ambulance->driver_id]);
            $rideRequest?->ride_status_activities()?->create([
                'status' => RideStatusEnum::REQUESTED,
                'changed_at' => now(),
            ]);

            DB::commit();
            $rideRequest = $rideRequest->refresh();
            dispatch(fn() => event(new RideRequestEvent($rideRequest)))->afterResponse();

            $this->runAfterResponse(function () use ($rideRequest, $ambulance) {
                $resource = new RideRequestResource($rideRequest);
                $data = $resource->toArray(request());
                $this->addRideRequestFireStore($data, [$ambulance->driver_id]);
            });

            return response()->json(['id' => $rideRequest->id, 'data' => new RideRequestResource($rideRequest), 'drivers' => $ambulance->driver_id]);
        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    private function runAfterResponse(callable $callback)
    {
        if (function_exists('fastcgi_finish_request')) {
            fastcgi_finish_request();
        }

        try {

            $callback();

        } catch (Exception $e) {

            Log::error('Firestore background sync failed', ['error' => $e->getMessage()]);
        }
    }
}
