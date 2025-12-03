<?php

namespace App\Enums;

enum WalletPointsDetail:string {
  const SIGN_UP_BONUS = 'Welcome! Bonus credited.';
  const ADMIN_CREDIT = 'Admin has credited the balance.';
  const ADMIN_DEBIT = 'Admin has debited the balance.';
  const WITHDRAW = 'Balance Withdrawn Requested';
  const REWARD = 'Reward Points for placing an ride.';
  const REFUND = 'Amount Returned.';
  const REJECTED = 'Request Not Approved.';
  const WALLET_ORDER = "Wallet amount successfully debited for Ride";
  const POINTS_ORDER = "Point amount successfully debited for Ride";
  const COMMISSION = 'Admin has sended a commission.';
}
