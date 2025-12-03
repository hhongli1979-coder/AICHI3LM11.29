<?php

namespace App\Repositories\Api;

use Exception;
use App\Models\Language;
use Nwidart\Modules\Facades\Module;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\File;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

class LanguageRepository extends BaseRepository
{
    protected $fieldSearchable =
    [
        'title' => 'like',
    ];

    function model()
    {
        return Language::class;
    }

    public function boot()
    {
        try {

            $this->pushCriteria(app(RequestCriteria::class));
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function show($id)
    {
        try {

            return $this->model->findOrFail($id);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function translate($request)
    {
        try {

            $locale = app()->getLocale();
            $file = $request->file;
            $dir = resource_path("lang/{$locale}");
            $allFiles = $this->getAllTranslationFiles($locale, $dir);
            if (!$file) {
                $file = head($allFiles);
            }

            $translations = $this->getTranslations($locale, $dir, $file);
            return $translations;

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    protected function getAllTranslationFiles($locale, $dir)
    {
        $allFiles = [];
        if (File::isDirectory($dir)) {
            foreach (File::allFiles($dir) as $dirFile) {
                $filename = pathinfo($dirFile, PATHINFO_FILENAME);
                $allFiles[] = $filename;
            }
        }

        $modules = Module::all();
        foreach ($modules as $module) {
            if ($module->isEnabled()) {
                $moduleDir = base_path("Modules/{$module->getName()}/lang/{$locale}");
                if (File::isDirectory($moduleDir)) {
                    foreach (File::allFiles($moduleDir) as $moduleFile) {
                        $filename = pathinfo($moduleFile, PATHINFO_FILENAME);
                        if (!in_array($filename, $allFiles)) {
                            $allFiles[] = $filename;
                        }
                    }
                }
            }
        }

        return $allFiles;
    }

    protected function getTranslations($locale, $dir, $file)
    {
        $translations = [];
        $languageFilePath = "{$dir}/{$file}.php";
        if (file_exists($languageFilePath)) {
            $translations = include $languageFilePath;
        }

        $modules = Module::all();
        foreach ($modules as $module) {
            if ($module->isEnabled()) {
                $moduleDir = base_path("Modules/{$module->getName()}/lang/{$locale}");
                $moduleLanguageFilePath = "{$moduleDir}/{$file}.php";
                if (file_exists($moduleLanguageFilePath)) {
                    $moduleTranslations = include $moduleLanguageFilePath;
                    $translations = array_merge($translations, $moduleTranslations);
                }
            }
        }

        return $translations;
    }
}
