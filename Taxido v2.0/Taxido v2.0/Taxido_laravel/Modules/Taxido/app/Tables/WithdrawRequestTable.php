<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Enums\RequestEnum;
use Modules\Taxido\Models\WithdrawRequest;

class WithdrawRequestTable
{
    protected $request;
    protected $withdrawRequest;

    public function __construct(Request $request)
    {
        $this->withdrawRequest = new WithdrawRequest();
        $this->request         = $request;
    }

    public function getData()
    {
        // Always start fresh
        $withdrawRequests = WithdrawRequest::query();

        // If current user is a driver, filter by driver ID
        if (getCurrentRoleName() == RoleEnum::DRIVER) {
            $driverId = getCurrentDriver()?->id;
            $withdrawRequests = $withdrawRequests->where('driver_id', $driverId);
        }

        // Apply filter
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'pending':
                    $withdrawRequests = $withdrawRequests->whereNull('deleted_at')->where('status', RequestEnum::PENDING);
                    break;
                case 'approved':
                    $withdrawRequests = $withdrawRequests->whereNull('deleted_at')->where('status', RequestEnum::APPROVED);
                    break;
                case 'rejected':
                    $withdrawRequests = $withdrawRequests->whereNull('deleted_at')->where('status', RequestEnum::REJECTED);
                    break;
                case 'trash':
                    $withdrawRequests = WithdrawRequest::withTrashed()->whereNotNull('deleted_at');
                    if (getCurrentRoleName() === RoleEnum::DRIVER) {
                        $withdrawRequests = $withdrawRequests->where('driver_id', getCurrentDriver()?->id);
                    }
                    break;
                case 'all':
                default:
                    $withdrawRequests = $withdrawRequests->whereNull('deleted_at');
            }
        } else {
            $withdrawRequests = $withdrawRequests->whereNull('deleted_at');
        }

        // Handle search
        if ($this->request->has('s')) {
            $search = $this->request->s;
            $withdrawRequests = $withdrawRequests->where(function ($query) use ($search) {
                $query->where('amount', 'LIKE', "%{$search}%")
                    ->orWhere('message', 'LIKE', "%{$search}%")
                    ->orWhere('status', 'LIKE', "%{$search}%")
                    ->orWhereHas('driver', function ($driverQuery) use ($search) {
                        $driverQuery->where('name', 'LIKE', "%{$search}%")
                                    ->orWhere('email', 'LIKE', "%{$search}%");
                    });
            });
        }

        // Handle export
        if ($this->request->export) {
            return $withdrawRequests->latest()->get();
        }

        // Default paginated result
        return $withdrawRequests->orderBy('created_at', 'desc')->paginate($this->request->paginate);
    }

    public function generate()
    {
        $withdrawRequests = $this->getData();
        $defaultCurrency  = getDefaultCurrency()->symbol;

        if (!empty($withdrawRequests)) {
            $withdrawRequests->each(function ($item) use ($defaultCurrency) {
                $item->driver_name      = $item->driver->name ?? null;
                $item->status           = ucfirst($item->status);
                $item->driver_email     = isDemoModeEnabled() ? __('static.demo_mode') : ($item->driver->email ?? null);
                $item->driver_profile   = $item->driver->profile_image_id ?? null;
                $item->formatted_amount = $defaultCurrency . number_format($item->amount, 2);
                $item->date = formatDateBySetting($item->created_at);
            });
        }

        $tableConfig = [
            'columns' => [
                [
                    'title'         => 'Driver',
                    'field'         => 'driver_name',
                    'email'         => 'driver_email',
                    'profile_image' => 'driver_profile',
                    'sortable'      => true,
                ],
                ['title' => 'Amount', 'field' => 'formatted_amount', 'sortable' => true],
                [
                    'title'        => 'Status',
                    'field'        => 'status',
                    'type'         => 'badge',
                    'colorClasses' => [
                        'Pending'  => 'warning',
                        'Approved' => 'primary',
                        'Rejected' => 'danger',
                    ],
                    'sortable' => true,
                ],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true],
                [
                    'title'      => 'Action',
                    'type'       => 'action',
                    'permission' => ['withdraw_request.edit'],
                    'sortable'   => false,
                ],
            ],
            'data' => $withdrawRequests,
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->getFilterCount('all')],
                ['title' => 'Pending', 'slug' => 'pending', 'count' => $this->getFilterCount('pending')],
                ['title' => 'Approved', 'slug' => 'approved', 'count' => $this->getFilterCount('approved')],
                ['title' => 'Rejected', 'slug' => 'rejected', 'count' => $this->getFilterCount('rejected')],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->getFilterCount('trash')],
            ],
            'bulkactions' => [['title' => 'Active']],
            'viewActionBox' => [
                'view'  => 'taxido::admin.withdraw-request.show',
                'field' => 'withdrawRequest',
                'type'  => 'action',
            ],
            'total' => $this->withdrawRequest->count(),
        ];

        return $tableConfig;
    }

    public function getFilterCount($filter)
    {
        $withdrawRequests = WithdrawRequest::query();

        if (getCurrentRoleName() === RoleEnum::DRIVER) {
            $withdrawRequests = $withdrawRequests->where('driver_id', getCurrentDriver()?->id);
        }

        switch ($filter) {
            case 'pending':
                return $withdrawRequests->whereNull('deleted_at')->where('status', RequestEnum::PENDING)->count();
            case 'approved':
                return $withdrawRequests->whereNull('deleted_at')->where('status', RequestEnum::APPROVED)->count();
            case 'rejected':
                return $withdrawRequests->whereNull('deleted_at')->where('status', RequestEnum::REJECTED)->count();
            case 'trash':
                $trashQuery = WithdrawRequest::withTrashed()->whereNotNull('deleted_at');
                if (getCurrentRoleName() === RoleEnum::DRIVER) {
                    $trashQuery = $trashQuery->where('driver_id', getCurrentDriver()?->id);
                }
                return $trashQuery->count();
            case 'all':
            default:
                return $withdrawRequests->whereNull('deleted_at')->count();
        }
    }
}
