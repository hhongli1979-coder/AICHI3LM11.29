<?php

namespace App\Providers;

use Exception;
use App\Models\Plugin;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Nwidart\Modules\Facades\Module;
use Illuminate\Support\ServiceProvider;

class PluginServiceProvider extends ServiceProvider
{
    protected static bool $bootedOnce = false;
    /**
     * Register services.
     */
    public function register(): void
    {

    }

    public function isSlugExists($slug)
    {
        try {

            return Plugin::where('slug', $slug)->whereNull('deleted_at')?->first();

        } catch (Exception $e) {

            //
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        if(shouldRegisterAdminUi()) {
            $modules = Module::collections();
            foreach ($modules as $module) {
                $moduleDirPath = base_path('Modules/') .$module->getName();
                if (is_dir($moduleDirPath)) {
                    $moduleJsonPath = $moduleDirPath. '/module.json';
                    if (file_exists($moduleJsonPath)) {
                        $contents = File::get($moduleJsonPath);
                        $module = json_decode(json: $contents, associative: true);
                        try {
                            if (DB::connection()->getPDO() && DB::connection()->getDatabaseName()) {
                                try {
                                    $plugin = $this->isSlugExists($module['alias']);
                                    if (!$plugin) {
                                        $plugin = Plugin::create([
                                            'name' => $module['name'],
                                            'slug' => $module['alias'],
                                            'thumbnail_url' => $module['thumbnail_url'] ?? null,
                                            'version' => $module['version'] ?? null,
                                            'description' =>  $module['description'] ?? null,
                                            'status' => Module::isEnabled($module['name']),
                                        ]);
                                    } else {
                                        $plugin->update([
                                            'name' => $module['name'],
                                            'slug' => $module['alias'] ?? null,
                                            'thumbnail_url' => $module['thumbnail_url'] ?? null,
                                            'version' => $module['version'] ?? null,
                                            'description' =>  $module['description'] ?? null,
                                            'status' => Module::isEnabled($module['name']),
                                        ]);
                                    }

                                    $plugin->save();
                                    $plugin->fresh();

                                } catch (\Exception $e) {

                                    //
                                }
                            }

                        } catch (\Exception $e) {

                            //
                        }
                    }
                }
            }
        }
    }
}
