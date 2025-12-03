<?php

namespace Modules\Taxido\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DriverReview extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'driver_reviews';

    protected $fillable = [
        'rating',
        'driver_id',
        'ride_id',
        'message',
        'service_id',
        'service_category_id',
        'rider_id',
    ];

    protected $hidden = [
        'updated_at',
        'deleted_at'
    ];
    protected $casts = [
        'ride_id' => 'integer',
        'driver_id' => 'integer',
        'rating' => 'integer',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('DriverReview')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->ride_id} - Driver Review has been {$eventName}");
    }

    /**
     * @return BelongsTo
     */
    public function ride(): BelongsTo
    {
        return $this->belongsTo(Ride::class, 'ride_id');
    }

    /**
     * @return BelongsTo
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'driver_id');
    }

    /**
     * @return BelongsTo
     */
    public function rider(): BelongsTo
    {
        return $this->belongsTo(Rider::class, 'rider_id');
    }

    /**
     * @return BelongsTo
     */
    public function services(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    /**
     * @return BelongsTo
     */
    public function service_category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }
}
