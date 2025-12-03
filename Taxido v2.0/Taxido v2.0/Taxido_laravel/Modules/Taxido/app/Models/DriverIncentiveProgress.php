<?php

namespace Modules\Taxido\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DriverIncentiveProgress extends Model
{

    protected $table = 'driver_incentive_progress';

    protected $fillable = [
        'driver_id',
        'vehicle_type_zone_id',
        'period_type',
        'period_date',
        'current_rides',
        'last_completed_level',
        'completed_levels',
    ];

    protected $casts = [
        'driver_id' => 'integer',
        'vehicle_type_zone_id' => 'integer',
        'period_date' => 'date',
        'current_rides' => 'integer',
        'last_completed_level' => 'integer',
        'completed_levels' => 'array',
    ];

    /**
     * Relationship to Driver
     * @return BelongsTo
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'driver_id');
    }

    /**
     * Relationship to VehicleTypeZone
     * @return BelongsTo
     */
    public function vehicleTypeZone(): BelongsTo
    {
        return $this->belongsTo(VehicleTypeZone::class, 'vehicle_type_zone_id');
    }

    /**
     * Get the current period date based on period type
     */
    public static function getCurrentPeriodDate(string $periodType): Carbon
    {
        $now = Carbon::now();

        return match ($periodType) {
            'daily' => $now->startOfDay(),
            'weekly' => $now->startOfWeek(),
            default => $now->startOfDay(),
        };
    }

    /**
     * Get the next period date based on period type
     */
    public static function getNextPeriodDate(string $periodType, Carbon $currentPeriodDate): Carbon
    {
        return match ($periodType) {
            'daily' => $currentPeriodDate->copy()->addDay(),
            'weekly' => $currentPeriodDate->copy()->addWeek(),
            default => $currentPeriodDate->copy()->addDay(),
        };
    }

    /**
     * Check if the current period has ended
     */
    public function isPeriodEnded(): bool
    {
        $now = Carbon::now();
        $periodEnd = $this->getPeriodEndDate();

        return $now->greaterThan($periodEnd);
    }

    /**
     * Get the end date of the current period
     */
    public function getPeriodEndDate(): Carbon
    {
        return match ($this->period_type) {
            'daily' => $this->period_date->copy()->endOfDay(),
            'weekly' => $this->period_date->copy()->endOfWeek(),
            default => $this->period_date->copy()->endOfDay(),
        };
    }

    /**
     * Add a completed level to the progress
     */
    public function addCompletedLevel(int $level, float $incentiveAmount): void
    {
        $completedLevels = $this->completed_levels ?? [];

        $completedLevels[] = [
            'level' => $level,
            'completed_at' => Carbon::now()->toDateTimeString(),
            'incentive_amount' => $incentiveAmount,
        ];

        $this->completed_levels = $completedLevels;
        $this->last_completed_level = $level;
        $this->save();
    }

    /**
     * Check if a specific level has been completed
     */
    public function hasCompletedLevel(int $level): bool
    {
        $completedLevels = $this->completed_levels ?? [];

        return collect($completedLevels)->contains('level', $level);
    }

    /**
     * Get the next level that can be completed
     */
    public function getNextAvailableLevel(): ?int
    {
        return $this->last_completed_level + 1;
    }

    /**
     * Reset progress for a new period
     */
    public function resetForNewPeriod(string $periodType): void
    {
        $this->update([
            'period_date' => self::getCurrentPeriodDate($periodType),
            'current_rides' => 0,
            'last_completed_level' => 0,
            'completed_levels' => [],
        ]);
    }

    /**
     * Increment ride count
     */
    public function incrementRideCount(): void
    {
        $this->increment('current_rides');
    }

    /**
     * Get progress percentage for a specific level
     */
    public function getProgressPercentage(int $targetRides): float
    {
        if ($targetRides <= 0) {
            return 0;
        }

        return min(100, ($this->current_rides / $targetRides) * 100);
    }

    /**
     * Get remaining rides needed for a specific target
     */
    public function getRemainingRides(int $targetRides): int
    {
        return max(0, $targetRides - $this->current_rides);
    }

    /**
     * Scope to get progress for current period
     */
    public function scopeCurrentPeriod($query, string $periodType)
    {
        $currentPeriodDate = self::getCurrentPeriodDate($periodType);

        return $query->where('period_type', $periodType)
                    ->where('period_date', $currentPeriodDate);
    }

    /**
     * Scope to get progress by driver
     */
    public function scopeByDriver($query, int $driverId)
    {
        return $query->where('driver_id', $driverId);
    }

    /**
     * Scope to get progress by vehicle type zone
     */
    public function scopeByVehicleTypeZone($query, int $vehicleTypeZoneId)
    {
        return $query->where('vehicle_type_zone_id', $vehicleTypeZoneId);
    }
}
