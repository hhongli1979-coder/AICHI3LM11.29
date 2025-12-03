<?php

namespace Modules\Taxido\Enums;

enum WalletDetail: string
{
  const REWARD = 'Reward points for placing an ride.';
  const REFUND = 'Amount returned.';
  const REJECTED = 'Request not approved.';
  const WALLET_RIDE = "Wallet amount successfully debited for ride.";
  const COMMISSION = 'Admin has sended a commission.';
  const WITHDRAW = 'Balance Withdrawn Requested.';
  const TOPUP = 'Topup wallet balance.';
}
