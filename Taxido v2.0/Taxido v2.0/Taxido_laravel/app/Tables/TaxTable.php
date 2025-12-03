<?php

namespace App\Tables;

use App\Models\Tax;
use Illuminate\Http\Request;

class TaxTable
{
    protected $tax;
    protected $request;

    public function __construct(Request $request)
    {
        $this->tax = new Tax();
        $this->request = $request;
    }

    public function getData()
    {
        $taxes = $this->tax;
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $taxes->where('status', true)->paginate($this->request?->paginate);
                case 'deactive':
                    return $taxes->where('status', false)->paginate($this->request?->paginate);
                case 'trash':
                    return $taxes->withTrashed()?->whereNotNull('deleted_at')?->paginate($this->request?->paginate);
            }
        }

        if ($this->request->has('s')) {
            return $taxes->withTrashed()->where(function ($query) {
                $query->where('name', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhere('rate', 'LIKE', "%" . $this->request->s . "%");
            })->paginate($this->request->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $taxes->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $taxes?->latest()?->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $taxes = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $taxes->each(function ($tax) {
            $tax->name = $tax->getTranslation('name', app()->getLocale());
            $tax->rate = $tax->rate . '%';
            $tax->date = formatDateBySetting($tax->created_at);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Name', 'field' => 'name', 'imageField' => null, 'action' => true, 'sortable' => true],
                ['title' => 'Rate', 'field' => 'rate', 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.tax.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at']
            ],
            'data' => $taxes,
            'actions' => [
                ['title' => 'Edit',  'route' => 'admin.tax.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'tax.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.tax.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'tax.destroy'],
                ['title' => 'Restore', 'route' => 'admin.tax.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'tax.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.tax.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'tax.forceDelete']
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->tax->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->tax->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->tax->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->tax->withTrashed()?->whereNotNull('deleted_at')?->count()]
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'tax.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'tax.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'tax.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'tax.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'tax.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $this->tax->count()
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
        $this->tax->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->tax->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->tax->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->tax->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->tax->whereIn('id', $this->request->ids)->forceDelete();
    }
}
