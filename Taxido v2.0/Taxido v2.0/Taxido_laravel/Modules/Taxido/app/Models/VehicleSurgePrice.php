<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleSurgePrice extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'id',
        'vehicle_type_id',
        'zone_id',
        'surge_price_id',
        'amount'
    ];

    /**
     * @return BelongsTo
     */
    public function surgePrice(): BelongsTo
    {
        return $this->belongsTo(SurgePrice::class,'surge_price_id');
    }
}
