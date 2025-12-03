<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\ExtraCharge;

class ExtraChargeTable
{
    protected $extraCharge;

    protected $request;

    public function __construct(Request $request)
    {
        $this->extraCharge = new ExtraCharge();
        $this->request = $request;
    }

    public function getData()
    {
        $extraCharges = $this->extraCharge;
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $extraCharges->where('status', true)->paginate($this->request?->paginate);
                case 'deactive':
                    return $extraCharges->where('status', false)->paginate($this->request?->paginate);
                case 'trash':
                    return $extraCharges->withTrashed()?->whereNotNull('deleted_at')?->paginate($this->request?->paginate);
            }
        }

        if ($this->request->has('s')) {
            return $extraCharges->withTrashed()->where(function ($query) {
                $query->where('name', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhere('rate', 'LIKE', "%" . $this->request->s . "%");
            })->paginate($this->request->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $extraCharges->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $extraCharges->whereNull('deleted_at')->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $extraCharges = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $extraCharges->each(function ($extraCharge) {
            $extraCharge->date = formatDateBySetting($extraCharge->created_at);
            $cs = $extraCharge?->ride?->currency_symbol;
            $extraCharge->ride_amount = $cs.$extraCharge?->amount;
            $extraCharge->ride_numb        = "#{$extraCharge?->ride?->ride_number}";

        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Title', 'field' => 'title', 'imageField' => null, 'action' => false, 'sortable' => true],
                ['title' => 'Ride Number', 'field' => 'ride_numb', 'type' => 'badge', 'badge_type' => 'light', 'sortable' => false],
                ['title' => 'Amount', 'field' => 'ride_amount', 'sortable' => false],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at']
            ],
            'data' => $extraCharges,
            'actions' => [
                ['title' => 'Edit',  'route' => 'admin.extra-charge.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'extra_charge.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.extra-charge.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'extra_charge.destroy'],
                ['title' => 'Restore', 'route' => 'admin.extra-charge.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'extra_charge.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.extra-charge.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'extra_charge.forceDelete']
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->extraCharge->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'extra_charge.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'extra_charge.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'extra_charge.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'extra_charge.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'extra_charge.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $this->extraCharge->count()
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
        $this->extraCharge->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->extraCharge->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->extraCharge->whereIn('id', $this->request->ids)->delete();
    }
    public function restoreHandler(): void
    {
        $this->extraCharge->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->extraCharge->whereIn('id', $this->request->ids)->forceDelete();
    }
}
