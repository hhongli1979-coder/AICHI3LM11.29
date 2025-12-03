<?php

namespace Modules\Instamojo\Payment;

use Exception;
use App\Helpers\Helpers;
use App\Enums\PaymentStatus;
use App\Http\Traits\PaymentTrait;
use App\Models\PaymentTransactions;
use App\Http\Traits\TransactionsTrait;
use Modules\Instamojo\Enums\InstamojoEvent;

class Instamojo
{
    use PaymentTrait, TransactionsTrait;

    public static function getPaymentUrl()
    {
        $payment_base_url = 'https://api.instamojo.com';
        if (env('INSTAMOJO_SANDBOX_MODE')) {
            $payment_base_url = 'https://test.instamojo.com';
        }

        return $payment_base_url;
    }

    public static function getProvider()
    {
        $ch = curl_init();
        $url = self::getPaymentUrl().'/oauth2/token/';
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $credentials = [
            'grant_type' => 'client_credentials',
            'client_id' => env('INSTAMOJO_CLIENT_ID'),
            'client_secret' => env('INSTAMOJO_CLIENT_SECRET'),
        ];

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($credentials));
        $result = curl_exec($ch);

        curl_close($ch);
        $response = json_decode($result);

        if (isset($response?->error)) {
            throw new Exception($response?->error, 500);
        }

        $accessToken = $response?->access_token;

        return $accessToken;
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
                'payment_method' => config('instamojo.name'),
                'payment_status' => PaymentStatus::PENDING,
                'type' => $request->type,
                'request_type' => $request->request_type,
                'redirect_url' => $request->redirect_url
            ]);

            $accessToken = 'Bearer '.self::getProvider();
            $url = self::getPaymentUrl().'/v2/payment_requests/';
            $webhook_url = route('instamojo.webhook');
            $parsed_url = parse_url($webhook_url);
            if (isset($parsed_url['host'])) {
                if ($parsed_url['host'] == 'localhost' || $parsed_url['host'] == '127.0.0.1') {
                    $webhook_url = '';
                }
            }

            $intent = [
                'purpose' => 'Item_id #'.$obj?->id,
                'amount' => currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), $obj?->total),
                'buyer_name' => $obj?->consumer['name'],
                'email' => $obj?->consumer['email'],
                'redirect_url' => route('instamojo.status', [
                    'item_id' => $obj->id,
                    'type' => $request->type,
                ]),
                'send_email' => 'True',
                'webhook' => $webhook_url,
                'allow_repeated_payments' => 'False',
            ];

            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_HEADER, false);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($curl, CURLOPT_HTTPHEADER, ["Authorization: $accessToken"]);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($intent));

            $response = curl_exec($curl);
            $err = curl_error($curl);
            curl_close($curl);

            $response = json_decode($response);
            if ($err || isset($response?->error)) {
                throw new Exception($err, 500);
            } else {
                self::updatePaymentTransactionId($paymentTransaction, $response?->id);

                return [
                    'item_id' => $obj?->id,
                    'url' => $response?->longurl,
                    'transaction_id' => $response?->id,
                    'is_redirect' => true,
                    'type' => $request->type,
                ];
            }

            throw new Exception('Something went to wrong in instamojo gateway', 500);
        } catch (Exception $e) {

            self::updatePaymentStatusByType($obj?->id, $request?->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function status($request)
    {
        try {

            $paymentTransaction = PaymentTransactions::where([
                'item_id' => $request->item_id, 'type' => $request->type,
            ])->first();
            $transaction_id = $paymentTransaction?->transaction_id;
            $accessToken = 'Bearer '.self::getProvider();
            $url = self::getPaymentUrl().'/v2/payment_requests/'.$transaction_id;

            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_HEADER, false);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($curl, CURLOPT_HTTPHEADER, ["Authorization: $accessToken"]);

            $response = curl_exec($curl);
            $response = json_decode($response, true);
            $err = curl_error($curl);
            curl_close($curl);

            if ($err) {
                throw new Exception($err, 500);
            } else {
                if (isset($response['status'])) {
                    if ($response['status'] == InstamojoEvent::COMPLETED) {
                        return self::updatePaymentStatus($paymentTransaction, PaymentStatus::COMPLETED);
                    }
                }
            }

            throw new Exception($response, 500);
        } catch (Exception $e) {

            self::updatePaymentStatusByType($request->item_id, $request->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function webhook($request)
    {
        try {

            $data = $_POST;
            if (! isset($data['mac'])) {
                $data = $request;
            }

            if (isset($data['mac'])) {
                $mac_provided = $data['mac'];
                unset($data['mac']);
                $ver = explode('.', phpversion());
                $major = (int) head($ver);
                $minor = (int) next($ver);
                if ($major >= 5 and $minor >= 4) {
                    ksort($data, SORT_STRING | SORT_FLAG_CASE);
                } else {
                    uksort($data, 'strcasecmp');
                }

                $mac_calculated = hash_hmac('sha1', implode('|', $data), env('INSTAMOJO_SALT_KEY'));
                $paymentTransaction = PaymentTransactions::where([
                    'transaction_id' => $data['payment_request_id'],
                ])->first();

                if ($mac_provided == $mac_calculated) {
                    if (isset($data['status'])) {
                        if ($data['status'] == InstamojoEvent::CREDIT) {
                            return self::updatePaymentStatus($paymentTransaction, PaymentStatus::COMPLETED);
                        }
                    }

                    return self::updatePaymentStatus($paymentTransaction, PaymentStatus::FAILED);
                }

                throw new Exception('Invalid MAC passed', 500);
            }

        } catch (Exception $e) {

            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
