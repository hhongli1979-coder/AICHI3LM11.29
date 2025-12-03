<?php
namespace Modules\Taxido\Http\Resources\Riders;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RiderWalletResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'rider_id'  => $this->rider_id,
            'balance'   => $this->balance,
            'histories' => $this->histories->map(function ($history) {
                return [
                    'id'              => $history->id,
                    'rider_wallet_id' => $history->rider_wallet_id,
                    'detail'          => $history->getFormattedDescription(),
                    'amount'          => $history->amount,
                    'type'            => $history->type,
                    'transaction_id'  => $history->transaction_id,
                    'is_referral_bonus' => $history->isReferralBonus(),
                    'referral_transaction_type' => $history->getReferralTransactionType(),
                ];
            }),
        ];
    }
}
