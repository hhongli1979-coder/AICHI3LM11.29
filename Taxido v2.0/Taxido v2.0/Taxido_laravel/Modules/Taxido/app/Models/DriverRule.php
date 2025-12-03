<?php

namespace Modules\Taxido\Models;

use App\Models\Attachment;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class DriverRule extends Model
{
    use HasFactory, SoftDeletes, HasTranslations;

    /**
     * The attributes that are mass assignable.
     */
    public $translatable = [
        'title',
    ];

    protected $fillable = [
        'title',
        'rule_image_id',
        'status',
        'created_by_id'
    ];

    protected $visible = [
        'title',
        'status'
    ];

    protected $casts = [
        'status' => 'integer',
        'rule_image_id' => 'integer',
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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('DriverRule')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->title} - Driver Rule has been {$eventName}");
    }

    /**
     * @return BelongsTo
     */
    public function created_by(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'created_by_id');
    }

    /**
     * @return BelongsTo
     */
    public function rule_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'rule_image_id');
    }

    /**
     * @return BelongsToMany
     */
    public function vehicle_types(): BelongsToMany
    {
        return $this->belongsToMany(VehicleType::class, 'driver_vehicle_types');
    }
}
