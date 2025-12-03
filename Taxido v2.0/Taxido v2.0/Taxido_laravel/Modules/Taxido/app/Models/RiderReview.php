<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RiderReview extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'rider_reviews';

    /**
     * The Review that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'rating',
        'rider_id',
        'ride_id',
        'service_id',
        'message',
        'service_category_id',
        'driver_id',
    ];

    protected $casts = [
        'ride_id' => 'integer',
        'rider_id' => 'integer',
        'rating' => 'integer',
    ];

    protected $hidden = [
        'updated_at',
        'deleted_at'
    ];

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
    public function rider(): BelongsTo
    {
        return $this->belongsTo(Rider::class, 'rider_id');
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
