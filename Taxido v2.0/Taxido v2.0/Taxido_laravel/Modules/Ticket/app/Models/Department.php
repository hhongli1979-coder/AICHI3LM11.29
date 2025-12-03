<?php

namespace Modules\Ticket\Models;

use App\Models\User;
use App\Models\Attachment;
use Modules\Ticket\Models\Ticket;
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

class Department extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, sluggable, InteractsWithMedia, HasTranslations;

    public $translatable = [
        'name',
        'description',
    ];

    protected $table = 'departments';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'status',
        'imap_credentials',
        'department_image_id',
        'created_by_id',
    ];

    protected $visible = [
        'id',
        'name',
        'slug',
        'description',
        'status'
    ];

    protected $casts = [
        'imap_credentials' => 'json',
        'department_image_id' => 'integer'
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
            ->useLogName('Department')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->name} - Department has been {$eventName}");
    }

    /**
     * @return HasMany
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class,'department_id');
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
    public function department_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'department_image_id');
    }

    /**
     * @return BelongsToMany
     */
    public function assigned_executives(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'department_users');
    }
}

