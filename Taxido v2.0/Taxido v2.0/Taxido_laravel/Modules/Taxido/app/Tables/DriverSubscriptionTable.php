<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\DriverSubscription;

class DriverSubscriptionTable
{
    protected $request;
    protected $driverSubscription;

    protected $sortableColumns = [
        'driver.name',
        'plan.name',
        'total',
        'start_date',
        'end_date',
        'is_active',
        'created_at',
    ];

    public function __construct(Request $request)
    {
        $this->driverSubscription = DriverSubscription::query();
        $this->request = $request;
    }

    public function getData()
    {
        $subscriptions = $this->driverSubscription->with(['driver', 'plan']);

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $subscriptions = $subscriptions->where('is_active', true);
                    break;
                case 'deactive':
                    $subscriptions = $subscriptions->where('is_active', false);
                    break;
            }
        }

        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $subscriptions = $subscriptions->leftJoin('users as driver_users', function ($join) {
                $join->on('driver_subscriptions.driver_id', '=', 'driver_users.id')
                     ->whereNull('driver_users.deleted_at');
            })->leftJoin('plans', function ($join) {
                $join->on('driver_subscriptions.plan_id', '=', 'plans.id')
                     ->whereNull('plans.deleted_at');
            })->select('driver_subscriptions.*')
              ->where(function ($query) use ($searchTerm) {
                  $query->where('driver_subscriptions.driver_id', 'LIKE', "%$searchTerm%")
                        ->orWhere('subscriptions.total', 'LIKE', "%$searchTerm%")
                        ->orWhere('driver_subscriptions.plan_id', 'LIKE', "%$searchTerm%")
                        ->orWhere('driver_users.name', 'LIKE', "%$searchTerm%")
                        ->orWhere('plans.name', 'LIKE', "%$searchTerm%");
              });
        }

        $subscriptions = $this->sorting($subscriptions);

        return $subscriptions->paginate($this->request?->paginate ?? 15);
    }

    protected function sorting($subscriptions)
    {
        $orderby = $this->request->get('orderby', 'created_at');
        $order = strtolower($this->request->get('order', 'desc')) === 'asc' ? 'asc' : 'desc';

        if (!in_array($orderby, $this->sortableColumns)) {
            return $subscriptions->orderBy('driver_subscriptions.created_at', 'desc');
        }

        if (str_contains($orderby, '.')) {
            [$relation, $column] = explode('.', $orderby);

            switch ($relation) {
                case 'driver':
                    return $subscriptions->leftJoin('users as driver_users', function ($join) {
                        $join->on('driver_subscriptions.driver_id', '=', 'driver_users.id')
                             ->whereNull('driver_users.deleted_at');
                    })->select('driver_subscriptions.*')
                      ->orderBy("driver_users.$column", $order);
                case 'plan':
                    return $subscriptions->leftJoin('plans', function ($join) {
                        $join->on('driver_subscriptions.plan_id', '=', 'plans.id')
                             ->whereNull('plans.deleted_at');
                    })->select('driver_subscriptions.*')
                      ->orderBy("plans.$column", $order);
            }
        }

        return $subscriptions->orderBy("driver_subscriptions.$orderby", $order);
    }

    public function generate()
    {
        $subscriptions = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
            $subscriptions = $this->getData();
        }

        $subscriptions->each(function ($subscription) {
            $defaultCurrency = getDefaultCurrency()?->symbol;
            $subscription->driver_name = $subscription->driver ? $subscription->driver->name : 'N/A';
            $subscription->driver_email = isDemoModeEnabled() ? __('taxido::static.demo_mode') : ($subscription->driver?->email ?? null);
            $subscription->driver_profile = $subscription->driver?->profile_image_id ?? 'N/A';
            $subscription->plan_name = $subscription->plan ? $subscription->plan->name : 'N/A';
            $subscription->status = $subscription->is_active ? 'Active' : 'Inactive';
            $subscription->total = $defaultCurrency . number_format($subscription->total, 2);
            $subscription->date = formatDateBySetting($subscription->created_at);
        });

        $baseQuery = $this->driverSubscription->newQuery();

        $tableConfig = [
            'columns' => [
                ['title' => 'Driver', 'field' => 'driver_name', 'route' => 'admin.driver.show', 'email' => 'driver_email', 'profile_image' => 'driver_profile', 'sortable' => true, 'profile_id' => 'driver_id', 'sortField' => 'driver.name'],
                ['title' => 'Plan', 'field' => 'plan_name', 'sortable' => true, 'sortField' => 'plan.name'],
                ['title' => 'Total', 'field' => 'total', 'sortable' => true, 'sortField' => 'total'],
                ['title' => 'Start Date', 'field' => 'start_date', 'sortable' => true, 'sortField' => 'start_date'],
                ['title' => 'Expire Date', 'field' => 'end_date', 'sortable' => true, 'sortField' => 'end_date'],
                ['title' => 'Is Active', 'field' => 'is_active', 'type' => 'status', 'sortable' => true, 'sortField' => 'is_active'],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $subscriptions,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.driver-subscription.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'subscription.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.driver-subscription.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'subscription.destroy'],
                ['title' => 'Restore', 'route' => 'admin.driver-subscription.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'subscription.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.driver-subscription.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'subscription.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => (clone $baseQuery)->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => (clone $baseQuery)->where('is_active', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => (clone $baseQuery)->where('is_active', false)->count()],
            ],
            'bulkactions' => [
                ['title' => 'Move to Trash', 'permission' => 'subscription.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
            ],
            'total' => (clone $baseQuery)->count(),
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
        }
    }

    public function activeHandler(): void
    {
        $this->driverSubscription->whereIn('id', $this->request->ids)->update(['is_active' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->driverSubscription->whereIn('id', $this->request->ids)->update(['is_active' => false]);
    }

    public function trashedHandler(): void
    {
        $this->driverSubscription->whereIn('id', $this->request->ids)->delete();
    }
}