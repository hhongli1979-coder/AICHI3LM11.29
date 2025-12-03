<?php

namespace Modules\Taxido\Models;

use App\Models\User;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Coupon extends Model
{
    use HasFactory, SoftDeletes,HasTranslations;

    /**
     * The Coupons that are mass assignable.
     *
     * @var array
     */
    public $translatable = [
        'title',
        'description'
    ];

    protected $fillable = [
        'title',
        'description',
        'code',
        'used',
        'type',
        'amount',
        'status',
        'content',
        'min_ride_fare',
        'is_expired',
        'start_date',
        'end_date',
        'is_apply_all',
        'is_unlimited',
        'created_by_id',
        'usage_per_coupon',
        'usage_per_rider',
    ];

    protected $casts = [
        'min_ride_fare' => 'integer',
        'amount' => 'integer',
        'usage_per_rider' => 'integer',
        'is_expired' => 'integer',
        'is_unlimited' => 'integer',
        'status' => 'integer',
    ];

    protected $hidden = [
        'used',
        'is_apply_all',
        'is_unlimited',
    ];

    protected $dates = [
        'start_date',
        'end_date'
    ];

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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Coupon')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->title} - Coupon has been {$eventName}");
    }

    public function scopeActive(Builder $query)
    {
        return $query->where(function ($coupons) {
            $coupons->where('is_expired', false)
              ->orWhere(function ($q2) {
                  $q2->where('is_expired', true)
                     ->whereDate('end_date', '>=', now());
              });
        })?->where('status', true)?->whereNUll('deleted_at');
    }

    /**
     * @return BelongsTo
     */
    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return BelongsToMany
     */
    public function riders(): BelongsToMany
    {
        return $this->belongsToMany(Rider::class, 'coupon_riders', 'coupon_id');
    }

    /**
     * @return BelongsToMany
     */
    public function zones(): BelongsToMany
    {
        return $this->belongsToMany(Zone::class, 'coupon_zones', 'coupon_id');
    }

    /**
     * @return BelongsToMany
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'coupon_service', 'coupon_id');
    }

    /**
     * @return BelongsToMany
     */
    public function vehicle_types(): BelongsToMany
    {
        return $this->belongsToMany(VehicleType::class, 'coupon_vehicle_types', 'coupon_id');
    }

    /**
     * @return HasMany
     */
    public function rides(): HasMany
    {
        return $this->hasMany(Ride::class, 'coupon_id');
    }
}
