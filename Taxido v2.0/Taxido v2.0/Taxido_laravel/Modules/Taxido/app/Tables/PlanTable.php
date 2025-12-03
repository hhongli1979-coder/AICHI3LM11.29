<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Plan;

class PlanTable
{
    protected $plan;
    protected $request;

    public function __construct(Request $request)
    {
        $this->plan = new Plan();
        $this->request = $request;
    }

    public function getData()
    {
        $plans = $this->plan;

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $plans->where('status', true)->paginate($this->request?->paginate);
                case 'deactive':
                    return $plans->where('status', false)->paginate($this->request?->paginate);
                case 'trash':
                    return $plans->withTrashed()->whereNotNull('deleted_at')->paginate($this->request?->paginate);
            }
        }

        if ($this->request->has('s')) {
            return $plans->withTrashed()->where('name', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
        }

        if ($this->request->has('s')) {
            return $plans->withTrashed()->where(function ($query) {
                $query->where('name', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhere('duration', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhere('price', 'LIKE', "%" . $this->request->s . "%");
            })->paginate($this->request->paginate);
        }


        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $plans->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $plans->whereNull('deleted_at')->paginate($this->request?->paginate);
    }


    public function generate()
    {

        $plans = $this->getData();
        $defaultCurrency = getDefaultCurrency()?->symbol;
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $plans->each(function ($plan) use ($defaultCurrency)  {
            $plan->description = $plan->getTranslation('description', app()->getLocale());
            $plan->service_categories = $plan->service_categories()->pluck('name')->implode(', ');
            $plan->name = $plan->getTranslation('name', app()->getLocale());
            $plan->price = $defaultCurrency . number_format($plan->price, 2);
            $plan->date = formatDateBySetting($plan->created_at);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Plan Name', 'field' => 'name', 'sortable' => true, 'action' => true,],
                ['title' => 'Service Categories', 'field' => 'service_categories', 'sortable' => false],
                ['title' => 'Duration', 'field' => 'duration', 'sortable' => true],
                ['title' => 'Price', 'field' => 'price', 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.plan.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $plans,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.plan.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'plan.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.plan.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'plan.destroy'],
                ['title' => 'Restore', 'route' => 'admin.plan.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'plan.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.plan.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'plan.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->plan->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->plan->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->plan->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->plan->withTrashed()?->whereNotNull('deleted_at')?->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'plan.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'plan.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'plan.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'plan.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'plan.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $this->plan->count(),
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
        $this->plan->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->plan->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->plan->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->plan->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->plan->whereIn('id', $this->request->ids)->forceDelete();
    }
}
