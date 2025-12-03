<?php

namespace Modules\Taxido\Models;

use App\Models\Attachment;
use Modules\Taxido\Models\Ride;
use Spatie\MediaLibrary\HasMedia;
use Modules\Taxido\Models\VehicleType;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RentalVehicle extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, HasTranslations, InteractsWithMedia;

    public $translatable = ['name', 'description'];

    protected $fillable = [
        'id',
        'name',
        'description',
        'vehicle_type_id',
        'normal_image_id',
        'front_view_id',
        'side_view_id',
        'boot_view_id',
        'interior_image_id',
        'vehicle_subtype',
        'fuel_type',
        'gear_type',
        'vehicle_speed',
        'mileage',
        'interior',
        'created_by_id',
        'status',
        'vehicle_per_day_price',
        'driver_id',
        'driver_per_day_charge',
        'registration_no',
        'registration_image_id',
        'commission_type',
        'commission_rate',
        'verified_status',
        'bag_count',
        'is_ac',
        'zone_id',
    ];

    protected $hidden = [
        'deleted_at',
        'updated_at',
    ];

    protected $casts = [
        'zone_id' => 'integer',
        'vehicle_type_id' => 'integer',
        'normal_image_id' => 'integer',
        'side_view_id' => 'integer',
        'front_view_id' => 'integer',
        'boot_view_id' => 'integer',
        'interior_image_id' => 'integer',
        'vehicle_per_day_price' => 'float',
        'driver_per_day_charge' => 'float',
        'created_by_id' => 'float',
        'registration_image_id' => 'integer'
    ];

    protected $appends = ['rental_vehicle_galleries'];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId();
        });
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

    public function getInteriorAttribute($value)
    {
        if (is_array($value)) {
            return $value;
        }

        return $value ? explode(',', $value) : [];
    }

    public function getRentalVehicleGalleriesAttribute()
    {
        $images = [
            $this->normal_image?->original_url,
            $this->side_view?->original_url,
            $this->boot_view?->original_url,
            $this->interior_image?->original_url,
            $this->front_view?->original_url,
        ];

        return array_filter($images);
    }

    /**
     * @return HasMany
     */
    public function rides(): HasMany
    {
        return $this->hasMany(Ride::class, 'rental_vehicle_id');
    }

    /**
     * @return BelongsTo
     */
    public function normal_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'normal_image_id');
    }

    /**
     * @return BelongsTo
     */
    public function side_view(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'side_view_id');
    }

    /**
     * @return BelongsTo
     */
    public function boot_view(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'boot_view_id');
    }

    /**
     * @return BelongsTo
     */
    public function interior_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'interior_image_id');
    }

    /**
     * @return BelongsTo
     */
    public function front_view(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'front_view_id');
    }

        /**
     * @return BelongsTo
     */
    public function registration_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'registration_image_id');
    }

    /**
     * @return BelongsTo
     */
    public function vehicle_type(): BelongsTo
    {
        return $this->belongsTo(VehicleType::class, 'vehicle_type_id');
    }

    /**
     * @return BelongsTo
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'driver_id')->with('profile_image')->without(['address', 'zones', 'payment_account', 'vehicle_info']);
    }

    /**
     * @return BelongsTo
     */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }
}
