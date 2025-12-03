<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IncentiveLevel extends Model
{

    protected $table = 'incentive_levels';

    protected $fillable = [
        'vehicle_type_zone_id',
        'period_type',
        'level_number',
        'target_rides',
        'incentive_amount',
        'is_active',
    ];

    protected $casts = [
        'vehicle_type_zone_id' => 'integer',
        'level_number' => 'integer',
        'target_rides' => 'integer',
        'incentive_amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Validation rules for progressive target rides and positive amounts
     */
    public static function validationRules(): array
    {
        return [
            'vehicle_type_zone_id' => 'required|integer|exists:vehicle_type_zones,id',
            'period_type' => 'required|in:daily,weekly',
            'level_number' => 'required|integer|min:1|max:5',
            'target_rides' => 'required|integer|min:1',
            'incentive_amount' => 'required|numeric|min:0.01',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Custom validation for progressive target rides
     */
    public static function validateProgressiveTargets(array $levels): array
    {
        $errors = [];
        $sortedLevels = collect($levels)->sortBy('level_number');

        $previousTarget = 0;
        foreach ($sortedLevels as $index => $level) {
            if ($level['target_rides'] <= $previousTarget) {
                $errors["levels.{$index}.target_rides"] = "Target rides must be greater than the previous level ({$previousTarget} rides)";
            }
            $previousTarget = $level['target_rides'];
        }

        return $errors;
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
     * Relationship to DriverIncentiveProgress
     * @return HasMany
     */
    public function driverProgress(): HasMany
    {
        return $this->hasMany(DriverIncentiveProgress::class, 'vehicle_type_zone_id', 'vehicle_type_zone_id')
            ->where('period_type', $this->period_type);
    }

    /**
     * Relationship to Incentives (earned incentives)
     * @return HasMany
     */
    public function incentives(): HasMany
    {
        return $this->hasMany(Incentive::class, 'incentive_level_id');
    }

    /**
     * Scope to get active levels only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get levels by period type
     */
    public function scopeByPeriod($query, string $periodType)
    {
        return $query->where('period_type', $periodType);
    }

    /**
     * Scope to get levels by vehicle type zone
     */
    public function scopeByVehicleTypeZone($query, int $vehicleTypeZoneId)
    {
        return $query->where('vehicle_type_zone_id', $vehicleTypeZoneId);
    }

    /**
     * Get levels ordered by level number
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('level_number');
    }
}
