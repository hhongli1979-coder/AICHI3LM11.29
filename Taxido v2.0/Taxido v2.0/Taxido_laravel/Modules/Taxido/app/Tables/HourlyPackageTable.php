<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\HourlyPackage;

class HourlyPackageTable
{
    protected $hourlyPackage;
    protected $request;

    public function __construct(Request $request)
    {
        $this->hourlyPackage = new HourlyPackage();
        $this->request = $request;
    }

    public function getData()
    {
        $hourlyPackages = $this->hourlyPackage->query(); 

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $hourlyPackages = $hourlyPackages->where('status', true);
                    break;
                case 'deactive':
                    $hourlyPackages = $hourlyPackages->where('status', false);
                    break;
                case 'trash':
                    $hourlyPackages = $hourlyPackages->withTrashed()->whereNotNull('deleted_at');
                    break;
            }
        }

        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $hourlyPackages = $hourlyPackages->withTrashed()->where(function ($query) use ($searchTerm) {
                $query->where('hour', 'LIKE', "%" . $this->request->s . "%")
                ->orWhere('distance', 'LIKE', "%" . $this->request->s . "%")
                ->orWhere('distance_type', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhereHas('vehicle_types', function ($query) use ($searchTerm) {
                        $query->where('name', 'LIKE', "%{$searchTerm}%");
                    });
            });
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            $hourlyPackages = $hourlyPackages->orderBy($this->request->orderby, $this->request->order);
        } else {
            $hourlyPackages = $hourlyPackages->latest();
        }

        return $hourlyPackages->paginate($this->request->paginate);

    }

    public function generate()
    {
        $hourlyPackages = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $hourlyPackages->each(function ($hourlyPackage) {
            $vehicleTypes = $hourlyPackage->vehicle_types()->pluck('name');
            $hourlyPackage->vehicle_type = $vehicleTypes->isNotEmpty() ? $vehicleTypes->implode(', ') : 'N/A';
            $hourlyPackage->distance_column = $hourlyPackage->distance . ' ' . $hourlyPackage->distance_type;
            $hourlyPackage->date = formatDateBySetting($hourlyPackage->created_at);
        });


        $tableConfig = [
            'columns' => [
                ['title' => 'Distance', 'field' => 'distance_column', 'imageField' => null, 'sortable' => false, 'action' => true],
                ['title' => 'Hour ', 'field' => 'hour', 'sortable' => true],
                ['title' => 'Vehicle Types', 'field' => 'vehicle_type', 'sortable' => false],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.hourly-package.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at']
            ],
            'data' => $hourlyPackages,
            'actions' => [
                ['title' => 'Edit',  'route' => 'admin.hourly-package.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'hourly_package.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.hourly-package.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'hourly_package.destroy'],
                ['title' => 'Restore', 'route' => 'admin.hourly-package.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'hourly_package.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.hourly-package.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'hourly_package.forceDelete']
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->hourlyPackage->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->hourlyPackage->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->hourlyPackage->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->hourlyPackage->withTrashed()?->whereNotNull('deleted_at')?->count()]
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'hourly_package.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'hourly_package.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'hourly_package.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'hourly_package.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'hourly_package.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $this->hourlyPackage->count()
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
        $this->hourlyPackage->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->hourlyPackage->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->hourlyPackage->whereIn('id', $this->request->ids)->delete();
    }
    public function restoreHandler(): void
    {
        $this->hourlyPackage->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->hourlyPackage->whereIn('id', $this->request->ids)->forceDelete();
    }
}
