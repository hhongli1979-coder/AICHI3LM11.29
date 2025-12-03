<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Carbon\Carbon;
use App\Enums\PaymentMethod;
use Modules\Taxido\Models\Plan;
use App\Http\Traits\PaymentTrait;
use Illuminate\Support\Facades\DB;
use Nwidart\Modules\Facades\Module;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\DriverSubscription;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Modules\Taxido\Http\Traits\WalletPointsTrait;

class PlanRepository extends BaseRepository
{
    use PaymentTrait, WalletPointsTrait;

    public $driverSubscription;

    function model()
    {
        $this->driverSubscription = new DriverSubscription();

        return Plan::class;
    }

    public function boot()
    {
        try {

            $this->pushCriteria(app(RequestCriteria::class));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function show($id)
    {
        try {

            return $this->model->findOrFail($id);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function calculateEndDate($duration, $addDays = null)
    {
        $duration = $duration === 'monthly' ? 'month' : 'year';
        $date = Carbon::now()?->add(1, $duration);
        if ($addDays) {
            $date->addDays($addDays);
        }

        return $date;
    }

    public function purchase($request)
    {
        DB::beginTransaction();
        try {

            if ($request->payment_method != PaymentMethod::CASH || $request->payment_method != PaymentMethod::WALLET ) {
                $is_subscription_allow = config($request->payment_method)['subscription'] ?? 0;
                if(!$is_subscription_allow) {
                    throw new Exception(__('taxido::static.plans.payment_not_allowed_for_plan'), 400);

                }
            }

            $currentUserRole = getCurrentRoleName();
            if ($currentUserRole != RoleEnum::DRIVER) {
                throw new Exception(__('taxido::static.plans.only_driver_can_purchase_plan'), 400);
            }

            $addDays = null;
            $existingSubscription = $this?->driverSubscription?->where('driver_id', getCurrentUserId())?->where('is_active', true)?->first();
            if ($existingSubscription) {
                $existingSubscription->update(['is_active' => false]);
            }

            $plan = $this->model->find($request->plan_id);
            $driverSubscription = $this->driverSubscription->create([
                'driver_id' => getCurrentUserId(),
                'plan_id' => $plan?->id,
                'start_date' => Carbon::now(),
                'end_date' => $this->calculateEndDate($plan->duration, $addDays),
                'total' => $plan->price,
                'is_active' => true,
                'payment_method' => $request->payment_method,
            ]);

            DB::commit();
            if ($request->wallet_balance) {
                $driver_id = getCurrentUserId();
                if ($this->verifyDriverWallet($driver_id, $plan->price)) {
                    $this->debitDriverWallet($driver_id, $plan->price, "Wallet amount successfully debited for purchase {$plan?->name} plan.");
                    return $driverSubscription;
                }

            } elseif ($request->payment_method != PaymentMethod::CASH) {
                $module = Module::find($request->payment_method);
                if (!is_null($module) && $module?->isEnabled()) {
                    $moduleName = $module->getName();
                    $payment = 'Modules\\' . $moduleName . '\\Payment\\' . $moduleName;
                    $request->merge(['type' => 'subscription']);
                    if (class_exists($payment) && method_exists($payment, 'getIntent')) {
                        return $payment::getIntent($driverSubscription, $request);
                    }
                }
            }

            throw new Exception(__('taxido::static.plans.invalid_payment_method'), 400);

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyIsExpiredSubscriptions()
    {
        try {

            $expiredSubscriptions = DriverSubscription::where('end_date', '<', now())->get();
            foreach ($expiredSubscriptions as $subscription) {
                $subscription->update(['is_active' => false]);
            }

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
