<?php

namespace Modules\Taxido\Models;

use Spatie\MediaLibrary\HasMedia;
use App\Models\Attachment;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PushNotification extends Model implements HasMedia
{
    use HasFactory,InteractsWithMedia,SoftDeletes;

    protected $fillable = [
        'title',
        'message',
        'send_to',
        'user_id',
        'is_read',
        'image_id',
        'url',
        'notification_type',
        'is_scheduled',
        'scheduled_at',
    ];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId();
        });
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('notification_image')->singleFile();
    }

    /**
     * @return BelongsTo
     */
    public function image_notify()
    {
        return $this->belongsTo(Attachment::class, 'image_id');
    }
}
