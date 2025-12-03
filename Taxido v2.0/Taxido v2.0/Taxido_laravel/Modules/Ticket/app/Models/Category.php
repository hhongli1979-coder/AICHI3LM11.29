<?php

namespace Modules\Ticket\Models;

use App\Models\Attachment;
use Spatie\MediaLibrary\HasMedia;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Cviebrock\EloquentSluggable\Sluggable;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Cviebrock\EloquentSluggable\Services\SlugService;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model implements HasMedia
{
    use HasFactory, sluggable, SoftDeletes, InteractsWithMedia, HasTranslations;

    protected $table = 'knowledge_base_categories';

    public $translatable = [
        'name',
        'description'
    ];
    
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'category_image_id',
        'category_meta_image_id',
        'status',
        'type',
        'meta_title',
        'meta_description',
        'parent_id',
        'sort_order',
        'created_by_id'
    ];

    protected $casts = [
        'status' => 'integer',
        'parent_id' => 'integer',
        'category_image_id' => 'integer',
        'category_meta_image_id' => 'integer'
    ];

    protected $with = [
        'childs',
        'category_image',
        'category_meta_image',
    ];

    public static function boot()
    {
        parent::boot();
        static::addGlobalScope('type', function (Builder $builder) {
            $builder->where('type', 'post');
        });

        static::saving(function ($model) {
            $model->type = 'post';
            $model->created_by_id = getCurrentUserId();
            if (!isSameModelSlug($model, request()['slug'])) {
                $model->slug = SlugService::createSlug(self::class, 'slug', request()['slug'] ?? $model->slug);
            }
        });

        static::deleted(function ($user) {
            $user->childs()->delete();
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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Ticket Category')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->name} - Ticket Category has been {$eventName}");
    }
    
    

    public static function getHierarchy($prefix = '', $type = null)
    {
        $categories = (new self())::with('childs')->whereNull('parent_id')->get();
        if ($type) {
            $categories = $categories->where('type', $type);
        }

        $nestedCategories = [];
        foreach ($categories as $knowledge_category) {
            $nestedCategories += self::formatCategory($knowledge_category);
        }

        return $nestedCategories;
    }

    private static function formatCategory($knowledge_category, $prefix = '')
    {
        $formattedCategory[$knowledge_category->id] = $prefix . $knowledge_category->name;
        if ($knowledge_category->childs) {
            foreach ($knowledge_category->childs as $child) {
                $formattedCategory += self::formatCategory($child, $prefix . '- ');
            }
        }

        return $formattedCategory;
    }

    public function scopeWithOutParent($query)
    {
        return $query->whereNull('parent_id');
    }

    private function getCategories(): array
    {
        $mainCategories = self::whereNull('parent_id')->get();
        foreach ($mainCategories as $knowledge_category) {
            $this->categories[] = $knowledge_category->toArray();
            $this->getParentCategories($knowledge_category, 0);
        }

        return $this->categories;
    }

    private function getParentCategories($knowledge_category, $level)
    {
        if ($subCategories = $knowledge_category->hasSubCategories) {
            $level++;
            foreach ($subCategories as $subCategory) {
                $subCategory->name = str_repeat('- ', $level) . $subCategory->name;
                $this->categories[] = $subCategory;
                $this->getParentCategories($subCategory, $level);
            }
        }
    }

    public function scopeActive($query, $value)
    {
        return $query->where('status', $value);
    }

    /**
     * @return HasMany
     */
    public function hasSubCategories(): HasMany
    {
        return $this->hasMany($this, 'parent_id');
    }

    /**
     * @return HasMany
     */
    public function childs(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id', 'id')->orderBy('sort_order', 'ASC');
    }

    /**
     * @return BelongsTo
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * @return BelongsTo
     */
    public function category_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'category_image_id');
    }

    /**
     * @return BelongsTo
     */
    public function category_meta_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'category_meta_image_id');
    }
}
