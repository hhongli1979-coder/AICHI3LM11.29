<?php

namespace Modules\Taxido\Repositories\Front;

use Exception;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Traits\PaymentTrait;
use Modules\Taxido\Enums\RoleEnum;
use Nwidart\Modules\Facades\Module;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Enums\WalletDetail;
use Modules\Taxido\Models\RiderWallet;
use Prettus\Repository\Eloquent\BaseRepository;
use Modules\Taxido\Http\Traits\WalletPointsTrait;

class WalletRepository extends BaseRepository
{
    use WalletPointsTrait, PaymentTrait;

    public function model()
    {
        return RiderWallet::class;
    }

    public function index()
    {
        $user_id = $this->isRider() ? getCurrentUserId() : null;
        $wallet = $this->getWallet($user_id);
        $histories = $wallet->histories()->latest()->paginate(10);

        return view('taxido::front.account.my-wallet', [
            'rider' => $user_id,
            'wallet' => $wallet,
            'histories' => $histories
        ]);
    }

    private function isRider(): bool
    {
        return getCurrentRoleName() === RoleEnum::RIDER;
    }

    private function getWallet($rider_id)
    {
        $wallet = $this->model->where('rider_id', $rider_id)->first();

        if (!$wallet) {
            $wallet = RiderWallet::create([
                'rider_id' => $rider_id,
                'balance'  => 0.0,
            ]);
        }

        return $wallet;
    }

    public function topUp($request)
    {
        try {

            $user_id = getCurrentUserId();
            $roleName = getCurrentRoleName();
            if ($roleName === RoleEnum::RIDER) {
                $wallet = $this->getWallet($user_id);
                $payment = $this->createPayment($wallet, $request);
                if (isset($payment['is_redirect'])) {
                    if ($payment['is_redirect']) {
                        return redirect()->away($payment['url']);
                    }
                }
            }

            throw new Exception(__('static.wallet.permission_denied'), 403);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function createPayment($wallet, $request)
    {
        try {

            if (!$wallet) {
                throw new Exception(__('static.wallet.not_found'), 404);
            }

            $module = Module::find($request->payment_method);
            $request->merge(['type' => PaymentMethod::WALLET]);
            $request->merge(['request_type' => 'web']);
            $request->merge(['redirect_url' => route('front.cab.wallet.top-up.verify', ['item_id' => $wallet->id])]);
            if (!is_null($module) && $module?->isEnabled()) {
                $moduleName = $module->getName();
                $payment = 'Modules\\' . $moduleName . '\\Payment\\' . $moduleName;

                if (class_exists($payment) && method_exists($payment, 'getIntent')) {
                    $wallet['total'] = $request->amount;
                    $request->merge(['type' => 'wallet']);
                    return $payment::getIntent($wallet, $request);
                } else {
                    throw new Exception(__('taxido::front.wallet.payment_module_not_found'), 400);
                }
            }

            throw new Exception(__('static.wallet.invalid_payment_method'), 400);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }


    public function verifyPayment($item_id)
    {
        try {

            $paymentTransaction = self::getPaymentTransactions($item_id, 'wallet');
            if ($paymentTransaction) {
                if ($paymentTransaction?->payment_status == PaymentStatus::COMPLETED) {
                    if(!$paymentTransaction?->is_verified) {
                        $item = RiderWallet::findOrFail($item_id);
                        $amount = $paymentTransaction?->amount;
                        $this->creditRiderWallet($item->rider_id,  $amount, WalletDetail::TOPUP);
                    }
                }

                $paymentTransaction->update([
                    'is_verified' => true
                ]);
            }

            return redirect()->route('front.cab.wallet.index');

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
