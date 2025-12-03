<?php

namespace Modules\Ticket\Providers;

use Exception;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    protected $namespace = 'Modules\\Ticket\\Http\\Controllers';
    protected $apiNamespace = 'Modules\\Ticket\\Http\\Controllers\\Api';
    protected $webNamespace = 'Modules\\Ticket\\Http\\Controllers';

    /**
     * Called before routes are registered.
     *
     * Register any model bindings or pattern based filters.
     */
    public function boot(): void
    {
        parent::boot();
    }

    /**
     * Define the routes for the application.
     */
    public function map(): void
    {
        $this->mapApiRoutes();

        $this->mapWebRoutes();

        if ($this->shouldRegisterAdminUi()) {
            $this->registerMenus();
        }
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     */
    protected function mapWebRoutes(): void
    {
        Route::middleware('web')->namespace($this->webNamespace)->group(module_path('Ticket', '/routes/web.php'));
        Route::middleware('web')->prefix('admin')->namespace($this->namespace)->group(module_path('Ticket', '/routes/admin.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     */
    protected function mapApiRoutes(): void
    {
        Route::middleware('api')->prefix('api')->group(module_path('Ticket', '/routes/api/api.php'));
        Route::middleware('api')->namespace($this->namespace)->prefix('api')->group(module_path('Ticket', '/routes/api/admin.php'));
        Route::middleware('api')->namespace($this->apiNamespace)->prefix('api')->group(module_path('Ticket', '/routes/api/api.php'));
    }

    protected function registerMenus()
    {
        try {
            add_menu(label: 'ticket::static.ticket.support_ticket', module_slug: 'ticket', slug: 'ticket', icon: 'ri-user-voice-line', position: 20, permission: 'ticket.ticket.index', section: 'ticket::static.section');
            add_menu(label: 'ticket::static.ticket.dashboard', route: 'admin.ticket.dashboard', parent_slug: 'ticket', module_slug: 'ticket', slug: 'tc_ticket_dashboard', icon: 'ri-group-line', position: 21, permission: 'ticket.ticket.index', section: 'ticket::static.section');
            add_menu(label: 'ticket::static.ticket.all', route: 'admin.ticket.index', parent_slug: 'ticket', module_slug: 'ticket', slug: 'tc_ticket', icon: 'ri-group-line', permission: 'ticket.ticket.index', section: 'ticket::static.section');
            add_menu(label: 'ticket::static.executive.all_support_executive', route: 'admin.executive.index', parent_slug: 'ticket', module_slug: 'ticket', slug: 'tc_all_executives', icon: 'ri-team-line', section: 'ticket::static.section', permission: 'ticket.executive.index');
            add_menu(label: 'ticket::static.ticket.status', route: 'admin.status.index', parent_slug: 'ticket', module_slug: 'ticket', slug: 'tc_status', icon: 'ri-group-line', permission: 'ticket.status.index', section: 'ticket::static.section');
            add_menu(label: 'ticket::static.priority.priority', route: 'admin.priority.index', parent_slug: 'ticket', module_slug: 'ticket', slug: 'tc_priority', icon: 'ri-group-line', permission: 'ticket.priority.index', section: 'ticket::static.section');
            add_menu(label: 'ticket::static.knowledge.knowledge', module_slug: 'ticket', slug: 'tc_knowledge', icon: 'ri-git-repository-line', position: 22, section: 'ticket::static.section', permission: 'ticket.knowledge.index');
            add_menu(label: 'ticket::static.knowledge.all', route: 'admin.knowledge.index', parent_slug: 'tc_knowledge', module_slug: 'ticket', slug: 'tc_all_knowledge', icon: 'ri-team-line', section: 'ticket::static.section', permission: 'ticket.knowledge.index');
            add_menu(label: 'ticket::static.knowledge.add', route: 'admin.knowledge.create', parent_slug: 'tc_knowledge', module_slug: 'ticket', slug: 'tc_knowledge_create', icon: 'ri-id-card-line', section: 'ticket::static.section', permission: 'ticket.knowledge.create');
            add_menu(label: 'ticket::static.knowledge.categories', route: 'admin.ticket.category.index', parent_slug: 'tc_knowledge', module_slug: 'ticket', slug: 'tc_category', icon: 'ri-id-card-line', section: 'ticket::static.section', permission: 'ticket.category.index');
            add_menu(label: 'ticket::static.knowledge.tags', route: 'admin.ticket.tag.index', parent_slug: 'tc_knowledge', module_slug: 'ticket', slug: 'tc_tag', icon: 'ri-id-card-line', section: 'ticket::static.section', permission: 'ticket.tag.index');
            add_menu(label: 'ticket::static.department.department', route: 'admin.department.index', parent_slug: 'ticket', module_slug: 'ticket', slug: 'tc_department', icon: 'ri-group-line', permission: 'ticket.department.index', section: 'ticket::static.section');
            add_menu(label: 'ticket::static.formfield.formfield', route: 'admin.formfield.index', parent_slug: 'ticket', module_slug: 'ticket', slug: 'tc_formfield', icon: 'ri-group-line', permission: 'ticket.formfield.index', section: 'ticket::static.section');
            add_menu(label: 'ticket::static.setting.settings', route: 'admin.ticket.setting.index', parent_slug: 'ticket', module_slug: 'ticket', slug: 'tc_setting', icon: 'ri-group-line', permission: 'ticket.setting.index', section: 'ticket::static.section');
        } catch (Exception $e) {
        }
    }

    protected function shouldRegisterAdminUi(): bool
    {
        if ($this->app->runningInConsole()) {
            return false;
        }

        $request = request();
        if ($request->expectsJson() || $request->isJson() || $request->wantsJson()) {
            return false;
        }

        return true;
    }
}
