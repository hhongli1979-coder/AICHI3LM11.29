<?php

namespace Modules\Taxido\Tables;

use App\Models\Currency;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Ride;

use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Enums\ServicesEnum;

class RideTable
{
    protected $ride;
    protected $request;

    protected $sortableColumns = [
        'total',
        'rider.name',
        'created_at',
        'ride_number',
        'driver.name',
        'ride_status',
        'service.name',
        'payment_status',
        'service_category.name',
    ];

    public function __construct(Request $request)
    {
        $this->ride = Ride::query();
        $this->request = $request;
    }

    public function getRides($applyRoleFilter = true)
    {
        $rides = $this->ride->newQuery();
        $roleName = getCurrentRoleName();

        if ($applyRoleFilter) {
            if ($roleName === RoleEnum::DRIVER) {
                $rides->where('rides.driver_id', getCurrentUserId());
            } elseif ($roleName === RoleEnum::FLEET_MANAGER) {
                $fleetManagerId = getCurrentUserId();
                $rides->whereHas('driver', fn($q) => $q->where('fleet_manager_id', $fleetManagerId));
            } elseif ($roleName === RoleEnum::DISPATCHER) {
                $rides->whereHas('zones', fn($q) =>
                    $q->whereHas('dispatchers', fn($q2) =>
                        $q2->where('dispatcher_id', getCurrentUserId())
                    )
                );
            }
        }

        return $rides;
    }

    public function getData()
    {
        $rides = $this->getRides();

        $rides->whereNull('rides.deleted_at');

        if ($this->request?->status) {
            $rides->where('rides.ride_status_id', getRideStatusIdByName($this->request->status));
        }

        if ($this->request->has('filter') && $this->request->get('filter') !== 'all') {
            $rides->where('rides.service_id', getServiceIdBySlug($this->request->filter));
        }

        if ($this->request->has('s')) {
            $search = $this->request->s;

            $rides->withTrashed()
                ->leftJoin('users as rider_users', 'rides.rider_id', '=', 'rider_users.id')
                ->leftJoin('users as driver_users', 'rides.driver_id', '=', 'driver_users.id')
                ->leftJoin('services', 'rides.service_id', '=', 'services.id')
                ->leftJoin('service_categories', 'rides.service_category_id', '=', 'service_categories.id')
                ->select('rides.*')
                ->where(function ($q) use ($search) {
                    $q->where('rides.ride_number', 'LIKE', "%{$search}%")
                      ->orWhere('rides.total', 'LIKE', "%{$search}%")
                      ->orWhere('rider_users.name', 'LIKE', "%{$search}%")
                      ->orWhere('driver_users.name', 'LIKE', "%{$search}%")
                      ->orWhere('services.name', 'LIKE', "%{$search}%")
                      ->orWhere('service_categories.name', 'LIKE', "%{$search}%");
                });
        }

        $rides = $this->sorting($rides);
        return $rides->latest()->paginate($this->request->paginate ?? 15);
    }

    public function getRideCountByStatus($status)
    {
        return $this->getRides()
            ->where('rides.ride_status_id', getRideStatusIdByName($status))
            ->whereNull('rides.deleted_at')
            ->count();
    }

    public function generate()
    {
        $rides = $this->getData();

        $currencyCode   = session('currency', getDefaultCurrencyCode());
        $currencySymbol = Currency::where('code', $currencyCode)->value('symbol') ?? getDefaultCurrencySymbol();

        $rides->each(function ($ride) use ($currencySymbol, $currencyCode) {
            $convertedTotal         = currencyConvert($currencyCode, $ride->total);
            $ride->formatted_total  = ($ride->currency_symbol ?? $currencySymbol) . ((float) $convertedTotal);
            $ride->date             = formatDateBySetting($ride->created_at);
            $ride->rider_name       = $ride->rider['name'] ?? null;
            $ride->rider_email      = isDemoModeEnabled() ? __('taxido::static.demo_mode') : ($ride->rider['email'] ?? null);
            $ride->rider_profile    = $ride->rider['profile_image_id'] ?? null;
            $ride->driver_name      = $ride->driver?->name ?? 'N/A';
            $ride->driver_email     = isDemoModeEnabled() ? __('taxido::static.demo_mode') : ($ride->driver?->email ?? null);
            $ride->driver_profile   = $ride->driver?->profile_image_id ?? 'N/A';
            $ride->service          = $ride->service?->name;
            $ride->ride_numb        = "#{$ride->ride_number}";
            $ride->service_category = $ride->service_category?->name ?? 'N/A';
            $ride->status           = ucfirst($ride?->ride_status_activities()?->latest()->first()?->status ?? $ride?->ride_status?->name);
            $ride->payment_status   = ucfirst($ride->payment_status);
            $ride->payment_method   = ucfirst($ride->payment_method);
        });

        $baseQuery = $this->getRides()->whereNull('rides.deleted_at');

        $tableConfig = [
            'columns'       => [
                ['title' => 'Ride Number', 'field' => 'ride_numb', 'sortable' => true, 'sortField' => 'ride_number', 'type' => 'badge', 'badge_type' => 'light'],
                ['title' => 'Rider', 'field' => 'rider_name', 'route' => 'admin.rider.show', 'email' => 'rider_email', 'profile_image' => 'rider_profile', 'sortable' => true, 'profile_id' => 'rider_id', 'sortField' => 'rider.name'],
                ['title' => 'Driver', 'field' => 'driver_name', 'route' => 'admin.driver.show', 'email' => 'driver_email', 'profile_image' => 'driver_profile', 'sortable' => true, 'profile_id' => 'driver_id', 'sortField' => 'driver.name'],
                ['title' => 'Service', 'field' => 'service', 'sortable' => true, 'sortField' => 'service.name'],
                ['title' => 'Service Category', 'field' => 'service_category', 'sortable' => true, 'sortField' => 'service_category.name'],
                ['title' => 'Payment Status', 'field' => 'payment_status', 'sortable' => true, 'type' => 'badge', 'colorClasses' => getPaymentStatusColorClasses()],
                ['title' => 'Ride Status', 'field' => 'status', 'sortable' => true, 'type' => 'badge', 'colorClasses' => getRideStatusColorClasses()],
                ['title' => 'Total', 'field' => 'formatted_total', 'sortable' => true, 'sortField' => 'total'],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
                ['title' => 'Action', 'type' => 'action', 'permission' => ['ride.index'], 'sortable' => false],
            ],
            'data'          => $rides,
            'actions'       => [],
            'filters'       => [
                ['title' => 'All', 'slug' => 'all', 'count' => (clone $baseQuery)->count()],
                ['title' => ucfirst(ServicesEnum::CAB), 'slug' => ServicesEnum::CAB, 'count' => (clone $baseQuery)->where('rides.service_id', getServiceIdBySlug(ServicesEnum::CAB))->count()],
                ['title' => ucfirst(ServicesEnum::PARCEL), 'slug' => ServicesEnum::PARCEL, 'count' => (clone $baseQuery)->where('rides.service_id', getServiceIdBySlug(ServicesEnum::PARCEL))->count()],
                ['title' => ucfirst(ServicesEnum::FREIGHT), 'slug' => ServicesEnum::FREIGHT, 'count' => (clone $baseQuery)->where('rides.service_id', getServiceIdBySlug(ServicesEnum::FREIGHT))->count()],
                ['title' => ucfirst(ServicesEnum::AMBULANCE), 'slug' => ServicesEnum::AMBULANCE, 'count' => (clone $baseQuery)->where('rides.service_id', getServiceIdBySlug(ServicesEnum::AMBULANCE))->count()],
            ],
            'bulkactions'   => [
                ['whenFilter' => ['all']],
            ],
            'actionButtons' => [
                ['icon' => 'ri-eye-line', 'permission' => 'ride.index', 'role' => 'admin', 'route' => 'admin.ride.details', 'field' => 'id', 'class' => 'dark-icon-box', 'tooltip' => 'Ride details'],
            ],
            'total'         => $rides->total(),
        ];

        return $tableConfig;
    }

    protected function sorting($rides)
    {
        if (!$this->request->has('orderby') || !$this->request->has('order')) {
            return $rides->orderBy('rides.created_at', 'desc');
        }

        $orderby = $this->request->get('orderby');
        $order   = strtolower($this->request->get('order')) === 'asc' ? 'asc' : 'desc';

        if (!in_array($orderby, $this->sortableColumns)) {
            return $rides->orderBy('rides.created_at', 'desc');
        }

        if (str_contains($orderby, '.')) {
            [$relation, $column] = explode('.', $orderby);

            switch ($relation) {
                case 'rider':
                    return $rides->leftJoin('users as rider_users', 'rides.rider_id', '=', 'rider_users.id')
                                 ->select('rides.*')
                                 ->orderBy("rider_users.$column", $order);
                case 'driver':
                    return $rides->leftJoin('users as driver_users', 'rides.driver_id', '=', 'driver_users.id')
                                 ->select('rides.*')
                                 ->orderBy("driver_users.$column", $order);
                case 'service':
                    return $rides->leftJoin('services', 'rides.service_id', '=', 'services.id')
                                 ->select('rides.*')
                                 ->orderBy("services.$column", $order);
                case 'service_category':
                    return $rides->leftJoin('service_categories', 'rides.service_category_id', '=', 'service_categories.id')
                                 ->select('rides.*')
                                 ->orderBy("service_categories.$column", $order);

            }
        }

        return $rides->orderBy("rides.$orderby", $order);
    }
}
