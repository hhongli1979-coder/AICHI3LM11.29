<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Cviebrock\EloquentSluggable\Sluggable;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Cviebrock\EloquentSluggable\Services\SlugService;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Page extends Model
{
    use Sluggable, HasFactory, SoftDeletes, LogsActivity,HasTranslations;

    /**
     * The Pages that are mass assignable.
     *
     * @var array
     */
    public $translatable = [
        'title',
        'content'
    ];

    protected $fillable = [
        'title',
        'slug',
        'meta_title',
        'meta_description',
        'content',
        'status',
        'page_meta_image_id',
        'created_by_id'
    ];
    protected $casts = [
        'status' => 'integer',
        'page_meta_image_id' => 'integer',
    ];
    protected $with = [
        'meta_image'
    ];

    protected $hidden = [
        'content',
    ];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId();
            if (!isSameModelSlug($model, request()['slug'])) {
                $model->slug = SlugService::createSlug(self::class, 'slug', request()['slug'] ?? $model->slug);
            }
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
    /**
     * @return BelongsTo
     */
    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Page')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->title} - Page has been {$eventName}");
    }

    /**
     * @return BelongsTo
     */
    public function meta_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'page_meta_image_id');
    }
}
