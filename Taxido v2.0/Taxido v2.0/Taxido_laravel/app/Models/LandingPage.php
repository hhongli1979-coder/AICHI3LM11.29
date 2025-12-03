<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LandingPage extends Model
{
    use HasFactory , LogsActivity ,HasTranslations;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    public $translatable = [
        'content',
    ];
    public $fillable = [
        'content'
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'content' => 'json'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Landing Page')
            ->setDescriptionForEvent(fn(string $eventName) => "Landing Page has been {$eventName}");
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
