<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Airport;

class AirportTable
{
    protected $request;
    protected $airport;

    public function __construct(Request $request)
    {
        $this->airport = new Airport();
        $this->request = $request;
    }

    public function getBaseQuery()
    {
        $airports = $this->airport->newQuery()->withTrashed();

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $airports->where('status', true);
                    break;
                case 'deactive':
                    $airports->where('status', false);
                    break;
                case 'trash':
                    $airports->onlyTrashed();
                    break;
            }
        }

        if ($this->request->has('s') && $this->request->s !== '') {
            $airports->where(function ($query) {
                $query->where('name', 'LIKE', "%" . $this->request->s . "%");
            });
        }

        return $airports;
    }

    public function getData()
    {
        return $this->getBaseQuery()
            ->latest()
            ->paginate($this->request->paginate);
    }

    public function generate()
    {
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $airports = $this->getData();

        $defaultCurrency = getDefaultCurrency()?->symbol;
        if (!empty($airports)) {
            $airports->each(function ($item) use ($defaultCurrency) {
                $item->formatted_amount = $defaultCurrency . number_format($item->amount, 2);
            });
        }

        $airports->each(function ($airport) {
            $airport->name = $airport->getTranslation('name', app()->getLocale());
            $airport->date = formatDateBySetting($airport->created_at);
        });

        // ✅ Fixed Count Logic
        $baseQuery = $this->airport->newQuery()->withTrashed();

        $allCount = (clone $baseQuery)->count();
        $activeCount = (clone $baseQuery)->where('status', true)->count();
        $deactiveCount = (clone $baseQuery)->where('status', false)->count();

        $tableConfig = [
            'columns' => [
                ['title' => 'Name', 'field' => 'name', 'imageField' => null, 'action' => true, 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.airport.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at']
            ],
            'data' => $airports,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.airport.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'airport.edit'],
                ['title' => 'Delete Permanently', 'route' => 'admin.airport.forceDelete', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'airport.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $allCount],
                ['title' => 'Active', 'slug' => 'active', 'count' => $activeCount],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $deactiveCount],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'airport.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'airport.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'airport.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $allCount
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
        $this->airport->whereIn('id', $this->request->ids)->update(['status' => 1]);
    }

    public function deactiveHandler(): void
    {
        $this->airport->whereIn('id', $this->request->ids)->update(['status' => 0]);
    }

    public function trashedHandler(): void
    {
        $this->airport->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->airport->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->airport->whereIn('id', $this->request->ids)->forceDelete();
    }
}
