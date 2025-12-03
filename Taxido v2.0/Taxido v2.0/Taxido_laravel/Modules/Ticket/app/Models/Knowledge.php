<?php

namespace Modules\Ticket\Models;

use App\Models\User;
use App\Models\Attachment;
use Modules\Ticket\Models\Tag;
use Spatie\MediaLibrary\HasMedia;
use Spatie\Activitylog\LogOptions;
use Modules\Ticket\Models\Category;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Cviebrock\EloquentSluggable\Sluggable;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Cviebrock\EloquentSluggable\Services\SlugService;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Knowledge extends Model implements HasMedia
{
    use Sluggable, HasFactory, SoftDeletes, InteractsWithMedia, HasTranslations;

    public $translatable = [
        'title',
        'description',
        'content',
    ];

    protected $table = 'knowledge_bases';
    /**
     * The Blogs that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'slug',
        'content',
        'knowledge_thumbnail_id',
        'knowledge_meta_image_id',
        'meta_title',
        'meta_description',
        'status',
        'created_by_id'
    ];

    protected $with = [
        'knowledge_thumbnail',
        'knowledge_meta_image',
        'categories:id,name,slug',
        'created_by:id,name,email',
    ];

    protected $casts = [
        'knowledge_thumbnail_id' => 'integer',
        'knowledge_meta_image_id' => 'integer',
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
            ->useLogName('Knowledge')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->title} - Knowledge has been {$eventName}");
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
    public function knowledge_thumbnail(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'knowledge_thumbnail_id');
    }

     /**
     * @return BelongsTo
     */
    public function knowledge_meta_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'knowledge_meta_image_id');
    }

    /**
     * @return BelongsToMany
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'knowledge_categories');
    }

    /**
     * @return BelongsToMany
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'knowledge_tags');
    }
}
