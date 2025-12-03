<?php

namespace Modules\Ticket\Database\Seeders;

use App\Models\Module;
use App\Models\Plugin;
use Illuminate\Database\Seeder;
use Modules\Ticket\Enums\RoleEnum;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Modules\Ticket\Models\Executive;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use Modules\Taxido\Enums\RoleEnum as EnumsRoleEnum;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $taxidoModuleEnabled = Module::where('name', 'Taxido')->exists();

        $modules = [
            'tickets' => [
                'actions' => [
                    'index'   => 'ticket.ticket.index',
                    'create'  => 'ticket.ticket.create',
                    'reply'   => 'ticket.ticket.reply',
                    'trash'   => 'ticket.ticket.destroy',
                    'restore' => 'ticket.ticket.restore',
                    'delete'  => 'ticket.ticket.forceDelete'
                ],
                'roles' => [
                    RoleEnum::Executive => ['index', 'create', 'reply'],
                    RoleEnum::ADMIN => ['index', 'create', 'reply', 'trash', 'restore', 'delete'],
                    RoleEnum::USER => ['index', 'create', 'reply', 'trash', 'restore', 'delete']
                ]
            ],
            'priorities' => [
                'actions' => [
                    'index' => 'ticket.priority.index',
                    'create'  => 'ticket.priority.create',
                    'edit'    => 'ticket.priority.edit',
                    'trash' => 'ticket.priority.destroy',
                    'restore' => 'ticket.priority.restore',
                    'delete' => 'ticket.priority.forceDelete'
                ],
                'roles' => [
                    RoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                ]
            ],
            'executives' => [
                'actions' => [
                    'index' => 'ticket.executive.index',
                    'create'  => 'ticket.executive.create',
                    'edit'    => 'ticket.executive.edit',
                    'trash' => 'ticket.executive.destroy',
                    'restore' => 'ticket.executive.restore',
                    'delete' => 'ticket.executive.forceDelete'
                ],
                'roles' => [
                    RoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                ]
            ],
            'departments' => [
                'actions' => [
                    'index'   => 'ticket.department.index',
                    'create'  => 'ticket.department.create',
                    'edit'    => 'ticket.department.edit',
                    'show' => 'ticket.department.show',
                    'trash' => 'ticket.department.destroy',
                    'restore' => 'ticket.department.restore',
                    'delete' => 'ticket.department.forceDelete'
                ],
                'roles' => [
                    RoleEnum::ADMIN => ['index', 'create', 'edit', 'show', 'trash', 'restore', 'delete'],
                ]
            ],
            'formfields' => [
                'actions' => [
                    'index'   => 'ticket.formfield.index',
                    'create'  => 'ticket.formfield.create',
                    'edit'    => 'ticket.formfield.edit',
                    'trash'   => 'ticket.formfield.destroy',
                    'restore' => 'ticket.formfield.restore',
                    'delete'  => 'ticket.formfield.forceDelete'
                ],
                'roles' => [
                    RoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                ]
            ],
            'statuses' => [
                'actions' => [
                    'index' => 'ticket.status.index',
                    'create'  => 'ticket.status.create',
                    'edit'    => 'ticket.status.edit',
                    'trash' => 'ticket.status.destroy',
                    'restore' => 'ticket.status.restore',
                    'delete' => 'ticket.status.forceDelete'
                ],
                'roles' => [
                    RoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                ]
            ],
            'knowledge' => [
                'actions' => [
                    'index'   => 'ticket.knowledge.index',
                    'create'  => 'ticket.knowledge.create',
                    'edit'    => 'ticket.knowledge.edit',
                    'trash'   => 'ticket.knowledge.destroy',
                    'restore' => 'ticket.knowledge.restore',
                    'delete'  => 'ticket.knowledge.forceDelete'
                ],
                'roles' => [
                    RoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::USER => ['index']
                ]
            ],
            'knowledge_categories' => [
                'actions' => [
                    'index'   => 'ticket.category.index',
                    'create'  => 'ticket.category.create',
                    'edit'    => 'ticket.category.edit',
                    'delete'  => 'ticket.category.destroy'
                ],
                'roles' => [
                    RoleEnum::ADMIN => ['index', 'create', 'edit', 'delete'],
                    RoleEnum::USER => ['index'],
                ]
            ],
            'knowledge_tags' => [
                'actions' => [
                    'index'   => 'ticket.tag.index',
                    'create'  => 'ticket.tag.create',
                    'edit'    => 'ticket.tag.edit',
                    'trash'   => 'ticket.tag.destroy',
                    'restore' => 'ticket.tag.restore',
                    'delete'  => 'ticket.tag.forceDelete'
                ],
                'roles' => [
                    RoleEnum::ADMIN => ['index', 'create', 'edit', 'trash', 'restore', 'delete'],
                    RoleEnum::USER => ['index'],
                ]
            ],
            'ticket_settings' => [
                'actions' => [
                    'index'   => 'ticket.setting.index',
                    'create'  => 'ticket.setting.create',
                    'edit'    => 'ticket.setting.edit',
                    'trash' => 'ticket.setting.destroy',
                    'restore' => 'ticket.setting.restore',
                    'delete' => 'ticket.setting.forceDelete'
                ],
                'roles' => [
                    RoleEnum::ADMIN => ['index', 'create', 'edit', 'destroy'],
                ]
            ]

        ];

        if ($taxidoModuleEnabled) {
            $modules['tickets']['roles'][EnumsRoleEnum::DRIVER] = ['index', 'create', 'reply'];
            $modules['tickets']['roles'][EnumsRoleEnum::RIDER] = ['index', 'create', 'reply'];
            $modules['knowledge']['roles'][EnumsRoleEnum::DRIVER] = ['index'];
        }

        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        foreach ($modules as $key => $value) {
            Module::updateOrCreate(['name' => $key], ['name' => $key, 'actions' => $value['actions']]);
            foreach ($value['actions'] as $action => $permission) {
                if (!Permission::where('name', $permission)->first()) {
                    Permission::updateOrCreate(['name' => $permission], ['name' => $permission]);
                }
                if (isset($value['roles'])) {
                    foreach ($value['roles'] as $role => $allowed_actions) {
                        if ($role == RoleEnum::Executive) {
                            if (in_array($action, $allowed_actions)) {
                                $executivePermissions[] = $permission;
                            }
                        }

                        if ($role == RoleEnum::USER) {
                            if (in_array($action, $allowed_actions)) {
                                $userPermissions[] = $permission;
                            }
                        }
                    }
                }
            }
        }
        $admin = getAdmin();
        $adminRole = Role::where('name', RoleEnum::ADMIN)?->first();
        $adminRole?->givePermissionTo(Permission::all());

        $userRole = Role::where('name', RoleEnum::USER)->first();
        $userRole->givePermissionTo($userPermissions);
        $module = Plugin::where('name', 'Ticket')->first();
        if(!$module) {
            $module = Plugin::updateOrCreate(['name' => 'Ticket']);
        }
        $executiveRole = Role::updateOrCreate([
            'name' => RoleEnum::Executive,
            'system_reserve' => true,
            'module' => $module?->id,
        ]);

        $executiveRole->givePermissionTo($executivePermissions);
        $executive = Executive::updateOrCreate([
            'name' => "Smith Due",
            'email' => 'executive@example.com',
            'password' => Hash::make('executive@123'),
            'country_code' => (string) '1',
            'phone' => '78945622',
            'system_reserve' => true,
            'is_verified' => true,
        ]);

        $executive->assignRole($executiveRole);
    }
}
