<?php

namespace Modules\Taxido\Models;

use App\Models\Attachment;
use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Cviebrock\EloquentSluggable\Sluggable;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CancellationReason extends Model implements HasMedia
{
    use HasFactory,Sluggable,SoftDeletes,InteractsWithMedia,HasTranslations;

     /**
     * The Cancellation Reason that are mass assignable.
     *
     * @var array
     */
    public $translatable = [
        'title',
    ];

    protected $fillable = [
        'title',
        'slug',
        'for',
        'ride_start',
        'icon_image_id',
        'status',
        'created_by_id',
    ];

    protected $visible = [
        'title',
        'slug',
        'status',
        'icon_image_id'
    ];

    protected $casts = [
        'status' => 'integer',
        'icon_image_id' => 'integer',
        'created_by_id' => 'integer',

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
    public function icon_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'icon_image_id');
    }
}
