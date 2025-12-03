<?php

namespace Modules\FlutterWave\Payment;

use Exception;
use App\Enums\PaymentStatus;
use App\Http\Traits\PaymentTrait;
use App\Models\PaymentTransactions;
use App\Http\Traits\TransactionsTrait;
use Modules\FlutterWave\Enums\FlwEvent;

class FlutterWave
{
    use PaymentTrait, TransactionsTrait;

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
                'payment_method' => config('flutterwave.name'),
                'payment_status' => PaymentStatus::PENDING,
                'type' => $request->type,
            ]);

            $data = [
                'item_id' => $obj->id,
                'type' => $request->type,
            ];

            $intent = [
                'tx_ref' => time(),
                'amount' =>  currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), roundNumber($obj?->total)),
                'currency' => getDefaultCurrencyCode(),
                'payment_options' => 'card',
                'redirect_url' => route('flutterwave.webhook', $data),
                'customer' => [
                    'email' => $obj?->consumer['email'],
                    'name' => $obj?->consumer['name'],
                ],
                'meta' => [
                    'price' => roundNumber($obj?->total),
                ],
                'customizations' => [
                    'title' => 'Pay Way '.config('app.name'),
                    'description' => '',
                ],
            ];

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => 'https://api.flutterwave.com/v3/payments',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => json_encode($intent),
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer '.env('FLW_SECRET_KEY'),
                    'Content-Type: application/json',
                ],
            ]);

            $response = curl_exec($curl);
            $err = curl_error($curl);
            curl_close($curl);
            $payment = json_decode($response);
            if ($payment?->status == FlwEvent::SUCCESS && empty($err)) {
                return [
                    'item_id' => $obj?->id,
                    'url' => $payment?->data?->link,
                    'transaction_id' => $transaction_id,
                    'is_redirect' => true,
                    'type' => $request->type,
                ];
            } elseif ($payment?->status == FlwEvent::ERROR) {
                throw new Exception($payment?->message, 500);
            }

            throw new Exception('Something went to wrong in flutterwave gateway', 500);
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
            self::updatePaymentTransactionId($paymentTransaction, $transaction_id);
            if ($request->status == FlwEvent::SUCCESSFUL) {
                $transaction_id = $request->transaction_id;
                $curl = curl_init();
                curl_setopt_array($curl, [
                    CURLOPT_URL => "https://api.flutterwave.com/v3/transactions/{$transaction_id}/verify",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => '',
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 0,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => 'GET',
                    CURLOPT_HTTPHEADER => [
                        'Content-Type: application/json',
                        'Authorization: Bearer '.env('FLW_SECRET_KEY'),
                    ],
                ]);
                $response = curl_exec($curl);
                $err = curl_error($curl);
                curl_close($curl);

                $payment = json_decode($response);
                if ($payment?->data?->status == FlwEvent::SUCCESSFUL && empty($err)) {
                    return self::updatePaymentStatus($paymentTransaction, PaymentStatus::COMPLETED);
                }
            }

            return self::updatePaymentStatus($paymentTransaction, PaymentStatus::FAILED);

        } catch (Exception $e) {

            self::updatePaymentStatusByType($request->item_id, $request->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
