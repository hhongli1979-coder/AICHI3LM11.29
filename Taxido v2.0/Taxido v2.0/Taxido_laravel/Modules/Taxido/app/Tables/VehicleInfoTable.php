<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\VehicleInfo;

class VehicleInfoTable
{
    protected $vehicleInfo;
    protected $request;

    public function __construct(Request $request)
    {
        $this->vehicleInfo = new VehicleInfo();
        $this->request = $request;
    }

    public function getVehicleInfo()
    {
        $vehicleInfo = $this->vehicleInfo->whereNotNull('fleet_manager_id');
        if ($this->request->has('is_verified')) {
            $vehicleInfo = $vehicleInfo->where('is_verified', $this->request?->is_verified);
        }

        $currentUserRole = getCurrentRoleName();
        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            $vehicleInfo->where('fleet_manager_id', getCurrentUserId());
        }


        return $vehicleInfo;
    }

    public function getData()
    {
        $vehicleInfo = $this->getVehicleInfo();

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'trash':
                    $vehicleInfo = $vehicleInfo->withTrashed()->whereNotNull('deleted_at');
                    break;
            }
        }

        if ($this->request->has('s') && $this->request->s !== '') {
            $searchTerm = $this->request->s;
            $vehicleInfo = $vehicleInfo->with(['vehicle'])
                ->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%$searchTerm%")
                      ->orWhere('plate_number', 'LIKE', "%$searchTerm%")
                      ->orWhereHas('vehicle', function ($vq) use ($searchTerm) {
                          $vq->where('name', 'LIKE', "%$searchTerm%");
                      });
                });
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            $orderby = $this->request->orderby;
            $order = $this->request->order;

            if (Schema::hasColumn('vehicle_info', $orderby)) {
                $vehicleInfo = $vehicleInfo->orderBy($orderby, $order);
            }
        } else {
            $vehicleInfo = $vehicleInfo->latest();
        }

        return $vehicleInfo->paginate($this->request->paginate ?? 15);
    }

    public function generate()
    {
        $vehicles = $this->getData();

        $vehicles->each(function ($vehicle) {
            $vehicle->vehicle_type = $vehicle?->vehicle?->name;
            $vehicle->date = formatDateBySetting($vehicle->created_at);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Name', 'field' => 'name', 'action' => true, 'imageField' => 'profile_image_id', 'placeholderLetter' => true, 'sortable' => true],
                ['title' => 'Vehicle Type', 'field' => 'vehicle_type', 'sortable' => true],
                ['title' => 'Plate Number', 'field' => 'plate_number', 'sortable' => true],
                ['title' => 'Verified', 'field' => 'is_verified', 'route' => 'admin.vehicleInfo.verify', 'type' => 'is_verified', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
                ['title' => 'Action', 'type' => 'action', 'permission' => ['vehicle_info.index'], 'sortable' => false],
            ],
            'data'   => $vehicles,
            'actions'  => [
                ['title' => 'Edit', 'route' => 'admin.vehicle-info.edit', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'assigned', 'maintenance'], 'permission' => 'vehicle_info.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.vehicle-info.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'assigned', 'maintenance'], 'permission' => 'vehicle_info.destroy'],
                ['title' => 'Delete Permanently', 'route' => 'admin.vehicle-info.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'vehicle_info.forceDelete'],
            ],
            'filters'       => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->getVehicleInfo()->whereNull('deleted_at')->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->getVehicleInfo()->withTrashed()->whereNotNull('deleted_at')->count()],
            ],
            'bulkactions'   => [
                ['title' => 'Move to Trash', 'action' => 'trash', 'permission' => 'vehicle_info.destroy', 'whenFilter' => ['all', 'active', 'assigned', 'maintenance']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'vehicle_info.forceDelete', 'whenFilter' => ['trash']],
            ],
            'actionButtons' => [
                ['icon' => 'ri-file-2-line', 'route' => 'admin.vehicleInfo.document', 'class' => 'dark-icon-box', 'permission' => 'vehicle_info.index', 'tooltip' => 'Fleet Vehicle document'],
            ],
            'total' => $vehicles->total(),
        ];

        return $tableConfig;
    }
}


