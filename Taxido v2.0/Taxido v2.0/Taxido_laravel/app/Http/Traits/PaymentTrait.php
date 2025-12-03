<?php

namespace App\Http\Traits;

use App\Models\PaymentTransactions;

trait PaymentTrait
{
    public static function updatePaymentStatus($payment, $status)
    {
        if ($payment) {
            $payment?->update([
                'payment_status' => $status,
            ]);

            $payment = $payment?->refresh();
            if ($payment->request_type == 'web') {
                if($payment->redirect_url) {
                    return redirect($payment->redirect_url);
                }
            }

            return $payment;
        }
    }

    public static function updatePaymentMethod($booking, $method)
    {
        $booking?->update([
            'payment_method' => $method,
        ]);

        $booking = $booking->fresh();

        return $booking;
    }

    public static function verifyTransaction($transaction_id)
    {
        return PaymentTransactions::where(['transaction_id', $transaction_id])->first();
    }

    public static function getPaymentTransactions($item_id, $type, $transaction_id = null)
    {
        $paymentTransactions = PaymentTransactions::where([
            'item_id' => $item_id,
            'type' => $type,
            'is_verified' => false
        ]);
        if($paymentTransactions && $transaction_id) {
            $paymentTransactions->where('transaction_id', $transaction_id);
        }

        return $paymentTransactions?->first();
    }

    public static function updatePaymentStatusByType($item_id, $type, $status)
    {
        $payment = self::getPaymentTransactions($item_id, $type);

        return self::updatePaymentStatus($payment, $status);
    }

    public static function updatePaymentStatusByTrans($transaction_id, $status)
    {
        $payment = self::verifyTransaction($transaction_id);

        return self::updatePaymentStatus($payment, $status);
    }

    public static function updatePaymentTransactionId($payment, $transaction_id)
    {
        if ($payment) {
            $payment?->update([
                'transaction_id' => $transaction_id,
            ]);

            $payment = $payment?->fresh();
            return $payment;
        }
    }
}
