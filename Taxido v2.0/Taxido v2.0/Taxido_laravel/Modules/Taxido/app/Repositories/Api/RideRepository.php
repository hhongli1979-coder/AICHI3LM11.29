<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Carbon\Carbon;
use App\Enums\PaymentMode;
use App\Enums\PaymentStatus;
use App\Enums\PaymentMethod;
use App\Enums\TransactionType;
use Barryvdh\DomPDF\Facade\Pdf;
use Modules\Taxido\Events\UpdateRideLocationEvent;
use Modules\Taxido\Http\Traits\ReferralTrait;
use Modules\Taxido\Models\Driver;
use Modules\Taxido\Models\Ride;
use App\Http\Traits\PaymentTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\Rider;
use Nwidart\Modules\Facades\Module;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Enums\ServicesEnum;
use Modules\Taxido\Enums\WalletDetail;
use Modules\Taxido\Models\RideRequest;
use Modules\Taxido\Models\RiderWallet;
use Modules\Taxido\Models\DriverWallet;
use Modules\Taxido\Enums\RideStatusEnum;
use Modules\Taxido\Events\RideStatusEvent;
use Modules\Taxido\Models\VehicleTypeZone;
use Modules\Taxido\Models\ReferralBonus;
use Modules\Taxido\Models\RiderWalletHistory;
use Modules\Taxido\Models\DriverWalletHistory;
use Modules\Taxido\Events\ReferralBonusCreditedEvent;
use Modules\Taxido\Http\Traits\CouponTrait;
use Modules\Taxido\Enums\ServiceCategoryEnum;
use Modules\Taxido\Models\DriverSubscription;
use Modules\Taxido\Http\Resources\RideResource;
use Modules\Taxido\Http\Traits\CommissionTrait;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Modules\Taxido\Http\Traits\RideRequestTrait;
use Modules\Taxido\Http\Resources\RideDetailResource;
use Modules\Taxido\Http\Resources\Drivers\RideRequestResource;
use Modules\Taxido\Services\IncentiveCalculationService;

class RideRepository extends BaseRepository
{
    use RideRequestTrait, CouponTrait, PaymentTrait, CommissionTrait, ReferralTrait;

    private ?IncentiveCalculationService $incentiveCalculationService = null;

    protected $fieldSearchable = [
        'ride_number' => 'like',
    ];

    public function model()
    {
        return Ride::class;
    }

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getRideLocation($ride_id)
    {
        try {
            if (!$ride_id) {
                throw new Exception('Ride number is required', 400);
            }

            $ride = Ride::where('id', $ride_id)->first();
            $firstPoint = head($ride->location_coordinates) ?? null;
            $paymentMethods = getPaymentMethodList();
            $allPaymentMethods = collect($paymentMethods);
            $zone = getZoneByPoint($firstPoint['lat'], $firstPoint['lng'])->first();
            if ($zone) {
                $selectedSlugs = $zone->payment_method;
                $filtered = $allPaymentMethods->filter(function ($method) use ($selectedSlugs) {
                    return in_array($method['slug'], $selectedSlugs);
                })->map(function ($method) {
                    return collect($method)->only(['name', 'slug', 'title', 'image'])->toArray();
                })->values();

                return [
                    'success' => true,
                    'data' => [
                        [
                            'ride_number' => $ride->ride_number,
                            'location_coordinates' => $ride->location_coordinates,
                            'zone' => $zone->name,
                            'locations' => $zone->locations,
                            'currency_code' => $zone->currency->code,
                            'currency_symbol' => $zone->currency->symbol,
                            'exchange_rate' => $zone->currency->exchange_rate,
                            'payment_method' => $filtered,
                        ]
                    ]
                ];
            }
            throw new Exception("Zone not found!", 400);
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function show($id)
    {
        $ride = $this->model->findOrFail($id);
        return new RideDetailResource($ride);
    }

    public function updateRideStatusActivities($ride, $status)
    {
        $ride_status_id = getRideStatusIdBySlug($status);
        if ($ride_status_id) {
            $ride->update(['ride_status_id' => $ride_status_id]);
            if ($status) {
                $rideStatusActivities = $ride->ride_status_activities()->latest()->first();
                $rideRequestId = $ride->ride_status_activities()->where('status', RideStatusEnum::ACCEPTED)->value('ride_request_id');
                if ($rideStatusActivities && $rideRequestId) {
                    if ($rideStatusActivities->status == $status) {
                        $rideStatusActivities->update([
                            'status' => $status,
                            'changed_at' => now(),
                            'ride_request_id' => $rideRequestId,
                        ]);
                    } else {
                        $ride->ride_status_activities()->create([
                            'status' => $status,
                            'changed_at' => now(),
                            'ride_request_id' => $rideRequestId,
                        ]);
                    }
                } else {
                    $ride->ride_status_activities()->create([
                        'status' => $status,
                        'changed_at' => now(),
                    ]);
                }
            }
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $ride = $this->model->findOrFail($id);
            $roleName = getCurrentRoleName();
            $taxidoSettings = getTaxidoSettings();
            $ride_status_id = isset($request['status']) ? getRideStatusIdBySlug($request['status']) : null;
            $driver = getDriverById($ride->driver_id);
            $zone_id = $ride->zones()->pluck('zone_id')->first();
            $vehicleTypeZone = VehicleTypeZone::where('vehicle_type_id', $ride->vehicle_type_id)
                ->where('zone_id', $zone_id)?->first();

            if (isset($request['status'])) {
                if ($request['status'] == RideStatusEnum::CANCELLED) {
                    if (empty($request['cancellation_reason'])) {
                        throw new Exception(__('taxido::static.rides.cancellation_reason_required'), 422);
                    }

                    if ($ride->ride_status->slug == RideStatusEnum::CANCELLED) {
                        throw new Exception(__('taxido::static.rides.ride_already_cancelled'), 400);
                    }

                    if (in_array($ride?->ride_status?->slug, [RideStatusEnum::STARTED, RideStatusEnum::ARRIVED, RideStatusEnum::COMPLETED])) {
                        throw new Exception(__('taxido::static.rides.ride_cannot_cancel'), 400);
                    }

                    $riderCancellationCharge = $vehicleTypeZone->cancellation_charge_for_rider ?? 0;
                    $driverCancellationCharge = $vehicleTypeZone->cancellation_charge_for_driver ?? 0;
                    if ($roleName == RoleEnum::DRIVER) {
                        $riderCancellationCharge = 0;
                    } elseif ($roleName == RoleEnum::RIDER) {
                        $driverCancellationCharge = 0;
                    }

                    $ride->update([
                        'rider_cancellation_charge' => $riderCancellationCharge,
                        'driver_cancellation_charge' => $driverCancellationCharge,
                        'ride_status_id' => $ride_status_id,
                        'cancellation_reason' => $request['cancellation_reason'] ?? null,
                    ]);

                    $charge_goes_to = $vehicleTypeZone->charge_goes_to;
                    if ($driverCancellationCharge > 0) {
                        $this->debitDriverWallet($ride->driver_id, $driverCancellationCharge, __('taxido::static.commission_histories.ride_cancellation_charge_debited', ['ride_number' => $ride->ride_number]), $ride->id, false);
                        if ($charge_goes_to == 'fleet') {
                            $this->creditFleetWallet($driver->fleet_manager_id, $driverCancellationCharge, __('taxido::static.commission_histories.ride_cancellation_charge_credited', ['ride_number' => $ride->ride_number]), $ride->id);
                        }
                    }
                    if ($riderCancellationCharge > 0) {
                        $this->debitRiderWallet($ride->rider_id, $riderCancellationCharge, __('taxido::static.commission_histories.ride_cancellation_charge_debited', ['ride_number' => $ride->ride_number]), $ride->id, false);
                        if ($charge_goes_to == RoleEnum::DRIVER) {
                            $this->creditDriverWallet($ride->driver_id, $riderCancellationCharge, __('taxido::static.commission_histories.ride_cancellation_charge_credited', ['ride_number' => $ride->ride_number]), $ride->id);
                        } elseif ($charge_goes_to == 'fleet') {
                            $this->creditFleetWallet($ride->fleet_manager_id, $riderCancellationCharge, __('taxido::static.commission_histories.ride_cancellation_charge_credited', ['ride_number' => $ride->ride_number]), $ride->id);
                        }
                    }

                    $driver->update(['is_on_ride' => false]);
                    $driver = $driver->refresh();
                }

                if ($roleName == RoleEnum::DRIVER && $request['status'] == RideStatusEnum::COMPLETED) {
                    $ride_status_id = getRideStatusIdBySlug(RideStatusEnum::COMPLETED);
                    if ($ride->driver_id != getCurrentUserId()) {
                        throw new Exception(__('taxido::static.rides.only_assigned_driver'), 400);
                    }

                    if ($ride->service->type == ServicesEnum::PARCEL) {
                        $isParcelOtpEnabled = $taxidoSettings['activation']['parcel_otp'];
                        if ($isParcelOtpEnabled && !$ride->is_otp_verified) {
                            if (isset($request['parcel_delivered_otp']) && !is_null($request['parcel_delivered_otp'])) {
                                if ($ride->parcel_delivered_otp == $request['parcel_delivered_otp']) {
                                    $ride->update(['is_otp_verified' => true, 'parcel_otp_verified_at' => now()]);
                                    $ride = $ride->refresh();
                                }
                            }
                            if (!$ride->parcel_otp_verified_at) {
                                throw new Exception(__('taxido::static.rides.otp_not_verified_for_parcel'), 400);
                            }
                        }
                    }

                    $driver->update(['is_on_ride' => false]);
                }
            }

            if ($roleName == RoleEnum::RIDER && isset($request['location_coordinates'])) {
                if ($ride->ride_status->slug != RideStatusEnum::STARTED) {
                    throw new Exception(__('taxido::static.rides.ride_location_can_update_when_ride_started'), 400);
                }
                if (is_array($request['location_coordinates']) && count($request['location_coordinates']) < 2) {
                    throw new Exception(__('taxido::static.rides.ride_location_minimum_two_coordinates'), 422);
                }

                $zoneRideDistance = $this->getZoneRideDistance($request['location_coordinates']);
                if ($zoneRideDistance) {
                    $new_zone_id = $zoneRideDistance->zone->id;
                    $new_vehicleTypeZone = VehicleTypeZone::where('vehicle_type_id', $ride->vehicle_type_id)
                        ->where('zone_id', $new_zone_id)
                        ->first();

                    if ($new_vehicleTypeZone) {
                        $rideDistance = $zoneRideDistance->ride_distance;
                        $isPeakZone = false;
                        $peakZone = $this->getPeakZones($request['location_coordinates'] ?? []);
                        if ($peakZone && $peakZone->zone_id == $new_zone_id) {
                            $peakZoneCharge = (($zoneRideDistance->zone->peak_price_increase_percentage ?? 0) * $new_vehicleTypeZone->base_fare_charge) / 100;
                            $new_vehicleTypeZone->base_fare_charge += $peakZoneCharge;
                            $isPeakZone = true;
                        } else {
                            $peakZoneCharge = 0;
                        }

                        $req = (object) array_merge($request, [
                            'service_id' => $ride->service_id,
                            'service_category_id' => $ride->service_category_id,
                            'vehicle_type_id' => $ride->vehicle_type_id,
                            'weight' => $ride->weight,
                            'ride_request_id' => $ride->ride_request_id,
                            'preferences' => $ride->preferences,
                            'current_time' => Carbon::now()->format('H:i:s'),
                            'ride_distance' => $rideDistance,
                            'duration' => $rideDistance['duration'] ?? $ride->duration,
                            'coupon_code' => $ride->coupon_code,
                            'rider_id' => $ride->rider_id,
                            'is_with_driver' => $ride->is_with_driver,
                            'is_peak_zone' => $isPeakZone,
                            'peak_zone_id' => $peakZone?->id,
                            'zone_id' => $new_zone_id,
                        ]);

                        $charges = $this->calVehicleTypeZonePrice($rideDistance, $new_vehicleTypeZone, $req);

                        $ride->update([
                            'locations' => $request['locations'] ?? $ride->locations,
                            'location_coordinates' => $request['location_coordinates'] ?? $ride->location_coordinates,
                            'distance' => $rideDistance['distance_value'] ?? $ride->distance,
                            'distance_unit' => $rideDistance['distance_unit'] ?? $ride->distance_unit,
                            'duration' => $rideDistance['duration'] ?? $ride->duration,
                            'ride_fare' => $charges['base_fare_charge'] ?? $ride->ride_fare,
                            'additional_distance_charge' => $charges['additional_distance_charge'] ?? $ride->additional_distance_charge,
                            'additional_minute_charge' => $charges['additional_minute_charge'] ?? $ride->additional_minute_charge,
                            'additional_weight_charge' => $charges['additional_weight_charge'] ?? $ride->additional_weight_charge,
                            'tax' => $charges['tax'] ?? $ride->tax,
                            'commission' => $charges['commission'] ?? $ride->commission,
                            'driver_commission' => $charges['driver_commission'] ?? $ride->driver_commission,
                            'platform_fee' => $charges['platform_fee'] ?? $ride->platform_fee,
                            'preference_charge' => $charges['preference_charge'] ?? $ride->preference_charge,
                            'sub_total' => $charges['sub_total'] ?? $ride->sub_total,
                            'total' => $charges['total'] ?? $ride->total,
                            'is_peak_zone' => $isPeakZone,
                            'peak_zone_id' => $peakZone?->id,
                            'peak_zone_charge' => $peakZoneCharge ?? 0,
                        ]);

                        if ($new_zone_id) {
                            $ride->zones()->sync([$new_zone_id]);
                            $zone_id = $new_zone_id;
                            $vehicleTypeZone = $new_vehicleTypeZone;
                        }

                        dispatch(fn() => event(new UpdateRideLocationEvent($ride)))->afterResponse();


                    } else {
                        throw new Exception(__('taxido::static.rides.invalid_vehicle_type_zone'), 400);
                    }
                } else {
                    throw new Exception(__('taxido::static.rides.ride_distance_not_calculated'), 422);
                }
            }

            if ($ride_status_id) {
                $ride->update(['ride_status_id' => $ride_status_id, 'dropped_at' => now()]);
                $this->updateRideStatusActivities($ride, $request['status']);
            }


            DB::commit();
            $ride = $ride->refresh();
            $rideData = new RideDetailResource($ride->refresh());
            $rideDataArray = $rideData->toArray(request());
            $rideDataArray = json_decode(json_encode($rideDataArray), true);
            $this->fireStoreUpdateDocument('rides', $ride->id, $rideDataArray, true);
            if (isset($request['status'])) {
                if ($request['status'] == RideStatusEnum::COMPLETED) {
                    $this->handleExtraChargesAndWaitingTime($ride, $request, $vehicleTypeZone);
                }
            }
            $driver = $driver->refresh();
            $data = ['is_on_ride' => (string) $driver->is_on_ride, 'ride_id' => null];
            if (isset(($request['status']))) {
                if ($request['status'] == RideStatusEnum::COMPLETED) {
                    if ($taxidoSettings['activation']['driver_incentive_enable'] ?? false) {
                        $this->calculateAndCreditIncentive($ride, $vehicleTypeZone);
                    }

                    if ($taxidoSettings['activation']['referral_enable'] ?? false) {
                        if ($ride->sub_total > $taxidoSettings['referral']['minimum_ride_amount']) {
                            $rider = Rider::find($ride->rider_id);
                            if ($rider && $rider->referred_by_id) {
                                $riderCompletedRides = $rider->rides()->where('ride_status_id', $ride_status_id)?->count();
                                if ($riderCompletedRides === 1) {
                                    $this->creditReferralBonus($ride, 'rider');
                                }
                            }

                            $driver = Driver::find($ride->driver_id);
                            if ($driver && $driver->referred_by_id) {
                                $riderCompletedRides = $driver->rides()->where('ride_status_id', $ride_status_id)?->count();
                                if ($riderCompletedRides === 1) {
                                    $this->creditReferralBonus($ride, 'driver');
                                }
                            }
                        }
                    }

                    $data['ride_id'] = $ride->id;
                }
            }

            $this->fireStoreUpdateDocument('driverTrack', $driver->id, $data, true);
            return response()->json([
                'id' => $ride->id,
                'ride_status' => [
                    'start_time' => $ride->start_time,
                    'name' => $ride->ride_status->name,
                    'slug' => $ride->ride_status->slug,
                ],
            ]);

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getRideLocationCharges($request)
    {
        try {

            $ride = $this->model->where('id', $request['ride_id'])?->whereNull('deleted_at')?->first();
            $zoneRideDistance = $this->getZoneRideDistance($request['location_coordinates']);
            if ($zoneRideDistance) {
                $new_zone_id = $zoneRideDistance->zone->id;
                $new_vehicleTypeZone = VehicleTypeZone::where('vehicle_type_id', $ride->vehicle_type_id)
                    ->where('zone_id', $new_zone_id)
                    ->first();

                if ($new_vehicleTypeZone) {
                    $rideDistance = $zoneRideDistance->ride_distance;
                    $isPeakZone = false;
                    $peakZone = $this->getPeakZones($request['location_coordinates'] ?? []);
                    if ($peakZone && $peakZone->zone_id == $new_zone_id) {
                        $peakZoneCharge = (($zoneRideDistance->zone->peak_price_increase_percentage ?? 0) * $new_vehicleTypeZone->base_fare_charge) / 100;
                        $new_vehicleTypeZone->base_fare_charge += $peakZoneCharge;
                        $isPeakZone = true;
                    } else {
                        $peakZoneCharge = 0;
                    }
                    $req = (object) array_merge($request, [
                        'service_id' => $ride->service_id,
                        'service_category_id' => $ride->service_category_id,
                        'vehicle_type_id' => $ride->vehicle_type_id,
                        'weight' => $ride->weight,
                        'ride_request_id' => $ride->ride_request_id,
                        'preferences' => $ride->preferences,
                        'current_time' => Carbon::now()->format('H:i:s'),
                        'ride_distance' => $rideDistance,
                        'duration' => $rideDistance['duration'] ?? $ride->duration,
                        'coupon_code' => $ride->coupon_code,
                        'rider_id' => $ride->rider_id,
                        'is_with_driver' => $ride->is_with_driver,
                        'is_peak_zone' => $isPeakZone,
                        'peak_zone_id' => $peakZone?->id,
                        'zone_id' => $new_zone_id,
                    ]);

                    return $this->calVehicleTypeZonePrice($rideDistance, $new_vehicleTypeZone, $req);
                }

                throw new Exception("Vehicle type zone not found!", 404);
            }

            throw new Exception("Zone not found!", 404);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    private function handleExtraChargesAndWaitingTime($ride, $request, $vehicleTypeZone)
    {
        $tax = 0;
        $waitingTime = null;
        $total_extra_charge = 0;

        if (isset($request['extra_charges']) && is_array($request['extra_charges']) && count($request['extra_charges'])) {
            foreach ($request['extra_charges'] as $extraCharge) {
                $ride->extra_charges()->create([
                    'title' => $extraCharge['title'] ?? null,
                    'amount' => $extraCharge['amount'] ?? 0,
                ]);
                $total_extra_charge += $extraCharge['amount'] ?? 0;
            }

            $subTotal = $ride->sub_total + $total_extra_charge;
            $platformSubTotal = $subTotal + ($ride->platform_fees ?? 0);
            $taxRate = getTaxRateById($vehicleTypeZone->tax_id) ?? 0;
            if ($taxRate && $platformSubTotal) {
                $tax = ($platformSubTotal * $taxRate) / 100;
            }

            $diffTax = ($tax - $ride->tax) < 0 ? 0 : ($tax - $ride->tax);
            $tax = ($diffTax > 0 && $tax) ? $tax : $ride->tax;
            $total = $ride->total + $diffTax + $total_extra_charge;

            $ride->update([
                'tax' => $tax,
                'sub_total' => $subTotal,
                'total' => $total,
                'total_extra_charge' => ($ride->total_extra_charge ?? 0) + $total_extra_charge,
            ]);
        }

        if($vehicleTypeZone) {
            if (!$ride->waiting_charges && !$ride->waiting_total_times) {
                $arrived_at = $ride->ride_status_activities()->where('status', RideStatusEnum::ARRIVED)->value('created_at');
                $started_at = $ride->ride_status_activities()->where('status', RideStatusEnum::STARTED)->value('created_at');

                if ($arrived_at && $started_at) {
                    $waitingTime = Carbon::parse($started_at)->diffInMinutes(Carbon::parse($arrived_at));
                    $waitingTime = round($waitingTime, 2);
                    if ($waitingTime >= $vehicleTypeZone->free_waiting_time_before_start_ride) {
                        $waitingTime -= $vehicleTypeZone->free_waiting_time_before_start_ride;
                    }
                    if ($waitingTime >= $vehicleTypeZone->free_waiting_time_after_start_ride) {
                        $waitingTime -= $vehicleTypeZone->free_waiting_time_after_start_ride;
                    }

                    if ($waitingTime > 0) {
                        $waiting_charges = $waitingTime * $vehicleTypeZone->waiting_charge;
                        $waiting_total_times = $waitingTime;
                        $total = $ride->total + $waiting_charges;

                        $ride->update([
                            'waiting_charges' => $waiting_charges,
                            'waiting_total_times' => $waiting_total_times,
                            'total' => $total,
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Get IncentiveCalculationService instance
     */
    private function getIncentiveCalculationService(): IncentiveCalculationService
    {
        if ($this->incentiveCalculationService === null) {
            $this->incentiveCalculationService = app(IncentiveCalculationService::class);
        }
        return $this->incentiveCalculationService;
    }

    /**
     * Calculate and credit multi-level incentives for completed ride
     */
    private function calculateAndCreditIncentive($ride, $vehicleTypeZone)
    {
        try {

            $driver = getDriverById($ride->driver_id);
            if (!$driver) {
                return;
            }

            $incentiveService = $this->getIncentiveCalculationService();
            $result = $incentiveService->calculateIncentives($driver, $ride, $vehicleTypeZone);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function startRide($request)
    {
        DB::beginTransaction();
        try {
            $roleName = getCurrentRoleName();
            if ($roleName == RoleEnum::DRIVER) {
                $ride = $this->model->findOrFail($request->ride_id);
                $service = getServiceById($ride->service_id);
                if ($ride->otp != $request->otp) {
                    throw new Exception(__('taxido::static.rides.invalid_otp'), 400);
                }
                if ($ride->driver_id != getCurrentUserId()) {
                    throw new Exception(__('taxido::static.rides.only_assigned_driver'), 400);
                }

                if ($service->slug == ServicesEnum::PARCEL) {
                    $ride->update([
                        'ride_status_id' => getRideStatusIdBySlug(RideStatusEnum::STARTED),
                        'parcel_delivered_otp' => rand(1000, 9999),
                    ]);
                } else {
                    $ride->update([
                        'is_otp_verified' => true,
                        'start_time' => $request->start_time,
                        'ride_status_id' => getRideStatusIdBySlug(RideStatusEnum::STARTED),
                        'start_ride_locations' => $request->start_ride_locations ?? null,
                        'start_ride_coordinates' => $request->start_ride_coordinates ?? null,
                    ]);
                }

                $ride->save();
                DB::commit();
                $ride = $ride->refresh();
                $driver = getDriverById($ride->driver_id);
                $driver->update(['is_on_ride' => true]);

                $this->updateRideStatusActivities($ride, RideStatusEnum::STARTED);
                $data = [
                    'driver_name' => $driver->name,
                    'is_verified' => $driver?->is_verified,
                    'is_on_ride' => (string) $driver?->is_on_ride,
                    'profile_image_url' => $driver?->profile_image?->original_url,
                    'rating_count' => $driver?->rating_count,
                    'review_count' => $driver?->review_count,
                    'phone' => $driver?->phone,
                    'country_code' => $driver?->country_code,
                    'model' => $driver?->vehicle_info?->model,
                    'plate_number' => $driver?->vehicle_info?->plate_number,
                    'ride_id' => $ride?->id,
                    'vehicle_type_map_icon_url' => $driver?->vehicle_info?->vehicle?->vehicle_map_icon?->original_url,
                ];

                $rideData = new RideDetailResource($ride);
                $rideDataArray = $rideData->toArray(request());
                $this->fireStoreUpdateDocument('driverTrack', $driver->id, $data, true);
                $rideDataArray = json_decode(json_encode($rideDataArray), true);
                $this->fireStoreUpdateDocument('rides', $ride->id, $rideDataArray, true);
                return response()->json([
                    'id' => $ride->id,
                    'data' => new RideResource($ride),
                    'ride_status' => [
                        'name' => $ride->ride_status->name,
                        'slug' => $ride->ride_status->slug,
                    ],
                ]);
            }
            throw new Exception(__('taxido::static.rides.user_must_be_driver'), 400);
        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function ambulanceStartRide($request)
    {
        DB::beginTransaction();
        try {
            $ride = $this->model->findOrFail($request->ride_id);
            $service = getServiceById($ride->service_id);
            if ($service->type == ServicesEnum::AMBULANCE) {
                $roleName = getCurrentRoleName();
                if ($roleName == RoleEnum::DRIVER) {
                    if ($ride->driver_id != getCurrentUserId()) {
                        throw new Exception(__('taxido::static.rides.only_assigned_driver'), 400);
                    }

                    $ride->update(['ride_status_id' => getRideStatusIdBySlug(RideStatusEnum::STARTED)]);
                    $ride->save();
                    DB::commit();
                    $ride = $ride->fresh();
                    $driver = getDriverById($ride->driver_id);
                    $driver->update(['is_on_ride' => true]);

                    $this->updateRideStatusActivities($ride, RideStatusEnum::STARTED);
                    $data = [
                        'driver_name' => $driver?->name,
                        'is_verified' => $driver?->is_verified,
                        'is_on_ride' => (string) $driver?->is_on_ride,
                        'profile_image_url' => $driver?->profile_image?->original_url,
                        'rating_count' => $driver?->rating_count,
                        'review_count' => $driver?->review_count,
                        'phone' => $driver?->phone,
                        'country_code' => $driver?->country_code,
                        'model' => $driver?->vehicle_info?->model,
                        'plate_number' => $driver?->vehicle_info?->plate_number,
                        'ride_id' => $ride?->id,
                        'vehicle_type_map_icon_url' => $driver?->vehicle_info?->vehicle?->vehicle_map_icon?->original_url,
                    ];

                    $rideData = new RideDetailResource($ride);
                    $rideDataArray = $rideData->toArray(request());
                    $this->fireStoreUpdateDocument('driverTrack', $driver->id, $data, true);

                    $rideDataArray = json_decode(json_encode($rideDataArray), true);
                    $this->fireStoreUpdateDocument('rides', $ride->id, $rideDataArray, true);
                    return response()->json([
                        'id' => $ride->id,
                        'data' => new RideResource($ride),
                        'ride_status' => [
                            'name' => $ride->ride_status->name,
                            'slug' => $ride->ride_status->slug,
                        ],
                    ]);
                }
                throw new Exception(__('taxido::static.rides.user_must_be_driver'), 400);
            }

            throw new Exception(__('taxido::static.rides.only_ambulance_ride_request'), 400);

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyOtp($request)
    {
        DB::beginTransaction();
        try {
            if (parcelOtpEnabled()) {
                $roleName = getCurrentRoleName();
                if ($roleName != RoleEnum::DRIVER) {
                    throw new Exception(__('taxido::static.rides.user_must_be_driver'), 400);
                }

                $ride = $this->model->findOrFail($request->ride_id);
                if ($ride->service_id != getServiceIdBySlug(ServicesEnum::PARCEL)) {
                    throw new Exception(__('taxido::static.rides.invalid_service_type'), 400);
                }

                if ($ride->otp != $request->otp) {
                    throw new Exception(__('taxido::static.rides.invalid_otp'), 400);
                }

                $ride->update(['is_otp_verified' => true, 'parcel_otp_verified_at' => now()]);
                DB::commit();
                return response()->json([
                    'id' => $ride->id,
                    'ride_status' => [
                        'name' => $ride->ride_status->name,
                        'slug' => $ride->ride_status->slug,
                    ],
                ]);
            }
            throw new Exception(__('taxido::static.rides.parcel_otp_disabled'), 400);
        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyCoupon($request)
    {
        try {
            $rideDiscount = 0;
            $coupon = $this->getCoupon($request->coupon);
            if ($coupon) {
                $total = $this->isValidCoupon($coupon, $request);
                if ($total) {
                    switch ($coupon->type) {
                        case 'fixed':
                            $rideDiscount = $this->fixedDiscount($total, $coupon->amount);
                            break;
                        case 'percentage':
                            $rideDiscount = $this->percentageDiscount($total, $coupon->amount);
                            break;
                        default:
                            $rideDiscount = 0;
                    }
                }
            }
            return [
                'total_coupon_discount' => round($rideDiscount, 2),
                'coupon_type' => $coupon->type,
                'is_apply_all' => $coupon->is_apply_all,
                'amount' => $coupon->amount,
                'applicable_vehicles' => $coupon->vehicle_types()->pluck('vehicle_type_id')->toArray(),
                'success' => true,
            ];
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function payment($request)
    {
        DB::beginTransaction();
        try {
            $ride = $this->model->findOrFail($request->ride_id);
            $settings = getTaxidoSettings();
            if ($request->driver_tip && !$ride->driver_tips) {
                if ($settings['activation']['driver_tips']) {
                    $ride->driver_tips = $request->driver_tip;
                    $ride->comment = $request->comment;
                    $ride->sub_total = $ride->sub_total + $request->driver_tip;
                    $ride->total = $ride->total + $request->driver_tip;
                    $ride->save();
                    $ride = $ride->refresh();
                }
            }

            if ($request->coupon) {
                $discount = $this->verifyCoupon($request);
                if (isset($discount['total_coupon_discount'])) {
                    $coupon = $this->getCoupon($request->coupon);
                    if ($coupon) {
                        $ride->coupon_id = $coupon->id;
                        $ride->coupon_total_discount = $discount['total_coupon_discount'] ?? 0;
                        $ride->sub_total = $ride->sub_total - ($discount['total_coupon_discount'] ?? 0);
                        $ride->total = $ride->total - ($discount['total_coupon_discount'] ?? 0);
                        $ride->save();
                    }
                }
            }

            DB::commit();
            $ride = $ride->refresh();
            if ($request->payment_method != PaymentMethod::CASH && $request->payment_method != PaymentMethod::WALLET) {
                if (!$settings['activation']['online_payments']) {
                    throw new Exception(__('taxido::static.online_payments_is_disabled'), 400);
                }

                $module = Module::find($request->payment_method);
                if (!is_null($module) && $module->isEnabled()) {
                    $moduleName = $module->getName();
                    $payment = 'Modules\\' . $moduleName . '\\Payment\\' . $moduleName;
                    if (class_exists($payment) && method_exists($payment, 'getIntent')) {
                        if ($ride->payment_method != PaymentMethod::CASH) {
                            $ride->payment_status = PaymentStatus::PENDING;
                            $ride->payment_mode = PaymentMode::ONLINE;
                            $processing_fee = config($request->payment_method)['processing_fee'] ?? 0.0;
                            $ride->processing_fee = $processing_fee ?? 0;
                            $ride->total = $ride->total + $processing_fee;
                            $ride->save();
                        }

                        $request->merge(['type' => 'ride', 'request_type' => 'api']);
                        return $payment::getIntent($ride, $request);
                    }
                    throw new Exception(__('static.booking.payment_module_not_found'), 400);
                }
                throw new Exception(__('taxido::static.rides.selected_payment_module_not_found'), 400);
            } elseif ($request->payment_method == PaymentMethod::CASH) {
                if (!$settings['activation']['cash_payments']) {
                    throw new Exception(__('taxido::static.cash_payments_is_disabled'), 400);
                }
                $ride->payment_mode = PaymentMode::OFFLINE;
                $ride->save();
                $request->merge(['type' => 'ride']);
                $ride = $this->paymentStatus($ride, PaymentStatus::COMPLETED, $request);
                $rideData = new RideDetailResource($ride);
                $rideDataArray = $rideData->toArray(request());

                $rideDataArray = json_decode(json_encode($rideDataArray), true);
                $this->fireStoreUpdateDocument('rides', $ride->id, $rideDataArray, true);
                return $ride;
            } elseif ($request->payment_method == PaymentMethod::WALLET) {
                $riderId = getCurrentUserId();
                $request->merge(['type' => 'ride']);
                $ride = $this->paymentStatus($ride, PaymentStatus::COMPLETED, $request);
                $ride->payment_method = PaymentMethod::WALLET;
                $ride->save();
                $ride = $ride->refresh();

                if ($this->verifyRiderWallet($riderId, $ride->total)) {
                    $this->debitRiderWallet($riderId, $ride->total, "Wallet amount successfully debited for ride #{$ride->ride_number}.");
                }

                $rideData = new RideDetailResource($ride);
                $rideDataArray = $rideData->toArray(request());
                $rideDataArray = json_decode(json_encode($rideDataArray), true);
                $this->fireStoreUpdateDocument('rides', $ride->id, $rideDataArray, true);
                return $ride;
            }
            throw new Exception(__('static.invalid_payment_method'), 400);
        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyPayment($request)
    {
        try {
            $paymentTransaction = self::getPaymentTransactions($request->item_id, $request->type, $request->transaction_id);
            if ($paymentTransaction) {
                $item = null;
                $payment_method = $paymentTransaction->payment_method;
                switch ($paymentTransaction->type) {
                    case 'wallet':
                        $currentRoleName = getCurrentRoleName();
                        if ($currentRoleName === RoleEnum::DRIVER) {
                            $item = DriverWallet::findOrFail($request->item_id);
                        } elseif ($currentRoleName === RoleEnum::RIDER) {
                            $item = RiderWallet::findOrFail($request->item_id);
                        }
                        break;
                    case 'subscription':
                        $item = $this->getDriverSubscription($request->item_id);
                        break;
                    case 'ride':
                        $item = $this->model->findOrFail($request->item_id);
                        $item->payment_method = $payment_method;
                        $item->save();
                        $item = $item->refresh();
                        if ($paymentTransaction->payment_status == PaymentStatus::COMPLETED) {
                            $rideRequestId = RideRequest::where('ride_number', $item->ride_number)?->first()?->id;
                            $this->fireStoreDeleteDocument('ride_requests', $rideRequestId);
                            $this->fireStoreDeleteDocument('rides', $item?->id);
                        } else {
                            $rideData = new RideDetailResource($item);
                            $rideDataArray = $rideData->toArray(request());
                            $rideDataArray = json_decode(json_encode($rideDataArray), true);
                            $this->fireStoreUpdateDocument('rides', $item->id, $rideDataArray, true);
                        }
                }

                if (!$paymentTransaction->is_verified) {
                    if ($item && $payment_method) {
                        if ($payment_method != PaymentMethod::CASH) {
                            $payment = Module::find($payment_method);
                            if (!is_null($payment) && $payment->isEnabled()) {
                                $request['amount'] = $paymentTransaction->amount;
                                $request['transaction_id'] = $paymentTransaction->transaction_id;
                                $payment_status = $paymentTransaction->payment_status;
                                $paymentTransaction->update(['is_verified' => true]);
                                $item = $this->paymentStatus($item, $payment_status, $request);
                                return response()->json(['id' => $item->id]);
                            }
                        } elseif ($payment_method == PaymentMethod::CASH || $payment_method == PaymentMethod::WALLET) {
                            $payment_status = PaymentStatus::COMPLETED;
                            $paymentTransaction->update(['is_verified' => true]);
                            return response()->json(['id' => $item->id]);
                        }
                        throw new Exception(__('static.payment_methods.not_found'), 400);
                    }
                }
                return response()->json(['id' => $item->id]);
            }
            throw new Exception(__('taxido::static.rides.invalid_details'), 400);
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getDriverSubscription($item_id)
    {
        return DriverSubscription::findOrFail($item_id);
    }

    public function paymentStatus($item, $status, $request)
    {
        if ($status) {
            if ($request->type == 'ride') {
                $item->update(['payment_status' => $status]);
                if ($status == PaymentStatus::COMPLETED) {
                    $ride_status_id = getRideStatusIdBySlug(RideStatusEnum::COMPLETED);
                    if ($ride_status_id) {
                        $item->ride_status_id = $ride_status_id;
                        $item->save();
                        $item = $item->refresh();
                    }
                    $this->calAdminDriverCommission($item);
                }
            } elseif ($request->type == 'wallet') {
                if ($status == PaymentStatus::COMPLETED) {
                    $item->increment('balance', $request->amount);
                    $transaction_id = $request->transaction_id;
                    $this->storeTransaction($item, TransactionType::CREDIT, WalletDetail::TOPUP, $request->amount, null, $transaction_id);
                }
            } elseif ($request->type == 'subscription') {
                if ($status == PaymentStatus::COMPLETED) {
                    $item->update(['payment_status' => $status]);
                    return $item;
                }
            }
        }
        return $item;
    }

    public function getRiderInvoice($request)
    {
        $ride = $this->verifyInvoiceId($request->invoice_id);
        $roleName = getCurrentRoleName();

        if ($ride->rider_id != getCurrentUserId() && $roleName == RoleEnum::RIDER) {
            throw new Exception(__('errors.not_created_ride'), 400);
        }

        $invoice = [
            'ride' => $ride,
            'settings' => getTaxidoSettings(),
        ];

        return Pdf::loadView('taxido::emails.rider-invoice', $invoice)->download('rider_invoice_' . $ride->ride_number . '.pdf');
    }

    public function getDriverInvoice($request)
    {
        try {
            $ride = $this->verifyInvoiceId($request->invoice_id);
            $roleName = getCurrentRoleName();
            if ($ride->driver_id != getCurrentUserId() && $roleName == RoleEnum::DRIVER) {
                throw new Exception(__('errors.not_created_ride'), 400);
            }

            $invoice = [
                'ride' => $ride,
                'settings' => getTaxidoSettings(),
            ];

            return Pdf::loadView('taxido::emails.driver-invoice', $invoice)->download('driver_invoice_' . $ride->ride_number . '.pdf');
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyInvoiceId($invoice_id)
    {
        try {
            $ride = $this->model->where('invoice_id', $invoice_id)->first();
            if (!$ride) {
                throw new Exception(__('errors.invalid_ride_number'), 400);
            }
            return new RideDetailResource($ride);

        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function fetchTodayScheduleRide()
    {
        try {
            $today = now()->format('Y-m-d');
            $cabSettings = getTaxidoSettings();
            $leadTimeMinutes = $cabSettings['ride']['schedule_ride_request_lead_time'] ?? 15;
            $serviceCategoryIds = getServiceCategoryIdsByType(ServiceCategoryEnum::SCHEDULE);
            $rideRequestIds = RideRequest::whereIn('service_category_id', $serviceCategoryIds)
                ->whereDate('start_time', $today)
                ->whereNull('deleted_at')
                ->pluck('id');
            foreach ($rideRequestIds as $rideRequestId) {
                if ($rideRequestId) {
                    $rideRequest = RideRequest::where('id', $rideRequestId)->whereNull('deleted_at')->first();
                    if ($rideRequest) {
                        $startTime = Carbon::parse($rideRequest->start_time);
                        $drivers = $this->findIdleDrivers($rideRequest);
                        if ($leadTimeMinutes) {
                            $reminderTime = $startTime->subMinutes($leadTimeMinutes);
                            if (now() >= $reminderTime && now() < $startTime) {
                                $rideRequest->ride_status_activities()->create([
                                    'status' => RideStatusEnum::REQUESTED,
                                    'changed_at' => now(),
                                ]);
                                $drivers = $this->findIdleDrivers($rideRequest);
                                $rideRequestFireStoreFields = new RideRequestResource($rideRequest);
                                $data = $rideRequestFireStoreFields->toArray(request());
                                $this->addRideRequestFireStore($data, $drivers);
                            }
                        }
                    }
                }
            }
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function offlineDrivers()
    {
        try {
            $filters = [['is_online', '==', '1']];
            $cabSettings = getTaxidoSettings();
            $driverMaxOnlineHours = $cabSettings['ride']['driver_max_online_hours'] ?? 18;
            if ($driverMaxOnlineHours) {
                $drivers = $this->fireStoreQueryCollection('driverTrack', $filters);
                $workingHoursAgo = Carbon::now()->subHours($driverMaxOnlineHours)->format('Y-m-d\TH:i:s.v\Z');
                foreach ($drivers as $driver) {
                    $lastOnline = $driver['last_online_at'] ?? null;
                    if ($lastOnline && $lastOnline < $workingHoursAgo) {
                        $this->fireStoreUpdateDocument('driverTrack', $driver['id'], ['is_online' => '0'], true);
                    } elseif (!$lastOnline) {
                        $this->fireStoreUpdateDocument('driverTrack', $driver['id'], ['is_online' => '0'], true);
                    }
                }
                return $drivers;
            }
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
