<?php

namespace Modules\Taxido\Models;

use App\Models\Tax;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VehicleTypeZone extends Model
{

    protected $table = "vehicle_type_zones";

    /**
     * Create a new factory instance for the model.
     */
    protected $fillable = [
        'id',
        'vehicle_type_id',
        'zone_id',
        'base_fare_charge',
        'base_distance',
        'tax_id',
        'is_allow_tax',
        'per_distance_charge',
        'per_minute_charge',
        'per_weight_charge',
        'waiting_charge',
        'free_waiting_time_before_start_ride',
        'free_waiting_time_after_start_ride',
        'is_allow_airport_charge',
        'cancellation_charge_for_rider',
        'cancellation_charge_for_driver',
        'commission_type',
        'commission_rate',
        'airport_charge_rate',
        'charge_goes_to',
        'is_allow_preference'
    ];

    protected $casts = [
        'vehicle_type_id' => 'integer',
        'zone_id' => 'integer',
        'is_allow_preference' => 'boolean'
    ];

    /**
     * @return BelongsTo
     */
    public function tax(): BelongsTo
    {
        return $this->belongsTo(Tax::class, 'tax_id');
    }

    /**
     * @return BelongsTo
     */
    public function vehicleType(): BelongsTo
    {
        return $this->belongsTo(VehicleType::class, 'vehicle_type_id');
    }

    /**
     * @return BelongsTo
     */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }

    public function preferences()
    {
        return $this->belongsToMany(Preference::class, 'vehicle_type_zone_preferences')
            ->withPivot('price')
            ->withTimestamps();
    }

    /**
     * Relationship to IncentiveLevel
     * @return HasMany
     */
    public function incentiveLevels(): HasMany
    {
        return $this->hasMany(IncentiveLevel::class, 'vehicle_type_zone_id');
    }

    /**
     * Get active incentive levels
     * @return HasMany
     */
    public function activeIncentiveLevels(): HasMany
    {
        return $this->incentiveLevels()->where('is_active', true);
    }

    /**
     * Get incentive levels by period type
     */
    public function getIncentiveLevelsByPeriod(string $periodType)
    {
        return $this->incentiveLevels()
            ->where('period_type', $periodType)
            ->where('is_active', true)
            ->orderBy('level_number')
            ->get();
    }

    /**
     * Check if this vehicle type zone has incentive levels configured
     */
    public function hasIncentiveLevels(): bool
    {
        return $this->incentiveLevels()->where('is_active', true)->exists();
    }
}
