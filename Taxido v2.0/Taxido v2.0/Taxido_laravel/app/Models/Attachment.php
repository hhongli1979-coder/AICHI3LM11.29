<?php

namespace App\Models;

use Spatie\MediaLibrary\HasMedia;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attachment extends Media implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;

    protected $table = 'media';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'file_name',
        'collection_name',
        'model_id',
        'model_type',
        'order_column',
        'disk',
        'conversions_disk',
        'mime_type',
        'size',
        'custom_properties',
        'generated_conversions',
        'responsive_images',
        'manipulations',
        'original_url',
        'preview_url',
        'created_by_id',
        'alternative_text'
    ];

    protected $appends = [
        'asset_url',
        'original_url'
    ];

    protected $visible = [
        'id',
        'name',
        'file_name',
        'disk',
        'mime_type',
        'size',
        'original_url',
        'preview_url',
        'created_by_id',
        'created_at',
    ];

    public static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->model_id  = $model->model_id;
            $model->created_by_id = getCurrentUserId() ?? getAdmin()?->id;
        });
    }

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function getAssetUrlAttribute()
    {
        return str_replace(config('app.url'), "", $this->original_url);
    }

    public function renameFile($media, $request)
    {
        $newFileName = $request->title . '.' . $media->extension;
        $disk = $media->disk;
        $relativeOldPath = str_replace(storage_path('app/public/'), '', $media->getPath());
        $newPath = dirname($relativeOldPath) . '/' . $newFileName;
        
        if (file_exists($media->getPath())) {
            Storage::disk($disk)->move($relativeOldPath, $newPath);
        }
        return $newFileName;
    }
}
