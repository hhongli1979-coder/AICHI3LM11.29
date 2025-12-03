<?php

namespace Modules\Taxido\Models;

use App\Models\Currency;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\SoftDeletes;
use MatanYadaev\EloquentSpatial\Objects\Polygon;
use MatanYadaev\EloquentSpatial\Traits\HasSpatial;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Zone extends Model
{
    use HasFactory, HasSpatial, SoftDeletes, HasTranslations;

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
    {
        return \Modules\Taxido\Database\Factories\ZoneFactory::new();
    }

    public $translatable = [
        'name',
    ];

    protected $fillable = [
        'id',
        'name',
        'place_points',
        'locations',
        'payment_method',
        'amount',
        'status',
        'weight_unit',
        'currency_id',
        'distance_type',
        'created_by_id',

        'total_rides_in_peak_zone',
        'peak_zone_geographic_radius',
        'minutes_choosing_peak_zone',
        'minutes_peak_zone_active',
        'peak_price_increase_percentage',
    ];

    protected $spatialFields = [
        'place_points',
    ];

    protected $visible = [
        'id',
        'name',
        'payment_method',
        'status',
        'distance_type',
        'total_rides_in_peak_zone',
        'peak_zone_geographic_radius',
        'minutes_choosing_peak_zone',
        'minutes_peak_zone_active',
        'peak_price_increase_percentage',
    ];

    protected $casts = [
        'place_points' => Polygon::class,
        'locations' => 'json',
        'status' => 'string',
        'payment_method' => 'array',
        'amount' => 'integer',
    ];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId() ?? getAdmin()?->id;
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

    public function setPaymentMethodAttribute($value)
    {
        $this->attributes['payment_method'] = is_array($value)
            ? json_encode(array_values($value))
            : $value;
    }

    public function getPaymentMethodAttribute($value)
    {
        $decoded = json_decode($value, true);
        return is_array($decoded) ? $decoded : [];
    }

    public function getPaymentMethodDetailsAttribute()
    {
        $storedMethods = $this->payment_method;
        $allMethods = collect(getPaymentMethodList())->keyBy('slug');

        return array_values(array_filter(array_map(function ($slug) use ($allMethods) {
            if ($allMethods->has($slug)) {
                $method = $allMethods[$slug];
                return [
                    'slug' => $slug,
                    'name' => $method['name'] ?? '',
                    'title' => $method['title'] ?? '',
                    'image' => $method['image'] ?? '',
                    'status' => $method['status'] ?? false,
                ];
            }
            return null;
        }, $storedMethods)));
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Zone')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->name} - Zone has been {$eventName}");
    }

    /**
     * @return BelongsTo
     */
    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class,'currency_id');
    }

    /**
     * @return BelongsToMany
     */
    public function sos(): BelongsToMany
    {
        return $this->belongsToMany(SOS::class, 'sos_zones');
    }

    /**
     * @return BelongsToMany
     */
    public function coupons(): BelongsToMany
    {
        return $this->belongsToMany(Coupon::class, 'coupon_zones');
    }

    /**
     * @return BelongsToMany
     */
    public function drivers(): BelongsToMany
    {
        return $this->belongsToMany(Driver::class,'driver_zones');
    }

    /**
     * @return BelongsToMany
     */
    public function dispatchers(): BelongsToMany
    {
        return $this->belongsToMany(Dispatcher::class,'dispatcher_zones');
    }

    /**
     * @return BelongsToMany
     */
    public function rides(): BelongsToMany
    {
        return $this->belongsToMany(Ride::class, 'ride_zones');
    }

    /**
     * @return HasMany
     */
    public function peakZones(): HasMany
    {
        return $this->hasMany(PeakZone::class);
    }

    public function getPeakZoneEarningsAttribute(): float
    {
        return $this->peakZones()
            ->whereHas('rides', function ($q) {
                $q->where('payment_status', 'COMPLETED');
            })
            ->withSum('rides', 'peak_zone_charge')
            ->get()
            ->sum('rides_sum_peak_zone_charge') * 0.2;
    }
}
