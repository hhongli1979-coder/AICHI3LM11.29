<?php

namespace Modules\Taxido\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bid extends Model
{
    use HasFactory;

    protected $table = 'bids';

    protected $fillable = [
        'id',
        'ride_request_id',
        'ride_id',
        'driver_id',
        'amount',
        'status',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected $casts = [
        'ride_request_id' => 'integer',
        'ride_id' => 'integer',
        'driver_id' => 'integer',
        'amount' => 'float',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Bid')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->title} - Bid has been {$eventName}");
    }

    /**
     * @return HasMany
     */
    public function ride(): HasMany
    {
        return $this->hasMany(Ride::class, 'ride_id');
    }

    /**
     * @return HasMany
     */
    public function ride_status_activities(): HasMany
    {
        return $this->hasMany(RideStatusActivity::class, 'ride_id');
    }

    /**
     * @return BelongsTo
     */
    public function ride_request(): BelongsTo
    {
        return $this->belongsTo(RideRequest::class, 'ride_request_id');
    }

    /**
     * @return BelongsTo
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'driver_id')->with('profile_image')->without(['address', 'zones', 'payment_account', 'vehicle_info']);
    }
}
