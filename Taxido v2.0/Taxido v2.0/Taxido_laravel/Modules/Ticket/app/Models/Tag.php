<?php

namespace Modules\Ticket\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use Sluggable, SoftDeletes, HasFactory, HasTranslations;

    protected $table = 'knowledge_base_tags';
    
    /**
     * The attributes that are mass assignable.
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
            $model->created_by_id = getCurrentUserId() ?? getAdmin()?->id;
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
            ->useLogName('Tag')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->name} - Tag has been {$eventName}");
    }

    /**
     * @return BelongsToMany
     */
    public function knowledges(): BelongsToMany
    {
        return $this->belongsToMany(Knowledge::class, 'knowledge_tags');
    }
}
