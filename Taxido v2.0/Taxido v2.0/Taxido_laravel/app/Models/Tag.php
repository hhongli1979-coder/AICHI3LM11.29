<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Cviebrock\EloquentSluggable\Sluggable;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use Sluggable, SoftDeletes, HasFactory, LogsActivity,HasTranslations;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    public $translatable = [
        'name',
        'description'
    ];
    protected $fillable = [
        'name',
        'slug',
        'type',
        'status',
        'description',
        'created_by_id'
    ];

    protected $casts = [
        'status' => 'integer',
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

    public function toArray($locale = null)
    {
        $locale = $locale ?? app()->getLocale();
        $attributes = parent::toArray();
        foreach ($this->getTranslatableAttributes() as $name) {
            $translation = $this->getTranslation($name, $locale);
            $attributes[$name] = $translation ?? ($attributes[$name] ?? null)   ;
        }
        return $attributes;
    }

    /**
     * @return belongsToMany
     */
    public function blogs()
    {
        return $this->belongsToMany(Blog::class, 'blog_tags');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Tag')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->name} - Tag has been {$eventName}");
    }
}
