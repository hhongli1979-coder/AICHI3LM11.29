<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\DriverRule;

class DriverRuleTable
{
    protected $request;
    protected $driverRule;

    public function __construct(Request $request)
    {
        $this->driverRule = new DriverRule();
        $this->request = $request;
    }

    public function getData()
    {
        $driverRules = $this->driverRule;
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $driverRules = $driverRules->where('status', true);
                    break;
                case 'deactive':
                    $driverRules = $driverRules->where('status', false);
                    break;
                case 'trash':
                    $driverRules = $driverRules->withTrashed()?->whereNotNull('deleted_at');
                    break;
            }
        }

        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $driverRules = $driverRules->withTrashed()->where(function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', "%{$searchTerm}%")
                    ->orWhereHas('vehicle_types', function ($query) use ($searchTerm) {
                        $query->where('name', 'LIKE', "%{$searchTerm}%");
                    });
            });
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            $driverRules = $driverRules->orderBy($this->request->orderby, $this->request->order);
        } else {
            $driverRules = $driverRules->latest();
        }

        return $driverRules->paginate($this->request->paginate);
    }

    public function generate()
    {
        $driverRules = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $driverRules->each(function ($driverRule) {
            $driverRule->vehicle_type = $driverRule->vehicle_types()->pluck('name')->implode(', ');
            $driverRule->date = formatDateBySetting($driverRule->created_at);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Title', 'field' => 'title', 'imageField' => 'rule_image_id', 'action' => true, 'sortable' => true],
                ['title' => 'Vehicle Types', 'field' => 'vehicle_type', 'sortable' => false],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.driver-rule.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $driverRules,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.driver-rule.edit', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'driver_rule.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.driver-rule.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'driver_rule.destroy'],
                ['title' => 'Restore', 'route' => 'admin.driver-rule.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'driver_rule.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.driver-rule.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'driver_rule.forceDelete']
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->driverRule->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->driverRule?->whereNull('deleted_at')?->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->driverRule->whereNull('deleted_at')?->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->driverRule->withTrashed()?->whereNotNull('deleted_at')?->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'driver_rule.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'driver_rule.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'driver_rule.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'driver_rule.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'driver_rule.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $driverRules->count(),
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
        $this->driverRule->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->driverRule->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->driverRule->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->driverRule->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->driverRule->whereIn('id', $this->request->ids)->forceDelete();
    }
}
