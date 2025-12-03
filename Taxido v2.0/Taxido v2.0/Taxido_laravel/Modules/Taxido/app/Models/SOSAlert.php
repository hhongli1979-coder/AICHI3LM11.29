<?php

namespace Modules\Taxido\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SOSAlert extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sos_alerts';

    protected $fillable = [
        'id',
        'location_coordinates',
        'ride_id',
        'created_by_id',
        'sos_status_id',
        'sos_id'
    ];

    protected $with = [
        'ride',
        'status',
        'activities',
        'sos'
    ];

    protected $hidden = [
        'deleted_at',
        'updated_at',
    ];

    protected $casts = [
        'location_coordinates' => 'array',
        'created_by_id' => 'integer',
        'sos_status_id' => 'integer',
    ];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId();
        });
    }

    /**
     * @return HasMany
     */
    public function activities(): HasMany
    {
        return $this->hasMany(SOSStatusActivity::class, 'sos_alert_id');
    }

    /**
     * @return BelongsTo
     */
    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
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
    public function status(): BelongsTo
    {
        return $this->belongsTo(SOSStatus::class, 'sos_status_id');
    }

    /**
     * @return BelongsTo
     */
    public function sos(): BelongsTo
    {
        return $this->belongsTo(SOS::class, 'sos_id');
    }
}

