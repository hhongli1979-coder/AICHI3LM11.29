<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Models\Driver;
use Modules\Taxido\Models\Incentive;
use Modules\Taxido\Models\IncentiveLevel;
use Modules\Taxido\Models\VehicleTypeZone;
use Modules\Taxido\Models\Ride;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Services\IncentiveCalculationService;
use Modules\Taxido\Services\IncentiveService;
use Prettus\Repository\Eloquent\BaseRepository;

class IncentiveRepository extends BaseRepository
{
    private $incentiveService;
    private $calculationService;

    public function model()
    {
        $this->incentiveService = new IncentiveService();
        $this->calculationService = new IncentiveCalculationService($this->incentiveService);
        return Incentive::class;
    }

    public function getUnifiedIncentiveData(Request $request): JsonResponse
    {
        try {
            $driver = $this->validateDriverAccess();
            $vehicleTypeZoneId = $this->getVehicleTypeZoneId($request, $driver);
            $date = $request->input('date') ? Carbon::parse($request->input('date'))->startOfDay() : Carbon::today()->startOfDay();

            $todayData = $this->getDayData($driver, $date, $vehicleTypeZoneId);
            $weeklyData = $this->getWeeklyData($driver, $date, $vehicleTypeZoneId);
            $levels = $this->getLevels($vehicleTypeZoneId);
            $overview = $this->getOverview($driver);

            return response()->json( array_merge($todayData, [
                    'weekly' => $weeklyData,
                    'levels' => $levels,
                    'overview' => $overview
                ]));

        } catch (Exception $e) {
            return $this->handleError($e, 'Failed to retrieve incentive data');
        }
    }

    private function getDayData(Driver $driver, Carbon $date, int $vehicleTypeZoneId): array
    {
        $rides = Ride::where('driver_id', $driver->id)
            ->where('ride_status_id', getRideStatusIdBySlug('completed'))
            ->whereDate('dropped_at', $date)
            ->get();

        $ridesCompleted = $rides->count();
        $totalEarnings = $rides->sum('total');

        $vehicleTypeZone = VehicleTypeZone::find($vehicleTypeZoneId);
        $targetRides = $vehicleTypeZone?->incentive_target_rides ?? 3;
        $bonusAmount = $vehicleTypeZone?->incentive_amount ?? 12.00;

        return [
            'date' => $date->toDateString(),
            'rides_completed' => $ridesCompleted,
            'total_earnings' => round($totalEarnings, 2),
            'target_rides' => $targetRides,
            'bonus_amount' => round($bonusAmount, 2),
            'is_achieved' => $ridesCompleted >= $targetRides
        ];
    }

    private function getWeeklyData(Driver $driver, Carbon $date, int $vehicleTypeZoneId): array
    {
        $weekStart = (clone $date)->startOfWeek(Carbon::MONDAY);
        $weekEnd = (clone $date)->endOfWeek(Carbon::SUNDAY);

        $weeklyRides = Ride::where('driver_id', $driver->id)
            ->where('ride_status_id', getRideStatusIdBySlug('completed'))
            ->whereBetween('dropped_at', [$weekStart, $weekEnd])
            ->get();

        $ridesCompleted = $weeklyRides->count();
        $totalEarnings = $weeklyRides->sum('total');

        $vehicleTypeZone = VehicleTypeZone::find($vehicleTypeZoneId);
        $targetRides = $vehicleTypeZone?->incentive_target_rides ?? 3;
        $bonusAmount = $vehicleTypeZone?->incentive_amount ?? 12.00;

        $days = [];
        $current = clone $weekStart;
        while ($current <= $date) {
            $dayRides = Ride::where('driver_id', $driver->id)
                ->where('ride_status_id', getRideStatusIdBySlug('completed'))
                ->whereDate('dropped_at', $current)
                ->get();

            $days[] = [
                'date' => $current->toDateString(),
                'rides_completed' => $dayRides->count(),
                'total_earnings' => round($dayRides->sum('total'), 2),
                'levels' => []
            ];

            $current->addDay();
        }

        return [
            'week_start' => $weekStart->toDateString(),
            'week_end' => $weekEnd->toDateString(),
            'rides_completed' => $ridesCompleted,
            'total_earnings' => round($totalEarnings, 2),
            'target_rides' => $targetRides,
            'bonus_amount' => round($bonusAmount, 2),
            'is_achieved' => $ridesCompleted >= $targetRides,
            'days' => $days
        ];
    }

    private function getLevels(int $vehicleTypeZoneId): array
    {
        $levels = IncentiveLevel::byVehicleTypeZone($vehicleTypeZoneId)
            ->active()
            ->ordered()
            ->get();

        return $levels->map(fn($level) => [
            'id' => $level->id,
            'level_number' => $level->level_number,
            'target_rides' => $level->target_rides,
            'incentive_amount' => number_format($level->incentive_amount, 2, '.', ''),
            'is_completed' => false
        ])->toArray();
    }

    private function getOverview(Driver $driver): array
    {
        $allTimeIncentives = $driver->incentives()->achieved()->get();
        $totalCompletedRides = Ride::where('driver_id', $driver->id)
            ->where('ride_status_id', getRideStatusIdBySlug('completed'))
            ->count();

        return [
            'total_earned' => (int) $allTimeIncentives->sum('bonus_amount'),
            'total_incentives' => $allTimeIncentives->count(),
            'total_completed_rides' => $totalCompletedRides
        ];
    }

    public function processRideIncentives(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'ride_id' => 'required|integer|exists:rides,id',
                'driver_id' => 'required|integer|exists:drivers,id'
            ]);

            $ride = Ride::findOrFail($request->ride_id);
            $driver = Driver::findOrFail($request->driver_id);

            if ($ride->ride_status_id !== getRideStatusIdBySlug('completed')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ride is not completed'
                ], 400);
            }

            $result = $this->calculationService->calculateIncentives($driver, $ride);

            return response()->json([
                'success' => $result['success'],
                'message' => $result['message'],
                'data' => $result['results'] ?? []
            ], $result['success'] ? 200 : 500);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (Exception $e) {
            return $this->handleError($e, 'Failed to process ride incentives');
        }
    }

    private function validateDriverAccess(): Driver
    {
        if (getCurrentRoleName() !== RoleEnum::DRIVER) {
            throw new Exception('Unauthorized access: Only drivers can view incentive data', 403);
        }

        $driver = Driver::find(getCurrentUserId());

        if (!$driver) {
            throw new Exception('Driver not found', 404);
        }

        return $driver;
    }

    private function getVehicleTypeZoneId(Request $request, Driver $driver): int
    {
        $vehicleTypeZoneId = $request->input('vehicle_type_zone_id')
            ?? $this->detectVehicleTypeZoneId($driver);

        if (!$vehicleTypeZoneId) {
            throw new Exception('No vehicle type zone found for driver', 400);
        }

        return $vehicleTypeZoneId;
    }

    private function detectVehicleTypeZoneId(Driver $driver): ?int
    {
        $latestRide = $driver->rides()
            ->where('ride_status_id', getRideStatusIdBySlug('completed'))
            ->latest('dropped_at')
            ->first();

        if ($latestRide?->vehicle_type_id) {
            $zoneId = $latestRide->zones()->value('zone_id');
            if ($zoneId) {
                $vehicleTypeZone = VehicleTypeZone::where('vehicle_type_id', $latestRide->vehicle_type_id)
                    ->where('zone_id', $zoneId)
                    ->value('id');
                if ($vehicleTypeZone) {
                    return $vehicleTypeZone;
                }
            }
        }

        if ($driver->vehicleInfo?->vehicle_type_id) {
            return VehicleTypeZone::where('vehicle_type_id', $driver->vehicleInfo->vehicle_type_id)
                ->value('id');
        }

        return null;
    }

    private function handleError(Exception $e, string $defaultMessage): JsonResponse
    {
        Log::error($defaultMessage, [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        $statusCode = in_array($e->getCode(), [400, 403, 404]) ? $e->getCode() : 500;

        return response()->json([
            'success' => false,
            'message' => $e->getCode() > 0 ? $e->getMessage() : $defaultMessage
        ], $statusCode);
    }
}
