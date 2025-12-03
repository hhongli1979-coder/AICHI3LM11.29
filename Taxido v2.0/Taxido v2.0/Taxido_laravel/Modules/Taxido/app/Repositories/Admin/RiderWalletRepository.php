<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use App\Enums\WalletPointsDetail;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\RiderWallet;
use Modules\Taxido\Enums\TransactionType;
use Prettus\Repository\Eloquent\BaseRepository;
use Modules\Taxido\Http\Traits\WalletPointsTrait;

class RiderWalletRepository extends BaseRepository
{
    use WalletPointsTrait;

    function model()
    {
        return RiderWallet::class;
    }

    public function index($request, $riderWalletTable)
    {
        if (request()->action) {
            return redirect()->back();
        }

        $rider_id = $request->rider_id;
        if (getCurrentRoleName() == RoleEnum::RIDER) {
            $rider_id = getCurrentUserId();
        }

        $riderWallet = $this->model->where('rider_id', $rider_id)->first();
        return view('taxido::admin.rider-wallet.index', [
            'balance'     => $riderWallet?->balance,
            'tableConfig' => $riderWalletTable,
        ]);
    }

    public function updateBalance($request)
    {
        try {

            switch ($request->type) {
                case TransactionType::CREDIT:
                    return $this->credit($request);
                case TransactionType::DEBIT:
                    return $this->debit($request);
            }
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function credit($request)
    {
        try {

            $this->creditRiderWallet($request->rider_id, $request->balance, $request->note ?? WalletPointsDetail::ADMIN_CREDIT);
            return redirect()->back()->with('success', __('taxido::static.wallets.balance_credited'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function debit($request)
    {
        try {

            $this->debitRiderWallet($request->rider_id, $request->balance, $request->note ?? WalletPointsDetail::ADMIN_DEBIT);
            return redirect()->back()->with('success', __('taxido::static.wallets.balance_debited'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
