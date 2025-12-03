<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\FleetManager;

class FleetManagerTable
{
    protected $fleetManager;
    protected $request;

    public function __construct(Request $request)
    {
        $this->fleetManager = new FleetManager();
        $this->request = $request;
    }

    public function getFleetManagers()
    {
        $fleetManagers = $this->fleetManager;

        $currentUserRole = getCurrentRoleName();
        $currentUserId = getCurrentUserId();

        if ($currentUserRole === RoleEnum::FLEET_MANAGER) {
            return $fleetManagers->where('id', $currentUserId);
        }

        return $fleetManagers->where('system_reserve', false);
    }

    public function getData()
    {
        $fleetManagers = $this->getFleetManagers();

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $fleetManagers = $fleetManagers->whereNull('deleted_at')->where('status', true);
                    break;
                case 'deactive':
                    $fleetManagers = $fleetManagers->whereNull('deleted_at')->where('status', false);
                    break;
                case 'trash':
                    return $fleetManagers->withTrashed()->whereNotNull('deleted_at')->paginate($this->request?->paginate);
            }
        }

        if (isset($this->request->s)) {
            return $fleetManagers->withTrashed()
                ->where(function ($q) {
                    $q->where('name', 'LIKE', "%" . $this->request->s . "%")
                        ->orWhere('email', 'LIKE', "%" . $this->request->s . "%")
                        ->orWhere('phone', 'LIKE', "%" . $this->request->s . "%" );
                })
                ->paginate($this->request->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $fleetManagers->orderBy($this->request->orderby, $this->request->order)
                ->paginate($this->request->paginate);
        }

        return $fleetManagers->whereNull('deleted_at')->latest()->paginate($this->request->paginate);
    }

    public function generate()
    {
        $fleetManagers = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $fleetManagers->each(function ($manager) {
            if (isDemoModeEnabled()) {
                $manager->email = __('static.demo_mode');
            }

            $manager->date = formatDateBySetting($manager->created_at);
        });

        $tableConfig = [
            'columns'     => [
                ['title' => 'Name', 'field' => 'name', 'route' => 'admin.fleet-manager.show', 'action' => true, 'imageField' => 'profile_image_id', 'placeholderLetter' => true, 'sortable' => true, 'email' => 'email'],
                ['title' => 'Email', 'field' => 'email', 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.fleet-manager.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Verified', 'field' => 'is_verified', 'route' => 'admin.fleet-manager.verify', 'type' => 'is_verified', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'fleet_managers.created_at'],
            ],
            'data' => $fleetManagers,
            'actions'     => [
                ['title' => 'Edit', 'route' => 'admin.fleet-manager.edit', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'fleet_manager.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.fleet-manager.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'fleet_manager.destroy'],
                ['title' => 'Restore', 'route' => 'admin.fleet-manager.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'fleet_manager.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.fleet-manager.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'fleet_manager.forceDelete'],
            ],
            'filters'     => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->getFleetManagers()->whereNull('deleted_at')->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->getFleetManagers()->whereNull('deleted_at')->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->getFleetManagers()->whereNull('deleted_at')->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->getFleetManagers()->withTrashed()->whereNotNull('deleted_at')->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'action' => 'active', 'permission' => 'fleet_manager.edit', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'action' => 'deactive', 'permission' => 'fleet_manager.edit', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'action' => 'trash', 'permission' => 'fleet_manager.destroy', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'fleet_manager.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'fleet_manager.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $fleetManagers->count(),
        ];

        return $tableConfig;
    }

    public function bulkActionHandler()
    {
        switch ($this->request->action) {
            case 'active':
                $this->activeHandler();
                break;
            case 'deactive':
                $this->deactiveHandler();
                break;
            case 'trash':
                $this->trashHandler();
                break;
            case 'restore':
                $this->restoreHandler();
                break;
            case 'delete':
                $this->deleteHandler();
                break;
        }
    }

    public function activeHandler(): void
    {
        $this->fleetManager->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->fleetManager->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashHandler(): void
    {
        $this->fleetManager->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->fleetManager->withTrashed()->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->fleetManager->withTrashed()->whereIn('id', $this->request->ids)->forceDelete();
    }
}
