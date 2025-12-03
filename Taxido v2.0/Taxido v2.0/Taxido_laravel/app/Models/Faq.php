<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Faq extends Model
{
    use HasFactory, SoftDeletes, LogsActivity,HasTranslations;

    /**
     * The Faq that are mass assignable.
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
    ];

    protected $casts = [
        'created_by_id' => 'integer',
    ];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId();
        });
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
            ->useLogName('Faq')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->title} - Faq has been {$eventName}");
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

}
