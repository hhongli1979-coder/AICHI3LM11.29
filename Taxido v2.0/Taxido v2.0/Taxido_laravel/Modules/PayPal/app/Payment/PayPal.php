<?php

    namespace Modules\PayPal\Payment;

    use Exception;
    use Illuminate\Support\Str;
    use App\Enums\PaymentStatus;
    use App\Http\Traits\PaymentTrait;
    use App\Models\PaymentTransactions;
    use Modules\PayPal\Enums\PaypalEvent;
    use Modules\PayPal\Enums\PaypalCurrencies;

    class PayPal
    {
        use PaymentTrait;

        public static function getPayPalConfigs()
        {
            return config('paypal.configs');
        }

        public static function getPayPalPaymentUrl()
        {
            $paypal = self::getPayPalConfigs();

            return ($paypal['paypal_mode'] == '1') ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
        }

        public static function getAccessToken()
        {

            $paypal = self::getPayPalConfigs();
            $payment_url = self::getPayPalPaymentUrl();
            if (! empty($paypal)) {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $payment_url.'/v1/oauth2/token');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials');
                curl_setopt($ch, CURLOPT_USERPWD, @$paypal['paypal_client_id'].':'.@$paypal['paypal_client_secret']);

                $headers = [];
                $headers[] = 'Content-Type: application/x-www-form-urlencoded';
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

                $accessToken = curl_exec($ch);
                if (curl_errno($ch)) {
                    echo 'Error:'.curl_error($ch);
                }
                curl_close($ch);

                return json_decode($accessToken, true);
            }
        }

        public static function getIntent($obj, $request)
        {
            try {

                $payment = PaymentTransactions::updateOrCreate([
                    'item_id' => $obj?->id,
                    'type' => $request->type,
                    'is_verified' => false,
                ], [
                    'item_id' => $obj?->id,
                    'transaction_id' => uniqid(),
                    'amount' => $obj?->total,
                    'payment_method' => config('paypal.name'),
                    'payment_status' => PaymentStatus::PENDING,
                    'type' => $request->type,
                    'request_type' => $request->request_type,
                    'redirect_url' => $request->redirect_url
                ]);

                $defaultCurrencyCode = getDefaultCurrencyCode();
                if (! in_array($defaultCurrencyCode, array_column(PaypalCurrencies::cases(), 'value'))) {
                    throw new Exception($defaultCurrencyCode.' currency code is not support for PayPal.', 400);
                }

                $token = self::getAccessToken();
                $payment_url = self::getPayPalPaymentUrl();
                if (isset($token['access_token'])) {
                    $payload = [];
                    $payload['intent'] = 'CAPTURE';
                    $payload['purchase_units'] = [
                        [
                            'invoice_id' => $obj?->id,
                            'amount' => [
                                'currency_code' => $request->currency_code ?? $defaultCurrencyCode,
                                'value' => currencyConvert($request->currency_code ?? $defaultCurrencyCode, roundNumber($obj->total)),
                            ],
                            'description' => 'Details From '.config('app.name'),
                        ],
                    ];
                    $payload['application_context'] = [
                        'brand_name' => config('app.name'),
                        'user_action' => 'PAY_NOW',
                        'payment_method' => [
                            'payer_selected' => 'PAYPAL',
                            'payee_preferred' => 'IMMEDIATE_PAYMENT_REQUIRED',
                        ],
                        'return_url' => route('paypal.status'),
                        'cancel_url' => route('paypal.status'),
                    ];

                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, $payment_url.'/v2/checkout/orders');
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                    curl_setopt($ch, CURLOPT_POST, 1);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

                    $headers = [];
                    $headers[] = 'Content-Type: application/json';
                    $headers[] = 'Authorization: Bearer '.$token['access_token'];
                    $headers[] = 'Paypal-Request-Id:'.Str::uuid();
                    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                    $transaction = curl_exec($ch);
                    if (curl_errno($ch)) {
                        throw new Exception('Error:'.curl_error($ch), 500);
                    }
                    curl_close($ch);
                    $transaction = json_decode($transaction, true);
                    if (isset($transaction['links']) && isset($transaction['id'])) {
                        self::updatePaymentTransactionId($payment, $transaction['id']);
                        return [
                            'item_id' => $obj?->id,
                            'url' => next($transaction['links'])['href'],
                            'transaction_id' => $transaction['id'],
                            'type' => $request->type,
                            'is_redirect' => true,
                        ];
                    }
                }

                throw new Exception("Something went to wrong in paypal gateway", 500);

            } catch (Exception $e) {

                self::updatePaymentStatusByType($obj?->id, $request?->type, PaymentStatus::FAILED);
                throw new Exception($e->getMessage(), $e->getCode());
            }
        }

        public static function status($transaction_id)
        {
            try {

                $token = self::getAccessToken();
                $payment_url = self::getPayPalPaymentUrl();
                if (isset($token['access_token'])) {
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, $payment_url."/v2/checkout/orders/{$transaction_id}/capture");
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                    curl_setopt($ch, CURLOPT_POST, 1);

                    $headers = [];
                    $headers[] = 'Content-Type: application/json';
                    $headers[] = 'Authorization: Bearer '.$token['access_token'];
                    $headers[] = 'Paypal-Request-Id:'.Str::uuid();
                    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

                    $payment = curl_exec($ch);
                    if (curl_errno($ch)) {
                        echo 'Error:'.curl_error($ch);
                    }
                    curl_close($ch);
                    $payment = json_decode($payment);
                    $payment_status = PaymentStatus::PENDING;
                    $paymentTransaction = self::getPaymentByTransactionId($transaction_id);
                    if (isset($payment?->status)) {
                        $payment_status = $payment?->status;
                    } elseif (! isset($payment?->status) && isset($payment?->details)) {
                        if (head($payment?->details)?->issue == PaypalEvent::ORDER_ALREADY_CAPTURED) {
                            return $paymentTransaction;
                        }
                    } else {
                        $payment_status = PaymentStatus::FAILED;
                    }

                    return self::updatePaymentStatus($paymentTransaction, $payment_status);
                }

                throw new Exception('Provided transaction id is invalid!', 400);
            } catch (Exception $e) {

                self::updatePaymentStatusByTrans($transaction_id, PaymentStatus::FAILED);
                throw new Exception($e->getMessage(), $e->getCode());
            }
        }

        public static function getPaymentByTransactionId($transaction_id)
        {
            return PaymentTransactions::where('transaction_id', $transaction_id)->first();
        }

        public static function getPaymentByItemId($item_id)
        {
            return PaymentTransactions::where('item_id', $item_id)->first();
        }

        public static function webhook($request)
        {

            try {
                $config = self::getPayPalConfigs();
                $payment_url = self::getPayPalPaymentUrl();
                $token = self::getAccessToken();

                if (isset($token['access_token'])) {
                    $payload = [
                        'auth_algo' => $request->header('PAYPAL-AUTH-ALGO', null),
                        'cert_url' => $request->header('PAYPAL-CERT-URL', null),
                        'transmission_id' => $request->header('PAYPAL-TRANSMISSION-ID', null),
                        'transmission_sig' => $request->header('PAYPAL-TRANSMISSION-SIG', null),
                        'transmission_time' => $request->header('PAYPAL-TRANSMISSION-TIME', null),
                        'webhook_id' => $config->webhook_id,
                        'webhook_event' => $request->all(),
                    ];

                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, $payment_url.'/v1/notifications/verify-webhook-signature');
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                    curl_setopt($ch, CURLOPT_POST, 1);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

                    $headers = [];
                    $headers[] = 'Content-Type: application/json';
                    $headers[] = 'Authorization: Bearer '.$token['access_token'];
                    $headers[] = 'Paypal-Request-Id:'.Str::uuid();
                    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                    $event = curl_exec($ch);
                    if (! isset($event['verification_status'])) {
                        throw new Exception($event['error']['name'], 500);
                    }

                    switch ($request->event_type) {
                        case PaypalEvent::COMPLETED:
                            $payment_status = PaymentStatus::COMPLETED;
                            break;

                        case PaypalEvent::PENDING:
                            $payment_status = PaymentStatus::PENDING;
                            break;

                        case PaypalEvent::REFUNDED:
                            $payment_status = PaymentStatus::REFUNDED;
                            break;

                        case PaypalEvent::DECLINED:
                        case PaypalEvent::CANCELLED:
                            $payment_status = PaymentStatus::CANCELLED;
                            break;

                        default:
                            $payment_status = PaymentStatus::FAILED;
                    }

                    $paymentTransaction = self::getPaymentByItemId($request->resource['invoice_id']);

                    return self::updatePaymentStatus($paymentTransaction, $payment_status);
                }

                throw new Exception('Provided transactions id is invalid!', 400);
            } catch (Exception $e) {

                throw new Exception($e->getMessage(), $e->getCode());
            }
        }
    }
