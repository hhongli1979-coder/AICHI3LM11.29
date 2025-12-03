<?php

namespace Modules\Taxido\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CabCommissionHistory extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "cab_commission_histories";

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'admin_commission',
        'driver_commission',
        'fleet_commission',
        'commission_rate',
        'commission_type',
        'ride_id',
        'driver_id'
    ];

    protected $with = [
        'ride',
        'driver'
    ];

    protected $casts = [
        'admin_commission' => 'float',
        'driver_commission' => 'float',
        'fleet_commission' => 'float',
        'commission_rate' => 'float',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('CabCommissionHistory')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->ride_id} - CabCommissionHistory has been {$eventName}");
    }

    /**
     * @return HasOne
     */
    public function ride(): HasOne
    {
        return $this->hasOne(Ride::class,'id', 'ride_id');
    }

    /**
     * @return HasOne
     */
    public function driver(): HasOne
    {
        return $this->hasOne(Driver::class,'id', 'driver_id');
    }
}
