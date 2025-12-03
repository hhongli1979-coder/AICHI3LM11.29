<?php

namespace Modules\Taxido\Models;

use App\Models\Attachment;
use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DriverDocument extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'driver_id',
        'document_id',
        'expired_at',
        'document_image_id',
        'created_by_id',
        'status',
    ];

    protected $casts = [
        'expired_at' => 'datetime',
        'driver_id' => 'integer',
        'fleet_manager_id' => 'integer',
        'document_id' => 'integer',
        'document_image_id' => 'integer'
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
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'driver_id');
    }

    /**
     * @return BelongsTo
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'document_id');
    }

    /**
     * @return BelongsTo
     */
    public function document_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'document_image_id');
    }
}
