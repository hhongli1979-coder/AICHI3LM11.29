<?php

namespace Modules\Taxido\Models;

use App\Models\User;
use App\Models\Attachment;
use Spatie\MediaLibrary\HasMedia;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Onboarding extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, SoftDeletes, HasTranslations;

    /**
     * The onboardings that are mass assignable.
     *
     * @var array
     */
    public $translatable = [
        'title',
        'description',
        'onboarding_image_id'
    ];

    protected $fillable = [
        'title',
        'description',
        'onboarding_image_id',
        'status',
        'created_by_id'
    ];

    protected $visible = [
        'title',
        'type',
        'description'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Onboarding')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->title} - Onboarding Screen has been {$eventName}");
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
    public function onboarding_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'onboarding_image_id');
    }
}
