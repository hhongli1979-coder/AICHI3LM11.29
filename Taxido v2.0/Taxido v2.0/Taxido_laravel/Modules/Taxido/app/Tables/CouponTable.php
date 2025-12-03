<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Coupon;

class CouponTable
{
    protected $coupon;
    protected $request;

    public function __construct(Request $request)
    {
        $this->coupon = new Coupon();
        $this->request = $request;
    }

    public function getData()
    {
        $coupons = $this->coupon->query();

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $coupons->where('status', true)->orderBy('created_at', 'DESC')->paginate($this->request?->paginate);
                case 'deactive':
                    return $coupons->where('status', false)->orderBy('created_at', 'DESC')->paginate($this->request?->paginate);
                case 'trash':
                    return $coupons->withTrashed()->whereNotNull('deleted_at')->orderBy('created_at', 'DESC')->paginate($this->request?->paginate);
            }
        }

        if ($this->request->has('s')) {
            return $coupons->withTrashed()->where(function ($query) {
                $query->where('title', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhere('code', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhere('type', 'LIKE', "%" . $this->request->s . "%");
            })->orderBy('created_at', 'DESC')->paginate($this->request->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $coupons->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        if($this->request->export) {
            return $coupons?->latest()?->get();
        }

        return $coupons->whereNull('deleted_at')->orderBy('created_at', 'DESC')->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $coupons = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $defaultCurrency = getDefaultCurrency()->symbol;

        $coupons->each(function ($coupon) use($defaultCurrency){
            $coupon->title = $coupon->getTranslation('title', app()->getLocale());
            $coupon->description = $coupon->getTranslation('description', app()->getLocale());
            $coupon->formatted_amount = $coupon?->type == 'fixed' ? $defaultCurrency . number_format($coupon->amount, 2) : number_format($coupon->amount, 2) . '%';
            $coupon->date = formatDateBySetting($coupon->created_at);

        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Title', 'field' => 'title', 'imageField' => null, 'action' => true, 'sortable' => true],
                ['title' => 'Code', 'field' => 'code', 'imageField' => null, 'sortable' => true],
                ['title' => 'Type', 'field' => 'type', 'imageField' => null, 'sortable' => true],
                ['title' => 'Amount', 'field' => 'formatted_amount', 'imageField' => null, 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.coupon.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => false],
            ],
            'data' => $coupons,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.coupon.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'coupon.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.coupon.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'coupon.destroy'],
                ['title' => 'Restore', 'route' => 'admin.coupon.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'coupon.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.coupon.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'coupon.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->coupon->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->coupon->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->coupon->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->coupon->withTrashed()?->whereNotNull('deleted_at')?->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'coupon.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'coupon.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'coupon.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'coupon.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'coupon.forceDelete', 'whenFilter' => ['trash']],

            ],
            'total' => $this->coupon->count(),
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
        $this->coupon->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->coupon->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->coupon->whereIn('id', $this->request->ids)->delete();
    }
    public function restoreHandler(): void
    {
        $this->coupon->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->coupon->whereIn('id', $this->request->ids)->forceDelete();
    }
}
