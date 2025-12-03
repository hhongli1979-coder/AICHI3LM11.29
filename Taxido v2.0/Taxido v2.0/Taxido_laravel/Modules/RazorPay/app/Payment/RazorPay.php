<?php

namespace Modules\RazorPay\Payment;

use Exception;
use Razorpay\Api\Api;
use App\Enums\PaymentStatus;
use App\Http\Traits\PaymentTrait;
use App\Models\PaymentTransactions;
use App\Http\Traits\TransactionsTrait;
use Modules\RazorPay\Enums\RazorPayEvent;

class RazorPay
{
    use PaymentTrait, TransactionsTrait;

    public static function getProvider()
    {
        return new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));
    }

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
                'payment_method' => config('razorpay.name'),
                'payment_status' => PaymentStatus::PENDING,
                'type' => $request->type,
                'request_type' => $request->request_type,
                'redirect_url' => $request->redirect_url
            ]);

            $provider = self::getProvider();
            $transaction = $provider->paymentLink->create([
                'notes' => [
                    'item_id' => $obj->id,
                    'type' => $request->type,
                ],
                'amount' => (currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), $obj?->total) * 100),
                'currency' => $request->currency_code ?? getDefaultCurrencyCode(),
                'callback_url' => route('razorpay.status', ['item_id' => $obj?->id, 'type' => $request->type]),
                'description' => 'Order From '.config('app.name'),
            ]);

            if ($transaction) {
                self::updatePaymentTransactionId($paymentTransaction, $transaction?->id);

                return [
                    'item_id' => $obj?->id,
                    'url' => $transaction->short_url,
                    'transaction_id' => $transaction->id,
                    'is_redirect' => true,
                    'type' => $request->type,
                ];
            }

            throw new Exception( 'Something went to wrong in stripe gateway', 500);
        } catch (Exception $e) {

            self::updatePaymentStatusByType($obj?->id, $request?->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function status($request)
    {
        try {

            $provider = self::getProvider();
            $paymentTransaction = PaymentTransactions::where([
                'transaction_id' => $request->razorpay_payment_link_id,
                'type' => $request->type,
            ])
                ->first();

            $transaction_id = $paymentTransaction->transaction_id;
            $payment = $provider->paymentLink->fetch($transaction_id);
            switch ($payment->status) {
                case RazorPayEvent::COMPLETED:
                    $status = PaymentStatus::COMPLETED;
                    break;

                case RazorPayEvent::FAILED:
                    $status = PaymentStatus::FAILED;
                    break;

                default:
                    $status = PaymentStatus::PENDING;
            }

            return self::updatePaymentStatus($paymentTransaction, $status);

        } catch (Exception $e) {

            self::updatePaymentStatusByTrans($request->razorpay_payment_link_id, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function webhook($request)
    {
        try {

            $provider = self::getProvider();
            $response = @file_get_contents('php://input');
            $signature = $request->header('X-Razorpay-Signature');
            if ($response && $signature) {
                $provider->utility->verifyWebhookSignature($response, $signature, env('RAZORPAY_WEBHOOK_SECRET_KEY'));
            }

            $item_id = $request->payload['payment_link']['notes']['item_id'];
            $type = $request->payload['payment_link']['notes']['type'];
            $paymentTransaction = PaymentTransactions::where([
                'item_id' => $item_id, 'type' => $type,
            ])->first();
            switch ($request->event) {
                case RazorPayEvent::PAID:
                    $status = PaymentStatus::COMPLETED;
                    break;

                case RazorPayEvent::PARTIALLY_PAID:
                    $status = PaymentStatus::PENDING;
                    break;

                case RazorPayEvent::CANCELLED:
                    $status = PaymentStatus::CANCELLED;
                    break;

                default:
                    $status = PaymentStatus::FAILED;
                    break;
            }

            return self::updatePaymentStatus($paymentTransaction, $status);

        } catch (Exception $e) {

            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
