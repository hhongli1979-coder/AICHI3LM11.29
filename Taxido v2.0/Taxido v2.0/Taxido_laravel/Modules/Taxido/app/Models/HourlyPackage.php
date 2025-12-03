<?php

namespace Modules\Taxido\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class HourlyPackage extends Model
{
    use HasFactory,SoftDeletes;

    /**
     * The Hourly Packages that are mass assignable.
     * @var array
    */

    protected $fillable = [
        'distance',
        'distance_type',
        'status',
        'hour',
        'created_by_id',
    ];

    protected $casts = [
        'status' => 'integer',
        'hour' => 'float',
        'distance' => 'float',
    ];

    protected $hidden = [
        'updated_at',
        'deleted_at',
    ];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId();
        });
    }

    /**
     * @return BelongsTo
     */
    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    /**
     * @return BelongsToMany
     */
    public function vehicle_types(): BelongsToMany
    {
        return $this->belongsToMany(VehicleType::class, 'vehicle_type_hourly_packages');
    }

}
