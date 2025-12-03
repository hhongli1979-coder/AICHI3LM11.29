<?php

namespace Modules\Taxido\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use MatanYadaev\EloquentSpatial\Objects\Polygon;
use MatanYadaev\EloquentSpatial\Traits\HasSpatial;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PeakZone extends Model
{
    use HasFactory, SoftDeletes, HasSpatial;

    protected $fillable = [
        'zone_id',
        'name',
        'polygon',
        'locations',
        'is_active',
        'starts_at',
        'ends_at',
        'distance_price_percentage',
    ];

    protected $spatialFields = ['polygon'];

    protected $casts = [
        'polygon' => Polygon::class,
        'locations' => 'json',
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    /**
     * @return BelongsTo
     */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    /**
     * @return HasMany
     */
    public function rides(): HasMany
    {
        return $this->hasMany(Ride::class, 'peak_zone_id');
    }

    public function isActiveNow(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = Carbon::now();
        if ($this->starts_at && $this->ends_at) {
            return $now->between($this->starts_at, $this->ends_at);
        }

        $referenceTime = $this->updated_at && $this->updated_at->gt($this->created_at)
            ? $this->updated_at
            : $this->created_at;

        $activeUntil = $referenceTime->copy()->addMinutes($this->zone->minutes_peak_zone_active);
        return $now->lessThanOrEqualTo($activeUntil);
    }

    public function getEarningsAttribute(): float
    {
        return $this->rides()
            ->where('payment_status', 'COMPLETED')
            ->sum('peak_zone_charge') * 0.2;
    }
}
