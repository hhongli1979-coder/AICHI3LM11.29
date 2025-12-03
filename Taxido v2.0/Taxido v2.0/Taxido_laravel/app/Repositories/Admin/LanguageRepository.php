<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\Language;
use Illuminate\Support\Facades\DB;
use Nwidart\Modules\Facades\Module;
use Illuminate\Support\Facades\File;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Pagination\LengthAwarePaginator;
use Prettus\Repository\Eloquent\BaseRepository;

class LanguageRepository extends BaseRepository
{
    public function model()
    {
        return Language::class;
    }

    public function index($languageTable)
    {
        if (request()->filled('action')) {
            return redirect()->back();
        }

        return view('admin.language.index', ['tableConfig' => $languageTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $language = $this->model->create([
                'name'       => $request->name,
                'flag'       => $request->flag,
                'locale'     => $request->locale,
                'app_locale' => $request->app_locale,
                'is_rtl'     => $request->is_rtl,
                'status'     => $request->status,
            ]);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.language.edit', ['language' => $language->id])
                        ->with('success', __('static.languages.create_successfully'));
            }

            return redirect()->route('admin.language.index')->with('success', __('static.languages.create_successfully'));
        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $language = $this->model->findOrFail($id);
            $language->update($request);

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.language.edit', ['language' => $language->id])
                    ->with('success', __('static.languages.update_successfully'));
            }

            return to_route('admin.language.index')->with('success', __('static.languages.update_successfully'));
        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {
            $language = $this->model->findOrFail($id);
            if ($language->system_reserve === 1) {
                return to_route('admin.language.index')->with('success', __('static.languages.can_not_delete_default_lang'));
            }

            $language->destroy($id);

            return to_route('admin.language.index')->with('success', __('static.languages.delete_successfully'));
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {
            $language = $this->model->findOrFail($id);
            if ($language->system_reserve === 1) {
                throw new Exception(__('static.languages.can_not_update_default_lang'), 400);
            }

            $language->update(['status' => $status]);
            return json_encode(["resp" => $language]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function rtl($id, $rtl)
    {
        try {

            $language = $this->model->findOrFail($id);
            if ($language->system_reserve === 1) {
                throw new Exception(__('static.languages.can_not_update_default_lang'), 400);
            }

            $language->update(['is_rtl' => $rtl]);
            return response()->json(["resp" => $language]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getLocaleById($id)
    {
        $language = $this->model->findOrFail($id);
        return $language->locale;
    }

    public function translate($request)
    {
        try {
            $locale   = $this->getLocaleById($request->id);
            $file     = $request->file;
            $dir      = resource_path("lang/{$locale}");
            $allFiles = $this->getAllTranslationFiles($locale, $dir);

            if (! $file) {
                $file = head($allFiles);
            }

            $translations = $this->getTranslationsForSingleFile($locale, $file);
            $translations = $this->createPaginate($translations, $request);

            return view('admin.language.translate', [
                'translations' => $translations,
                'allFiles'     => $allFiles,
                'file'         => $file,
            ]);
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    protected function getAllTranslationFiles($locale, $dir)
    {
        $allFiles = [];
        if (File::isDirectory($dir)) {
            foreach (File::allFiles($dir) as $dirFile) {
                $filename   = pathinfo($dirFile, PATHINFO_FILENAME);
                $allFiles[] = $filename;
            }
        }

        $modules = Module::all();
        foreach ($modules as $module) {
            if ($module?->isEnabled()) {
                $moduleDir = base_path("Modules/{$module->getName()}/lang/{$locale}");
                if (File::isDirectory($moduleDir)) {
                    foreach (File::allFiles($moduleDir) as $moduleFile) {
                        $filename = pathinfo($moduleFile, PATHINFO_FILENAME);
                        if (! in_array($filename, $allFiles)) {
                            $allFiles[] = $filename;
                        }
                    }
                }
            }
        }

        return $allFiles;
    }

    protected function getTranslationsForSingleFile($locale, $file)
    {
        $translations = [];

        $filePath = resource_path("lang/{$locale}/{$file}.php");
        if (file_exists($filePath)) {
            $translations = include $filePath;
        }

        $modules = Module::all();
        foreach ($modules as $module) {
            if ($module->isEnabled()) {
                $moduleDir      = base_path("Modules/{$module->getName()}/lang/{$locale}");
                $moduleFilePath = "{$moduleDir}/{$file}.php";
                if (file_exists($moduleFilePath)) {
                    $moduleTranslations = include $moduleFilePath;
                    $translations       = $this->deepMergeTranslations($translations, $moduleTranslations);
                }
            }
        }

        return $translations;
    }

    protected function deepMergeTranslations(array $main, array $module): array
    {
        foreach ($module as $key => $value) {
            if (isset($main[$key]) && is_array($main[$key]) && is_array($value)) {
                $main[$key] = $this->deepMergeTranslations($main[$key], $value);
            } else {
                $main[$key] = $value;
            }
        }
        return $main;
    }

    protected function normalizeTranslations($translations)
    {
        $normalized = [];

        foreach ($translations as $key => $message) {
            if (is_array($message)) {
                $nestedTranslations = $this->normalizeTranslations($message);
                foreach ($nestedTranslations as $nestedKey => $nestedMessage) {
                    $normalized["{$key}__{$nestedKey}"] = $nestedMessage;
                }
            } else {
                $normalized[$key] = $message;
            }
        }

        return $normalized;
    }

    public function createPaginate($translations, $request)
    {
        $perPage     = config('app.paginate', 15);
        $currentPage = $request->input('page', 1);

        $normalizedTranslations = $this->normalizeTranslations($translations);

        $total = count($normalizedTranslations);
        $items = array_slice($normalizedTranslations, ($currentPage - 1) * $perPage, $perPage, true);

        return new LengthAwarePaginator($items, $total, $perPage, $currentPage, [
            'path'  => $request->url(),
            'query' => $request->query(),
        ]);
    }

    public function translate_update($request, $id)
    {
        try {
            $locale = $this->getLocaleById($id);
            $file   = $request->file;

            // Get only the translation fields (filter out system fields)
            $translations = array_filter($request->except(['_token', '_method', 'file']), function ($key) {
                return ! in_array($key, ['_token', '_method', 'file']);
            }, ARRAY_FILTER_USE_KEY);

            // Track which translations belong to which file
            $fileSources = $this->identifyTranslationSources($locale, $file, $translations);

            // Update each file with only its own translations
            foreach ($fileSources as $filePath => $fileTranslations) {
                $existingTranslations = include $filePath;
                $updatedTranslations  = $this->deepUpdateTranslations($existingTranslations, $fileTranslations);

                $content = "<?php\n\nreturn " . $this->formatArrayForExport($updatedTranslations) . ";\n";
                File::put($filePath, $content);
            }

            Artisan::call('cache:clear');
            return to_route('admin.language.translate', ['id' => $id, 'file' => $file])
                ->with('success', __('static.languages.translate_file_update_successfully'));

        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    protected function identifyTranslationSources($locale, $file, $translations)
    {
        $fileSources = [];

        // Check main application file
        $mainFilePath = resource_path("lang/{$locale}/{$file}.php");
        if (file_exists($mainFilePath)) {
            $mainTranslations = include $mainFilePath;
            $mainUpdates      = $this->filterTranslationsForFile($translations, $mainTranslations);
            if (! empty($mainUpdates)) {
                $fileSources[$mainFilePath] = $mainUpdates;
            }
        }

        // Check module files
        $modules = Module::all();
        foreach ($modules as $module) {
            if ($module->isEnabled()) {
                $moduleDir      = base_path("Modules/{$module->getName()}/lang/{$locale}");
                $moduleFilePath = "{$moduleDir}/{$file}.php";

                if (file_exists($moduleFilePath)) {
                    $moduleTranslations = include $moduleFilePath;
                    $moduleUpdates      = $this->filterTranslationsForFile($translations, $moduleTranslations);
                    if (! empty($moduleUpdates)) {
                        $fileSources[$moduleFilePath] = $moduleUpdates;
                    }
                }
            }
        }

        return $fileSources;
    }

    protected function filterTranslationsForFile($allTranslations, $fileTranslations)
    {
        $filtered = [];

        foreach ($allTranslations as $compositeKey => $value) {
            $keys         = explode('__', $compositeKey);
            $current      = $fileTranslations;
            $existsInFile = true;

            foreach ($keys as $key) {
                if (! isset($current[$key])) {
                    $existsInFile = false;
                    break;
                }
                $current = $current[$key];
            }

            if ($existsInFile) {
                $filtered[$compositeKey] = $value;
            }
        }

        return $filtered;
    }

    protected function deepUpdateTranslations(array $existing, array $updates): array
    {
        foreach ($updates as $compositeKey => $newValue) {
            if (empty($compositeKey)) {
                continue;
            }

            $keys    = explode('__', $compositeKey);
            $current = &$existing;

            foreach ($keys as $index => $key) {
                if ($index === count($keys) - 1) {
                    $current[$key] = $newValue;
                } else {
                    if (! isset($current[$key]) || ! is_array($current[$key])) {
                        $current[$key] = [];
                    }
                    $current = &$current[$key];
                }
            }
        }

        return $existing;
    }

    protected function formatArrayForExport($array, $indent = 0): string
    {
        $out       = "[\n";
        $indentStr = str_repeat('    ', $indent + 1);

        foreach ($array as $key => $value) {
            $out .= $indentStr . "'" . addslashes($key) . "' => ";

            if (is_array($value)) {
                $out .= $this->formatArrayForExport($value, $indent + 1);
            } else {
                $out .= "'" . addslashes($value) . "'";
            }

            $out .= ",\n";
        }

        $out .= str_repeat('    ', $indent) . "]";
        return $out;
    }
}
