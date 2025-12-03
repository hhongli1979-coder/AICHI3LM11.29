<?php

namespace Modules\Paystack\Payment;

use Exception;
use App\Enums\PaymentStatus;
use App\Http\Traits\PaymentTrait;
use App\Models\PaymentTransactions;
use App\Http\Traits\TransactionsTrait;
use Modules\Paystack\Enums\PaystackEvent;

class Paystack
{
    use PaymentTrait, TransactionsTrait;

    public static function getPaymentUrl()
    {
        if (env('PAYSTACK_SANDBOX_MODE')) {
            return 'https://api.paystack.co';
        }
        return env('PAYSTACK_PAYMENT_URL', 'https://api.paystack.co');
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
                'payment_method' => config('paystack.name'),
                'payment_status' => PaymentStatus::PENDING,
                'type' => $request->type,
                'request_type' => $request->request_type,
                'redirect_url' => $request->redirect_url
            ]);

            $url = self::getPaymentUrl().'/transaction/initialize';
            $intent = [
                'name' => $obj?->consumer['name'] ?? 'Customer',
                'email' => $obj?->consumer['email'] ?? 'customer@example.com',
                'amount' => currencyConvert($request->currency_code ?? getDefaultCurrencyCode(),roundNumber($obj?->total))*100,
                'callback_url' => route('paystack.webhook', [
                    'item_id' => $obj->id,
                    'type' => $request->type,
                ]),
                'item_id' => $obj?->id,
            ];

            $fields = http_build_query($intent);
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer '.env('PAYSTACK_SECRET_KEY'),
                'Cache-Control: no-cache',
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            $response = curl_exec($ch);
            $err = curl_error($ch);
            curl_close($ch);

            $payment = json_decode($response);


            if ($payment->status !== true || empty($payment->data)) {
                $message = $payment->message ?? 'Payment initialization failed';
                throw new Exception($message, 500);
            }

            if (!isset($payment->data->authorization_url) || !isset($payment->data->reference)) {
                throw new Exception('Missing required payment data from Paystack', 500);
            }

            $paymentUrl = $payment->data->authorization_url;
            $transaction_id = $payment->data->reference;
            self::updatePaymentTransactionId($paymentTransaction, $transaction_id);

            return [
                'item_id' => $obj?->id,
                'url' => $paymentUrl,
                'transaction_id' => $transaction_id,
                'is_redirect' => true,
                'type' => $request->type,
            ];

        } catch (Exception $e) {
            
            self::updatePaymentStatusByType($obj?->id, $request?->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function webhook($request)
    {
        try {
            $paymentTransaction = PaymentTransactions::where([
                'item_id' => $request->item_id,
                'type' => $request->type,
            ])->first();

            if (!$paymentTransaction) {
                throw new Exception('Payment transaction not found', 404);
            }

            $transaction_id = $paymentTransaction->transaction_id;
            if (!$transaction_id) {
                throw new Exception('Missing transaction ID', 400);
            }

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => self::getPaymentUrl().'/transaction/verify/'.$transaction_id,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'GET',
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer '.env('PAYSTACK_SECRET_KEY'),
                    'Cache-Control: no-cache',
                ],
            ]);

            $response = curl_exec($curl);
            $err = curl_error($curl);
            curl_close($curl);

            if ($err) {
                throw new Exception("cURL Error: " . $err, 500);
            }

            $payment = json_decode($response);
            if (!$payment || !isset($payment->status)) {
                throw new Exception('Invalid response from Paystack verification', 500);
            }

            if ($payment->status !== true || empty($payment->data)) {
                return self::updatePaymentStatus($paymentTransaction, PaymentStatus::FAILED);
            }

            if ($payment->data->status == PaystackEvent::SUCCESS && 
                $payment->data->gateway_response == PaystackEvent::SUCCESSFUL) {
                return self::updatePaymentStatus($paymentTransaction, PaymentStatus::COMPLETED);
            }

            return self::updatePaymentStatus($paymentTransaction, PaymentStatus::PENDING);

        } catch (Exception $e) {

            self::updatePaymentStatusByType($request->item_id, $request->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}