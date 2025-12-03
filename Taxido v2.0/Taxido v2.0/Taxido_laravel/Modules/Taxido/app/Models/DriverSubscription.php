<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DriverSubscription extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $table = 'driver_subscriptions';

    protected $fillable = [
        'driver_id',
        'plan_id',
        'start_date',
        'duration',
        'end_date',
        'total',
        'is_included_free_trial',
        'is_active',
        'payment_method',
        'payment_status',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public static function hasActiveSubscription($driver_id)
    {
        return self::where('driver_id', $driver_id)?->active()?->exists();
    }

    /**
     * @return BelongsTo
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }

    /**
     * @return BelongsTo
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'driver_id');
    }
}
