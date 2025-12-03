<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\Driver;
use Modules\Taxido\Models\DriverWalletHistory;

class DriverWalletTable
{
    protected $history;
    protected $request;

    public function __construct(Request $request)
    {
        $this->history = new DriverWalletHistory();
        $this->request = $request;
    }

    public function getData()
    {
        if (request()->has('driver_id') || getCurrentRoleName() == RoleEnum::DRIVER) {
            $driver_id  = request()->driver_id ?? getCurrentUserId();
            $driver_wallet_id = getDriverWalletId($driver_id);
            $histories  = $this->history->where('driver_wallet_id', $driver_wallet_id);

            if (request()->has('s')) {
                return $histories
                    ->where('type', 'LIKE', "%" . request()->s . "%")
                    ->orWhere('amount', 'LIKE', "%" . request()->s . "%")
                    ->orWhere('detail', 'LIKE', "%" . request()->s . "%")
                    ->where('driver_wallet_id', $driver_wallet_id)
                    ->paginate($this->request?->paginate)
                    ->appends(['driver_id' => $driver_id, 's' => request()->s]);
            }

            if ($this->request->has('orderby') && $this->request->has('order')) {
                $orderby = $this->request->orderby;
                $order   = $this->request->order;
                return $histories->orderBy($orderby, $order)
                    ->paginate($this->request?->paginate)
                    ->appends(['driver_id' => $driver_id]);
            }

            return $histories->whereNull('deleted_at')
                ->latest()
                ->paginate($this->request?->paginate)
                ->appends(['driver_id' => $driver_id]);
        }

        return [];
    }

    public function generate()
    {
        $histories = $this->getData();
        $driver_id = request()->driver_id ?? (getCurrentRoleName() == RoleEnum::DRIVER ? getCurrentUserId() : null);

        $currency_symbol = '$';
        if ($driver_id) {
            $driver = Driver::with('address.country')->find($driver_id);
            $currency_symbol = $driver->address->country->currency_symbol ?? '$';
        }

       if (!empty($histories)) {
            $histories?->each(function ($item) use ($currency_symbol) {
                $item->type = ucfirst($item->type);
                $item->formatted_amount = $currency_symbol . number_format((float) $item->amount, 2, '.', ',');
                // Use simplified transaction description for two core bonus types
                $item->detail = $item->getFormattedDescription();
            });
        }

        $tableConfig = [
            'columns' => [
                ['title' => 'Amount', 'field' => 'formatted_amount', 'imageField' => null, 'sortable' => true, 'sortField' => 'amount'],
                ['title' => 'Type', 'field' => 'type', 'type' => 'badge', 'colorClasses' => ['Credit' => 'primary', 'Debit' => 'danger'], 'imageField' => null, 'sortable' => true],
                ['title' => 'Remark', 'field' => 'detail', 'imageField' => null, 'sortable' => true],
                ['title' => 'Created At', 'field' => 'created_at', 'sortable' => true],
            ],
            'data' => $histories,
            'total' => $this->history->count(),
        ];

        return $tableConfig;
    }
}
