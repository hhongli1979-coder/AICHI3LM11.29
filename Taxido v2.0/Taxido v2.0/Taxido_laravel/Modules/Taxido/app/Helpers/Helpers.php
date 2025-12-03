<?php

use App\Models\Tax;
use Carbon\Carbon;
use App\Enums\PaymentStatus;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Enums\RequestEnum;
use Modules\Taxido\Enums\RideStatusEnum;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Enums\ServicesEnum;
use Modules\Taxido\Models\Airport;
use Modules\Taxido\Models\Ambulance;
use Modules\Taxido\Models\Coupon;
use Modules\Taxido\Models\Driver;
use Modules\Taxido\Models\Ride;
use Modules\Taxido\Models\Rider;
use Modules\Taxido\Models\VehicleInfo;
use Modules\Taxido\Models\Zone;
use Modules\Taxido\Models\Service;
use Modules\Taxido\Models\PeakZone;
use Modules\Taxido\Models\Dispatcher;
use Modules\Taxido\Models\RideStatus;
use Modules\Taxido\Models\DriverWallet;
use Modules\Taxido\Models\DriverReview;
use Modules\Taxido\Models\VehicleType;
use Modules\Taxido\Models\RideRequest;
use Modules\Taxido\Models\RiderReview;
use Modules\Taxido\Models\FleetManager;
use Modules\Taxido\Models\TaxidoSetting;
use Modules\Taxido\Models\PaymentAccount;
use Modules\Taxido\Models\DriverDocument;
use Modules\Taxido\Models\ServiceCategory;
use Modules\Taxido\Models\WithdrawRequest;
use Modules\Taxido\Models\VehicleTypeZone;
use Modules\Taxido\Models\FleetManagerWallet;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Modules\Taxido\Models\CabCommissionHistory;
use Modules\Taxido\Models\FleetWithdrawRequest;

if (! function_exists('getCurrentRider')) {
    function getCurrentRider()
    {
        $rider = Rider::where('id', getCurrentUserId())->first(['id', 'name', 'email', 'country_code', 'phone']);
        if ($rider) {
            return (object) [
                'id'           => $rider?->id,
                'name'         => $rider?->name,
                'email'        => $rider?->email,
                'country_code' => $rider?->country_code,
                'phone'        => $rider?->phone,
            ];
        }
    }
}

if (! function_exists('getRiderById')) {
    function getRiderById($rider_id)
    {
        return Rider::where('id', $rider_id)->first(['id', 'name', 'email', 'country_code', 'phone']);
    }
}

if (! function_exists('getAllRiders')) {
    function getAllRiders()
    {
        Rider::where('status', true)?->get();

    }
}

if (! function_exists('getAllDispatchers')) {
    function getAllDispatchers()
    {
        return Dispatcher::where('status', true)?->count();
    }
}

if (! function_exists('getAllFleetManagers')) {
    function getAllFleetManagers()
    {
        return FleetManager::where('status', true)?->count();
    }
}

if (! function_exists('getAllCouponCodes')) {
    function getAllCouponCodes()
    {
        return Coupon::where('status', true)?->get();
    }
}

if (! function_exists('getRideStatus')) {
    function getRideStatus()
    {
        return RideStatus::get();
    }
}

if (! function_exists('getRideStatusIdBySlug')) {
    function getRideStatusIdBySlug($slug)
    {
        return RideStatus::where('slug', $slug)?->value('id');
    }
}

if (! function_exists('getTotalRidesByStatus')) {
    function getTotalRidesByStatus($status, $start_date = null, $end_date = null)
    {
        $rides = Ride::where('ride_status_id', getRideStatusIdBySlug($status))?->whereNull('deleted_at');
        if (getCurrentRoleName() == RoleEnum::DRIVER) {
            $rides = $rides->where('driver_id', getCurrentUserId());
        }

        if (getCurrentRoleName() == RoleEnum::FLEET_MANAGER) {
            $fleetManagerId = getCurrentUserId();
            $rides          = $rides->whereHas('driver', function ($q) use ($fleetManagerId) {
                $q->where('fleet_manager_id', $fleetManagerId);
            });
        }

        if (getCurrentRoleName() == RoleEnum::DISPATCHER) {
            $rides = $rides->whereHas('zones', function ($q) {
                $q->whereHas('dispatchers', function ($q) {
                    $q->where('dispatcher_id', getCurrentUserId());
                });
            });
        }

        if ($start_date && $end_date) {
            $rides = $rides->whereBetween('created_at', [$start_date, $end_date]);
        }

        return $rides->count();
    }
}


if (! function_exists('getActiveRidesIds')) {
    function getActiveRidesIds()
    {
        $roleName = getCurrentRoleName();
        $rides = Ride::whereIn('ride_status_id', getRideStatusIdsBySlugs([
            RideStatusEnum::STARTED, RideStatusEnum::ARRIVED, RideStatusEnum::ACCEPTED, RideStatusEnum::SCHEDULED
        ]))?->whereNull('deleted_at');

        if ($roleName == RoleEnum::DRIVER) {
            $rides = $rides->where('driver_id', getCurrentUserId());
        }

        if ($roleName == RoleEnum::RIDER) {
            $rideId =  $rides->where('rider_id', getCurrentUserId())?->latest()?->first()?->id;
            Log::info('getActiveRidesIds: ' . $rideId);

            return $rideId;
        }

        return $rides->pluck('id')?->toArray();
    }
}

if (! function_exists('getTotalRidesByStatusForRider')) {
    function getTotalRidesByStatusForRider($status, $start_date = null, $end_date = null)
    {
        $rides = Ride::where('ride_status_id', getRideStatusIdBySlug($status))
            ->whereNull('deleted_at');

        if (getCurrentRoleName() == RoleEnum::RIDER) {
            $rides = $rides->where('rider_id', getCurrentUserId());
        }

        if ($start_date && $end_date) {
            $rides = $rides->whereBetween('created_at', [$start_date, $end_date]);
        }
        return $rides->count();
    }
}

if (! function_exists('getTotalDriverRidesByStatus')) {
    function getTotalDriverRidesByStatus($status, $driver_id)
    {
        return Ride::where('ride_status_id', getRideStatusIdBySlug($status))?->where('driver_id', $driver_id)->whereNull('deleted_at')?->count();
    }
}

if (! function_exists('getTotalRiders')) {
    function getTotalRiders($start_date = null, $end_date = null)
    {
        $query = Rider::where('status', true);
        if ($start_date && $end_date) {
            return $query->whereBetween('created_at', [$start_date, $end_date])->count();
        }
        return $query->whereYear('created_at', date('Y'))->whereMonth('created_at', date('m'))->count();
    }
}



if (! function_exists('getTotalDispatchers')) {
    function getTotalDispatchers($start_date = null, $end_date = null)
    {
        $query = Dispatcher::where('status', true);

        if ($start_date && $end_date) {
            return $query->whereBetween('created_at', [$start_date, $end_date])->count();
        }
        $query->whereYear('created_at', date('Y'))->whereMonth('created_at', date('m'))->count();
    }
}

if (! function_exists('getPeakZones')) {
    function getPeakZones($start_date = null, $end_date = null)
    {
        $query = PeakZone::where('is_active', true);
        if ($start_date && $end_date) {
            return $query->whereBetween('created_at', [$start_date, $end_date])->count();
        }
        $query->whereYear('created_at', date('Y'))->whereMonth('created_at', date('m'))->count();

    }
}


if (! function_exists('getTotalRidersPercentage')) {
    function getTotalRidersPercentage($start_date = null, $end_date = null)
    {
        $sort             = request('sort') ?? null;
        $previousRange    = getPreviousDateRange($sort, request('start'), request('end'));
        $previousCount    = getTotalRiders($previousRange['start'], $previousRange['end']);
        $customRangeCount = getTotalRiders($start_date, $end_date);

        return calculatePercentage($customRangeCount, $previousCount);
    }
}

if (! function_exists('getTotalWithdrawRequestsPercentage')) {
    function getTotalWithdrawRequestsPercentage($start_date = null, $end_date = null)
    {
        $sort              = request('sort') ?? null;
        $previousRange     = getPreviousDateRange($sort, request('start'), request('end'));
        $previousAmount    = getTotalWithdrawals($previousRange['start'], $previousRange['end']);
        $customRangeAmount = getTotalWithdrawals($start_date, $end_date);

        return calculatePercentage($customRangeAmount, $previousAmount);
    }
}

if (! function_exists('getTotalWalletsPercentage')) {
    function getTotalWalletsPercentage($start_date = null, $end_date = null)
    {
        $sort               = request('sort') ?? null;
        $previousRange      = getPreviousDateRange($sort, request('start'), request('end'));
        $previousBalance    = getDriverWalletBalance(getCurrentUserId(), $previousRange['start'], $previousRange['end']);
        $customRangeBalance = getDriverWalletBalance(getCurrentUserId(), $start_date, $end_date);

        return calculatePercentage($customRangeBalance, $previousBalance);
    }
}

if (! function_exists('getTotalDriversPercentage')) {
    function getTotalDriversPercentage($start_date = null, $end_date = null, $is_verified = null)
    {
        $sort             = request('sort') ?? null;
        $previousRange    = getPreviousDateRange($sort, request('start'), request('end'));
        $previousCount    = getTotalDrivers($previousRange['start'], $previousRange['end'], $is_verified);
        $customRangeCount = getTotalDrivers($start_date, $end_date, $is_verified);

        return calculatePercentage($customRangeCount, $previousCount);
    }
}

if (! function_exists('getTotalReviewsPercentage')) {
    function getTotalReviewsPercentage($start_date = null, $end_date = null)
    {
        $sort             = request('sort') ?? null;
        $previousRange    = getPreviousDateRange($sort, request('start'), request('end'));
        $previousCount    = getDriverReviewsCount(getCurrentUserId(), $previousRange['start'], $previousRange['end']);
        $customRangeCount = getDriverReviewsCount(getCurrentUserId(), $start_date, $end_date);

        return calculatePercentage($customRangeCount, $previousCount);
    }
}

if (! function_exists('getTotalDocumentsPercentage')) {
    function getTotalDocumentsPercentage($start_date = null, $end_date = null)
    {
        $sort             = request('sort') ?? null;
        $previousRange    = getPreviousDateRange($sort, request('start'), request('end'));
        $previousCount    = getDriverDocumentsCount(getCurrentUserId(), $previousRange['start'], $previousRange['end']);
        $customRangeCount = getDriverDocumentsCount(getCurrentUserId(), $start_date, $end_date);

        return calculatePercentage($customRangeCount, $previousCount);
    }
}

if (! function_exists('getTotalRidesPercentage')) {
    function getTotalRidesPercentage($start_date = null, $end_date = null)
    {
        $sort             = request('sort') ?? null;
        $previousRange    = getPreviousDateRange($sort, request('start'), request('end'));
        $previousCount    = getTotalRides($previousRange['start'], $previousRange['end']);
        $customRangeCount = getTotalRides($start_date, $end_date);

        return calculatePercentage($customRangeCount, $previousCount);
    }
}

if (! function_exists('getTotalRidesEarningsPercentage')) {
    function getTotalRidesEarningsPercentage($start_date = null, $end_date = null, $paymentMethod = null)
    {
        $sort                = request('sort') ?? null;
        $previousRange       = getPreviousDateRange($sort, request('start'), request('end'));
        $previousEarnings    = getTotalRidesEarnings($previousRange['start'], $previousRange['end'], $paymentMethod);
        $customRangeEarnings = getTotalRidesEarnings($start_date, $end_date, $paymentMethod);

        return calculatePercentage($customRangeEarnings, $previousEarnings);
    }
}

if (! function_exists('calculatePercentage')) {
    function calculatePercentage($customRangeCount, $todayCount)
    {

        if ($todayCount == 0) {
            $todayCount = 1;
            $difference = 1;
            $percentage = ($customRangeCount / $todayCount) * 100;
        } else {
            $difference = $customRangeCount - $todayCount;
            $percentage = ($difference / $todayCount) * 100;
        }

        return [
            'status'     => $difference > 0 ? 'increase' : ($difference < 0 ? 'decrease' : 'no_change'),
            'percentage' => number_format(($percentage), 2),
        ];
    }
}

if (! function_exists('getTotalDrivers')) {
    function getTotalDrivers($start_date = null, $end_date = null, $is_verified = null)
    {
        $query = Driver::where('status', true);

        if ($is_verified !== null) {
            $query->where('is_verified', $is_verified);
        }
        if ($start_date && $end_date) {
           return $query->whereBetween('created_at', [$start_date, $end_date])->count();
        }
        return  $query->whereYear('created_at', date('Y'))
            ->whereMonth('created_at', date('m'))
            ->count();

    }
}

if (! function_exists('getTotalFleetDrivers')) {
    function getTotalFleetDrivers($start_date = null, $end_date = null, $is_verified = null)
    {
        $query = FleetManager::where('status', true);

        if ($is_verified !== null) {
            $query->where('is_verified', $is_verified);
        }
        if ($start_date && $end_date) {
            return $query->whereBetween('created_at', [$start_date, $end_date])->count();
        }
         return $query->whereYear('created_at', date('Y'))
            ->whereMonth('created_at', date('m'))
            ->count();

    }
}

if (! function_exists('getTotalFleetManagers')) {
    function getTotalFleetManagers($start_date = null, $end_date = null, $is_verified = null)
    {
        $query = FleetManager::where('status', true);
        $role=getCurrentRoleName();
        if ($role == RoleEnum::FLEET_MANAGER) {
           $query = $query->where('fleet_manager_id', getCurrentUserId());
        }

        if ($is_verified !== null) {
            $query->where('is_verified', $is_verified);
        }

        if ($start_date && $end_date) {
            return $query->whereBetween('created_at', [$start_date, $end_date])->count();
        }

        return $query->whereYear('created_at', date('Y'))
            ->whereMonth('created_at', date('m'))
            ->count();
    }
}

if (! function_exists('getTotalRides')) {
    function getTotalRides($start_date = null, $end_date = null)
    {
        $query = Ride::query();

        if ($start_date && $end_date) {
            $query->whereBetween('created_at', [$start_date, $end_date]);
        } else {
            $query->whereYear('created_at', date('Y'))
                ->whereMonth('created_at', date('m'));
        }

        $role = getCurrentRoleName();

        if ($role == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        }

        if ($role == RoleEnum::FLEET_MANAGER) {
            $query->whereHas('driver', function ($q) {
                $q->where('fleet_manager_id', getCurrentUserId());
            });
        }

        if ($role == RoleEnum::DISPATCHER) {
            $query->whereHas('zones', function ($q) {
                $q->whereHas('dispatchers', function ($q) {
                    $q->where('dispatcher_id', getCurrentUserId());
                });
            });
        }

        return $query->count();
    }
}

if (! function_exists('getTotalRidesEarnings')) {
    function getTotalRidesEarnings($start_date = null, $end_date = null, $paymentMethod = null,)
    {
        $query = Ride::query();
        if ($start_date && $end_date) {
            $query->whereBetween('created_at', [$start_date, $end_date]);
        } else {
            $query->whereYear('created_at', date('Y'))?->whereMonth('created_at', date('m'));
        }

        $role = getCurrentRoleName();
        if ($role == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        }

        if ($role == RoleEnum::FLEET_MANAGER) {
            $query->whereHas('driver', function ($q) {
                $q->where('fleet_manager_id', getCurrentUserId());
            });
        }

        if ($role == RoleEnum::DISPATCHER) {
            $query->whereHas('zones', function ($q) {
                $q->whereHas('dispatchers', function ($q) {
                    $q->where('dispatcher_id', getCurrentUserId());
                });
            });
        }

        if ($paymentMethod === 'cash') {
            $query->where('payment_method', 'cash');
        } elseif ($paymentMethod === 'online') {
            $query->whereNot('payment_method', 'cash');
        }

        return $query->sum('sub_total');
    }
}

if (! function_exists('getAllZones')) {
    function getAllZones()
    {
        return Zone::where('status', true)?->get(['id', 'name']);
    }
}

if (! function_exists('getAllVehicleTypes')) {
    function getAllVehicleTypes()
    {
        return VehicleType::where('status', true)->get();
    }
}

if (! function_exists('getAllServices')) {
    function getAllServices()
    {
        return Service::where('status', true)->get();
    }
}

if (! function_exists('getServiceIdBySlug')) {
    function getServiceIdBySlug($type)
    {
        return Service::where('type', $type)->value('id');
    }
}

if (! function_exists('getServiceTyeById')) {
    function getServiceTyeById($type)
    {
        return Service::where('id', $type)?->whereNull('deleted_at')->value('type');
    }
}

if (! function_exists('getServiceCategoryTyeById')) {
    function getServiceCategoryTyeById($type)
    {
        return ServiceCategory::where('id', $type)?->whereNull('deleted_at')->value('type');
    }
}

if (! function_exists('getAllVerifiedDrivers')) {
    function getAllVerifiedDrivers()
    {
        return  Driver::where('is_verified', true)->where('status', true)->get();
    }
}

if (! function_exists('getAllDrivers')) {
    function getAllDrivers()
    {
        return Driver::where('status', true)->get();
    }
}

if (! function_exists('getAllServices')) {
    function getAllServices()
    {
        return Service::where('status', true)->get();
    }
}

if (! function_exists('getCurrentDriver')) {
    function getCurrentDriver()
    {
        return Driver::where('id', getCurrentUserId())->first();
    }
}

if (! function_exists('getCurrentFleetManager')) {
    function getCurrentFleetManager()
    {
        return FleetManager::where('id', getCurrentUserId())->first();
    }
}

if (! function_exists('getZoneByPoint')) {
    function getZoneByPoint($latitude, $longitude)
    {
        $lat   = (float) $latitude;
        $lng   = (float) $longitude;
        $point = new Point($lat, $lng);
        return Zone::whereContains('place_points', $point)
            ->where('status', true)
            ->orderByRaw('ST_Area(place_points) ASC')
            ->limit(1)
            ->with('currency:id,code,symbol,exchange_rate')
            ->get();
    }
}

if (! function_exists('getCurrencySymbolByZoneId')) {
    function getCurrencySymbolByZoneId($zone_id)
    {
        $zone = Zone::findOrFail($zone_id);
        return $zone->currency?->symbol;
    }
}

if (! function_exists('getZoneByPoints')) {
    function getZoneByPoints($latitude, $longitude)
    {
        $lat   = (float) $latitude;
        $lng   = (float) $longitude;
        $point = new Point($lat, $lng);
        return Zone::whereContains('place_points', $point)
            ->orderByRaw('ST_Area(place_points) ASC')
            ->limit(1)
            ->get(['id', 'name', 'locations', 'amount', 'currency_id']);
    }
}

if (! function_exists('getDriverZoneByPoint')) {
    function getDriverZoneByPoint($latitude, $longitude)
    {
        $lat   = (float) $latitude;
        $lng   = (float) $longitude;
        $point = new Point($lat, $lng);
        return Zone::whereContains('place_points', $point)
            ->orderByRaw('ST_Area(place_points) ASC')
            ->get(['id', 'name', 'locations', 'amount', 'currency_id', 'payment_method']);
    }
}

if (! function_exists('getAirportByPoints')) {
    function getAirportByPoints($locations)
    {
        $airportIds = [];
        foreach($locations as $location) {
            if(isset($location['lat']) && isset($location['lng'])) {
                $lat   = (float) $location['lat'];
                $lng   = (float) $location['lng'];
            }

            $point = new Point($lat, $lng);
            $airportIds = array_merge($airportIds ?? [], Airport::whereContains('place_points', $point)
                ->orderByRaw('ST_Area(place_points) ASC')->pluck('id')
                ->toArray());
        }

        if(!empty($airportIds)) {
            $airportIds = array_unique($airportIds);
        }

        return $airportIds;
    }
}

if (!function_exists('getTaxidoSettings')) {
    function getTaxidoSettings()
    {
        return TaxidoSetting::pluck('taxido_values')?->first();
    }
}

if (!function_exists('getRideStatusIdByName')) {
    function getRideStatusIdByName($name)
    {
        return RideStatus::where('name', ucfirst($name))->value('id');
    }
}

if (! function_exists('getRideStatusIdBySlug')) {
    function getRideStatusIdBySlug($slug)
    {
        return RideStatus::where('slug', $slug)->value('id');
    }
}

if (! function_exists('getRideStatusNameById')) {
    function getRideStatusNameById($id)
    {
        return RideStatus::where('id', $id)->value('name');
    }
}

if (! function_exists('couponIsEnable')) {
    function couponIsEnable()
    {
        $taxidoSettings = getTaxidoSettings();
        return $taxidoSettings['activation']['coupon_enable'];
    }
}

if (! function_exists('rideCountryCode')) {
    function rideCountryCode()
    {
        $taxidoSettings = getTaxidoSettings();
        return $taxidoSettings['ride']['country_code'];
    }
}


if (! function_exists('getDriversByZoneIds')) {
    function getDriversByZoneIds($zoneIds)
    {
        return Driver::whereRelation('zones', function ($zones) use ($zoneIds) {
            $zones->WhereIn('zone_id', $zoneIds);
        })->where('is_online', true)?->whereNull('deleted_at');
    }
}

if (!function_exists('getDrivers')) {
    function getDrivers($asQuery = false)
    {
        $query = Driver::query()->where('status', true);
        if (getCurrentRoleName() === RoleEnum::DRIVER) {
            $query->where('id', getCurrentUserId());
        }

        if (getCurrentRoleName() === RoleEnum::FLEET_MANAGER) {
            $query->where('fleet_manager_id', getCurrentUserId());
        }

        if (getCurrentRoleName() === RoleEnum::DISPATCHER) {
            $query->whereHas('zones', function ($q) {
                $q->whereHas('dispatchers', function ($q) {
                    $q->where('dispatcher_id', getCurrentUserId());
                });
            });
        }

        if ($asQuery) {
            return $query;
        }

        return $query->with(['profile_image', 'reviews', 'vehicle_info.vehicle.vehicle_image', 'onRides.rider.profile_image', 'onRides.service', 'onRides.service_category', 'onRides.zones'])->get();
    }
}

if (! function_exists('getNearestDriversByZoneIds')) {
    function getNearestDriversByZoneIds($zoneIds, $coordinates, $vehicleTypeId = null)
    {
        $drivers = getDriversByZoneIds($zoneIds);
        if ($vehicleTypeId) {
            $drivers = $drivers->whereHas('vehicle_info', function ($query) use ($vehicleTypeId) {
                $query->where('vehicle_type_id', $vehicleTypeId);
            });
        }

        $drivers = $drivers?->where('is_on_ride', false);
        return $drivers->pluck('id');
    }
}

if (! function_exists('getDriverWalletId')) {
    function getDriverWalletId($driver_id)
    {
        return Driver::findOrFail($driver_id)->wallet()->pluck('id')->first();
    }
}

if (! function_exists('getRiderWalletId')) {
    function getRiderWalletId($rider_id)
    {
        return Rider::findOrFail($rider_id)->wallet()?->pluck('id')?->first();
    }
}

if (! function_exists('getFleetWalletId')) {
    function getFleetWalletId($fleet_id)
    {
        return FleetManager::findOrFail($fleet_id)->wallet()?->pluck('id')?->first();
    }
}

if (! function_exists('setDistanceUnit')) {
    function setDistanceUnit()
    {
        $taxidoSettings = getTaxidoSettings();
        return $taxidoSettings['ride']['distance_unit'] ?? 'km';
    }
}

if (! function_exists('getRoleNameByDriverId')) {
    function getRoleNameByDriverId($driver_id)
    {
        return Driver::where('id', $driver_id)?->first()?->role?->name;
    }
}

if (! function_exists('getRolesNameByUserId')) {
    function getRolesNameByUserId($user_id)
    {
        return Rider::find($user_id)?->role?->name;
    }
}

if (! function_exists('getRolesByUserId')) {
    function getRolesByUserId($user_id)
    {
        return FleetManager::find($user_id)?->role?->name;
    }
}

if (! function_exists('getVehicleTaxRate')) {
    function getVehicleTaxRate($vehicle_type_id)
    {
        $tax_id = VehicleType::findOrFail($vehicle_type_id)?->value('tax_id');
        if ($tax_id) {
            return getTaxRateById($tax_id);
        }
        return 0;
    }
}

if (! function_exists('getTaxRateById')) {
    function getTaxRateById($tax_id)
    {
        return Tax::where([['id', $tax_id], ['status', true]])?->value('rate') ?? 0;
    }
}

if (! function_exists('getRideStatusColorClasses')) {
    function getRideStatusColorClasses()
    {
        return [
            ucfirst(RideStatusEnum::REQUESTED) => 'requested',
            ucfirst(RideStatusEnum::PENDING) => 'pending',
            ucfirst(RideStatusEnum::SCHEDULED) => 'scheduled',
            ucfirst(RideStatusEnum::ACCEPTED)  => 'accepted',
            ucfirst(RideStatusEnum::REJECTED)  => 'rejected',
            ucfirst(RideStatusEnum::ARRIVED)   => 'arrived',
            ucfirst(RideStatusEnum::STARTED)   => 'requested',
            ucfirst(RideStatusEnum::CANCELLED) => 'cancelled',
            ucfirst(RideStatusEnum::COMPLETED) => 'completed',
            'Credited'  => 'completed',
            'N/A' => 'secondary'
        ];
    }
}

if (! function_exists('getPaymentStatusColorClasses')) {
    function getPaymentStatusColorClasses()
    {
        return [
            ucfirst(PaymentStatus::COMPLETED)  => 'completed',
            ucfirst(PaymentStatus::PENDING)    => 'pending',
            ucfirst(PaymentStatus::PROCESSING) => 'positive',
            ucfirst(PaymentStatus::FAILED)     => 'failed',
            ucfirst(PaymentStatus::EXPIRED)    => 'expired',
            ucfirst(PaymentStatus::REFUNDED)   => 'progress',
            ucfirst(PaymentStatus::CANCELLED)  => 'critical',
        ];
    }
}

if (! function_exists('getRideStatusClassByStatus')) {
    function getRideStatusClassByStatus($status)
    {
        return getRideStatusColorClasses()[ucfirst($status)] ?? '';
    }
}

if (! function_exists('getServiceIdsByTypes')) {
    function getServiceIdsByTypes($types)
    {
        return Service::whereIn('type', $types)?->pluck('id');
    }
}

if (! function_exists('getRideStatusIdsBySlugs')) {
    function getRideStatusIdsBySlugs($slugs)
    {
        return RideStatus::whereIn('slug', $slugs)?->pluck('id');
    }
}

if (! function_exists('getServiceById')) {
    function getServiceById($id)
    {
        return Service::where('id', $id)?->first();
    }
}

if (! function_exists('getServiceCategoryById')) {
    function getServiceCategoryById($id)
    {
        return ServiceCategory::where('id', $id)?->whereNull('deleted_at')->first();
    }
}

if (! function_exists('getServiceCategoryIdsBySlugs')) {
    function getServiceCategoryIdsBySlugs($slugs)
    {
        return ServiceCategory::whereIn('slug', $slugs)?->pluck('id');
    }
}

if (! function_exists('getServiceCategoryIdBySlug')) {
    function getServiceCategoryIdBySlug($slug)
    {
        return ServiceCategory::where('slug', $slug)->value('id');
    }
}

if (! function_exists('getServiceCategoryIdByType')) {
    function getServiceCategoryIdsByType($type)
    {
        return ServiceCategory::where('type', $type)?->where('status', true)->pluck('id')->toArray();
    }
}

if (! function_exists('getUnverifiedDriver')) {
    function getUnverifiedDriver()
    {
        return Driver::where('is_verified', false)->where('system_reserve', false)?->count();
    }
}

if (! function_exists('getAllDriverDocumentsCount'))
    {
    function getAllDriverDocumentsCount()
    {
        $query = DriverDocument::whereNull('deleted_at');

        if (getCurrentRoleName() == RoleEnum::DRIVER) {
            $query = $query->where('driver_id', getCurrentUserId());
        }

        if (getCurrentRoleName() == RoleEnum::FLEET_MANAGER) {
            $fleetManagerId = getCurrentUserId();
            $query = $query->whereHas('driver', function ($q) use ($fleetManagerId) {
                $q->where('fleet_manager_id', $fleetManagerId);
            });
        }

        if (getCurrentRoleName() == RoleEnum::DISPATCHER) {
            $query = $query->whereHas('driver', function ($q) {
                $q->whereHas('zones', function ($q) {
                    $q->whereHas('dispatchers', function ($q) {
                        $q->where('dispatcher_id', getCurrentUserId());
                    });
                });
            });
        }

        return $query->count();
    }
}

if (! function_exists('getPendingWithdrawRequests')) {
    function getPendingWithdrawRequests()
    {
        $query = WithdrawRequest::where('status', RequestEnum::PENDING)->whereNull('deleted_at');

        if (getCurrentRoleName() == RoleEnum::DRIVER) {
            $query = $query->where('driver_id', getCurrentUserId());
        }

        return $query->count();
    }
}

if (! function_exists('getPendingFleetWithdrawRequests')) {
    function getPendingFleetWithdrawRequests()
    {
        $query = FleetWithdrawRequest::where('status', RequestEnum::PENDING)->whereNull('deleted_at');

        if (getCurrentRoleName() == RoleEnum::FLEET_MANAGER) {
            $query = $query->where('fleet_manager_id', getCurrentUserId());
        }

        return $query->count();
    }
}

if (! function_exists('isRideCompleted')) {
    function isRideCompleted($ride)
    {
        $completedStatusId = RideStatus::where('name', RideStatusEnum::COMPLETED)->value('id');
        return ($ride?->payment_status == PaymentStatus::COMPLETED
            && $ride?->ride_status?->id == $completedStatusId);
    }
}

if (! function_exists('isAlreadyReviewed')) {
    function isAlreadyReviewed($user_id, $ride_id, $type = 'driver')
    {
        return $type === 'driver'
            ? DriverReview::where('driver_id', $user_id)->where('ride_id', $ride_id)->exists()
            : RiderReview::where('rider_id', $user_id)->where('ride_id', $ride_id)->exists();
    }
}

if (! function_exists('getReviewRatings')) {
    function getReviewRatings($ride_id, $type = 'rider')
    {
        $reviewClass = $type === 'rider' ? RiderReview::class : DriverReview::class;
        $review      = $reviewClass::where('ride_id', $ride_id)->get();
        return [
            $review->where('rating', 1)->count(),
            $review->where('rating', 2)->count(),
            $review->where('rating', 3)->count(),
            $review->where('rating', 4)->count(),
            $review->where('rating', 5)->count(),
        ];
    }
}

if (! function_exists('getCoupon')) { {
        function getCoupon($data)
        {
            return Coupon::where([['code', 'LIKE', '%' . $data . '%'], ['status', true]])
                ->orWhere('id', 'LIKE', '%' . $data . '%')
                ->whereNull('deleted_at')
                ->first();
        }
    }
}

if (! function_exists('getSubTotal')) {
    function getSubTotal($price, $quantity = 1)
    {
        return $price * $quantity;
    }
}

if (! function_exists('getRiderId')) {
    function getRiderId($request)
    {
        return $request->rider_id ?? getCurrentUserId();
    }
}

if (! function_exists('getTotalAmount')) {
    function getTotalAmount($rides)
    {
        $subtotal = [];
        foreach ($rides as $ride) {
            $subtotal[] = getSubTotal($ride);
        }

        return array_sum($subtotal);
    }
}

if (!function_exists('pushNotification')) {
    function pushNotification($pushNotification)
    {
        try {
            $firebaseJson = getFirebaseJson();
            $token = getFCMAccessToken();
            if ($firebaseJson) {
                $ch = curl_init();
                $url = "https://fcm.googleapis.com/v1/projects/{$firebaseJson['project_id']}/messages:send";
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($pushNotification));
                curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Authorization: Bearer ' . $token]);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

                $result = curl_exec($ch);
                if (curl_error($ch)) {
                    Log::error('FCM Push Notification Error: ' . curl_error($ch));
                }
                curl_close($ch);
                Log::info('FCM Push Notification Response: ' . $result);
            }
        } catch (Exception $e) {

            Log::error('FCM Push Notification Exception: ' . $e->getMessage());
        }
    }
}

if (! function_exists('getFirebaseJson')) {
    function getFirebaseJson()
    {
        $firebaseJson = json_decode(file_get_contents(public_path('admin/assets/firebase.json')), true);
        return $firebaseJson;
    }
}

if (! function_exists('getFCMAccessToken')) {
    function getFCMAccessToken()
    {
        $client = new Google_Client();
        $client->setAuthConfig(public_path('admin/assets/firebase.json'));
        $client->addScope('https://www.googleapis.com/auth/firebase.messaging');
        $client->refreshTokenWithAssertion();
        $token = $client->getAccessToken();

        return $token['access_token'];
    }
}

if (! function_exists('getVehicleType')) {
    function getVehicleType()
    {
        return VehicleType::all()->map(function ($vehicleType) {
            return [
                'id'    => $vehicleType->id,
                'name'  => $vehicleType->name,
                'image' => $vehicleType->vehicle_image?->original_url ?? asset('images/default.png'),
            ];
        });
    }
}

if (! function_exists('getPaymentAccount')) {
    function getPaymentAccount($user_id)
    {
        return PaymentAccount::where('user_id', $user_id)?->get()?->first();
    }
}

if (! function_exists('parcelOtpEnabled')) {
    function parcelOtpEnabled()
    {
        $taxidoSettings = getTaxidoSettings();
        return $taxidoSettings['activation']['parcel_otp'];
    }
}

if (! function_exists('getTotalRideRequestsByService')) {
    function getTotalRideRequestsByService($service = null, $start_date = null, $end_date = null)
    {
        $query = RideRequest::where('service_id', getServiceIdBySlug($service))
            ->whereNull('deleted_at');

        if (getCurrentRoleName() == RoleEnum::DRIVER) {
            $query = $query->where('driver_id', getCurrentUserId());
        }

        if ($start_date && $end_date) {
            $query->whereBetween('created_at', [$start_date, $end_date]);
        }

        if (request()?->status) {
            $query->where('ride_status_id', getRideStatusIdByName(request()?->status));
        }

        return $query->count();
    }
}

if (! function_exists('getTotalDriverReviewsByServiceCategory')) {
    function getTotalDriverReviewsByServiceCategory($serviceCategory)
    {
        $query = DriverReview::where('service_category_id', getServiceCategoryIdBySlug($serviceCategory))
            ->whereNull('deleted_at');

        if (getCurrentRoleName() == RoleEnum::DRIVER) {
            $query = $query->where('driver_id', getCurrentUserId());
        }

        return $query->count();
    }
}

if (! function_exists('getTotalRiderReviewsByServiceCategory')) {
    function getTotalRiderReviewsByServiceCategory($serviceCategory)
    {
        $query = DriverReview::where('service_category_id', getServiceCategoryIdBySlug($serviceCategory))
            ->whereNull('deleted_at');

        if (getCurrentRoleName() == RoleEnum::RIDER) {
            $query = $query->where('rider_id', getCurrentUserId());
        }

        return $query->count();
    }
}

if(! function_exists('getServiceIdByServiceCategories'))
{
    function getServiceIdByServiceCategories($serviceSlug)
    {
        $service = Service::where('slug', $serviceSlug)->first();
        return ServiceCategory::where('service_id', $service->id)->get();
    }
}

if(!function_exists('maximumSeat'))
{
    function maximumSeat()
    {
        $settings = getTaxidoSettings();
        return $settings['ride']['maximum_seat'];
    }
}

if (! function_exists('getTotalRidesByServices')) {
    function getTotalRidesByServices($service, $start_date = null, $end_date = null)
    {
        $serviceId = getServiceIdBySlug($service);

        $rides = Ride::where('service_id', $serviceId)
            ->whereNull('deleted_at')
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as total_rides')
            ->groupBy(DB::raw('MONTH(created_at)'));

        $role = getCurrentRoleName();

        if ($role == RoleEnum::DRIVER) {
            $rides->where('driver_id', getCurrentUserId());
        }

        if ($role == RoleEnum::FLEET_MANAGER) {
            $rides->whereHas('driver', function ($query) {
                $query->where('fleet_manager_id', getCurrentUserId());
            });
        }

        if ($role == RoleEnum::DISPATCHER) {
            $rides->whereHas('zones', function ($q) {
                $q->whereHas('dispatchers', function ($q) {
                    $q->where('dispatcher_id', getCurrentUserId());
                });
            });
        }

        $sort = request('sort');

        if ($sort === 'today') {
            $rides->whereBetween('created_at', [now()->startOfDay(), now()->endOfDay()]);
        } elseif ($sort === 'this_week') {
            $rides->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        } elseif ($sort === 'this_month') {
            $rides->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()]);
        } elseif ($sort === 'this_year' || ! $sort) {
            $rides->whereBetween('created_at', [now()->startOfYear(), now()->endOfYear()]);
        } elseif ($sort === 'custom' && $start_date && $end_date) {
            $rides->whereBetween(
                'created_at',
                [
                    \Carbon\Carbon::createFromFormat('m-d-Y', $start_date)->startOfDay(),
                    \Carbon\Carbon::createFromFormat('m-d-Y', $end_date)->endOfDay(),
                ]
            );
        }

        $data = $rides->pluck('total_rides', 'month')->toArray();

        $count = array_fill(1, 12, 0);
        foreach ($data as $month => $total) {
            $count[$month] = $total;
        }

        return $count;
    }
}

if (! function_exists('getTotalRidesByService')) {
    function getTotalRidesByService($service = null, $start_date = null, $end_date = null)
    {
        $query = Ride::where('service_id', getServiceIdBySlug($service))
            ->whereNull('deleted_at');

        if (getCurrentRoleName() == RoleEnum::DRIVER) {
            $query = $query->where('driver_id', getCurrentUserId());
        }

        if ($start_date && $end_date) {
            $query->whereBetween('created_at', [$start_date, $end_date]);
        }

        if (request()?->status) {
            $query->where('rides.ride_status_id', getRideStatusIdByName(request()?->status));
        }

        return $query->count();
    }
}

if (! function_exists('getTotalRidesByServiceCategory')) {
    function getTotalRidesByServiceCategory($serviceCategory = null, $start_date = null, $end_date = null)
    {
        $query = Ride::where('service_category_id', getServiceCategoryIdBySlug($serviceCategory))
            ->whereNull('deleted_at');

        $role = getCurrentRoleName();

        if ($role == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        }

        if ($role == RoleEnum::FLEET_MANAGER) {
            $query->whereHas('driver', function ($q) {
                $q->where('fleet_manager_id', getCurrentUserId());
            });
        }

        if ($role == RoleEnum::DISPATCHER) {
            $query->whereHas('zones', function ($q) {
                $q->whereHas('dispatchers', function ($q) {
                    $q->where('dispatcher_id', getCurrentUserId());
                });
            });
        }

        if ($start_date && $end_date) {
            $query->whereBetween('created_at', [$start_date, $end_date]);
        }
        if (request()?->status) {
            $query->where('rides.ride_status_id', getRideStatusIdByName(request()?->status));
        }
        return $query->count();
    }
}

if (! function_exists('getMonthlyCommissions')) {
    function getMonthlyCommissions()
    {
        $query = CabCommissionHistory::whereYear('created_at', now()->year)
            ->whereNull('deleted_at')
            ->selectRaw('
                MONTH(created_at) as month,
                SUM(admin_commission) as total_admin_commission,
                SUM(driver_commission) as total_driver_commission,
                SUM(fleet_commission) as total_fleet_commission
            ')
            ->groupBy('month');

        if (getCurrentRoleName() == RoleEnum::DRIVER) {
            $query = $query->where('driver_id', getCurrentUserId());
        }

        if (getCurrentRoleName() == RoleEnum::FLEET_MANAGER) {
            $fleetManagerId = getCurrentUserId();
            $query->whereHas('driver', function ($q) use ($fleetManagerId) {
                $q->where('fleet_manager_id', $fleetManagerId);
            });
        }

        if (getCurrentRoleName() == RoleEnum::DISPATCHER) {
            $query = $query->whereHas('ride', function ($q) {
                $q->whereHas('zones', function ($q) {
                    $q->whereHas('dispatchers', function ($q) {
                        $q->where('dispatcher_id', getCurrentUserId());
                    });
                });
            });
        }

        $commissions = $query?->get();
        $adminCommission  = array_fill(1, 12, 0);
        $driverCommission = array_fill(1, 12, 0);
        $fleetCommission  = array_fill(1, 12, 0);

        foreach ($commissions as $data) {
            $adminCommission[$data->month]  = $data->total_admin_commission;
            $driverCommission[$data->month] = $data->total_driver_commission;
            $fleetCommission[$data->month]  = $data->total_fleet_commission;
        }

        return [
            'admin_commission'  => $adminCommission,
            'driver_commission' => $driverCommission,
            'fleet_commission'  => $fleetCommission,
        ];
    }
}

if (! function_exists('getTotalRidesByServiceAndCategory')) {
    function getTotalRidesByServiceAndCategory($serviceSlug, $categorySlug, $start = null, $end = null)
    {
        $query = Ride::whereHas('service', function ($q) use ($serviceSlug) {
            $q->where('slug', $serviceSlug);
        })
            ->whereHas('service_category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            })
            ->whereNull('deleted_at');

        $role = getCurrentRoleName();

        if ($role == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        }

        if ($role == RoleEnum::FLEET_MANAGER) {
            $query->whereHas('driver', function ($q) {
                $q->where('fleet_manager_id', getCurrentUserId());
            });
        }

        if ($role == RoleEnum::DISPATCHER) {
            $query->whereHas('zones', function ($q) {
                $q->whereHas('dispatchers', function ($q) {
                    $q->where('dispatcher_id', getCurrentUserId());
                });
            });
        }

        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }

        if (request()?->status) {
            $query->where('ride_status_id', getRideStatusIdByName(request()?->status));
        }

        return $query->count();
    }
}

if (! function_exists('getTopDrivers')) {
    function getTopDrivers($start_date = null, $end_date = null)
    {
        $drivers = Driver::where('status', true)
            ->where('is_verified', true)
            ->whereBetween('created_at', [$start_date, $end_date])
            ->get()
            ->filter(function ($driver) {
                return getTotalDriverRides($driver->id) > 0;
            });

        $drivers = $drivers->sortByDesc(function ($driver) {
            return getTotalDriverRides($driver->id);
        })->values();

        $drivers = $drivers->take(5);

        return $drivers;
    }
}

if (! function_exists('getTotalDriverRides')) {
    function getTotalDriverRides($driver_id)
    {
        return Ride::where('driver_id', $driver_id)->whereNull('deleted_at')?->count();
    }
}

if (! function_exists('getDriverWallet')) {
    function getDriverWallet($driver_id)
    {
        $driverWallet = DriverWallet::where('driver_id', $driver_id)->whereNull('deleted_at')?->first();
        return $driverWallet?->balance;
    }
}

if (! function_exists('getRiderAvgReviewsById')) {
    function getRiderAvgReviewsById($rider_id)
    {
        if ($rider_id) {
            $rider = Rider::where('id', $rider_id)->with(['reviews'])->whereNull('deleted_at')?->first();
            if ($rider) {
                return (int) $rider?->reviews?->avg('rating');
            }
        }
        return 0;
    }
}

if (! function_exists('getRiderTotalReviewsById')) {
    function getRiderTotalReviewsById($rider_id)
    {
        if ($rider_id) {
            $rider = Rider::where('id', $rider_id)->with(['reviews'])->whereNull('deleted_at')?->first();
            if ($rider) {
                return (int) count($rider?->reviews->toArray());
            }
        }
        return 0;
    }
}

if (! function_exists('getRecentRides')) {
    function getRecentRides($start_date, $end_date, $service)
    {
        $query = Ride::where('service_id', $service)->orderBy('created_at', 'desc')->limit(5);

        if (getCurrentRoleName() == RoleEnum::DRIVER) {
            $query = $query->where('driver_id', getCurrentUserId());
        }

        if (getCurrentRoleName() == RoleEnum::FLEET_MANAGER) {
            $fleetManagerId = getCurrentUserId();
            $query->whereHas('driver', function ($q) use ($fleetManagerId) {
                $q->where('fleet_manager_id', $fleetManagerId);
            });
        }

        if (getCurrentRoleName() == RoleEnum::DISPATCHER) {
            $query->whereHas('zones', function ($q) {
                $q->whereHas('dispatchers', function ($q) {
                    $q->where('dispatcher_id', getCurrentUserId());
                });
            });
        }

        if ($start_date && $end_date) {
            $query->whereBetween('created_at', [$start_date, $end_date]);
        }

        return $query->get();
    }
}

if (! function_exists('getTotalWithdrawals')) {
    function getTotalWithdrawals($start_date = null, $end_date = null)
    {
        $query = WithdrawRequest::query();

        $role = getCurrentRoleName();

        if ($role == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        }

        if ($role == RoleEnum::FLEET_MANAGER) {
            $query->whereHas('driver', function ($q) {
                $q->where('fleet_manager_id', getCurrentUserId());
            });
        }

        if ($start_date && $end_date) {
            $query->whereBetween('created_at', [$start_date, $end_date]);
        } else {
            $query->whereYear('created_at', date('Y'))
                ->whereMonth('created_at', date('m'));
        }

        return $query->sum('amount');
    }
}

if (! function_exists('getDriverDocumentsCount')) {
    function getDriverDocumentsCount($driverId, $start_date = null, $end_date = null)
    {
        $query = DriverDocument::where('driver_id', $driverId);

        if ($start_date && $end_date) {
            $query->whereBetween('created_at', [$start_date, $end_date]);
        } else {
            $query->whereYear('created_at', date('Y'))
                ->whereMonth('created_at', date('m'));
        }

        return $query->count();
    }
}

if (! function_exists('getDriverReviewsCount')) {
    function getDriverReviewsCount($driverId, $start_date = null, $end_date = null)
    {
        $query = DriverReview::where('driver_id', $driverId);

        if ($start_date && $end_date) {
            $query->whereBetween('created_at', [$start_date, $end_date]);
        } else {
            $query->whereYear('created_at', date('Y'))
                ->whereMonth('created_at', date('m'));
        }

        return $query->count();
    }
}

if (! function_exists('getDriverWalletBalance')) {
    function getDriverWalletBalance($driverId, $start_date = null, $end_date = null)
    {
        $query = DriverWallet::where('driver_id', $driverId);

        if ($start_date && $end_date) {
            $query->whereBetween('created_at', [$start_date, $end_date]);
        } else {
            $query->whereYear('created_at', date('Y'))
                ->whereMonth('created_at', date('m'));
        }

        $balance = $query->sum('balance');

        return $balance;
    }
}

if (! function_exists('getFleetWalletBalance')) {
    function getFleetWalletBalance($fleetId, $start_date = null, $end_date = null)
    {
        $query = FleetManagerWallet::where('fleet_manager_id', $fleetId);

        if ($start_date && $end_date) {
            $query->whereBetween('created_at', [$start_date, $end_date]);
        } else {
            $query->whereYear('created_at', date('Y'))
                ->whereMonth('created_at', date('m'));
        }

        $balance = $query->sum('balance');

        return $balance;
    }
}

if (! function_exists('getPreviousDateRange')) {
    function getPreviousDateRange($sort, $start_date = null, $end_date = null)
    {
        switch ($sort) {
            case 'today':
                return [
                    'start' => Carbon::yesterday()->startOfDay(),
                    'end'   => Carbon::yesterday()->endOfDay(),
                ];

            case 'this_week':
                return [
                    'start' => Carbon::now()->subWeek()->startOfWeek(),
                    'end'   => Carbon::now()->subWeek()->endOfWeek(),
                ];

            case 'this_month':
                return [
                    'start' => Carbon::now()->startOfMonth()->subMonthsNoOverflow(),
                    'end'   => Carbon::now()->subMonthsNoOverflow()->endOfMonth(),
                ];

            case 'this_year':
                return [
                    'start' => Carbon::now()->subYear()->startOfYear(),
                    'end'   => Carbon::now()->subYear()->endOfYear(),
                ];

            case 'custom':
                if ($start_date && $end_date) {
                    return [
                        'start' => Carbon::createFromFormat('m-d-Y', $start_date)->subYear()->startOfDay(),
                        'end'   => Carbon::createFromFormat('m-d-Y', $end_date)->subYear()->endOfDay(),
                    ];
                }
                break;

            default:
                return [
                    'start' => Carbon::now()->subMonth()->startOfMonth(),
                    'end'   => Carbon::now()->subMonth()->endOfMonth(),
                ];
        }
    }
}

if (! function_exists('getDriverById')) {
    function getDriverById($id)
    {
        return Driver::where('id', $id)?->whereNull('deleted_at')?->first();
    }
}

if (!function_exists('calculateRideDistance')) {
    function calculateRideDistance(array $locations, $units = '')
    {
        $apiKey = env('GOOGLE_MAP_API_KEY');
        $url    = "https://maps.googleapis.com/maps/api/distancematrix/json";
        $distanceUnit = '';
        if ($units === 'mile') {
            $distanceUnit = 'imperial';
        }

        $totalDistance = 0.0;
        $totalDurationInSeconds = 0;
        for ($i = 0; $i < count($locations) - 1; $i++) {
            $origin = "{$locations[$i]['lat']},{$locations[$i]['lng']}";
            $destination = "{$locations[$i + 1]['lat']},{$locations[$i + 1]['lng']}";

            $response = Http::get($url, [
                'origins' => $origin,
                'destinations' => $destination,
                'key' => $apiKey,
                'units' => $distanceUnit
            ]);

            if ($response->ok()) {
                $data = $response->json();


                if (
                    $data['status'] === 'OK' &&
                    isset($data['rows'][0]['elements'][0]) &&
                    $data['rows'][0]['elements'][0]['status'] === 'OK'
                ) {
                    $element = $data['rows'][0]['elements'][0];
                    $distanceText = $element['distance']['text'] ?? null;
                    $distanceValue = $element['distance']['value'] ?? null;
                    $durationSec  = $element['duration']['value'] ?? 0;
                    if($units === 'mile') {
                        // convert meters  to miles
                        $totalDistance = $distanceValue * 0.000621371;
                    } else {
                        // convert meters to km
                        $totalDistance = $distanceValue * 0.001;
                    }

                    if ($distanceText) {
                        [$value, $unit] = explode(' ', $distanceText);
                        $distanceUnit = $unit;
                    }

                    $totalDurationInSeconds += $durationSec;
                }
            }
        }

        $totalDurationMinutes = (int) ceil($totalDurationInSeconds / 60);
        return [
            'distance_value' => (float) round($totalDistance, 2),
            'distance_unit' => $distanceUnit,
            'duration' => "{$totalDurationMinutes} mins",
            'locations' => $locations
        ];
    }
}

if (! function_exists('getDriverCount')) {
    function getDriverCount($status = 'all')
    {
        $query = Driver::query()
            ->where('is_verified', true)
            ->where('status', true);

        // Apply role-based filtering
        if (getCurrentRoleName() === RoleEnum::DRIVER) {
            $query->where('id', getCurrentUserId());
        }

        if (getCurrentRoleName() === RoleEnum::FLEET_MANAGER) {
            $fleetManagerId = getCurrentUserId();
            $query->where('fleet_manager_id', $fleetManagerId);
        }

        if (getCurrentRoleName() === RoleEnum::DISPATCHER) {
            $query->whereHas('zones', function ($q) {
                $q->whereHas('dispatchers', function ($q) {
                    $q->where('dispatcher_id', getCurrentUserId());
                });
            });
        }

        // Apply status-based filtering
        switch ($status) {
            case 'on_ride':
                $query->where('is_on_ride', true);
                break;

            case 'offline':
                $query->where(function ($q) {
                    $q->where(function ($subQuery) {
                        $subQuery->where('is_online', false)
                            ->orWhereNull('is_online');
                    })->where(function ($subQuery) {
                        $subQuery->where('is_on_ride', false)
                            ->orWhereNull('is_on_ride');
                    });
                });
                break;

            case 'all':
            default:
                // No extra condition
                break;
        }

        return $query->count();
    }
}

if (! function_exists('getVehicleCreateRoute')) {
    function getVehicleCreateRoute()
    {
        $service = request()->service;
        switch ($service) {
            case ServicesEnum::CAB:
                return route('admin.vehicle-type.cab.create');
            case ServicesEnum::FREIGHT:
                return route('admin.vehicle-type.freight.create');
            case ServicesEnum::PARCEL:
                return route('admin.vehicle-type.parcel.create');
            default:
                return "#";
        }
    }
}

if (! function_exists('getVehicleEditRoute')) {
    function getVehicleEditRoute()
    {
        $service = request()->service;
        switch ($service) {
            case ServicesEnum::CAB:
                return 'admin.vehicle-type.cab.edit';
            case ServicesEnum::FREIGHT:
                return 'admin.vehicle-type.freight.edit';
            case ServicesEnum::PARCEL:
                return 'admin.vehicle-type.parcel.edit';
            default:
                return "#";
        }
    }
}

if (! function_exists('getVehicleIndexRoute')) {
    function getVehicleIndexRoute($service)
    {
        switch ($service) {
            case ServicesEnum::CAB:
                return 'admin.vehicle-type.cab.index';
            case ServicesEnum::FREIGHT:
                return 'admin.vehicle-type.freight.index';
            case ServicesEnum::PARCEL:
                return 'admin.vehicle-type.parcel.index';
            default:
                return "#";
        }
    }
}

if (! function_exists('getServiceCategoryIndexRoute')) {
    function getServiceCategoryIndexRoute($service)
    {
        switch ($service) {
            case ServicesEnum::CAB:
                return 'admin.service-category.cab.index';
            case ServicesEnum::FREIGHT:
                return 'admin.service-category.freight.index';
            case ServicesEnum::PARCEL:
                return 'admin.service-category.parcel.index';
            default:
                return "#";
        }
    }
}

if (! function_exists('getServiceCategoryEditRoute')) {
    function getServiceCategoryEditRoute()
    {
        $service = request()->service;
        switch ($service) {
            case ServicesEnum::CAB:
                return 'admin.service-category.cab.edit';
            case ServicesEnum::FREIGHT:
                return 'admin.service-category.freight.edit';
            case ServicesEnum::PARCEL:
                return 'admin.service-category.parcel.edit';
            default:
                return "#";
        }
    }
}

if (! function_exists('getAmbulanceDrivers')) {
    function getAmbulanceDrivers()
    {
        return Driver::whereNull('deleted_at')?->where('status', true)?->where('service_id', getServiceIdBySlug(ServicesEnum::AMBULANCE))?->get();
    }
}

if (! function_exists('getAmbulances')) {
    function getAmbulances()
    {
        $ambulanceDriverIds = getAmbulanceDrivers()?->pluck('id')?->toArray();
        return Ambulance::whereNull('deleted_at')?->whereIn('driver_id', $ambulanceDriverIds)?->get();
    }
}

if (! function_exists('calculateDistance')) {
    function calculateDistance($lat1, $lng1, $lat2, $lng2)
    {
        $earthRadius = 6371000;
        $lat1Rad = deg2rad($lat1);
        $lat2Rad = deg2rad($lat2);
        $deltaLat = deg2rad($lat2 - $lat1);
        $deltaLng = deg2rad($lng2 - $lng1);

        $a = sin($deltaLat / 2) * sin($deltaLat / 2) +
             cos($lat1Rad) * cos($lat2Rad) *
             sin($deltaLng / 2) * sin($deltaLng / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }
}

if (! function_exists('parseDateRange')) {
    function parseDateRange($request)
    {
        $start_date = null;
        $end_date   = null;

        if ($request['is_expired'] && $request['start_end_date']) {
            $dates = preg_split('/\s+to\s+/i', $request['start_end_date']);
            if (count($dates) !== 2) {
                $dates = explode(' - ', $request['start_end_date']);
            }

            if (count($dates) === 2) {
                $start_date = trim($dates[0]);
                $end_date   = trim($dates[1]);

                try {
                    $start_date = \Carbon\Carbon::createFromFormat('m/d/Y', $start_date)->format('Y-m-d');
                    $end_date   = \Carbon\Carbon::createFromFormat('m/d/Y', $end_date)->format('Y-m-d');
                } catch (Exception $e) {
                    $start_date = \Carbon\Carbon::createFromFormat('d/m/Y', $start_date)->format('Y-m-d');
                    $end_date   = \Carbon\Carbon::createFromFormat('d/m/Y', $end_date)->format('Y-m-d');
                }
            } else {
                throw new Exception("Invalid date range format");
            }
        }

        return [$start_date, $end_date];
    }
}

if (!function_exists('getUserCurrencySymbol')) {
    function getUserCurrencySymbol($user)
    {
        return $user?->address?->country?->currency_symbol ?? getDefaultCurrencySymbol();
    }
}

if (!function_exists('getUserCurrencySymbol')) {
    function getUserCurrencySymbol($user)
    {
        return $user?->address?->country?->currency_symbol ?? getDefaultCurrencySymbol();
    }
}

if (!function_exists('getVehicleTypeZoneById')) {
    function getVehicleTypeZoneById($vehicle_type_id, $zone_id)
    {
        return VehicleTypeZone::where('vehicle_type_id',$vehicle_type_id)?->where('zone_id', $zone_id)?->first();
    }
}


if (! function_exists('getScheduleStatusColorClasses')) {
    function getScheduleStatusColorClasses()
    {
        return [
            'Delivered' => 'primary',
            'Scheduled' => 'warning',
            'N/A' => 'secondary'
        ];
    }
}

if (! function_exists('RemoveScheduleStatusColorClasses')) {
    function RemoveScheduleStatusColorClasses()
    {

        return [
            'Delivered' => 'danger',
            'Scheduled' => 'warning',
            'N/A' => 'secondary'
        ];
    }
}

if (! function_exists('sendNotifyMail')) {
    function sendNotifyMail($model, $notificationMailer)
    {
        try {

            Log::error("send to : ".$model?->email);
            $model->notify($notificationMailer);

        } catch(Exception $e) {

            Log::error($e?->getMessage());
        }
    }
}


if (! function_exists('validateFleetManagerDriver')) {
    function validateFleetManagerDriver($driver_id)
    {
        try {

            $roleName = getCurrentRoleName();
            if ($roleName != RoleEnum::FLEET_MANAGER) {
                throw new Exception("Fleet Manager access only.");
            }

            $driver = Driver::where('id', $driver_id)
            ->where('fleet_manager_id', getCurrentUserId())
            ->first();

            if (!$driver) {
                throw new ExceptionHandler('Driver not found or you do not have permission to access this driver\'s data.', 403);
            }

            return $driver_id;

        } catch(Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}

if (! function_exists('getFleetVehicles')) {
    function getFleetVehicles($start_date = null, $end_date = null, $is_verified = null)
    {
        $query = VehicleInfo::whereNUll('deleted_at');
        $role = getCurrentRoleName();
        if ($role == RoleEnum::FLEET_MANAGER) {
           $query = $query->where('fleet_manager_id', getCurrentUserId());
        }

        if ($start_date && $end_date) {
            return $query->whereBetween('created_at', [$start_date, $end_date])->count();;

        }
        return $query->whereYear('created_at', date('Y'))
            ->whereMonth('created_at', date('m'))
            ->count();
    }
}


