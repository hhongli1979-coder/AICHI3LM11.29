<?php

namespace Modules\Taxido\Models;

use App\Models\User;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Plan extends Model
{
    use HasFactory,SoftDeletes,HasTranslations;

    /**
     * The Plans that are mass assignable.
     *
     * @var array
     */
    public $translatable = [
        'name',
        'description'
    ];

    protected $fillable = [
        'name',
        'duration',
        'description',
        'price',
        'status',
        'created_by_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
        'created_by_id',
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
            ->useLogName('Plan')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->name} - Plan has been {$eventName}");
    }

    /**
     * @return BelongsTo
     */
    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    /**
     * @return  BelongsToMany
     */
    public function service_categories():  BelongsToMany
    {
        return $this->belongsToMany(ServiceCategory::class, 'plan_service_categories','plan_id');
    }
}
