<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\SurgePrice;

class SurgePriceTable
{

    protected $request;

    protected $surgePrice;

    public function __construct(Request $request)
    {
        $this->surgePrice = new SurgePrice();
        $this->request = $request;
    }

    public function getData()
    {
        $surgePrices = $this->surgePrice->query();

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $surgePrices = $surgePrices->where('status', true);
                    break;
                case 'deactive':
                    $surgePrices = $surgePrices->where('status', false);
                    break;
                case 'trash':
                    $surgePrices = $surgePrices->withTrashed()->whereNotNull('deleted_at');
                    break;
            }
        }

        if ($this->request->has('s')) {
            return $surgePrices->withTrashed()
                ->where('day', 'LIKE', "%" . $this->request->s . "%")
                ->orderBy('created_at', 'DESC')
                ->paginate($this->request?->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $surgePrices->orderBy($this->request->orderby, $this->request->order)
                ->paginate($this->request?->paginate);
        }

        return $surgePrices->orderBy('created_at', 'DESC')
            ->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $surgePrices = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $surgePrices->each(function ($surgePrice) {
            $surgePrice->date = formatDateBySetting($surgePrice->created_at);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Day', 'field' => 'day', 'imageField' => null, 'action' => true, 'sortable' => true],
                ['title' => 'Start Time', 'field' => 'start_time', 'sortable'=> true],
                ['title' => 'End Time', 'field' => 'end_time', 'sortable'=> true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.surge-price.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $surgePrices,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.surge-price.edit', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => false, 'permission' => 'surge_price.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.surge-price.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => false, 'permission' => 'surge_price.destroy'],
                ['title' => 'Restore', 'route' => 'admin.surge-price.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'isTranslate' => false, 'permission' => 'surge_price.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.surge-price.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'isTranslate' => false, 'permission' => 'surge_price.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->surgePrice->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->surgePrice->where('status', 1)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->surgePrice->where('status', 0)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->surgePrice->withTrashed()->whereNotNull('deleted_at')->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'surge_price.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'surge_price.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'surge_price.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'surge_price.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'surge_price.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $this->surgePrice->count(),
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
        $this->surgePrice->whereIn('id', $this->request->ids)->update(['status' => 1]);
    }

    public function deactiveHandler(): void
    {
        $this->surgePrice->whereIn('id', $this->request->ids)->update(['status' => 0]);
    }

    public function trashedHandler(): void
    {
        $this->surgePrice->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->surgePrice->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->surgePrice->whereIn('id', $this->request->ids)->forceDelete();
    }
    

}