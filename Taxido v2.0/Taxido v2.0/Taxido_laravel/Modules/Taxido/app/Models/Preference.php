<?php

namespace Modules\Taxido\Models;

use App\Models\Attachment;
use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Preference extends Model implements HasMedia
{
    use HasFactory, HasTranslations, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'name',
        'icon_image_id',
        'status'
    ];

    public array $translatable = ['name'];

    protected $casts = [
        'status' => 'integer'
    ];

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
    public function icon_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'icon_image_id');
    }

    /**
     * @return BelongsToMany
     */
    public function vehicle_type_zones(): BelongsToMany
    {
        return $this->belongsToMany(VehicleTypeZone::class, 'vehicle_type_zone_preferences')
                    ->withPivot('price')?->withTimestamps();
    }
}
