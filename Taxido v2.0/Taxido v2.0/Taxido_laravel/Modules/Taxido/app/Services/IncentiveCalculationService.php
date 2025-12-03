<?php

namespace Modules\Taxido\Services;

use Exception;
use Modules\Taxido\Http\Traits\WalletPointsTrait;
use Modules\Taxido\Models\Ride;
use Modules\Taxido\Models\Driver;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\Incentive;
use Modules\Taxido\Models\IncentiveLevel;
use Modules\Taxido\Models\VehicleTypeZone;
use Modules\Taxido\Models\DriverIncentiveProgress;
use Modules\Taxido\Events\DriverIncentiveLevelCompletedEvent;

class IncentiveCalculationService
{
    use WalletPointsTrait;
    private IncentiveService $incentiveService;

    public function __construct(IncentiveService $incentiveService)
    {
        $this->incentiveService = $incentiveService;
    }

    /**
     * Calculate and process incentives for a driver after ride completion
     *
     * @param Driver $driver
     * @param Ride $ride
     * @return array
     */
    public function calculateIncentives(Driver $driver, Ride $ride, $vehicleTypeZone): array
    {
        try {
            if (!$vehicleTypeZone) {
                return ['success' => false, 'message' => 'No vehicle type zone found'];
            }

            if (!$vehicleTypeZone->hasIncentiveLevels()) {
                return ['success' => true, 'message' => 'No incentive levels configured', 'incentives_credited' => []];
            }

            $results = [];
            foreach (['daily', 'weekly'] as $periodType) {
                $result = $this->processIncentivesForPeriod($driver, $ride, $vehicleTypeZone, $periodType);
                if ($result['incentives_credited']) {
                    $results[$periodType] = $result;
                }
            }

            return [
                'success' => true,
                'message' => 'Incentives processed successfully',
                'results' => $results
            ];

        } catch (Exception $e) {

            throw new ExceptionHandler( $e->getMessage(), $e->getCode());
        }
    }

    private function processIncentivesForPeriod(Driver $driver, Ride $ride, VehicleTypeZone $vehicleTypeZone, string $periodType): array
    {
        DB::beginTransaction();
        try {

            $progress = $this->getOrCreateDriverProgress($driver, $vehicleTypeZone, $periodType);
            if ($progress->isPeriodEnded()) {
                $progress->resetForNewPeriod($periodType);
            }

            $progress->incrementRideCount();
            $achievableLevels = $this->incentiveService->getAchievableLevels(
                $vehicleTypeZone->id,
                $periodType,
                $progress->current_rides,
                $progress->last_completed_level
            );

            $creditedIncentives = [];
            foreach ($achievableLevels as $level) {
                if (!$progress->hasCompletedLevel($level->level_number)) {
                    $incentiveResult = $this->creditIncentive($driver, $ride, $level, $progress);
                    if ($incentiveResult['success']) {
                        $creditedIncentives[] = $incentiveResult['incentive'];
                        $progress->addCompletedLevel($level->level_number, $level->incentive_amount);
                    }
                }
            }

            DB::commit();
            return [
                'success' => true,
                'period_type' => $periodType,
                'current_rides' => $progress->current_rides,
                'incentives_credited' => $creditedIncentives
            ];

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler( $e->getMessage(), $e->getCode());
        }
    }

    private function creditIncentive(Driver $driver, Ride $ride, IncentiveLevel $level, DriverIncentiveProgress $progress)
    {
        try {

            $incentive = Incentive::create([
                'driver_id' => $driver->id,
                'incentive_level_id' => $level->id,
                'type' => $level->period_type,
                'applicable_date' => $progress->period_date,
                'target_rides' => $level->target_rides,
                'bonus_amount' => $level->incentive_amount,
                'is_achieved' => true,
            ]);

            $symbol = $ride->currency_symbol;
            $this->creditDriverWallet($driver->id, $level->incentive_amount, "Level {$level->level} Incentive: {$level->target_rides} rides completed – Bonus {$symbol}{$level->incentive_amount} credited");
            event(new DriverIncentiveLevelCompletedEvent($incentive));
            return $incentive;

        } catch (Exception $e) {

            throw new ExceptionHandler( $e->getMessage(), $e->getCode());
        }
    }

    private function getOrCreateDriverProgress(Driver $driver, VehicleTypeZone $vehicleTypeZone, string $periodType): DriverIncentiveProgress
    {
        $currentPeriodDate = DriverIncentiveProgress::getCurrentPeriodDate($periodType);
        return DriverIncentiveProgress::firstOrCreate([
            'driver_id' => $driver->id,
            'vehicle_type_zone_id' => $vehicleTypeZone?->id,
            'period_type' => $periodType,
            'period_date' => $currentPeriodDate,
        ], [
            'current_rides' => 0,
            'last_completed_level' => 0,
            'completed_levels' => [],
        ]);
    }

    private function getVehicleTypeZoneForRide(Ride $ride): ?VehicleTypeZone
    {
        return VehicleTypeZone::find($ride->vehicle_type_zone_id);
    }
}
