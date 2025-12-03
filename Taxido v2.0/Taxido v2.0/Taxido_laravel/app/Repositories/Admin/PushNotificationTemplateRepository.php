<?php

namespace App\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use Nwidart\Modules\Facades\Module;
use App\Models\PushNotificationTemplate;
use Prettus\Repository\Eloquent\BaseRepository;

class PushNotificationTemplateRepository extends BaseRepository
{
    function model()
    {
        return PushNotificationTemplate::class;
    }
    
    public function index($request)
    {
        $pushNotificationTemplates = [];
        $coreFile = config_path('notify-templates.php');
        $coreTemplates = [];
        if (file_exists($coreFile)) {
            $coreTemplates = include $coreFile;
        }
        if (isset($coreTemplates['name'], $coreTemplates['slug'], $coreTemplates['push-notification-templates'])) {
            $pushNotificationTemplates[] = [
                'name' => $coreTemplates['name'],
                'slug' => $coreTemplates['slug'],
                'status' => true, 
                'templates' => $coreTemplates['push-notification-templates']
            ];
        }

        $modules = Module::all();
        foreach ($modules as $module) {
            $moduleFile = module_path($module->getName(), 'config/notify-templates.php');
            if (file_exists($moduleFile)) {
                $moduleTemplates = include $moduleFile;
                if (isset($moduleTemplates['name'], $moduleTemplates['slug'], $moduleTemplates['push-notification-templates'])) {
                    $pushNotificationTemplates[] = [
                        'name' => $moduleTemplates['name'],
                        'slug' => $moduleTemplates['slug'],
                        'status' => $module?->isEnabled(),
                        'templates' => $moduleTemplates['push-notification-templates']
                    ]; 
                }  
            }
        }
        
        return view('admin.push-notification-template.index' , ['pushNotificationTemplates' => $pushNotificationTemplates]);
    }

    public function edit($request ,$slug)
    {
        $content = $this->model->where('slug', $slug)->first();
        $eventAndShortcodes = $this->fetchShortcodes($slug);
        return view('admin.push-notification-template.template', [
            'slug' => $slug,
            'content' => $content, 
            'eventAndShortcodes' => $eventAndShortcodes,
        ]);
    }
    

    public function update($request, $slug)
    {
        DB::beginTransaction();
        try {
            $template = [
                'title' => $request['title'], 
                'content' => $request['content'],
                'url' => $request['url'],
            ];

            $template = $this->model->updateOrCreate(['slug' => $slug], $template);
            DB::commit();

            return redirect()->back()->with('success', __('static.notify_templates.template_updated_successfully'));
        } catch (Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', __('static.notify_templates.failed_to_update_template') . ' ' . $e->getMessage());
        }
    }
    
    public function fetchShortcodes($slug)
    {
        $eventAndShortcodes = [];
        $modules = Module::all();
        
        $coreFile = config_path('notify-templates.php');
        if (file_exists($coreFile)) {
            $templates = include $coreFile; 

            if (isset($templates['sms-templates'])) {
                foreach ($templates['sms-templates'] as $template) {
                    if ($template['slug'] === $slug) {
                        if (isset($template['shortcodes']) || isset($template['name'])) {
                            $eventAndShortcodes = [
                                'name' => $template['name'],
                                'shortcodes' => $template['shortcodes']
                            ];
                        }
                    }
                }
            }  
        }

        foreach ($modules as $module) {
            $templateFile = module_path($module->getName(), 'config/notify-templates.php');
            
            if (file_exists($templateFile)) {
                $templates = include $templateFile; 

                if (isset($templates['push-notification-templates'])) {
                    foreach ($templates['push-notification-templates'] as $template) {
                        if ($template['slug'] === $slug) {
                            if (isset($template['shortcodes']) || isset($template['name'])) {
                                $eventAndShortcodes = [
                                    'name' => $template['name'],
                                    'shortcodes' => $template['shortcodes']
                                ];
                            }

                        }
                    }
                }  
            }
        }
        
        return $eventAndShortcodes;
    }
}
