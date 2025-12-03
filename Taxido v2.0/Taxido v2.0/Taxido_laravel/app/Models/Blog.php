<?php

namespace App\Models;

use Spatie\MediaLibrary\HasMedia;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Cviebrock\EloquentSluggable\Sluggable;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Cviebrock\EloquentSluggable\Services\SlugService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Blog extends Model implements HasMedia
{
    use Sluggable, HasFactory, SoftDeletes, InteractsWithMedia ,LogsActivity, HasTranslations;

    public $translatable = [
        'title',
        'description',
        'content',
    ];

    /**
     * The Blogs that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'slug',
        'content',
        'blog_thumbnail_id',
        'blog_meta_image_id',
        'meta_title',
        'meta_description',
        'is_featured',
        'is_sticky',
        'status',
        'created_by_id',
        'description',
    ];

    protected $casts = [
        'blog_thumbnail_id' => 'integer',
        'blog_meta_image_id' => 'integer',
        'is_sticky' => 'integer',
        'is_featured' => 'integer',
        'status' => 'integer',
    ];

    protected $hidden = [
        'meta_description',
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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Blog')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->title} - Blog has been {$eventName}");
    }


    public function toArray($locale = null)
    {
        $attributes = parent::toArray();
        $locale = $locale ?? app()->getLocale();


        foreach ($this->getTranslatableAttributes() as $name) {
            $translation = $this->getTranslation($name, $locale);
            $attributes[$name] = $translation ?? ($attributes[$name] ?? null);

        }

        return $attributes;
    }

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
                'onUpdate' => true,
            ],
        ];
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
    public function blog_thumbnail(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'blog_thumbnail_id');
    }

    /**
     * @return BelongsTo
     */
    public function blog_meta_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'blog_meta_image_id');
    }

    /**
     * @return BelongsToMany
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'blog_categories');
    }

    /**
     * @return BelongsToMany
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'blog_tags');
    }
}
