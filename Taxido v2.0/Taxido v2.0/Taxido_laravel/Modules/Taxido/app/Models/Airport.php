<?php

namespace Modules\Taxido\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\SoftDeletes;
use MatanYadaev\EloquentSpatial\Objects\Polygon;
use MatanYadaev\EloquentSpatial\Traits\HasSpatial;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Airport extends Model
{
    use HasFactory, HasSpatial, SoftDeletes, HasTranslations;

    public $translatable = [
        'name',
    ];

    protected $fillable = [
        'id',
        'name',
        'place_points',
        'locations',
        'status',
        'created_by_id',
    ];

    protected $spatialFields = [
        'place_points',
    ];

    protected $casts = [
        'place_points' => Polygon::class,
        'locations' => 'json',
        'status' => 'string',
    ];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId() ?? getAdmin()?->id;
        });
    }

    /**
     * @return BelongsTo
     */
    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }
}
