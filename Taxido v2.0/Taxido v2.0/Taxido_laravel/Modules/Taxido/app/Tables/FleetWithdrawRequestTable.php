<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\FleetWithdrawRequest;

class FleetWithdrawRequestTable
{
    protected $request;
    protected $fleetWithdrawRequest;

    public function __construct(Request $request)
    {
        $this->fleetWithdrawRequest = new FleetWithdrawRequest();
        $this->request = $request;
    }

    public function getData()
    {
        $fleetWithdrawRequests = $this->fleetWithdrawRequest;

        if (getCurrentRoleName() == RoleEnum::FLEET_MANAGER) {
            $fleetManagerId = getCurrentFleetManager()?->id;
            $fleetWithdrawRequests = $fleetWithdrawRequests->where('fleet_manager_id', $fleetManagerId);
        }
        return $fleetWithdrawRequests->whereNull('deleted_at')->orderBy('created_at', 'desc')->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $fleetWithdrawRequests = $this->getData();
        $defaultCurrency = getDefaultCurrency()->symbol;

        if (!empty($fleetWithdrawRequests)) {
            $fleetWithdrawRequests?->each(function ($item) use ($defaultCurrency) {
                $item->fleet_manager_name = $item?->fleet->name ?? null;
                $item->status = ucfirst($item->status);
                $item->fleet_manager_email = $item?->fleet?->email;
                $item->fleet_manager_profile = $item?->fleet?->profile_image_id ?? null;
                $item->formatted_amount = $defaultCurrency . number_format($item->amount, 2);
            });
        }

        $tableConfig = [
            'columns' => [
                ['title' => 'Fleet Manager', 'field' => 'fleet_manager_name', 'email' => 'fleet_manager_email', 'profile_image' => 'fleet_manager_profile', 'sortable' => true],
                ['title' => 'Amount', 'field' => 'formatted_amount', 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'type' => 'badge', 'colorClasses' => ['Pending' => 'warning', 'Approved' => 'primary', 'Rejected' => 'danger'], 'sortable' => true],
                ['title' => 'Created At', 'field' => 'created_at', 'sortable' => true],
                ['title' => 'Action', 'type' => 'action', 'permission' => ['fleet_withdraw_request.action'], 'sortable' => false],
            ],
            'data' => $fleetWithdrawRequests,
            'actions' => [[]],
            'bulkactions' => ['title'],
            'viewActionBox' => ['view' => 'taxido::admin.fleet-withdraw-request.show', 'field' => 'fleetWithdrawRequest', 'type' => 'action'],
            'total' => $this->fleetWithdrawRequest->count()
        ];

        return $tableConfig;
    }
}