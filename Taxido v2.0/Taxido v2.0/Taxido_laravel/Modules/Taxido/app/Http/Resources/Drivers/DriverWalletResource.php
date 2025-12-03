<?php

namespace Modules\Taxido\Http\Resources\Drivers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DriverWalletResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'driver_id' => $this->driver_id,
            'balance' => $this->balance,
            'histories' => $this->histories->map(function ($history) {
                return [
                    'id' => $history->id,
                    'driver_wallet_id' => $history->driver_wallet_id,
                    'detail' => $history->getFormattedDescription(),
                    'amount' => $history->amount,
                    'type' => $history->type,
                    'transaction_id' => $history->transaction_id,
                    'ride_number' => $history->ride ? $history->ride->ride_number : null,
                    'is_referral_bonus' => $history->isReferralBonus(),
                    'referral_transaction_type' => $history->getReferralTransactionType(),
                ];
            }),
        ];
    }
}
