<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\Ambulance;

class AmbulanceTable
{
    protected $ambulance;
    protected $request;

    protected $sortableColumns = [
        'driver.name',
        'created_at',
        'name',
    ];

    public function __construct(Request $request)
    {
        $this->ambulance = Ambulance::query();
        $this->request   = $request;
    }

    public function getAmbulances()
    {
        $ambulances = $this->ambulance->with(['driver'])
            ->whereNotNull('ambulances.name')
            ->where('ambulances.name', '!=', '');

        $currentUserRole = getCurrentRoleName();
        $currentUserId   = getCurrentUserId();

        if ($currentUserRole == RoleEnum::DRIVER) {
            return $ambulances->where('driver_id', $currentUserId);
        }

        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            return $ambulances->whereHas('driver', function ($q) use ($currentUserId) {
                $q->where('fleet_manager_id', $currentUserId)
                  ->whereNull('deleted_at');
            });
        }

        return $ambulances;
    }

    public function getData()
    {
        $ambulances = $this->getAmbulances();

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'all':
                    $ambulances = $ambulances->whereNull('ambulances.deleted_at');
                    break;
            }
        } else {
            $ambulances = $ambulances->whereNull('ambulances.deleted_at');
        }

        if ($this->request->filled('s')) {
            $searchTerm = $this->request->s;
            $ambulances = $ambulances->with(['driver'])
                ->leftJoin('users as driver_users', function ($join) {
                    $join->on('ambulances.driver_id', '=', 'driver_users.id')
                         ->whereNull('driver_users.deleted_at');
                })
                ->select('ambulances.*')
                ->where(function ($query) use ($searchTerm) {
                    $query->where('ambulances.name', 'LIKE', "%$searchTerm%")
                          ->orWhere('ambulances.description', 'LIKE', "%$searchTerm%")
                          ->orWhere('driver_users.name', 'LIKE', "%$searchTerm%");
                });
        }

        $ambulances = $this->sorting($ambulances);

        return $ambulances->paginate($this->request?->paginate ?? 15);
    }

    public function generate()
    {
        $ambulances = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
            $ambulances = $this->getData();
        }

        $ambulances->each(function ($ambulance) {
            $ambulance->driver_name    = $ambulance?->driver?->name ?? 'N/A';
            $ambulance->driver_email   = isDemoModeEnabled() ? __('taxido::static.demo_mode') : ($ambulance?->driver?->email ?? null);
            $ambulance->driver_profile = $ambulance?->driver?->profile_image_id ?? null;
            $ambulance->date           = formatDateBySetting($ambulance->created_at);
        });

        return [
            'columns' => [
                ['title' => 'Name', 'field' => 'name', 'sortable' => true, 'action' => true],
                ['title' => 'Driver', 'field' => 'driver_name', 'email' => 'driver_email', 'profile_image' => 'driver_profile', 'sortable' => true, 'sortField' => 'driver.name', 'route' => 'admin.driver.show', 'profile_id' => 'driver_id'],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $ambulances,
            'actions' => [
                ['title' => 'Edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all'], 'permission' => 'driver.edit'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->getAmbulances()->whereNull('ambulances.deleted_at')->count()],
            ],
            'bulkactions' => [
                ['title' => 'Move to Trash', 'action' => 'trash', 'permission' => 'ambulance.destroy', 'whenFilter' => ['all']],
            ],
            'total' => $ambulances->total(),
        ];
    }

    public function bulkActionHandler()
    {
        if ($this->request->action === 'trash') {
            $this->trashHandler();
        }
    }

    public function trashHandler(): void
    {
        $this->ambulance->whereIn('id', $this->request->ids)->delete();
    }

    protected function sorting($ambulances)
    {
        $orderby = $this->request->get('orderby', 'created_at');
        $order   = strtolower($this->request->get('order', 'desc')) === 'asc' ? 'asc' : 'desc';

        if (!in_array($orderby, $this->sortableColumns)) {
            return $ambulances->orderBy('ambulances.created_at', 'desc');
        }

        if (str_contains($orderby, '.')) {
            [$relation, $column] = explode('.', $orderby);

            switch ($relation) {
                case 'driver':
                    return $ambulances->leftJoin('users as driver_users', function ($join) {
                        $join->on('ambulances.driver_id', '=', 'driver_users.id')
                             ->whereNull('driver_users.deleted_at');
                    })->select('ambulances.*')
                      ->orderBy("driver_users.$column", $order);
            }
        }

        return $ambulances->orderBy("ambulances.$orderby", $order);
    }
}