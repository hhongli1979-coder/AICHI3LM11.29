<?php

namespace Modules\Midtrans\Payment;

use Exception;
use App\Enums\PaymentStatus;
use App\Http\Traits\PaymentTrait;
use App\Models\PaymentTransactions;
use App\Http\Traits\TransactionsTrait;
use Modules\Midtrans\Enums\MidtransEvent;

class Midtrans
{
    use PaymentTrait, TransactionsTrait;
    public static function getMidtransConfigs()
    {
        return config('midtrans.configs');
    }

    public static function getMidtransPaymentUrl()
    {
        $midtrans = self::getMidtransConfigs();

        return ($midtrans['midtrans_sandbox_mode'] == '1') ? 'https://app.sandbox.midtrans.com/snap/v1/transactions' : 'https://app.midtrans.com/snap/v1/transactions';
    }

    public static function getIntent($obj, $request)
    {
        try {
            $transaction_id = uniqid();
            $paymentTransaction = PaymentTransactions::updateOrCreate([
                'item_id' => $obj?->id,
                'type' => $request->type,
                'is_verified' => false,
            ], [
                'item_id' => $obj?->id,
                'transaction_id' => $transaction_id,
                'amount' => $obj?->total,
                'payment_method' => config('midtrans.name'),
                'payment_status' => PaymentStatus::PENDING,
                'type' => $request->type,
                'request_type' => $request->request_type,
                'redirect_url' => $request->redirect_url
            ]);
            $data = [
                'item_id' => $obj->id,
                'type' => $request->type,
            ];
            $intent = [
                'transaction_details' => array(
                    'order_id' => $obj?->id,
                    'gross_amount' => currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), roundNumber($obj->total))
                ),
                "callbacks" => array(
                    "finish" => route('midtrans.webhook',$data)
                ),
                'customer_details' => array(
                    'first_name' => 'N/A',
                    'last_name' => 'N/A',

                    'phone' => 'N/A',
                    )];
                    $auth = base64_encode(config('midtrans.configs.server_key'));
                    $payment_url = self::getMidtransPaymentUrl();

            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $payment_url);
            curl_setopt($curl, CURLOPT_HEADER, false);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($curl, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                "Authorization: Basic $auth"
            ]);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($intent));

            $response = curl_exec($curl);
            if (curl_errno($curl)) {
                echo 'Error:'.curl_error($curl);
            }
            curl_close($curl);

            $response = json_decode($response);
                self::updatePaymentTransactionId($paymentTransaction, $transaction_id);
                return [
                    'item_id' => $obj?->id,
                    'url' => $response?->redirect_url,
                    'transaction_id' => $transaction_id,
                    'is_redirect' => true,
                    'type' => $request->type,
                ];

            throw new Exception('Something went to wrong in Midtrans gateway', 500);

        } catch (Exception $e) {

            self::updatePaymentStatusByType($obj?->id, $request?->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function webhook($request)
    {
        try{
        $paymentTransaction = PaymentTransactions::where([
            'item_id' => $request->item_id, 'type' => $request->type,
            ])->first();
        $transaction_id = $paymentTransaction->transaction_id;
        self::updatePaymentTransactionId($paymentTransaction, $transaction_id);
        if ($request->transaction_status == MidtransEvent::CAPTURE) {

        $auth = base64_encode(config('midtrans.configs.server_key'));
        $midtrans = self::getMidtransConfigs();
        $url = ($midtrans['midtrans_sandbox_mode'] == '1') ? "https://api.sandbox.midtrans.com/v2/$request->order_id/status" : "https://api.midtrans.com/v2/$request->order_id/status";
        $curl = curl_init();
                curl_setopt_array($curl, [
                    CURLOPT_URL =>  $url,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => '',
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 0,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => 'GET',
                    CURLOPT_HTTPHEADER => [
                        'Content-Type: application/json',
                        "Authorization: Basic $auth",
                    ],
                ]);

            $response = curl_exec($curl);
            if (curl_errno($curl)) {
                echo 'Error:'.curl_error($curl);
            }
            curl_close($curl);

            $payment = json_decode($response);
            self::updatePaymentTransactionId($paymentTransaction, $payment->transaction_id);
            if ($payment->transaction_status == MidtransEvent::CAPTURE && empty($err)) {
                return self::updatePaymentStatus($paymentTransaction, PaymentStatus::COMPLETED);
            }
        }
    }
        catch (Exception $e) {
            self::updatePaymentStatusByType($request->item_id, $request->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
