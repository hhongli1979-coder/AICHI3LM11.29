<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Modules\Taxido\Enums\RoleEnum;
use Nwidart\Modules\Facades\Module;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\RiderWallet;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Modules\Taxido\Http\Traits\WalletPointsTrait;

class RiderWalletRepository extends BaseRepository
{
    use WalletPointsTrait;
    protected $fieldSearchable = [
        'title' => 'like'
    ];

    function model()
    {
        return RiderWallet::class;
    }

    public function boot()
    {
        try {

            $this->pushCriteria(app(RequestCriteria::class));
        } catch (ExceptionHandler $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function topUp($request)
    {
        try {

            $user_id = getCurrentUserId();
            $roleName = getCurrentRoleName();
            if ($roleName === RoleEnum::RIDER) {
                $wallet = $this->getRiderWallet($user_id);
                return $this->createPayment($wallet, $request);
            } else {
                throw new Exception(__('static.wallet.permission_denied'), 403);
            }

        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function createPayment($wallet, $request)
    {
        try {

            if ($wallet) {
                $module = Module::find($request->payment_method);
                if (!is_null($module) && $module?->isEnabled()) {
                    $moduleName = $module->getName();
                    $payment = 'Modules\\'.$moduleName.'\\Payment\\'.$moduleName;
                    if (class_exists($payment) && method_exists($payment, 'getIntent')) {
                        $wallet['total'] = $request->amount;
                        $request->merge([
                            'type' => 'wallet',
                        ]);

                        return $payment::getIntent($wallet, $request);

                    } else {

                        throw new Exception(__('static.wallet.payment_module_not_found'), 400);
                    }
                 }
            }

            throw new Exception(__('static.wallet.invalid_payment_method'), 400);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
