<?php

namespace Modules\Taxido\Http\Traits;

use Exception;
use App\Enums\RoleEnum;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\RiderWallet;
use Modules\Taxido\Models\DriverWallet;
use Modules\Taxido\Models\FleetManagerWallet;
use Modules\Taxido\Enums\RoleEnum as EnumsRoleEnum;

trait WalletPointsTrait
{
  use WalletHistoryTrait;

  // Wallet
  public function getDriverWallet($driver_id)
  {
    $roleName = getRoleNameByDriverId($driver_id);
    if ($roleName == EnumsRoleEnum::DRIVER) {
      return DriverWallet::firstOrCreate(['driver_id' => $driver_id]);
    }

    throw new ExceptionHandler("User must be " . EnumsRoleEnum::DRIVER, 400);
  }

  public function getRiderWallet($rider_id)
  {
    $roleName = getRolesNameByUserId($rider_id);
    if ($roleName == EnumsRoleEnum::RIDER) {
      return RiderWallet::firstOrCreate(['rider_id' => $rider_id]);
    }

    throw new ExceptionHandler("user must be " . EnumsRoleEnum::RIDER, 400);
  }


  public function getFleetWallet($fleet_manager_id)
  {
    $roleName = getRolesByUserId($fleet_manager_id);
    if ($roleName == EnumsRoleEnum::FLEET_MANAGER) {
      return FleetManagerWallet::firstOrCreate(['fleet_manager_id' => $fleet_manager_id]);
    }

    throw new ExceptionHandler("User must be " . EnumsRoleEnum::FLEET_MANAGER, 400);
  }

  public function verifyDriverWallet($driver_id, $balance)
  {
    if (isUserLogin()) {
      if ($balance > 0.00) {
        $roleName = getCurrentRoleName();
        if ($roleName != RoleEnum::USER) {
          $driverWalletBalance = $this->getDriverWalletBalance($driver_id);
          if ($driverWalletBalance >= $balance) {
            return true;
          }
          throw new Exception(__('taxido::static.wallets.wallet_balance_not_sufficient'), 400);
        }
        throw new Exception(__('taxido::static.wallets.wallet_balance_ride'), 400);
      }
    }
    return false;
  }

  public function verifyRiderWallet($rider_id, $balance)
  {
    if (isUserLogin()) {
      if ($balance > 0.00) {
        $roleName = getCurrentRoleName();
        if ($roleName == EnumsRoleEnum::RIDER) {
          $riderWalletBalance = $this->getRiderWalletBalance($rider_id);
          if ($riderWalletBalance >= $balance) {
            return true;
          }
          throw new Exception(__('taxido::static.wallets.wallet_balance_not_sufficient'), 400);
        }
        throw new Exception(__('taxido::static.wallets.wallet_balance_ride'), 400);
      }
      throw new Exception(__('taxido::static.wallets.wallet_balance_not_sufficient'), 400);
    }
    return false;
  }

  public function verifyFleetWallet($fleet_manager_id, $balance)
  {
    if (isUserLogin() && $balance > 0.00) {

      $fleetWalletBalance = $this->getFleetWalletBalance($fleet_manager_id);
      if ($fleetWalletBalance >= $balance) {
        return true;
      }
      throw new Exception(__('taxido::static.wallets.wallet_balance_not_sufficient'), 400);
    }
    return false;
  }

  public function getDriverWalletBalance($driver_id)
  {
    return $this->getDriverWallet($driver_id)->balance;
  }

  public function getRiderWalletBalance($rider_id)
  {
    return $this->getRiderWallet($rider_id)->balance;
  }

  public function getFleetWalletBalance($fleet_manager_id)
  {
    return $this->getFleetWallet($fleet_manager_id)->balance;
  }

  public function creditDriverWallet($driver_id, $balance, $detail, $order_id = null)
  {
    if ($driver_id && $balance) {
      $driverWallet = $this->getDriverWallet($driver_id);
      if ($driverWallet) {
        $driverWallet->increment('balance', $balance);
      }

      $this->creditTransaction($driverWallet, $balance, $detail, $order_id);
      return $driverWallet;
    }
  }

  public function creditRiderWallet($rider_id, $balance, $detail, $order_id = null)
  {
    if ($rider_id && $balance) {
      $riderWallet = $this->getRiderWallet($rider_id);
      if ($riderWallet) {
        $riderWallet->increment('balance', $balance);
      }

      $this->creditTransaction($riderWallet, $balance, $detail, $order_id);
      return $riderWallet;
    }
  }

  public function creditFleetWallet($fleet_manager_id, $balance, $detail, $order_id = null)
  {
    if ($fleet_manager_id && $balance) {
      $fleetWallet = $this->getFleetWallet($fleet_manager_id);
      if ($fleetWallet) {
        $fleetWallet->increment('balance', $balance);
      }

      $this->creditTransaction($fleetWallet, $balance, $detail, $order_id);
      return $fleetWallet;
    }
  }

  public function debitDriverWallet($driver_id, $balance, $detail, $order_id = null, $isValidate = true)
  {
    if ($driver_id) {
      $driverWallet = $this->getDriverWallet($driver_id);
      if ($driverWallet) {
        if ($isValidate) {
          if ($driverWallet->balance <= $balance) {
            throw new ExceptionHandler(__('taxido::static.wallets.wallet_balance_not_sufficient'), 400);
          }
        }

        $driverWallet->decrement('balance', $balance);
        $this->debitTransaction($driverWallet, $balance, $detail, $order_id);

        return $driverWallet;
      }
    }
  }

  public function debitRiderWallet($rider_id, $balance, $detail, $order_id = null, $isValidate = true)
  {
    if ($rider_id) {
      $riderWallet = $this->getRiderWallet($rider_id);
      if ($riderWallet) {
        if ($isValidate) {
          if ($riderWallet->balance <= $balance) {
            throw new ExceptionHandler(__('taxido::static.wallets.wallet_balance_not_sufficient'), 400);
          }
        }

        $riderWallet?->decrement('balance', $balance);
        $this->debitTransaction($riderWallet, $balance, $detail, $order_id);
        return $riderWallet;
      }
    }
  }

  public function debitFleetWallet($fleet_manager_id, $balance, $detail,  $order_id = null)
  {
    if ($fleet_manager_id) {
      $fleetWallet = $this->getFleetWallet($fleet_manager_id);
      if ($fleetWallet && $fleetWallet->balance >= $balance) {
        $fleetWallet->decrement('balance', $balance);
        $this->debitTransaction($fleetWallet, $balance, $detail, $order_id);
        return $fleetWallet;
      }

      throw new ExceptionHandler(__('taxido::static.wallets.wallet_balance_not_sufficient'), 400);
    }
  }
}
