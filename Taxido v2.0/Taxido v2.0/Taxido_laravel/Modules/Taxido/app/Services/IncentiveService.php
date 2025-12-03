<?php

namespace Modules\Taxido\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Modules\Taxido\Models\IncentiveLevel;
use Modules\Taxido\Models\VehicleTypeZone;

class IncentiveService
{
    /**
     * Create multiple incentive levels for a vehicle type zone
     *
     * @param int $vehicleTypeZoneId
     * @param string $periodType
     * @param array $levels
     * @return array
     * @throws ValidationException
     */
    public function createIncentiveLevels(int $vehicleTypeZoneId, string $periodType, array $levels): array
    {
        // Validate vehicle type zone exists
        $vehicleTypeZone = VehicleTypeZone::findOrFail($vehicleTypeZoneId);

        // Validate progressive targets
        $this->validateProgressiveTargets($levels);

        // Validate individual level data
        $this->validateLevelData($levels, $vehicleTypeZoneId, $periodType);

        DB::beginTransaction();
        try {
            // Deactivate existing levels for this period
            IncentiveLevel::where('vehicle_type_zone_id', $vehicleTypeZoneId)
                ->where('period_type', $periodType)
                ->update(['is_active' => false]);

            $createdLevels = [];
            foreach ($levels as $levelData) {
                $incentiveLevel = IncentiveLevel::create([
                    'vehicle_type_zone_id' => $vehicleTypeZoneId,
                    'period_type' => $periodType,
                    'level_number' => $levelData['level_number'],
                    'target_rides' => $levelData['target_rides'],
                    'incentive_amount' => $levelData['incentive_amount'],
                    'is_active' => true,
                ]);

                $createdLevels[] = $incentiveLevel;
            }

            DB::commit();

            Log::info('Incentive levels created successfully', [
                'vehicle_type_zone_id' => $vehicleTypeZoneId,
                'period_type' => $periodType,
                'levels_count' => count($createdLevels)
            ]);

            return $createdLevels;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create incentive levels', [
                'vehicle_type_zone_id' => $vehicleTypeZoneId,
                'period_type' => $periodType,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Update incentive levels for a vehicle type zone
     *
     * @param int $vehicleTypeZoneId
     * @param string $periodType
     * @param array $levels
     * @return array
     * @throws ValidationException
     */
    public function updateIncentiveLevels(int $vehicleTypeZoneId, string $periodType, array $levels): array
    {
        // Validate progressive targets
        $this->validateProgressiveTargets($levels);

        // Validate individual level data
        $this->validateLevelData($levels, $vehicleTypeZoneId, $periodType);

        DB::beginTransaction();
        try {
            // Delete existing levels for this period
            IncentiveLevel::where('vehicle_type_zone_id', $vehicleTypeZoneId)
                ->where('period_type', $periodType)
                ->delete();

            // Create new levels
            $updatedLevels = [];
            foreach ($levels as $levelData) {
                $incentiveLevel = IncentiveLevel::create([
                    'vehicle_type_zone_id' => $vehicleTypeZoneId,
                    'period_type' => $periodType,
                    'level_number' => $levelData['level_number'],
                    'target_rides' => $levelData['target_rides'],
                    'incentive_amount' => $levelData['incentive_amount'],
                    'is_active' => true,
                ]);

                $updatedLevels[] = $incentiveLevel;
            }

            DB::commit();

            Log::info('Incentive levels updated successfully', [
                'vehicle_type_zone_id' => $vehicleTypeZoneId,
                'period_type' => $periodType,
                'levels_count' => count($updatedLevels)
            ]);

            return $updatedLevels;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update incentive levels', [
                'vehicle_type_zone_id' => $vehicleTypeZoneId,
                'period_type' => $periodType,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Delete a specific incentive level
     *
     * @param int $incentiveLevelId
     * @return bool
     */
    public function deleteIncentiveLevel(int $incentiveLevelId): bool
    {
        try {
            $incentiveLevel = IncentiveLevel::findOrFail($incentiveLevelId);

            DB::beginTransaction();

            // Soft delete by setting is_active to false to preserve historical data
            $incentiveLevel->update(['is_active' => false]);

            DB::commit();

            Log::info('Incentive level deleted successfully', [
                'incentive_level_id' => $incentiveLevelId
            ]);

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete incentive level', [
                'incentive_level_id' => $incentiveLevelId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Delete all incentive levels for a vehicle type zone and period
     *
     * @param int $vehicleTypeZoneId
     * @param string $periodType
     * @return bool
     */
    public function deleteIncentiveLevelsForPeriod(int $vehicleTypeZoneId, string $periodType): bool
    {
        try {
            DB::beginTransaction();

            IncentiveLevel::where('vehicle_type_zone_id', $vehicleTypeZoneId)
                ->where('period_type', $periodType)
                ->update(['is_active' => false]);

            DB::commit();

            Log::info('All incentive levels deleted for period', [
                'vehicle_type_zone_id' => $vehicleTypeZoneId,
                'period_type' => $periodType
            ]);

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete incentive levels for period', [
                'vehicle_type_zone_id' => $vehicleTypeZoneId,
                'period_type' => $periodType,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Get incentive configuration by vehicle type and zone
     *
     * @param int $vehicleTypeZoneId
     * @param string|null $periodType
     * @return array
     */
    public function getIncentiveConfiguration(int $vehicleTypeZoneId, ?string $periodType = null): array
    {
        $query = IncentiveLevel::byVehicleTypeZone($vehicleTypeZoneId)
            ->active()
            ->ordered();

        if ($periodType) {
            $query->byPeriod($periodType);
        }

        $levels = $query->get();

        // Group by period type
        $configuration = [];
        foreach ($levels as $level) {
            $configuration[$level->period_type][] = [
                'id' => $level->id,
                'level_number' => $level->level_number,
                'target_rides' => $level->target_rides,
                'incentive_amount' => $level->incentive_amount,
                'is_active' => $level->is_active,
            ];
        }

        return $configuration;
    }

    /**
     * Get active incentive levels for a specific period
     *
     * @param int $vehicleTypeZoneId
     * @param string $periodType
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveLevelsForPeriod(int $vehicleTypeZoneId, string $periodType)
    {
        return IncentiveLevel::byVehicleTypeZone($vehicleTypeZoneId)
            ->byPeriod($periodType)
            ->active()
            ->ordered()
            ->get();
    }

    /**
     * Check if a vehicle type zone has incentive levels configured
     *
     * @param int $TypeZoneId
     * @param string|null $periodType
     * @return bool
     */
    public function hasIncentiveLevels(int $vehicleTypeZoneId, ?string $periodType = null): bool
    {
        $query = IncentiveLevel::byVehicleTypeZone($vehicleTypeZoneId)->active();

        if ($periodType) {
            $query->byPeriod($periodType);
        }

        return $query->exists();
    }

    /**
     * Get the next level that can be achieved based on current rides
     *
     * @param int $vehicleTypeZoneId
     * @param string $periodType
     * @param int $currentRides
     * @param int $lastCompletedLevel
     * @return IncentiveLevel|null
     */
    public function getNextAchievableLevel(int $vehicleTypeZoneId, string $periodType, int $currentRides, int $lastCompletedLevel): ?IncentiveLevel
    {
        return IncentiveLevel::byVehicleTypeZone($vehicleTypeZoneId)
            ->byPeriod($periodType)
            ->active()
            ->where('level_number', '>', $lastCompletedLevel)
            ->where('target_rides', '<=', $currentRides)
            ->orderBy('level_number')
            ->first();
    }

    /**
     * Get all levels that can be achieved based on current rides
     *
     * @param int $vehicleTypeZoneId
     * @param string $periodType
     * @param int $currentRides
     * @param int $lastCompletedLevel
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAchievableLevels(int $vehicleTypeZoneId, string $periodType, int $currentRides, int $lastCompletedLevel)
    {
        return IncentiveLevel::byVehicleTypeZone($vehicleTypeZoneId)
            ->byPeriod($periodType)
            ->active()
            ->where('level_number', '>', $lastCompletedLevel)
            ->where('target_rides', '<=', $currentRides)
            ->ordered()
            ->get();
    }

    /**
     * Validate progressive target rides (each level > previous)
     *
     * @param array $levels
     * @throws ValidationException
     */
    private function validateProgressiveTargets(array $levels): void
    {
        $errors = IncentiveLevel::validateProgressiveTargets($levels);

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }

    /**
     * Validate individual level data
     *
     * @param array $levels
     * @param int $vehicleTypeZoneId
     * @param string $periodType
     * @throws ValidationException
     */
    private function validateLevelData(array $levels, int $vehicleTypeZoneId, string $periodType): void
    {
        $rules = IncentiveLevel::validationRules();
        $errors = [];

        // Check maximum 5 levels
        if (count($levels) > 5) {
            $errors['levels'] = 'Maximum 5 incentive levels are allowed per period.';
        }

        // Validate each level
        foreach ($levels as $index => $levelData) {
            // Add required fields if missing
            $levelData['vehicle_type_zone_id'] = $vehicleTypeZoneId;
            $levelData['period_type'] = $periodType;

            // Validate against rules
            $validator = validator($levelData, $rules);

            if ($validator->fails()) {
                foreach ($validator->errors()->messages() as $field => $messages) {
                    $errors["levels.{$index}.{$field}"] = $messages[0];
                }
            }

            // Check level number is within range and unique
            if (!isset($levelData['level_number']) || $levelData['level_number'] < 1 || $levelData['level_number'] > 5) {
                $errors["levels.{$index}.level_number"] = 'Level number must be between 1 and 5.';
            }
        }

        // Check for duplicate level numbers
        $levelNumbers = array_column($levels, 'level_number');
        if (count($levelNumbers) !== count(array_unique($levelNumbers))) {
            $errors['levels'] = 'Duplicate level numbers are not allowed.';
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }
}
