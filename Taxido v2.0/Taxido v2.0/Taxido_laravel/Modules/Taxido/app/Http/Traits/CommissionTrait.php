<?php

namespace Modules\Taxido\Http\Traits;

use App\Enums\PaymentMode;
use App\Enums\PaymentStatus;
use App\Enums\PaymentMethod;
use Log;
use Modules\Taxido\Models\Ride;
use Modules\Taxido\Models\Plan;
use App\Enums\WalletPointsDetail;
use Modules\Taxido\Models\FleetManager;
use Modules\Taxido\Enums\RideStatusEnum;
use Modules\Taxido\Models\CabCommissionHistory;

trait CommissionTrait
{
    use WalletPointsTrait;

    public function fleetCommission($driverCommission, $driver, $settings)
    {
        $commissionRate = 0;
        if ($driver?->fleet_manager_id) {
            if ($driver?->fleet_manager) {
                $fleetManager = FleetManager::whereNull('deleted_at')?->where('id', $driver?->fleet_manager_id)?->first();
                if ($fleetManager) {
                    $commissionRate = $settings['driver_commission']['fleet_commission_rate'];
                    if ($settings['driver_commission']['fleet_commission_type'] == 'percentage') {
                        $commissionRate = ($driverCommission * $commissionRate) / 100;
                    }
                }
            }
        }

        return $commissionRate;
    }

    public function calAdminDriverCommission($ride)
    {
        $settings = getTaxidoSettings();
        if ($settings['driver_commission']['status']) {
            if (
                $ride?->payment_status == PaymentStatus::COMPLETED &&
                $ride?->ride_status?->slug == RideStatusEnum::COMPLETED
            ) {
                $extraBidAmount = $ride?->bid_extra_amount;
                $waitingCharge = $ride?->waiting_charges;
                $driverTips = $ride?->driver_tips;
                $adminCommission = $ride?->commission;
                $driverCommission = $ride?->driver_commission;
                $driverId = $ride?->driver_id;
                $driver = getDriverById($driverId);
                $fleet_manager_id = $driver?->fleet_manager_id;
                $fleetCommission = $this->fleetCommission($driverCommission, $driver, $settings) ?? 0;
                $driverCommission -= $fleetCommission;
                $driverCommission = $driverCommission + $driverTips + $waitingCharge + $extraBidAmount;
                if ($driver) {
                    if ($driver?->subscription) {
                        if ($driver?->subscription?->is_active) {
                            if ($driver?->subscription) {
                                $plan = Plan::with(['service_categories'])?->where('id', $driver?->subscription?->plan_id)
                                    ?->whereNull('deleted_at')?->where('status', true)?->first();
                                if ($plan) {
                                    $categoryIds = $plan?->service_categories?->pluck('id')?->toArray();
                                    if (in_array($ride?->service_category_id, $categoryIds)) {
                                        $adminCommission = 0;
                                        $driverCommission += $adminCommission;
                                    }
                                }
                            }
                        }
                    }
                }

                if (!$this->isExistsCommissionHistory($ride)) {
                    if (
                        $ride?->payment_method == PaymentMethod::CASH ||
                        $ride?->payment_mode == PaymentMode::OFFLINE
                    ) {

                        Log::info('isExistsCommissionHistory: '. $this->isExistsCommissionHistory($ride));

                        $this->debitDriverWallet($driverId, $adminCommission, __('taxido::static.commission_histories.admin_debited_commission', ['ride_number' => $ride?->ride_number]), $ride?->id, false);
                        if ($fleetCommission && $fleet_manager_id) {
                            $this->creditFleetWallet($fleet_manager_id, $fleetCommission, WalletPointsDetail::COMMISSION, $ride?->id);
                            $this->debitDriverWallet($driverId, $fleetCommission, __('taxido::static.commission_histories.fleet_debited_commission', ['ride_number' => $ride?->ride_number]), $ride?->id, false);
                        }

                        Log::info('=====================================================');
                        Log::info('fleetCommission: '. $fleetCommission . 'fleet_manager_id : '.$fleet_manager_id);

                        if ($ride?->tax > 0) {
                            $this->debitDriverWallet($driverId, $ride->tax, __('taxido::static.commission_histories.admin_debited_tax', ['ride_number' => $ride?->ride_number]), $ride?->id, false);
                        }

                        if ($ride?->platform_fees > 0) {
                            $this->debitDriverWallet($driverId, $ride->platform_fees, __('taxido::static.commission_histories.admin_debited_platform_fee', ['ride_number' => $ride?->ride_number]), $ride?->id, false);
                        }

                        Log::info('=====================================================');

                        Log::info('adminCommission, $driverCommission, $fleetCommission: '. $adminCommission.": ". $driverCommission.":". $fleetCommission);

                        $this->createCommissionHistory($ride, $adminCommission, $driverCommission, $fleetCommission);
                    } elseif ($ride?->payment_mode == PaymentMode::ONLINE) {
                        $this->creditFleetWallet($fleet_manager_id, $fleetCommission, __('taxido::static.commission_histories.ride_commission_credited', ['ride_number' => $ride?->ride_number]), $ride?->id);
                        $this->creditDriverWallet($driverId, $driverCommission, __('taxido::static.commission_histories.ride_commission_credited', ['ride_number' => $ride?->ride_number]), $ride?->id);
                        $this->createCommissionHistory($ride, $adminCommission, $driverCommission, $fleetCommission);
                    }
                }
            }
        }

        return $ride;
    }

    public function createCommissionHistory($ride, $adminCommission, $driverCommission, $fleetCommission)
    {
        $taxidoSettings = getTaxidoSettings();
        $commissionRate = $ride?->vehicle_type?->commission_rate;
        $commissionType = $ride?->vehicle_type?->commission_type;

        if ($fleetCommission) {
            $commissionRate = $taxidoSettings['driver_commission']['fleet_commission_rate'];
            $commissionType = $taxidoSettings['driver_commission']['fleet_commission_type'];
        }

        $ride->commission_history()?->create([
            'admin_commission' => $adminCommission,
            'driver_commission' => $driverCommission,
            'fleet_commission' => $fleetCommission,
            'driver_id' => $ride?->driver_id,
            'commission_rate' => $commissionRate,
            'commission_type' => $commissionType,
        ]);

        return $ride;
    }

    public function isExistsCommissionHistory(Ride $ride)
    {
        return CabCommissionHistory::where('ride_id', $ride?->id)->exists();
    }
}
