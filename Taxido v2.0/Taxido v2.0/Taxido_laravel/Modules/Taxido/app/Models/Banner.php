<?php

namespace Modules\Taxido\Models;

use App\Models\User;
use App\Models\Attachment;
use Spatie\MediaLibrary\HasMedia;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Cviebrock\EloquentSluggable\Sluggable;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Banner extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, sluggable, SoftDeletes, HasTranslations;

    /**
     * The banners that are mass assignable.
     *
     * @var array
     */
    public $translatable = [
        'title',
        'banner_image_id'
    ];

    protected $fillable = [
        'title',
        'slug',
        'banner_image_id',
        'order',
        'status',
        'created_by_id'
    ];

    protected $visible = [
        'title',
        'order',
        'status'
    ];

    protected $casts = [
        'status' => 'integer',
    ];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId();
        });
    }

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Banner')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->title} - Banner has been {$eventName}");
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
    public function banner_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'banner_image_id');
    }

    /**
     * @return BelongsToMany
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'banner_services');
    }
}
