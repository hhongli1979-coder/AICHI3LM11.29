<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\VehicleType;

class VehicleTypeTable
{
    protected $vehicleType;
    protected $request;

    public function __construct(Request $request)
    {
        $this->vehicleType = new VehicleType();
        $this->request = $request;
    }

    public function getData()
    {
        $reqService = $this->request->service;
        $vehicleTypes = $this->vehicleType;

        if ($reqService) {
            $serviceId = getServiceIdBySlug($reqService);
            if ($serviceId) {
                $vehicleTypes = $vehicleTypes->where('service_id', $serviceId);
            }
        }

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $vehicleTypes = $vehicleTypes->where('status', true);
                    break;
                case 'deactive':
                    $vehicleTypes = $vehicleTypes->where('status', false);
                    break;
                case 'trash':
                    $vehicleTypes = $vehicleTypes->onlyTrashed();
                    break;
            }
        }

        if ($this->request->has('s')) {
            $vehicleTypes = $vehicleTypes->withTrashed()->where('name', 'LIKE', "%" . $this->request->s . "%");
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            $vehicleTypes = $vehicleTypes->orderBy($this->request->orderby, $this->request->order);
        } else {
            $vehicleTypes = $vehicleTypes->orderBy('created_at', 'desc');
        }

        return $vehicleTypes->paginate($this->request?->paginate ?? 10);
    }

    public function generate()
    {
        $vehicleTypes = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $vehicleTypes->each(function ($vehicleType) {
            $vehicleType->title = $vehicleType->getTranslation('name', app()->getLocale());
            $vehicleType->service = $vehicleType->services()->pluck('name')->implode(', ');
            $vehicleType->service_categories = $vehicleType->service_categories()->pluck('name')->implode(', ');
            $vehicleType->date = formatDateBySetting($vehicleType->created_at);
        });

        $baseQuery = $this->vehicleType;

        if ($this->request->service) {
            $serviceId = getServiceIdBySlug($this->request->service);
            if ($serviceId) {
                $baseQuery = $baseQuery->where('service_id', $serviceId);
            }
        }

        $allCount = (clone $baseQuery)->count();
        $activeCount = (clone $baseQuery)->whereNull('deleted_at')->where('status', true)->count();
        $deactiveCount = (clone $baseQuery)->whereNull('deleted_at')?->where('status', false)?->count();
        $trashCount = (clone $baseQuery)->onlyTrashed()->count();

        $tableConfig = [
            'columns' => [
                ['title' => 'Name', 'field' => 'name', 'imageField' => 'vehicle_image_id', 'action' => true, 'sortable' => true],
                ['title' => 'Service', 'field' => 'service', 'sortable' => false],
                ['title' => 'Service Categories', 'field' => 'service_categories', 'sortable' => false],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.vehicle-type.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
                ['title' => 'Action', 'type' => 'action', 'permission' => ['vehicle_type.index'], 'sortable' => false],
            ],
            'data' => $vehicleTypes,
            'actions' => [
                ['title' => 'Edit', 'route' => getVehicleEditRoute(), 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'vehicle_type.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.vehicle-type.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'vehicle_type.destroy'],
                ['title' => 'Restore', 'route' => 'admin.vehicle-type.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'vehicle_type.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.vehicle-type.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'vehicle_type.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $allCount],
                ['title' => 'Active', 'slug' => 'active', 'count' => $activeCount],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $deactiveCount],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $trashCount],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'vehicle_type.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'vehicle_type.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'vehicle_type.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'vehicle_type.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'vehicle_type.forceDelete', 'whenFilter' => ['trash']],
            ],
            'actionButtons' => [
                ['icon' => 'ri-road-map-line', 'route' => 'admin.vehicle-type-zone.index', 'class' => 'dark-icon-box', 'permission' => 'vehicle_type.index','tooltip' => 'Vehicle Zone'],
                ['icon' => 'ri-flashlight-fill','route' => 'admin.vehicle-surge-price.index', 'class' => 'dark-icon-box','permission' => 'vehicle_type.index','tooltip' => 'Surge Price'],
            ],
            'total' => $vehicleTypes?->count(),
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
            case 'trashed':
                $this->trashedHandler();
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
        $this->vehicleType->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->vehicleType->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->vehicleType->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->vehicleType->onlyTrashed()->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->vehicleType->onlyTrashed()->whereIn('id', $this->request->ids)->forceDelete();
    }
}
