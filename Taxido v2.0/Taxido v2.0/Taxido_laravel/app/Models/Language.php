<?php

namespace App\Models;

use Nwidart\Modules\Facades\Module;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Session;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Language extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'flag',
        'locale',
        'app_locale',
        'is_rtl',
        'system_reserve',
        'status',
    ];

    protected $casts = [
        'status' => 'integer',
        'is_rtl' => 'integer',
    ];

    protected $hidden = [
        'created_by_id',
        'created_at',
        'deleted_at',
        'updated_at'
    ];

    public static function boot()
    {
        parent::boot();
        static::created(function ($language) {
            self::createLangFolder($language);
            self::createModuleLangFolder($language);
        });

        static::deleting(function ($language) {
            self::deleteLangFolder($language);
            self::deleteModuleLangFolder($language);
        });

        static::saving(function ($language) {
            if (isDefaultLang($language?->id)) {
                Session::put('dir', $language?->is_rtl ? 'rtl' : 'ltr');
            }

            $language->created_by_id = getCurrentUserId() ?? getAdmin()?->id;
        });
    }

    public function getFlagAttribute($value)
    {

        return isset($value) ? asset('/images/flags').'/'.$value : null;
    }

    public function setValuesAttribute($value)
    {
        $this->attributes['flag'] = $value;
    }

    public static function createLangFolder($language)
    {
        $langDir = resource_path().'/lang/';
        $enDir = $langDir.(app()?->getLocale());
        $currentLang = $langDir.$language->locale;
        if (! File::exists($currentLang)) {
            File::makeDirectory($currentLang);
            File::copyDirectory($enDir, $currentLang);
        }
    }

    public static function createModuleLangFolder($language)
    {
        $modules = Module::all();

        foreach ($modules as $module) {
            if ($module->isEnabled()) {
                $moduleLangDir = base_path("Modules/{$module->getName()}/lang/{$language->locale}");
                $defaultLangDir = base_path("Modules/{$module->getName()}/lang/en");

                if (! File::exists($moduleLangDir)) {
                    File::makeDirectory($moduleLangDir, 0755, true);
                    if (File::exists($defaultLangDir)) {
                        File::copyDirectory($defaultLangDir, $moduleLangDir);
                    }
                }
            }
        }
    }

    public static function deleteLangFolder($language)
    {
        $folderURL = resource_path().'/lang/'.$language->locale;
        if (File::exists($folderURL)) {
            File::deleteDirectory($folderURL);
        }
    }

    public static function deleteModuleLangFolder($language)
    {
        $modules = Module::all();

        foreach ($modules as $module) {
            if ($module->isEnabled()) {
                $moduleLangDir = base_path("Modules/{$module->getName()}/lang/{$language->locale}");

                if (File::exists($moduleLangDir)) {
                    File::deleteDirectory($moduleLangDir);
                }
            }
        }
    }


}
