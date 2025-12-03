<?php

namespace App\Http\Traits;

use App\Models\User;
use App\Enums\RoleEnum;
use App\Enums\TransactionType;

trait TransactionsTrait
{
    public function getAdminRoleId()
    {
        return User::role(RoleEnum::ADMIN)->first()?->id;
    }

    public function debitTransaction($model, $amount, $detail, $order_id = null)
    {
        return $this->storeTransaction($model, TransactionType::DEBIT, $detail, $amount, $order_id);
    }

    public function creditTransaction($model, $amount, $detail, $order_id = null)
    {
        return $this->storeTransaction($model, TransactionType::CREDIT, $detail, $amount, $order_id);
    }

    public function storeTransaction($model, $type, $detail, $amount, $order_id = null, $transaction_id = null)
    {
        $transaction = $model->histories()?->create([
            'amount' => $amount,
            'order_id' => $order_id,
            'detail' => $detail,
            'type' => $type,
            'from' => $this->getAdminRoleId(),
        ]);
        return $transaction;

    }
}
