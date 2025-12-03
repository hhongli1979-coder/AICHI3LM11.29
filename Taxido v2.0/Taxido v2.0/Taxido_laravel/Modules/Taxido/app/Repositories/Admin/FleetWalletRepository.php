<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use App\Enums\WalletPointsDetail;
use Modules\Taxido\Enums\RoleEnum;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Enums\TransactionType;
use Modules\Taxido\Models\FleetManagerWallet;
use Prettus\Repository\Eloquent\BaseRepository;
use Modules\Taxido\Http\Traits\WalletPointsTrait;

class FleetWalletRepository extends BaseRepository
{
    use WalletPointsTrait;

    public function model()
    {
        return FleetManagerWallet::class;
    }

    public function index($request, $fleetWalletTable)
    {
        if (request()->action) {
            return redirect()->back();
        }

        $fleet_manager_id = $request->fleet_manager_id;
        if (getCurrentRoleName() == RoleEnum::FLEET_MANAGER) {
            $fleet_manager_id = getCurrentUserId();
        }

        $fleetWallet = $this->model->where('fleet_manager_id', $fleet_manager_id)->first();
        return view('taxido::admin.fleet-wallet.index', [
            'balance'     => $fleetWallet?->balance,
            'tableConfig' => $fleetWalletTable,
        ]);
    }

    public function credit($request)
    {
        try {

            $this->creditFleetWallet($request->fleet_manager_id, $request->balance, $request->note ?? WalletPointsDetail::ADMIN_CREDIT);
            return redirect()->back()->with('success', __('taxido::static.wallets.balance_credited'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function debit($request)
    {
        try {

            $this->debitFleetWallet($request->fleet_manager_id, $request->balance, $request->note ?? WalletPointsDetail::ADMIN_DEBIT);
            return redirect()->back()->with('success', __('taxido::static.wallets.balance_debited'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
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
}
