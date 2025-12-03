<?php

namespace App\Models;

use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Setting extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    /**
     * The values that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'values',
    ];

    protected $casts = [
        'values' => 'json',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function getValuesAttribute($value, $media = false, $lang = false, )
    {
        $values = json_decode($value, true);
        $lightLogoImage = getMedia($values['general']['light_logo_image_id'] ?? null);
        $darkLogoImage = getMedia($values['general']['dark_logo_image_id'] ?? null);
        $faviconImage = getMedia($values['general']['favicon_image_id'] ?? null);
        $logoImage = getMedia($values['app_setting']['logo_image_id'] ?? null);
        $preloaderImage = getMedia($values['appearance']['preloader_image_id'] ?? null);

        $values['general']['light_logo_image'] = $lightLogoImage;
        $values['general']['dark_logo_image'] = $darkLogoImage;
        $values['general']['favicon_image'] = $faviconImage;
        $values['app_setting']['logo_image'] = $logoImage;
        $values['appearance']['preloader_image'] = $preloaderImage;

        $defaultLanguage = Language::find($values['general']['default_language_id']);
        $values['general']['default_language'] = $defaultLanguage;

        $defaultCurrency = Currency::find($values['general']['default_currency_id']);
        $values['general']['default_currency'] = $defaultCurrency;

        return $values;
    }

    public function setValuesAttribute($value)
    {
        $this->attributes['values'] = json_encode($value);
    }
}
