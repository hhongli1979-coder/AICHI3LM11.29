<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use Illuminate\Support\Facades\Schema;
use Modules\Taxido\Models\RentalVehicle;

class RentalVehicleTable
{
    protected $rentalVehicle;
    protected $request;

    public function __construct(Request $request)
    {
        $this->rentalVehicle = new RentalVehicle();
        $this->request = $request;
    }

    public function getData()
    {
        $rentalVehicles = $this->rentalVehicle;
        if (getCurrentRoleName() == RoleEnum::DRIVER) {
            $driverId = getCurrentDriver()?->id;
            $rentalVehicles = $rentalVehicles->where('driver_id', $driverId);
        }
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $rentalVehicles = $rentalVehicles->where('rental_vehicles.status', true);
                    break;
                case 'deactive':
                    $rentalVehicles = $rentalVehicles->where('rental_vehicles.status', false);
                    break;
                case 'trash':
                    $rentalVehicles = $rentalVehicles->withTrashed()?->whereNotNull('rental_vehicles.deleted_at');
                    break;
            }
        }

        if ($this->request->has('s')) {
            $rentalVehicles = $this->applySearch($rentalVehicles);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $this->applySorting($rentalVehicles)->paginate($this->request?->paginate);
        }

        return $rentalVehicles?->latest()?->paginate($this->request?->paginate);
    }

    public function applySorting($rentalVehicles)
    {
        $orderby = $this->request->orderby;
        $order = $this->request->order;
        $rentalVehicles = $rentalVehicles->select('rental_vehicles.*');
        if (
            Schema::hasColumn('rental_vehicles', $orderby) ||
            (str_contains($orderby, 'users.') && Schema::hasColumn('users', str_replace('users.', '', $orderby))) ||
            (str_contains($orderby, 'vehicle_types.') && Schema::hasColumn('vehicle_types', str_replace('vehicle_types.', '', $orderby)))
        ) {
            if (str_contains($orderby, 'users.')) {
                $rentalVehicles = $rentalVehicles
                    ->join('users', 'rental_vehicles.driver_id', '=', 'users.id')
                    ->addSelect('users.name as driver_name');
            }

            if (str_contains($orderby, 'vehicle_types.')) {
                $rentalVehicles = $rentalVehicles
                    ->join('vehicle_types', 'rental_vehicles.vehicle_type_id', '=', 'vehicle_types.id')
                    ->addSelect('vehicle_types.name as vehicle_type_name');
            }

            return $rentalVehicles->orderBy($orderby, $order);
        }

        return $rentalVehicles;
    }


    public function applySearch($rentalVehicles)
    {
        if (isset($this->request->s)) {
            $searchTerm = $this->request->s;

            $rentalVehicles = $rentalVehicles->with(['driver', 'vehicle_type'])
                ->where(function ($query) use ($searchTerm) {
                    $query->where('name', 'LIKE', "%$searchTerm%")
                        ->orWhereHas('driver', function ($q) use ($searchTerm) {
                            $q->where('name', 'LIKE', "%$searchTerm%")
                                ->orWhere('email', 'LIKE', "%$searchTerm%");
                        })
                        ->orWhereHas('vehicle_type', function ($q) use ($searchTerm) {
                            $q->where('name', 'LIKE', "%$searchTerm%");
                        })
                        ->orWhere('vehicle_per_day_price', 'LIKE', "%$searchTerm%")
                        ->orWhere('verified_status', 'LIKE', "%$searchTerm%");
                });
        }

        return $rentalVehicles;
    }

    public function generate()
    {
        $rentalVehicles = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }
        $defaultCurrency = getDefaultCurrency()?->symbol;

        $rentalVehicles->each(function ($rentalVehicle) use ($defaultCurrency) {
            $rentalVehicle->vehicle_type = $rentalVehicle->vehicle_type->name;
            $rentalVehicle->driver_name = $rentalVehicle?->driver?->name;
            $rentalVehicle->driver_email = isDemoModeEnabled() ? __('taxido::static.demo_mode') : ($rentalVehicle?->driver?->email ?? null);
            $rentalVehicle->driver_profile = $rentalVehicle?->driver?->profile_image_id ?? null;
            $rentalVehicle->date = formatDateBySetting($rentalVehicle->created_at);

            $rentalVehicle->price = $defaultCurrency . number_format($rentalVehicle->vehicle_per_day_price, 2);
            $rentalVehicle->verified_status = ucfirst($rentalVehicle->verified_status);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Name', 'field' => 'name', 'imageField' => '', 'action' => true, 'sortable' => true],
                ['title' => 'Driver', 'field' => 'driver_name', 'email' => 'driver_email', 'profile_image' => 'driver_profile',   'sortable' => true, 'sortField' => 'users.name', 'route' => 'admin.driver.show', 'profile_id' => 'driver_id'],
                ['title' => 'Vehicle Type', 'field' => 'vehicle_type', 'imageField' => null, 'sortable' => true, 'sortField' => 'vehicle_types.name'],
                ['title' => 'Per Day Price', 'field' => 'price', 'imageField' => null, 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.rental-vehicle.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Verification Status', 'field' => 'verified_status', 'type' => 'badge', 'colorClasses' => ['Pending' => 'warning', 'Approved' => 'primary', 'Rejected' => 'danger'], 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $rentalVehicles,
            'actions' => [
                ['title' => 'Edit',  'route' => 'admin.rental-vehicle.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'rental_vehicle.edit', 'isTranslate' => true],
                ['title' => 'Move to trash', 'route' => 'admin.rental-vehicle.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'rental_vehicle.destroy'],
                ['title' => 'Restore', 'route' => 'admin.rental-vehicle.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'rental_vehicle.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.rental-vehicle.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'rental_vehicle.forceDelete']
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->getFilterCount('all')],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->getFilterCount('active')],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->getFilterCount('deactive')],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->getFilterCount('trash')]
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'rental_vehicle.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'rental_vehicle.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'rental_vehicle.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'rental_vehicle.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'rental_vehicle.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $this->rentalVehicle?->count()
        ];

        return $tableConfig;
    }

    public function getFilterCount($filter)
    {
        $rentalVehicles = $this->rentalVehicle;
        $currentUserRole = getCurrentRoleName();
        $currentUserId = getCurrentUserId();
        if ($currentUserRole == RoleEnum::DRIVER) {
            $rentalVehicles = $rentalVehicles->where('driver_id', $currentUserId);
        }

        if ($filter == 'active') {
            return $rentalVehicles->where('status', true)->count();
        }

        if ($filter == 'deactive') {
            return $rentalVehicles->where('status', false)->count();
        }

        if ($filter == 'trash') {
            return $rentalVehicles->withTrashed()->whereNotNull('deleted_at')->count();
        }

        return $rentalVehicles->count();
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
        $this->rentalVehicle->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->rentalVehicle->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->rentalVehicle->whereIn('id', $this->request->ids)->delete();
    }
    public function restoreHandler(): void
    {
        $this->rentalVehicle->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->rentalVehicle->whereIn('id', $this->request->ids)->forceDelete();
    }
}
