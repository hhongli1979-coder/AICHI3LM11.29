<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VehicleTypeZonePreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_type_zone_id',
        'preference_id',
        'price'
    ];

    protected $casts = [
        'price' => 'double'
    ];

    /**
     * @return BelongsTo
     */
    public function vehicleTypeZone(): BelongsTo
    {
        return $this->belongsTo(VehicleTypeZone::class);
    }

    /**
     * @return BelongsTo
     */
    public function preference(): BelongsTo
    {
        return $this->belongsTo(Preference::class);
    }
}
