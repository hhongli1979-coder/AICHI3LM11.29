<?php

namespace Modules\BKash\Payment;


use Exception;
use App\Enums\PaymentStatus;
use App\Http\Traits\PaymentTrait;
use App\Models\PaymentTransactions;
use Modules\BKash\Enums\BkashEvent;
use App\Http\Traits\TransactionsTrait;

class BKash
{
    use PaymentTrait, TransactionsTrait;

    public static function getPaymentUrl()
    {
        $payment_base_url = 'https://tokenized.pay.bka.sh/v1.2.0-beta';
        if (env('BKASH_SANDBOX_MODE')) {
            $payment_base_url = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';
        }

        return $payment_base_url;
    }

    public static function getProvider()
    {
        $provider = [
            'app_key' => env('BKASH_APP_KEY'),
            'app_secret' => env('BKASH_APP_SECRET'),
        ];

        $curl = curl_init(self::getPaymentUrl().'/tokenized/checkout/token/grant');
        $token = json_encode($provider);
        $header = [
            'Content-Type:application/json',
            'username:'.env('BKASH_USERNAME'),
            'password:'.env('BKASH_PASSWORD'),
        ];

        curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $token);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        $response = curl_exec($curl);
        curl_close($curl);

        return $response;
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
                'payment_method' => config('bkash.name'),
                'payment_status' => PaymentStatus::PENDING,
                'type' => $request->type,
                'request_type' => $request->request_type
            ]);

            $provider = self::getProvider();
            if (is_array($provider) && ! is_null($provider)) {
                $providerId = $provider['id_token'];
                $payload = ['item_id' => $obj->id, 'type' => $request->type];
                $intent = [
                    'mode' => '0011',
                    'amount' => currencyConvert('BDT', round($obj?->total, 2)),
                    'currency' => 'BDT',
                    'intent' => 'sale',
                    'payerReference' => '1',
                    'merchantInvoiceNumber' => $obj?->id,
                    'callbackURL' => route('bkash.webhook', $payload),
                ];

                $header = [
                    'Content-Type:application/json',
                    'authorization:'.$providerId,
                    'x-app-key:'.env('BKASH_APP_KEY'),
                ];

                $curl = curl_init(self::getPaymentUrl().'/tokenized/checkout/create');
                curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
                curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($curl, CURLOPT_POSTFIELDS, $intent);
                curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
                curl_setopt($curl, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
                $response = curl_exec($curl);
                $err = curl_error($curl);
                curl_close($curl);

                $payment = json_decode($response);
                if (! is_null($err)) {
                    throw new Exception($err, 500);
                } else {
                    if (isset($payment?->bkashURL) && $payment?->statusMessage == 'Successful') {
                        self::updatePaymentTransactionId($paymentTransaction, $payment->paymentID);

                        return [
                            'item_id' => $obj?->id,
                            'url' => $payment?->bkashURL,
                            'transaction_id' => $payment->paymentID,
                            'is_redirect' => true,
                            'type' => $request->type,
                        ];
                    }
                }

                throw new Exception('Something went to wrong in bkash gateway', 500);
            }

            throw new Exception('Invalid Bkash credentials', 500);
        } catch (Exception $e) {

            self::updatePaymentStatusByType($obj?->id, $request?->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function webhook($request)
    {
        try {

            $paymentTransaction = PaymentTransactions::where([
                'item_id' => $request->item_id, 'type' => $request->type,
            ])->first();

            $transaction_id = $paymentTransaction->transaction_id;
            $provider = self::getProvider();
            $providerId = $provider['id_token'];
            $intent = [
                'paymentID' => $transaction_id,
            ];

            $request_body = json_encode($intent);
            $header = [
                'Content-Type:application/json',
                'authorization:'.$providerId,
                'x-app-key:'.env('BKASH_APP_KEY'),
            ];

            $curl = curl_init(self::getPaymentUrl().'/tokenized/checkout/execute');
            curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $request_body);
            curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
            $result = curl_exec($curl);
            $payment = json_decode($result);
            curl_close($curl);
            $err = curl_error($curl);

            if ($payment->statusCode == '0000' && $payment->statusMessage == BkashEvent::SUCCESSFULL) {
                if ($payment->agreementStatus == BkashEvent::COMPLETED) {
                    $status = PaymentStatus::COMPLETED;

                    return self::updatePaymentStatus($paymentTransaction, $status);

                } elseif (isset($err) && ! empty($err)) {
                    throw new Exception($err, 500);
                } else {
                    return $paymentTransaction;
                }
            }

            throw new Exception($payment?->statusMessage, 500);
        } catch (Exception $e) {

            self::updatePaymentStatusByType($request->item_id, $request->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
