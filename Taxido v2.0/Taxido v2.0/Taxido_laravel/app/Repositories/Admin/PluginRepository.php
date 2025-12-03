<?php

namespace App\Repositories\Admin;

use ZipArchive;
use Exception;
use App\Models\Plugin;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use Prettus\Repository\Eloquent\BaseRepository;

class PluginRepository extends BaseRepository
{
    public function model()
    {
        return Plugin::class;
    }

    public function index($pluginTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('admin.plugin.index', ['tableConfig' => $pluginTable]);
    }

    public function getZipName($file)
    {
        return str_replace('.zip', '', $file?->getClientOriginalName());
    }

    public function verifyModule($file, $random_str)
    {
        $zip    = new ZipArchive;
        $isOpen = $zip->open($file);

        if ($isOpen) {
            $zip->extractTo(base_path('temp/' . $random_str . '/modules'));
            $zip->close();
            $tempModuleJsonPath = base_path('temp/') . $random_str . '/modules/module.json';

            if (file_exists($tempModuleJsonPath)) {
                $contents = File::get($tempModuleJsonPath);
                $module   = json_decode(json: $contents, associative: true);
                if ($module) {
                    return $module;
                }

                throw new Exception(__('static.plugins.invalid_module_json_format'), 400);
            }
            throw new Exception(__('static.plugins.module_json_not_found'), 400);
        }

        throw new Exception(__('static.plugins.zip_file_cannot_open'), 400);
    }

    public function store($request)
    {
        DB::beginTransaction();

        try {

            if (! class_exists('ZipArchive')) {
                throw new Exception(__('static.plugins.ziparchive_not_installed'), 400);
            }

            $random_str = Str::random(10);
            $module     = $this->verifyModule($request->file, $random_str);
            $modulePath = base_path('Modules/') . $module['name'];
            if (! is_dir($modulePath)) {
                mkdir($modulePath, 0777, true);
            }

            $moduleStatusPath = base_path() . '/modules_statuses.json';
            if (file_exists($moduleStatusPath)) {
                $contents      = File::get($moduleStatusPath);
                $modulesStatus = json_decode(json: $contents, associative: true);
                if (! isset($modulesStatus[$module['name']])) {
                    $modulesStatus[$module['name']] = true;
                    $newContents                    = json_encode($modulesStatus, true);
                    File::put($moduleStatusPath, $newContents);
                }
            }

            File::copyDirectory(base_path('temp/' . $random_str . '/modules'), $modulePath);
            File::deleteDirectory(base_path('temp'));

            Artisan::call('module:composer-update --all');
            DB::commit();
            return to_route('admin.plugin.index')->with('success', __('static.plugins.plugin_added_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($status, $id)
    {
        try {

            $page = $this->model->findOrFail($id);
            $page->update(['status' => $status]);

            return json_encode(["resp" => $page]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function delete($id)
    {
        try {
            $plugin     = $this->model->findOrFail($id);
            $modulePath = base_path('Modules/') . $plugin->name;
            if (is_dir($modulePath)) {
                File::deleteDirectory($modulePath);
            }

            $moduleStatusPath = base_path() . '/modules_statuses.json';
            if (file_exists($moduleStatusPath)) {
                $contents      = File::get($moduleStatusPath);
                $modulesStatus = json_decode(json: $contents, associative: true);
                if (array_key_exists($plugin->name, $modulesStatus)) {
                    unset($modulesStatus[$plugin->name]);
                    $newContents = json_encode($modulesStatus, true);
                    File::put($moduleStatusPath, $newContents);
                }
            }
            $plugin->forceDelete($id);
            Artisan::call('module:composer-update --all');
            return redirect()->route('admin.plugin.index')->with('success', __('static.plugins.plugin_deleted_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
