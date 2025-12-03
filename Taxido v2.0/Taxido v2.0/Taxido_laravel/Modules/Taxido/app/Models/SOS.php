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
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SOS extends Model implements HasMedia
{
   use HasFactory, InteractsWithMedia, Sluggable, SoftDeletes, HasTranslations;

    public $translatable = [
        'title',
    ];
    protected $table = 'sos';

    /**
     * The sos that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'slug',
        'country_code',
        'phone',
        'sos_image_id',
        'status',
        'created_by_id',
    ];

    protected $casts = [
        'status' => 'integer',
        'sos_image_id' => 'integer',
    ];

    protected $hidden = [
        'deleted_at',
        'updated_at',
        'created_at'
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
            ->useLogName('sos')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->title} - SOS has been {$eventName}");
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
    public function sos_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'sos_image_id');
    }

    /**
     * @return BelongsToMany
     */
    public function zones(): BelongsToMany
    {
        return $this->belongsToMany(Zone::class, 'sos_zones');
    }
}

