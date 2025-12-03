<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Incentive extends Model
{

  protected $table = 'incentives';

  protected $fillable = [
    'driver_id',
    'incentive_level_id',
    'type',
    'applicable_date',
    'target_rides',
    'bonus_amount',
    'is_achieved',
  ];

  protected $casts = [
    'driver_id' => 'integer',
    'incentive_level_id' => 'integer',
    'applicable_date' => 'date',
    'target_rides' => 'integer',
    'bonus_amount' => 'decimal:2',
    'is_achieved' => 'boolean',
  ];

  /**
    * @return BelongsTo
  */
  public function driver(): BelongsTo
  {
    return $this->belongsTo(Driver::class, 'driver_id');
  }

  /**
   * Relationship to IncentiveLevel
   * @return BelongsTo
   */
  public function incentiveLevel(): BelongsTo
  {
    return $this->belongsTo(IncentiveLevel::class, 'incentive_level_id');
  }

  /**
   * Get the vehicle type zone through incentive level
   */
  public function getVehicleTypeZoneAttribute()
  {
    return $this->incentiveLevel?->vehicleTypeZone;
  }

  /**
   * Get the level number through incentive level
   */
  public function getLevelNumberAttribute()
  {
    return $this->incentiveLevel?->level_number;
  }

  /**
   * Get the period type through incentive level
   */
  public function getPeriodTypeAttribute()
  {
    return $this->incentiveLevel?->period_type;
  }

  /**
   * Scope to get incentives by level
   */
  public function scopeByLevel($query, int $incentiveLevelId)
  {
    return $query->where('incentive_level_id', $incentiveLevelId);
  }

  /**
   * Scope to get achieved incentives
   */
  public function scopeAchieved($query)
  {
    return $query->where('is_achieved', true);
  }

  /**
   * Scope to get incentives by date range
   */
  public function scopeByDateRange($query, $startDate, $endDate)
  {
    return $query->whereBetween('applicable_date', [$startDate, $endDate]);
  }
}
