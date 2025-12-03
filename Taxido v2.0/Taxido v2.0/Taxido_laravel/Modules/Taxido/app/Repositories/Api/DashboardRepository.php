<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Carbon\Carbon;
use App\Models\Currency;
use Modules\Taxido\Models\Ride;
use Modules\Taxido\Models\Zone;
use Modules\Taxido\Models\Driver;
use Modules\Taxido\Enums\RoleEnum;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Enums\RideStatusEnum;
use Modules\Taxido\Models\CabCommissionHistory;
use Prettus\Repository\Eloquent\BaseRepository;

class DashboardRepository extends BaseRepository
{
    function model()
    {
        return Driver::class;
    }

    public function index()
    {
        try {

            $driverId = null;
            $roleName = getCurrentRoleName();
            $unit = request()->input('unit', 'km');
            $requestedDriverId = request()->driver_id;
            if ($roleName === RoleEnum::DRIVER) {
                $driverId = getCurrentUserId();
            } elseif ($roleName === RoleEnum::FLEET_MANAGER) {
                if ($requestedDriverId) {
                    $driverId = validateFleetManagerDriver($requestedDriverId);
                }
            }

            $driver = $driverId ? Driver::with('address.country')->find($driverId) : null;
            $currencySymbol = $driver?->address?->country?->currency_symbol;
            $totalBookings = $this->getTotalRides($roleName, $driverId);
            $completedBookings = $this->getTotalCompletedRides($roleName, $driverId);
            $pendingBookings = $this->getPendingRides($roleName, $driverId);
            $cancelledBookings = $this->getCancelledRides($roleName, $driverId);
            $totalEarnings = $this->getTotalEarnings($roleName, $driverId);
            $totalDistance = $this->getTotalDistance($roleName, $driverId);
            $averageDistance = $this->getAverageDistance($roleName, $driverId);
            $totalHours = $this->getTotalHours($roleName, $driverId);
            $averageHours = $this->getAverageHours($roleName, $driverId);
            $formattedUnit = $unit === 'mile' ? ' Mi' : 'Km';

            return [
                'ride' => [
                    'total_rides' => $totalBookings,
                    'completed_rides' => $completedBookings,
                    'pending_rides' => $pendingBookings,
                    'cancelled_rides' => $cancelledBookings,
                    'total_earnings'  => $totalEarnings,
                    'currency_symbol' => $currencySymbol,
                ],
                'driver_performance' => [
                    'total_distance' => round($totalDistance,2),
                    'average_distance' =>  round($averageDistance,2),
                    'unit' => $formattedUnit,
                    'total_hours' => $totalHours,
                    'average_hours' => $averageHours,
                ],
                'day' => [
                    'dayRevenues' => $this->getDayRevenues($roleName),
                    'highest_records' => [
                        'daily' => $this->getHighestSingleDayRecord($roleName),
                    ],
                ],
                'week' => [
                    'weekRevenues' => $this->getWeekRevenues($roleName),
                    'averages' => [
                        'average_earnings' => $this->getWeeklyAverageEarnings($roleName),
                        'average_rides' => $this->getWeeklyAverageRides($roleName),
                    ],
                    'highest_records' => [
                        'weekly' => $this->getHighestSingleWeekRecord($roleName),
                    ],
                ],
                'month' => [
                    'monthRevenues' => $this->getMonthRevenues($roleName),
                    'averages' => [
                        'average_earnings' => $this->getMonthlyAverageEarnings($roleName),
                        'average_rides' => $this->getMonthlyAverageRides($roleName),
                    ],
                    'highest_records' => [
                        'monthly' => $this->getHighestSingleMonthRecord($roleName),
                    ],
                ],
            ];
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getTotalRides($roleName, $driverId = null)
    {
        if ($roleName == RoleEnum::DRIVER) {
            return getTotalDriverRides(getCurrentUserId());
        }

        if ($roleName == RoleEnum::FLEET_MANAGER) {
            if ($driverId) {
                return Ride::where('driver_id', $driverId)->whereNull('deleted_at')->count();
            } else {
                $fleetManagerId = getCurrentUserId();
                $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                return Ride::whereIn('driver_id', $driverIds)->whereNull('deleted_at')->count();
            }
        }

        return Ride::whereNull('deleted_at')?->count();
    }

    public function getTotalCompletedRides($roleName, $driverId = null)
    {
        if ($roleName == RoleEnum::FLEET_MANAGER) {
            $completedStatusId = getRideStatusIdBySlug(RideStatusEnum::COMPLETED);
            if ($driverId) {
                return Ride::where('driver_id', $driverId)
                    ->where('ride_status_id', $completedStatusId)
                    ->whereNull('deleted_at')?->count();
            }
            $fleetManagerId = getCurrentUserId();
            $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
            return Ride::whereIn('driver_id', $driverIds)
                ->where('ride_status_id', $completedStatusId)
                ->whereNull('deleted_at')?->count();
        }

        return getTotalRidesByStatus(RideStatusEnum::COMPLETED);
    }

    public function getPendingRides($roleName, $driverId = null)
    {
        $arrived = RideStatusEnum::ARRIVED;
        $accepted = RideStatusEnum::ACCEPTED;
        $rides = Ride::whereIn('ride_status_id', [getRideStatusIdBySlug($accepted), getRideStatusIdBySlug($arrived)])?->whereNull('deleted_at');

        if ($roleName == RoleEnum::DRIVER) {
            $rides = $rides->where('driver_id', getCurrentUserId());
        } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
            if ($driverId) {
                $rides = $rides->where('driver_id', $driverId);
            } else {
                $fleetManagerId = getCurrentUserId();
                $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                $rides = $rides->whereIn('driver_id', $driverIds);
            }
        }

        return $rides->count();
    }

    public function getCancelledRides($roleName, $driverId = null)
    {
        if ($roleName == RoleEnum::FLEET_MANAGER) {
            $cancelledStatusId = getRideStatusIdBySlug(RideStatusEnum::CANCELLED);
            if ($driverId) {
                return Ride::where('driver_id', $driverId)
                    ->where('ride_status_id', $cancelledStatusId)
                    ->whereNull('deleted_at')
                    ->count();
            }

            $fleetManagerId = getCurrentUserId();
            $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
            return Ride::whereIn('driver_id', $driverIds)
                ->where('ride_status_id', $cancelledStatusId)
                ->whereNull('deleted_at')
                ->count();
        }

        return getTotalRidesByStatus(RideStatusEnum::CANCELLED);
    }

    public function getTotalEarnings($roleName, $driverId = null)
    {
        $query = CabCommissionHistory::whereNotNull('driver_commission')?->where('driver_commission', '>', 0);
        if ($roleName == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
            if ($driverId) {
                $query->where('driver_id', $driverId);
            } else {
                $fleetManagerId = getCurrentUserId();
                $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                $query->whereIn('driver_id', $driverIds);
            }
        }

        return $query->sum('driver_commission');
    }

    public function getTotalDistance($roleName, $driverId = null)
    {
        $unit = request()->input('unit', 'km');
        $completedStatusId = getRideStatusIdBySlug(RideStatusEnum::COMPLETED);
        $query = Ride::whereNull('deleted_at')?->where('ride_status_id', $completedStatusId);
        if ($roleName == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
            if ($driverId) {
                $query->where('driver_id', $driverId);
            } else {
                $fleetManagerId = getCurrentUserId();
                $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                $query->whereIn('driver_id', $driverIds);
            }
        }

        $totalDistance = 0;
        $rides = $query->get(['distance', 'distance_unit']);
        foreach ($rides as $ride) {
            $rideUnit = strtolower($ride->distance_unit ?? 'km');
            if ($rideUnit === 'mile') {
                $totalDistance += $ride->distance * 1.60934;
            } else {
                $totalDistance += $ride->distance;
            }
        }

        if ($unit === 'mile') {
            $totalDistance = $totalDistance / 1.60934;
        }

        return number_format($totalDistance, 2, '.', '');
    }

    public function getAverageDistance($roleName, $driverId = null)
    {
        $unit = request()->input('unit', 'km');
        $completedStatusId = getRideStatusIdBySlug(RideStatusEnum::COMPLETED);
        $query = Ride::whereNull('deleted_at')?->where('ride_status_id', $completedStatusId);
        if ($roleName == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
            if ($driverId) {
                $query->where('driver_id', $driverId);
            } else {
                $fleetManagerId = getCurrentUserId();
                $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                $query->whereIn('driver_id', $driverIds);
            }
        }

        $totalDistance = 0;
        $rides = $query->get(['distance', 'distance_unit']);
        $rideCount = $rides->count();
        if ($rideCount === 0) {
            return '0.00';
        }

        foreach ($rides as $ride) {
            $rideUnit = strtolower($ride->distance_unit ?? 'km');
            if ($rideUnit === 'mile') {
                $totalDistance += $ride->distance * 1.60934;
            } else {
                $totalDistance += $ride->distance;
            }
        }

        $averageDistance = $totalDistance / $rideCount;
        if ($unit === 'mile') {
            $averageDistance = $averageDistance / 1.60934;
        }

        return number_format($averageDistance, 2, '.', '');
    }

    public function getTotalHours($roleName, $driverId = null)
    {
        $completedStatusId = getRideStatusIdBySlug(RideStatusEnum::COMPLETED);

        $query = Ride::whereNull('deleted_at')
                    ->where('ride_status_id', $completedStatusId)
                    ->whereNotNull('start_time')
                    ->whereNotNull('end_time');

        if ($roleName == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
            if ($driverId) {

                $query->where('driver_id', $driverId);
            } else {

                $fleetManagerId = getCurrentUserId();
                $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                $query->whereIn('driver_id', $driverIds);
            }
        }

        $rides = $query->get(['start_time', 'end_time']);

        $totalMinutes = 0;

        foreach ($rides as $ride) {
            $startTime = Carbon::parse($ride->start_time);
            $endTime = Carbon::parse($ride->end_time);
            $totalMinutes += $startTime->diffInMinutes($endTime);
        }

        $totalHours = round($totalMinutes / 60, 2);

        return $totalHours . ' Hr';
    }

    public function getAverageHours($roleName, $driverId = null)
    {
        $completedStatusId = getRideStatusIdBySlug(RideStatusEnum::COMPLETED);

        $query = Ride::whereNull('deleted_at')
                    ->where('ride_status_id', $completedStatusId)
                    ->whereNotNull('start_time')
                    ->whereNotNull('end_time');

        if ($roleName == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
            if ($driverId) {

                $query->where('driver_id', $driverId);
            } else {

                $fleetManagerId = getCurrentUserId();
                $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                $query->whereIn('driver_id', $driverIds);
            }
        }

        $rides = $query->get(['start_time', 'end_time']);

        $rideCount = $rides->count();
        $totalHours = 0;

        if ($rideCount === 0) {
            return '0 Hr';
        }

        foreach ($rides as $ride) {
            $startTime = Carbon::parse($ride->start_time);
            $endTime = Carbon::parse($ride->end_time);
            $totalHours += $startTime->diffInHours($endTime);
        }

        return round($totalHours / $rideCount, 2);
    }

    public function chart()
    {
        try {
            $roleName = getCurrentRoleName();
            $monthData = $this->getMonthRevenues($roleName);
            return [
                'revenues' => $monthData['revenues'],
                'commissions' => array_fill(0, 12, 0),
                'months' => $monthData['months'],
            ];

        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getDayRevenues($roleName, $driverId = null)
    {
        $revenues = [];
        $days = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $days[] = $date->format('d');

            $query = CabCommissionHistory::whereDate('created_at', $date)
                ->whereNotNull('driver_commission')
                ->where('driver_commission', '>', 0);

            if ($roleName == RoleEnum::DRIVER) {
                $query->where('driver_id', getCurrentUserId());
            } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
                if ($driverId) {

                    $query->where('driver_id', $driverId);
                } else {

                    $fleetManagerId = getCurrentUserId();
                    $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                    $query->whereIn('driver_id', $driverIds);
                }
            }

            $revenues[] = (float) $query->sum('driver_commission');
        }

        return [
            'revenues' => $revenues,
            'days' => $days,
        ];
    }

    public function getWeekRevenues($roleName, $driverId = null)
    {
        $revenues = [];
        $days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        $startOfWeek = Carbon::now()->startOfWeek(Carbon::SUNDAY);

        foreach ($days as $index => $day) {
            $date = $startOfWeek->copy()->addDays($index);

            $query = CabCommissionHistory::whereDate('created_at', $date)
                ->whereNotNull('driver_commission')
                ->where('driver_commission', '>', 0);

            if ($roleName == RoleEnum::DRIVER) {
                $query->where('driver_id', getCurrentUserId());
            } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
                if ($driverId) {

                    $query->where('driver_id', $driverId);
                } else {

                    $fleetManagerId = getCurrentUserId();
                    $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                    $query->whereIn('driver_id', $driverIds);
                }
            }
            $revenues[] = (float) $query->sum('driver_commission');
        }

        return [
            'revenues' => $revenues,
            'days' => $days,
        ];
    }

    public function getMonthRevenues($roleName, $driverId = null)
    {
        $revenues = [];
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        foreach ($months as $index => $month) {
            $query = CabCommissionHistory::whereYear('created_at', Carbon::now()->year)
                ->whereMonth('created_at', $index + 1)
                ->whereNotNull('driver_commission')
                ->where('driver_commission', '>', 0);

            if ($roleName == RoleEnum::DRIVER) {
                $query->where('driver_id', getCurrentUserId());
            } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
                if ($driverId) {

                    $query->where('driver_id', $driverId);
                } else {

                    $fleetManagerId = getCurrentUserId();
                    $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                    $query->whereIn('driver_id', $driverIds);
                }
            }

            $revenues[] = (float) $query->sum('driver_commission');
        }

        return [
            'revenues' => $revenues,
            'months' => $months,
        ];
    }

    public function getWeeklyAverageEarnings($roleName, $driverId = null)
    {
        $weekRevenues = $this->getWeekRevenues($roleName, $driverId)['revenues'];
        return count($weekRevenues) > 0 ? round((float)(array_sum($weekRevenues) / count($weekRevenues)),2) : 0;
    }

    public function getWeeklyAverageRides($roleName, $driverId = null)
    {
        $completedStatusId = getRideStatusIdBySlug(RideStatusEnum::COMPLETED);

        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek   = Carbon::now()->endOfWeek();

        $query = Ride::whereNull('deleted_at')
                    ->where('ride_status_id', $completedStatusId)
                    ->whereBetween('created_at', [$startOfWeek, $endOfWeek]);

        if ($roleName == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
            if ($driverId) {

                $query->where('driver_id', $driverId);
            } else {

                $fleetManagerId = getCurrentUserId();
                $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                $query->whereIn('driver_id', $driverIds);
            }
        }

        $totalRides = $query->count();

        return $totalRides > 0 ? round($totalRides / 7, 2) : 0;
    }

    public function getMonthlyAverageEarnings($roleName, $driverId = null)
    {
        $monthRevenues = $this->getMonthRevenues($roleName, $driverId)['revenues'];
        $total = array_sum($monthRevenues);
        return $total > 0 ? round((float)($total / count($monthRevenues)),2) : 0;
    }

    public function getMonthlyAverageRides($roleName, $driverId = null)
    {
        $completedStatusId = getRideStatusIdBySlug(RideStatusEnum::COMPLETED);

        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        $query = Ride::whereNull('deleted_at')
                    ->where('ride_status_id', $completedStatusId)
                    ->whereBetween('created_at', [$startOfMonth, $endOfMonth]);

        if ($roleName == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
            if ($driverId) {

                $query->where('driver_id', $driverId);
            } else {

                $fleetManagerId = getCurrentUserId();
                $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                $query->whereIn('driver_id', $driverIds);
            }
        }

        $totalRides = $query->count();
        $daysInMonth = $startOfMonth->daysInMonth;

        return $totalRides > 0 ? round($totalRides / $daysInMonth, 2) : 0;
    }

    public function getHighestSingleDayRecord($roleName, $driverId = null)
    {
        $query = CabCommissionHistory::whereNotNull('driver_commission')
            ->where('driver_commission', '>', 0)
            ->selectRaw('DATE(created_at) as date, SUM(driver_commission) as total_earnings')
            ->groupBy('date')
            ->orderByDesc('total_earnings')
            ->limit(1);

        if ($roleName == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
            if ($driverId) {

                $query->where('driver_id', $driverId);
            } else {

                $fleetManagerId = getCurrentUserId();
                $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                $query->whereIn('driver_id', $driverIds);
            }
        }

        $record = $query->first();

        return [
            'date'   => $record ? Carbon::parse($record->date)->format('m/d/Y') : null,
            'amount' => $record ? (float) $record->total_earnings : 0,
        ];
    }

    public function getHighestSingleWeekRecord($roleName, $driverId = null)
    {
        $startOfWeek = Carbon::now()->startOfWeek(Carbon::SUNDAY);
        $endOfWeek = Carbon::now()->endOfWeek(Carbon::SATURDAY);

        $query = CabCommissionHistory::whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->whereNotNull('driver_commission')
            ->where('driver_commission', '>', 0)
            ->selectRaw('DATE(created_at) as date, SUM(driver_commission) as total_earnings')
            ->groupBy('date')
            ->orderByDesc('total_earnings')
            ->limit(1);

        if ($roleName == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
            if ($driverId) {

                $query->where('driver_id', $driverId);
            } else {

                $fleetManagerId = getCurrentUserId();
                $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                $query->whereIn('driver_id', $driverIds);
            }
        }

        $record = $query->first();

        return [
            'date'   => $record ? Carbon::parse($record->date)->format('m/d/Y') : null,
            'amount' => $record ? (float) $record->total_earnings : 0,
        ];
    }

    public function getHighestSingleMonthRecord($roleName, $driverId = null)
    {
        $query = CabCommissionHistory::whereNotNull('driver_commission')
            ->where('driver_commission', '>', 0)
            ->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(driver_commission) as total_earnings')
            ->groupBy('year', 'month')
            ->orderByDesc('total_earnings')
            ->limit(1);

        if ($roleName == RoleEnum::DRIVER) {
            $query->where('driver_id', getCurrentUserId());
        } elseif ($roleName == RoleEnum::FLEET_MANAGER) {
            if ($driverId) {
                $query->where('driver_id', $driverId);
            } else {
                $fleetManagerId = getCurrentUserId();
                $driverIds = Driver::where('fleet_manager_id', $fleetManagerId)->pluck('id');
                $query->whereIn('driver_id', $driverIds);
            }
        }

        $record = $query->first();

        return [
            'date' => $record ? Carbon::createFromDate($record->year, $record->month)->format('F, Y') : null,
            'amount' => $record ? (float) $record->total_earnings : 0,
        ];
    }

    public function getCurrency($zoneId)
    {
        $zone = Zone::find($zoneId);
        if (! $zone || ! $zone->currency_id) {
            return null;
        }
        return Currency::find($zone->currency_id);
    }
}
