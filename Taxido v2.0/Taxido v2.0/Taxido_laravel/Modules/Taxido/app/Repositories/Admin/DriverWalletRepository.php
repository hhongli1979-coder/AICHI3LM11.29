<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use App\Enums\WalletPointsDetail;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\DriverWallet;
use Modules\Taxido\Enums\TransactionType;
use Prettus\Repository\Eloquent\BaseRepository;
use Modules\Taxido\Http\Traits\WalletPointsTrait;
use Modules\Taxido\Models\Driver;

class DriverWalletRepository extends BaseRepository
{
    use WalletPointsTrait;

    function model()
    {
        return DriverWallet::class;
    }

    public function index($request, $driverWalletTable)
    {
        if ($request->action) {
            return redirect()->back();
        }

        $driver_id = $request->driver_id ?? ($this->isDriver() ? getCurrentUserId() : null);
        if ($driver_id) {
            $driverWallet = $this->getWallet($driver_id);
            $driver = Driver::with('address.country')->find($driver_id);
            return view('taxido::admin.driver-wallet.index', [
                'balance' => $driverWallet?->balance,
                'driver' => $driver, 
                'tableConfig' => $driverWalletTable
            ]);
        }

        return view('taxido::admin.driver-wallet.index', ['tableConfig' => $driverWalletTable]);
    }

    private function isDriver(): bool
    {
        return getCurrentRoleName() === RoleEnum::DRIVER;
    }

    private function getWallet($driver_id)
    {
        return $this->model->where('driver_id', $driver_id)->first() ?? $this->getDriverWallet($driver_id)->fresh();
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

            $this->creditDriverWallet($request->driver_id, $request->balance, $request->note ?? WalletPointsDetail::ADMIN_CREDIT);
            return redirect()->back()->with('success', __('taxido::static.wallets.balance_credited'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function debit($request)
    {
        try {

            $this->debitDriverWallet($request->driver_id, $request->balance, $request->note ?? WalletPointsDetail::ADMIN_DEBIT);
            return redirect()->back()->with('success', __('taxido::static.wallets.balance_debited'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
