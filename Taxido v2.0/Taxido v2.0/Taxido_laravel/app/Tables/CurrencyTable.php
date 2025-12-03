<?php

namespace App\Tables;

use App\Models\Currency;
use Illuminate\Http\Request;

class CurrencyTable
{
    protected $currency;
    protected $request;

    public function __construct(Request $request)
    {
        $this->currency = new Currency();
        $this->request = $request;
    }
    public function getData()
    {
        $currencies = $this->currency;
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $currencies->where('status', true)->paginate($this->request?->paginate);
                case 'deactive':
                    return $currencies->where('status', false)->paginate($this->request?->paginate);
                case 'trash':
                    return $currencies->withTrashed()?->whereNotNull('deleted_at')?->paginate($this->request?->paginate);
            }
        }

        if ($this->request->has('s')) {
            return $currencies->withTrashed()->where(function ($query) {
                $query->where('code', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhere('symbol', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhere('exchange_rate', 'LIKE', "%" . $this->request->s . "%"); 
            })->paginate($this->request->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $currencies->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $currencies->whereNull('deleted_at')->paginate($this->request?->paginate);
    }


    public function generate()
    {
        $currencies = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $currencies->each(function ($currency) {
            $currency->date = $currency->created_at->format('Y-m-d h:i:s A');
            $currency->date = formatDateBySetting($currency->created_at);

        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Code', 'field' => 'code', 'imageField' => null, 'action' => true, 'sortable' => true],
                ['title' => 'Symbol', 'field' => 'symbol', 'sortable' => true],
                ['title' => 'Exchange Rate', 'field' => 'exchange_rate', 'imageField' => null, 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.currency.status', 'type' => 'status', 'sortable' => false],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at']
            ],
            'data' => $currencies,
            'actions' => [
                ['title' => 'Edit',  'route' => 'admin.currency.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'],'permission' => 'currency.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.currency.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'currency.destroy'],
                ['title' => 'Restore', 'route' => 'admin.currency.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'currency.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.currency.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'currency.forceDelete']
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->currency->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->currency->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->currency->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->currency->withTrashed()?->whereNotNull('deleted_at')?->count()]
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'currency.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'currency.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'currency.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'currency.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'currency.forceDelete', 'whenFilter' => ['trash']],

            ],
            'total' => $this->currency->count()
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
        $this->currency->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->currency->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->currency->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->currency->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->currency->whereIn('id', $this->request->ids)->forceDelete();
    }
}
