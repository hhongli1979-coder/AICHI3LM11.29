<?php

namespace Modules\Taxido\Models;

use App\Models\Attachment;
use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Cviebrock\EloquentSluggable\Sluggable;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class VehicleType extends Model implements HasMedia
{
    use Sluggable, InteractsWithMedia, SoftDeletes, HasTranslations;

    /**
     * The Vehicles that are mass assignable.
     *
     * @var array
     */
    public $translatable = [
        'name',
        'description',
    ];

    protected $fillable = [
        'name',
        'description',
        'slug',
        'max_seat',
        'service_id',
        'vehicle_image_id',
        'vehicle_map_icon_id',
        'is_all_zones',
        'commission_type',
        'commission_rate',
        'status',
        'created_by_id'
    ];

    protected $casts = [
        'status' => 'integer',
        'commission_rate' => 'float',
        'vehicle_image_id' => 'integer',
        'vehicle_map_icon_id' => 'integer',
    ];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId() ?? getAdmin()?->id;
        });
    }

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
                'onUpdate' => true,
            ]
        ];
    }

    public function toArray()
    {
        $attributes = parent::toArray();
        foreach ($this->getTranslatableAttributes() as $name) {
            $translation = $this->getTranslation($name, app()->getLocale());
            $attributes[$name] = $translation ?? ($attributes[$name] ?? null);
        }
        return $attributes;
    }

    /**
     * @return HasOne
     */
    public function vehicle_info(): HasOne
    {
        return $this->hasOne(VehicleInfo::class,'id');
    }

    /**
     * @return BelongsTo
     */
    public function created_by(): BelongsTo
    {
        return $this->belongsTo(Rider::class, 'created_by_id');
    }

    /**
     * @return BelongsTo
     */
    public function vehicle_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'vehicle_image_id');
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
    public function vehicle_map_icon(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'vehicle_map_icon_id');
    }

    /**
     * @return BelongsToMany
     */
    public function zones(): BelongsToMany
    {
        return $this->belongsToMany(Zone::class, 'vehicle_type_zones', 'vehicle_type_id');
    }

    /**
     * @return BelongsToMany
     */
    public function coupons(): BelongsToMany
    {
        return $this->belongsToMany(Coupon::class, 'coupon_vehicle_types');
    }

    /**
     * @return BelongsToMany
     */
    public function service_categories(): BelongsToMany
    {
        return $this->belongsToMany(ServiceCategory::class, 'vehicle_categories');
    }

    /**
     * @return BelongsToMany
     */
    public function hourly_packages(): BelongsToMany
    {
        return $this->belongsToMany(HourlyPackage::class, 'vehicle_type_hourly_packages');
    }

    /**
     * @return BelongsToMany
     */
    public function driver_rules(): BelongsToMany
    {
        return $this->belongsToMany(DriverRule::class, 'driver_vehicle_types');
    }
}
