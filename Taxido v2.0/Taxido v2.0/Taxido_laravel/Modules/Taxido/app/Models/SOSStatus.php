<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SOSStatus extends Model 
{
    use SoftDeletes;

    protected $table = 'sos_statuses';
    
    protected $fillable = [
        'id',
        'name',
        'slug',
        'created_by_id',
    ];

    /**
     * @return BelongsTo
    */
    public function created_by(): BelongsTo
    {
        return $this->belongsTo(Rider::class, 'created_by_id');
    }   
    
    /**
     * @return HasMany
    */
    public function sosAlerts()
    {
        return $this->hasMany(SOSAlert::class, 'sos_status_id');
    }
}