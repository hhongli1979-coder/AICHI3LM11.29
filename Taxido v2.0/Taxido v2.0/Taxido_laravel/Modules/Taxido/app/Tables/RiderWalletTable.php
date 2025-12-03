<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\RiderWalletHistory;

class RiderWalletTable
{
    protected $history;
    protected $request;

    public function __construct(Request $request)
    {
        $this->history = new RiderWalletHistory();
        $this->request = $request;
    }

    public function getData()
    {
        if (request()->has('rider_id') || getCurrentRoleName() == RoleEnum::RIDER) {
            $rider_id  = request()->rider_id ?? getCurrentUserId();
            $rider_wallet_id = getRiderWalletId($rider_id);
            $histories = $this->history->where('rider_wallet_id', $rider_wallet_id);

            if (request()->has('s')) {
                $searchTerm = request()->s;
                return $histories->where(function ($query) use ($searchTerm) {
                        $query->where('type', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('amount', 'LIKE', "%{$searchTerm}%")
                            ->orWhere('detail', 'LIKE', "%{$searchTerm}%");
                    })
                    ->paginate($this->request?->paginate ?? 15)
                    ->appends(['rider_id' => $rider_id, 's' => $searchTerm]);
            }

            if ($this->request->has('orderby') && $this->request->has('order')) {
                $orderby = $this->request->orderby;
                $order   = $this->request->order;
                return $histories->orderBy($orderby, $order)
                    ->paginate($this->request?->paginate ?? 15)
                    ->appends(['rider_id' => $rider_id]);
            }

            return $histories->whereNull('deleted_at')
                ->latest()
                ->paginate($this->request?->paginate ?? 15)
                ->appends(['rider_id' => $rider_id]);
        }

        return [];
    }

    public function generate()
    {
        $histories  = $this->getData();
        $defaultCurrency = getDefaultCurrency()?->symbol;

        if (! empty($histories)) {
            $histories->each(function ($item) {
                $item->type  = ucfirst($item->type);
                $item->formatted_amount = formatCurrency($item->amount);
                // Use simplified transaction description for two core bonus types
                $item->detail = $item->getFormattedDescription();
            });
        }

        $tableConfig = [
            'columns' => [
                ['title' => 'Amount', 'field' => 'formatted_amount', 'imageField' => null, 'sortable' => true, 'sortField' => 'amount'],
                ['title' => 'Type', 'field' => 'type', 'type' => 'badge', 'colorClasses' => ['Credit' => 'primary', 'Debit' => 'danger'], 'imageField' => null, 'sortable' => true],
                ['title' => 'Remark', 'field' => 'detail', 'imageField' => null, 'sortable' => true, 'sortField' => 'detail'],
                ['title' => 'Created At', 'field' => 'created_at', 'sortable' => true],
            ],
            'data'  => $histories,
            'total'=> $this->history->count(),
        ];

        return $tableConfig;
    }
}
