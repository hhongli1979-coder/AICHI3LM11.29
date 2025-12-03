<?php

namespace Modules\Taxido\Http\Traits;

use App\Models\User;
use App\Enums\RoleEnum;
use App\Http\Traits\TransactionsTrait;

trait WalletHistoryTrait
{
    use TransactionsTrait;

    public function getRoleId()
    {
        $roleName = getCurrentRoleName() ?? RoleEnum::ADMIN;
        if ($roleName == RoleEnum::ADMIN) {
            return User::role(RoleEnum::ADMIN)->first()?->id;
        }

        return getCurrentUserId();
    }

    public function storeTransactionHistories($model, $type, $detail, $amount, $ride_id = null)
    {
        return $model->histories()->create([
            'amount' => $amount,
            'ride_id' => $ride_id,
            'detail' => $detail,
            'type' => $type,
            'from_user_id' => $this->getRoleId(),
        ]);
    }
}
