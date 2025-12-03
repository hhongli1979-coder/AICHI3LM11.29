<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RideStatusActivity extends Model
{
    use HasFactory;

    protected $table = 'ride_status_activities';

    protected $fillable = [
        'id',
        'status',
        'ride_request_id',
        'ride_id',
        'changed_at'
    ];

    protected $casts = [
        'ride_id' => 'integer',
        'ride_request_id' => 'integer',
    ];

    /**
     * @return BelongsTo
     */
    public function ride_status(): BelongsTo
    {
        return $this->belongsTo(RideStatus::class, 'ride_status_id');
    }

    /**
     * @return BelongsTo
     */
    public function ride(): BelongsTo
    {
        return $this->belongsTo(Ride::class, 'ride_id');
    }

}
