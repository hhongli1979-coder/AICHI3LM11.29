<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\FleetWalletHistory;

class FleetWalletTable
{
    protected $history;
    protected $request;

    public function __construct(Request $request)
    {
        $this->history = new FleetWalletHistory();
        $this->request = $request;
    }

    public function getData()
    {
        if (request()->has('fleet_manager_id') || getCurrentRoleName() == RoleEnum::FLEET_MANAGER) {
            $fleet_manager_id = request()->fleet_manager_id ?? getCurrentUserId();
            $fleet_wallet_id = getFleetWalletId($fleet_manager_id);
            $histories = $this->history->where('fleet_wallet_id', $fleet_wallet_id);

            if (request()->has('s')) {
                $searchTerm = request()->s;
                return $histories->withTrashed()
                    ->where(function ($query) use ($searchTerm) {
                        $query->where('type', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('amount', 'LIKE', "%{$searchTerm}%")
                              ->orWhere('detail', 'LIKE', "%{$searchTerm}%");
                    })
                    ->paginate($this->request?->paginate ?? 15)
                    ->appends(['fleet_manager_id' => $fleet_manager_id, 's' => $searchTerm]);
            }

            if ($this->request->has('orderby') && $this->request->has('order')) {
                $orderby = $this->request->orderby;
                $order = $this->request->order;
                return $histories->orderBy($orderby, $order)
                    ->paginate($this->request?->paginate ?? 15)
                    ->appends(['fleet_manager_id' => $fleet_manager_id]);
            }

            return $histories->whereNull('deleted_at')
                ->latest()
                ->paginate($this->request?->paginate ?? 15)
                ->appends(['fleet_manager_id' => $fleet_manager_id]);
        }

        return [];
    }

    public function applySorting($histories)
    {
        $orderby = $this->request->orderby;
        $order = $this->request->order;
        return $histories->orderBy($orderby, $order);
    }

    public function generate()
    {
        $histories = $this->getData();

        if (!empty($histories)) {
            $histories->each(function ($item) {
                $item->formatted_amount = formatCurrency($item->amount);
                $item->type = ucfirst($item->type);
            });
        }

        $tableConfig = [
            'columns' => [
                ['title' => 'Amount', 'field' => 'formatted_amount', 'imageField' => null, 'sortable' => true, 'sortField' =>  'amount'],
                ['title' => 'Type', 'field' => 'type', 'type' => 'badge', 'colorClasses' => ['Credit' => 'primary', 'Debit' => 'danger'], 'imageField' => null, 'sortable' => true],
                ['title' => 'Remark', 'field' => 'detail', 'imageField' => null, 'sortable' => true, 'sortField' =>  'detail'],
                ['title' => 'Created At', 'field' => 'created_at', 'sortable' => true],
            ],
            'data' => $histories,
            'total' => $this->history->count()
        ];

        return $tableConfig;
    }
}
