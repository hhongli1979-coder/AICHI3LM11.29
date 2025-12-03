<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SOSStatusActivity extends Model
{
    use HasFactory,SoftDeletes;

    protected $table  = 'sos_status_activities';

    protected $fillable = [
        'status',
        'ride_id',
        'sos_alert_id',
        'changed_at',
    ];

    /**
     * @return BelongsTo
     */
    public function sosAlert(): BelongsTo
    {
        return $this->belongsTo(SOSAlert::class, 'sos_alert_id');
    }

    /**
     * @return BelongsTo
     */
    public function ride(): BelongsTo
    {
        return $this->belongsTo(Ride::class, 'ride_id');
    }

}