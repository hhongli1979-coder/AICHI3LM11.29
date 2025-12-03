<?php

namespace Modules\Sslcommerz\Payment;

use Exception;
use App\Enums\PaymentStatus;
use App\Http\Traits\PaymentTrait;
use App\Models\PaymentTransactions;
use App\Http\Traits\TransactionsTrait;
use Modules\Sslcommerz\Enums\SslcmzEvent;

class Sslcommerz
{
    use PaymentTrait, TransactionsTrait;

    public static function getPaymentUrl()
    {
        $payment_base_url = 'https://securepay.sslcommerz.com';
        if (env('SSLC_SANDBOX_MODE')) {
            $payment_base_url = 'https://sandbox.sslcommerz.com';
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
                'transaction_id' => $transaction_id,
                'payment_method' => config('sslcommerz.name'),
                'amount' => $obj?->total,
                'payment_status' => PaymentStatus::PENDING,
                'type' => $request->type,
                'request_type' => $request->request_type,
                'redirect_url' => $request->redirect_url
            ]);

            $url = self::getPaymentUrl().'/gwprocess/v4/api.php';
            $data = [
                'item_id' => $obj->id,
                'type' => $request->type,
            ];

            $intent = [
                'store_id' => env('SSLC_STORE_ID'),
                'store_passwd' => env('SSLC_STORE_PASSWORD'),
                'total_amount' => currencyConvert($request->currency_code ?? getDefaultCurrencyCode(),roundNumber($obj?->total)),
                'currency' => $request->currency_code ?? getDefaultCurrencyCode(),
                'tran_id' => uniqid(),
                'success_url' => route('sslcommerz.webhook', $data),
                'cancel_url' => route('sslcommerz.webhook', $data),
                'cus_name' => $obj?->consumer['name'],
                'cus_email' => $obj?->consumer['email'],
                'cus_add1' => 'N/A',
                'cus_add2' => '',
                'cus_city' => '',
                'cus_state' => '',
                'cus_postcode' => '',
                'cus_country' => '',
                'cus_phone' => 'N/A',
                'cus_fax' => '',
                'ship_name' => 'N/A',
                'ship_add1' => 'N/A',
                'ship_add2' => 'N/A',
                'ship_city' => 'N/A',
                'ship_state' => 'N/A',
                'ship_postcode' => 'N/A',
                'ship_phone' => 'N/A',
                'ship_country' => 'N/A',
                'shipping_method' => 'NO',
                'product_name' => 'N/A',
                'product_category' => 'N/A',
                'product_profile' => 'service',
            ];

            $handle = curl_init();
            curl_setopt($handle, CURLOPT_URL, $url);
            curl_setopt($handle, CURLOPT_TIMEOUT, 30);
            curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 30);
            curl_setopt($handle, CURLOPT_POST, 1);
            curl_setopt($handle, CURLOPT_POSTFIELDS, $intent);
            curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);

            $response = curl_exec($handle);
            $err = curl_error($handle);
            $code = curl_getinfo($handle, CURLINFO_HTTP_CODE);
            curl_close($handle);

            $payment = json_decode($response);
            if ($payment->status == SslcmzEvent::SUCCESS && empty($err)) {
                return [
                    'item_id' => $obj?->id,
                    'url' => $payment->redirectGatewayURL,
                    'transaction_id' => $transaction_id,
                    'is_redirect' => true,
                    'type' => $request->type,
                ];
            }

            throw new Exception('Something went to wrong in sslcommerz gateway', 500);
        } catch (Exception $e) {

            self::updatePaymentStatusByType($obj?->id, $request?->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function webhook($request)
    {
        try {

            $payment = $request->all();
            $paymentTransaction = PaymentTransactions::where([
                'item_id' => $payment['item_id'], 'type' => $payment['type'],
            ])->first();

            if (! empty($payment) && isset($payment['tran_id'])) {
                if ($payment['status'] == SslcmzEvent::VALID && ! $payment['error']) {
                    $status = PaymentStatus::COMPLETED;
                } elseif ($payment['status'] == SslcmzEvent::UNATTEMPTED) {
                    $status = PaymentStatus::PENDING;
                }

                self::updatePaymentTransactionId($paymentTransaction, $payment['tran_id']);

                return self::updatePaymentStatus($paymentTransaction, $status);

            }

            return self::updatePaymentStatus($paymentTransaction, PaymentStatus::FAILED);

        } catch (Exception $e) {

            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
