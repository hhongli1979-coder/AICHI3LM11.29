<?php

namespace Modules\Taxido\Models;

use App\Models\Attachment;
use Spatie\MediaLibrary\HasMedia;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Cviebrock\EloquentSluggable\Sluggable;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ServiceCategory extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, SoftDeletes, HasTranslations, Sluggable;

    public $translatable = [
        'name',
        'description'
    ];

    protected $fillable = [
        'name',
        'slug',
        'status',
        'type',
        'description',
        'service_id',
        'service_category_image_id',
        'created_by_id'
    ];

    protected $visible = [
        'id',
        'name',
        'description',
        'status',
        'service_id'
    ];

    protected $casts = [
        'status' => 'integer',
        'service_category_image_id' => 'integer',
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
                'onUpdate' => false,
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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('ServiceCategory')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->name} - Service Category has been {$eventName}");
    }


    public function getUsedForAttribute()
    {
        return $this->services()->without(['service_categories', 'service_image', 'service_icon'])
            ->select('services.id', 'services.name', 'services.slug')
            ->get()
            ->makeHidden(['pivot','description'])
            ->toArray();
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
    public function service_category_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'service_category_image_id');
    }

    /**
     * @return BelongsTo
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    /**
     * @return BelongsToMany
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'categories_services');
    }

    /**
     * @return BelongsToMany
     */
    public function rideRequests(): BelongsToMany
    {
        return $this->belongsToMany(RideRequest::class, 'ride_request_categories');
    }

    /**
     * @return BelongsToMany
     */
    public function vehicle_types()
    {
        return $this->belongsToMany(VehicleType::class, 'vehicle_categories');
    }

    /**
     * @return HasMany
     */
    public function riderReviews(): HasMany
    {
        return $this->hasMany(RiderReview::class, 'service_category_id');
    }

    /**
     * @return HasMany
     */
    public function driverReviews(): HasMany
    {
        return $this->hasMany(DriverReview::class, 'service_category_id');
    }
}

