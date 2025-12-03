<?php

namespace App\Models;

use Spatie\MediaLibrary\HasMedia;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Testimonial extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, SoftDeletes, LogsActivity,HasTranslations;

    /**
     * The Review that are mass assignable.
     *
     * @var array
     */
    public $translatable = [
        'title',
        'description'
    ];

    protected $fillable = [
        'title',
        'description',
        'rating',
        'status',
        'profile_image_id',
        'created_by_id'
    ];

    protected $with = [
        'profile_image',
    ];

    protected $casts = [
        'profile_image_id' => 'integer',
        'status' => 'integer',
    ];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId();
        });
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

    /**
     * @return BelongsTo
     */
    public function profile_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'profile_image_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Testimonial')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->title} - Testimonial has been {$eventName}");
    }
}
