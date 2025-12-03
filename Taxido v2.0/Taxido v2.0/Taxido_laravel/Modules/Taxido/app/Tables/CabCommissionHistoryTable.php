<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Driver;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\CabCommissionHistory;

class CabCommissionHistoryTable
{
    protected $commissionHistory;
    protected $request;

    protected $sortableColumns = [
        'ride.ride_number',
        'driver.name',
        'admin_commission',
        'driver_commission',
        'fleet_commission',
        'created_at',
    ];

    public function __construct(Request $request)
    {
        $this->commissionHistory = CabCommissionHistory::query();
        $this->request = $request;
    }

    public function getData()
    {
        $commissionHistory = $this->applyFilters();
        $commissionHistory = $this->applySearch($commissionHistory);
        $commissionHistory = $this->applySorting($commissionHistory);

        return $commissionHistory->paginate($this->request->paginate ?? 15);
    }

    protected function applyFilters()
    {
        $commissionHistory = $this->commissionHistory->newQuery();
        $currentUserRole = getCurrentRoleName();
        $currentUserId = getCurrentUserId();

        if ($currentUserRole == RoleEnum::DRIVER) {
            $driverId = getCurrentDriver()?->id;
            $commissionHistory = $commissionHistory->where('driver_id', $driverId);
        }

        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            $driverIds = Driver::where('fleet_manager_id', $currentUserId)->pluck('id')->toArray();
            $commissionHistory = $commissionHistory->whereIn('driver_id', $driverIds);
        }

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $commissionHistory = $commissionHistory->whereNull('cab_commission_histories.deleted_at');
                    break;
                default:
                    $commissionHistory = $commissionHistory->whereNull('cab_commission_histories.deleted_at');
                    break;
            }
        } else {
            $commissionHistory = $commissionHistory->whereNull('cab_commission_histories.deleted_at');
        }

        return $commissionHistory;
    }

    protected function applySearch($commissionHistory)
    {
        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $commissionHistory = $commissionHistory->with(['ride', 'driver'])
                ->leftJoin('rides', function ($join) {
                    $join->on('cab_commission_histories.ride_id', '=', 'rides.id')
                         ->whereNull('rides.deleted_at');
                })
                ->leftJoin('users as driver_users', function ($join) {
                    $join->on('cab_commission_histories.driver_id', '=', 'driver_users.id')
                         ->whereNull('driver_users.deleted_at');
                })
                ->select('cab_commission_histories.*')
                ->where(function ($query) use ($searchTerm) {
                    $query->where('cab_commission_histories.ride_id', 'LIKE', "%$searchTerm%")
                        ->orWhere('cab_commission_histories.admin_commission', 'LIKE', "%$searchTerm%")
                        ->orWhere('cab_commission_histories.driver_commission', 'LIKE', "%$searchTerm%")
                        ->orWhere('cab_commission_histories.fleet_commission', 'LIKE', "%$searchTerm%")
                        ->orWhere('rides.ride_number', 'LIKE', "%$searchTerm%")
                        ->orWhere('driver_users.name', 'LIKE', "%$searchTerm%")
                        ->orWhere('driver_users.email', 'LIKE', "%$searchTerm%");
                });
        }

        return $commissionHistory;
    }

    protected function applySorting($commissionHistory)
    {
        if ($this->request->has('orderby') && $this->request->has('order')) {
            $orderby = $this->request->orderby;
            $order = strtolower($this->request->order) === 'asc' ? 'asc' : 'desc';

            if ($this->isSortable($orderby)) {
                if (str_contains($orderby, '.')) {
                    $parts = explode('.', $orderby);
                    $relation = $parts[0];
                    $column = $parts[1];

                    switch ($relation) {
                        case 'ride':
                            $commissionHistory = $commissionHistory->leftJoin('rides', function ($join) {
                                $join->on('cab_commission_histories.ride_id', '=', 'rides.id')
                                     ->whereNull('rides.deleted_at');
                            })->select('cab_commission_histories.*', 'rides.ride_number as ride_number')
                              ->orderBy("rides.$column", $order);
                            break;

                        case 'driver':
                            $commissionHistory = $commissionHistory->leftJoin('users as driver_users', function ($join) {
                                $join->on('cab_commission_histories.driver_id', '=', 'driver_users.id')
                                     ->whereNull('driver_users.deleted_at');
                            })->select('cab_commission_histories.*', 'driver_users.name as driver_name')
                              ->orderBy("driver_users.$column", $order);
                            break;
                    }
                } else {
                    $commissionHistory = $commissionHistory->orderBy("cab_commission_histories.$orderby", $order);
                }
            }
        }

        return $commissionHistory->orderBy('cab_commission_histories.created_at', 'desc');
    }

    protected function isSortable($column)
    {
        return in_array($column, $this->sortableColumns);
    }

    public function generate()
    {
        $commissionHistories = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
            $commissionHistories = $this->getData();
        }

        $defaultCurrency = getDefaultCurrency()->symbol;

        $commissionHistories->each(function ($commissionHistory) use ($defaultCurrency) {
            $commissionHistory->ride_numb = "#" . ($commissionHistory->ride->ride_number ?? 'N/A');
            $commissionHistory->driver_name = $commissionHistory->driver->name ?? null;
            $commissionHistory->driver_email = $commissionHistory->driver->email ?? null;
            $commissionHistory->driver_profile = $commissionHistory->driver->profile_image_id ?? null;
            $commissionHistory->date = formatDateBySetting($commissionHistory->created_at);
            $commissionHistory->formatted_admin_commission = $defaultCurrency . number_format($commissionHistory->admin_commission, 2);
            $commissionHistory->formatted_driver_commission = $defaultCurrency . number_format($commissionHistory->driver_commission, 2);
            $commissionHistory->formatted_fleet_commission = $defaultCurrency . number_format($commissionHistory->fleet_commission, 2);
            $commissionHistory->currency_symbol = $defaultCurrency;
        });

        // Base query for counts with role-based filtering
        $baseQuery = $this->commissionHistory->newQuery();
        $currentUserRole = getCurrentRoleName();
        $currentUserId = getCurrentUserId();

        if ($currentUserRole == RoleEnum::DRIVER) {
            $driverId = getCurrentDriver()?->id;
            $baseQuery = $baseQuery->where('driver_id', $driverId);
        }

        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            $driverIds = Driver::where('fleet_manager_id', $currentUserId)->pluck('id')->toArray();
            $baseQuery = $baseQuery->whereIn('driver_id', $driverIds);
        }

        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $baseQuery = $baseQuery->with(['ride', 'driver'])
                ->leftJoin('rides', function ($join) {
                    $join->on('cab_commission_histories.ride_id', '=', 'rides.id')
                         ->whereNull('rides.deleted_at');
                })
                ->leftJoin('users as driver_users', function ($join) {
                    $join->on('cab_commission_histories.driver_id', '=', 'driver_users.id')
                         ->whereNull('driver_users.deleted_at');
                })
                ->select('cab_commission_histories.*')
                ->where(function ($query) use ($searchTerm) {
                    $query->where('cab_commission_histories.ride_id', 'LIKE', "%$searchTerm%")
                        ->orWhere('cab_commission_histories.admin_commission', 'LIKE', "%$searchTerm%")
                        ->orWhere('cab_commission_histories.driver_commission', 'LIKE', "%$searchTerm%")
                        ->orWhere('cab_commission_histories.fleet_commission', 'LIKE', "%$searchTerm%")
                        ->orWhere('rides.ride_number', 'LIKE', "%$searchTerm%")
                        ->orWhere('driver_users.name', 'LIKE', "%$searchTerm%")
                        ->orWhere('driver_users.email', 'LIKE', "%$searchTerm%");
                });
        }

        $tableConfig = [
            'columns' => [
                ['title' => 'Ride Number', 'field' => 'ride_numb', 'sortable' => true, 'sortField' => 'ride.ride_number', 'type' => 'badge', 'badge_type' => 'light'],
                ['title' => 'Driver', 'field' => 'driver_name', 'email' => 'driver_email', 'profile_image' => 'driver_profile', 'sortable' => true, 'sortField' => 'driver.name', 'route' => 'admin.driver.show', 'profile_id' => 'driver_id'],
                ['title' => 'Admin Commission', 'field' => 'formatted_admin_commission', 'sortable' => true, 'sortField' => 'admin_commission'],
                ['title' => 'Driver Commission', 'field' => 'formatted_driver_commission', 'sortable' => true, 'sortField' => 'driver_commission'],
                ['title' => 'Fleet Commission', 'field' => 'formatted_fleet_commission', 'sortable' => true, 'sortField' => 'fleet_commission'],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $commissionHistories,
            'actions' => [],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => (clone $baseQuery)->whereNull('cab_commission_histories.deleted_at')->count()],
            ],
            'bulkactions' => [],
            'total' => $commissionHistories->total(),
        ];

        return $tableConfig;
    }

    public function bulkActionHandler()
    {
        switch ($this->request->action) {
            case 'trashed':
                $this->trashedHandler();
                break;
        }
    }

    public function trashedHandler(): void
    {
        $this->commissionHistory->whereIn('id', $this->request->ids)->delete();
    }
}