<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Driver;
use Modules\Taxido\Enums\RoleEnum;

class DriverTable
{
    protected $driver;
    protected $request;

    public function __construct(Request $request)
    {
        $this->driver  = new Driver();
        $this->request = $request;
    }

    public function getDrivers()
    {

        $drivers = $this->driver;

        if ($this->request->has('is_verified')) {
            $drivers = $drivers->where('is_verified', $this->request?->is_verified);
        }

        $currentUserRole = getCurrentRoleName();
        $currentUserId   = getCurrentUserId();

        if ($currentUserRole == RoleEnum::DRIVER) {
            return $drivers->where('id', $currentUserId);
        }

        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            $drivers = $drivers->where('fleet_manager_id', $currentUserId);
        }

        if ($currentUserRole == RoleEnum::DISPATCHER) {
            $drivers = $drivers->whereHas('zones', function ($q) {
                $q->whereHas('dispatchers', function ($q) {
                    $q->where('dispatcher_id', getCurrentUserId());
                });
            });
        }

        $drivers = $drivers->where('system_reserve', false);
        return $drivers;
    }

    public function getData()
    {
        $drivers = $this->getDrivers();

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $drivers = $drivers->whereNull('deleted_at')->where('status', true);
                    break;
                case 'deactive':
                    $drivers = $drivers->whereNull('deleted_at')->where('status', false);
                    break;
                case 'trash':
                    $drivers = $drivers->withTrashed()->whereNotNull('deleted_at');
                    break;
            }
        }

        if (isset($this->request->s)) {
            return $drivers->withTrashed()
                ->where('name', 'LIKE', "%" . $this->request->s . "%")
                ->orWhere('email', 'LIKE', "%" . $this->request->s . "%")
                ->orWhere('phone', 'LIKE', "%" . $this->request->s . "%" )
                ->paginate($this->request?->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $drivers->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $drivers?->latest()?->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $drivers = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $drivers->each(function ($driver) {
            if (isDemoModeEnabled()) {
                $driver->email = __('static.demo_mode');
            }

            $driver->role_name = ucfirst($driver->roles->pluck('name')->implode(', '));
            $driver->date = formatDateBySetting($driver->created_at);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'ID', 'field' => 'id', 'sortable' => true],
                ['title' => 'Name', 'field' => 'name', 'route' => 'admin.driver.show', 'action' => true, 'imageField' => 'profile_image_id', 'placeholderLetter' => true, 'sortable' => true],
                ['title' => 'Email', 'field' => 'email', 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.driver.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Verified', 'field' => 'is_verified', 'route' => 'admin.driver.verify', 'type' => 'is_verified', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
                ['title' => 'Action', 'type' => 'action', 'permission' => ['driver.index'], 'sortable' => false],
            ],
            'data'   => $drivers,
            'actions'  => [
                ['title' => 'Edit', 'route' => 'admin.driver.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'driver.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.driver.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'driver.destroy'],
                ['title' => 'Delete Permanently', 'route' => 'admin.driver.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'driver.forceDelete'],
            ],
            'filters'       => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->getDrivers()->whereNull('deleted_at')->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->getDrivers()->whereNull('deleted_at')->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->getDrivers()->whereNull('deleted_at')->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->getDrivers()->withTrashed()->whereNotNull('deleted_at')->count()],
            ],
            'bulkactions'   => [
                ['title' => 'Active', 'action' => 'active', 'permission' => 'driver.edit', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'action' => 'deactive', 'permission' => 'driver.edit', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'action' => 'trash', 'permission' => 'driver.destroy', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'driver.forceDelete', 'whenFilter' => ['trash']],
            ],
            'actionButtons' => [
                ['icon' => 'ri-eye-line', 'route' => 'admin.driver.show', 'class' => 'dark-icon-box', 'permission' => 'driver.index', 'tooltip' => 'Driver details'],
                ['icon' => 'ri-file-2-line', 'route' => 'admin.driver.document', 'class' => 'dark-icon-box', 'permission' => 'driver.index', 'tooltip' => 'Driver document'],
            ],
            'total' => $drivers->count(),
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
        $this->driver->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->driver->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashHandler(): void
    {
        $this->driver->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->driver->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->driver->whereIn('id', $this->request->ids)->forceDelete();
    }
}
