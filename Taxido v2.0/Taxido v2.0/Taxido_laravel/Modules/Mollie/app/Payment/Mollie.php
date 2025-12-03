<?php

namespace Modules\Mollie\Payment;

use Exception;
use App\Enums\PaymentStatus;
use App\Http\Traits\PaymentTrait;
use App\Models\PaymentTransactions;
use App\Http\Traits\TransactionsTrait;
use Mollie\Laravel\Facades\Mollie as MollieProvider;

class Mollie
{
    use PaymentTrait, TransactionsTrait;

    public static function getIntent($obj, $request)
    {
        try {

            $paymentTransaction = PaymentTransactions::updateOrCreate([
                'item_id' => $obj?->id,
                'type' => $request->type,
                'is_verified' => false,
            ], [
                'item_id' => $obj?->id,
                'transaction_id' => uniqid(),
                'amount' => $obj?->total,
                'payment_method' => config('mollie.name'),
                'payment_status' => PaymentStatus::PENDING,
                'type' => $request->type,
                'request_type' => $request->request_type,
                'redirect_url' => $request->redirect_url
            ]);

            $transaction = MollieProvider::api()->payments->create([
                'amount' => [
                    'currency' => $request->currency_code ?? getDefaultCurrencyCode(),
                    'value' => currencyConvert($request->currency_code ?? getDefaultCurrencyCode(),roundNumber($obj?->total)),
                ],
                'description' => 'Item id '.$obj?->id,
                'redirectUrl' => route('mollie.status', ['item_id' => $obj->id, 'type' => $request->type]),
                'webhookUrl' => '',
                'metadata' => [
                    'item_id' => $obj?->id,
                    'type' => $request->type,
                ],
            ]);

            if ($transaction) {
                self::updatePaymentTransactionId($paymentTransaction, $transaction?->id);

                return [
                    'item_id' => $obj?->id,
                    'url' => $transaction->getCheckoutUrl(),
                    'transaction_id' => $transaction->id,
                    'is_redirect' => true,
                    'type' => $request->type,
                ];
            }

            throw new Exception('Something went to wrong in stripe gateway', 500);
        } catch (Exception $e) {

            self::updatePaymentStatusByType($obj?->id, $request?->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function getPayment($transaction_id)
    {
        return MollieProvider::api()->payments->get($transaction_id);
    }

    public static function getPaymentStatus($payment)
    {
        switch (true) {
            case $payment->isPaid() && ! $payment->hasRefunds() && ! $payment->hasChargebacks():
                return PaymentStatus::COMPLETED;

            case $payment->isOpen():
                return PaymentStatus::PENDING;

            case $payment->isCanceled():
                return PaymentStatus::CANCELLED;

            case $payment->isFailed() || $payment->hasChargebacks() || $payment->isExpired():
                return PaymentStatus::FAILED;

            case $payment->hasRefunds():
                return PaymentStatus::REFUNDED;

            default:
                return PaymentStatus::PENDING;
        }
    }

    public static function status($request)
    {
        try {

            $paymentTransaction = PaymentTransactions::where([
                'item_id' => $request->item_id,
                'type' => $request->type,
            ])->first();

            if ($paymentTransaction) {
                $transaction_id = $paymentTransaction?->transaction_id;
                $payment = self::getPayment($transaction_id);
                $status = self::getPaymentStatus($payment);

                return self::updatePaymentStatus($paymentTransaction, $status);
            }

        } catch (Exception $e) {

            self::updatePaymentStatusByType($request->item_id, $request->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function webhook($request)
    {
        try {

            $payment = self::getPayment($request->id);
            $item_id = $payment->metadata->item_id;
            $type = $payment->metadata->type;

            $paymentTransaction = PaymentTransactions::where([
                'item_id' => $item_id, 'type' => $type,
            ])->first();
            $status = self::getPaymentStatus($payment);

            return self::updatePaymentStatus($paymentTransaction, $status);

        } catch (Exception $e) {

            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
