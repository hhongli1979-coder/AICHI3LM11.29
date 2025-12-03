<?php

namespace Modules\PhonePe\Payment;

use Exception;
use App\Enums\PaymentStatus;
use App\Http\Traits\PaymentTrait;
use App\Models\PaymentTransactions;
use App\Http\Traits\TransactionsTrait;

class PhonePe
{
    use PaymentTrait, TransactionsTrait;

    public static function getPaymentUrl()
    {
        $payment_base_url = 'https://api.phonepe.com/apis/hermes';
        if (env('PHONEPE_SANDBOX_MODE')) {
            $payment_base_url = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
        }

        return $payment_base_url;
    }

    public static function getIntent($obj, $request)
    {
        try {

            $transaction_id = uniqid();
            PaymentTransactions::updateOrCreate([
                'item_id' => $obj?->id,
                'type' => $request->type,
                'is_verified' => false,
            ], [
                'item_id' => $obj?->id,
                'amount' => $obj?->total,
                'transaction_id' => $transaction_id,
                'payment_method' => config('phonepe.name'),
                'payment_status' => PaymentStatus::PENDING,
                'type' => $request->type,
                'request_type' => $request->request_type,
                'redirect_url' => $request->redirect_url
            ]);

            $intent = [
                'merchantId' => env('PHONEPE_MERCHANT_ID'),
                'merchantTransactionId' => $transaction_id,
                'merchantUserId' => $obj?->consumer_id,
                'merchantOrderId' => $obj->id,
                'amount' => (currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), $obj?->total) * 100),
                'redirectUrl' => route('phonepe.webhook', [
                    'item_id' => $obj->id,
                    'type' => $request->type,
                    'transaction_id' => $transaction_id,
                ]),
                'callbackUrl' => route('phonepe.webhook', [
                    'item_id' => $obj->id,
                    'type' => $request->type,
                    'transaction_id' => $transaction_id,
                ]),
                'mobileNumber' => $obj?->consumer?->phone,
                'redirectMode' => 'POST',
                'paymentInstrument' => [
                    'type' => 'PAY_PAGE',
                ],
            ];

            $payloadMain = base64_encode(json_encode($intent));
            $string = $payloadMain.'/pg/v1/pay'.env('PHONEPE_SALT_KEY');
            $sha256 = hash('sha256', $string);
            $x_header = $sha256.'###'.env('PHONEPE_SALT_INDEX');
            $intent = json_encode(['request' => $payloadMain]);

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => self::getPaymentUrl().'/pg/v1/pay',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $intent,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'X-VERIFY: '.$x_header,
                    'accept: application/json',
                ],
            ]);

            $response = curl_exec($curl);
            $err = curl_error($curl);
            curl_close($curl);

            if (! is_null($err) && $err) {
                throw new Exception($err, 500);
            } else {
                $res = json_decode($response);
                if (isset($res->success) && $res->success == '1') {
                    $paymentUrl = $res?->data?->instrumentResponse?->redirectInfo?->url;

                    return [
                        'item_id' => $obj?->id,
                        'url' => $paymentUrl,
                        'transaction_id' => $transaction_id,
                        'is_redirect' => true,
                        'type' => $request->type,
                    ];
                } elseif (isset($res->success) && ! $res->success) {
                    throw new Exception($res->message, 500);
                }
            }

            throw new Exception('Something went to wrong in phonepe gateway', 500);
        } catch (Exception $e) {

            self::updatePaymentStatusByType($obj?->id, $request?->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function webhook($request)
    {
        try {

            $transaction_id = $request->transaction_id;
            $paymentTransaction = PaymentTransactions::where([
                'item_id' => $request->item_id, 'type' => $request->type,
            ])->first();

            self::updatePaymentTransactionId($paymentTransaction, $transaction_id);
            $x_header = hash('sha256', '/pg/v1/status/'.env('PHONEPE_MERCHANT_ID')."/{$transaction_id}".env('PHONEPE_SALT_KEY')).'###'.env('PHONEPE_SALT_INDEX');
            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => self::getPaymentUrl().'/pg/v1/status/'.env('PHONEPE_MERCHANT_ID').'/'.$transaction_id,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'GET',
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'X-VERIFY: '.$x_header,
                    'X-MERCHANT-ID:'.env('PHONEPE_MERCHANT_ID'),
                ],
            ]);

            $response = curl_exec($curl);
            $response = json_decode($response, true);
            $err = curl_error($curl);
            curl_close($curl);
            if (isset($response['code']) && $response['code'] == 'PAYMENT_SUCCESS') {
                return self::updatePaymentStatus($paymentTransaction, PaymentStatus::COMPLETED);
            } elseif (isset($err) && ! empty($err)) {
                throw new Exception($err, 500);
            } elseif (is_null($response) || empty($err)) {
                return $paymentTransaction;
            }

            throw new Exception($response, 500);
        } catch (Exception $e) {

            self::updatePaymentStatusByType($request->item_id, $request->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
