<?php

namespace Modules\CCAvenue\Payment;

use Exception;
use App\Enums\PaymentStatus;
use App\Http\Traits\PaymentTrait;
use App\Models\PaymentTransactions;
use App\Http\Traits\TransactionsTrait;
use Modules\CCAvenue\Enums\CCAvenueEvent;

class CCAvenue
{
    use PaymentTrait, TransactionsTrait;

    public static function getPaymentUrl()
    {
        $payment_base_url = 'https://secure.ccavenue.com';
        if (env('CCAVENUE_SANDBOX_MODE')) {
            $payment_base_url = 'https://test.ccavenue.com';
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
                'amount' => $obj?->total,
                'payment_method' => config('ccavenue.name'),
                'payment_status' => PaymentStatus::PENDING,
                'type' => $request->type,
                'request_type' => $request->request_type,
                'redirect_url' => $request->redirect_url
            ]);

            $merchant_data = '';
            $data = [
                'type' => $request->type,
            ];

            $amount = currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), $obj?->total);
            if (env('CCAVENUE_SANDBOX_MODE')) {
                $amount = 1.0;
            }

            $intent = [
                'merchant_id' => env('CCAVENUE_MERCHANT_ID'),
                'order_id' => $obj?->id,
                'amount' => $amount,
                'currency' => $request->currency_code ?? getDefaultCurrencyCode(),
                'redirect_url' => route('ccavenue.webhook', $data),
                'cancel_url' => route('ccavenue.webhook', $data),
                'language' => 'EN',
            ];

            foreach ($intent as $key => $value) {
                $merchant_data .= $key.'='.$value.'&';
            }

            $encrypted_data = self::encryptCC($merchant_data, env('CCAVENUE_WORKING_KEY'));
            $url = self::getPaymentUrl().'/transaction/transaction.do?command=initiateTransaction&encRequest='.$encrypted_data.'&access_code='.env('CCAVENUE_ACCESS_CODE');

            return [
                'item_id' => $obj?->id,
                'url' => $url,
                'transaction_id' => $transaction_id,
                'is_redirect' => true,
                'type' => $request->type,
            ];

            throw new Exception('Something went to wrong in ccavenue gateway', 500);
        } catch (Exception $e) {

            self::updatePaymentStatusByType($obj?->id, $request?->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public static function encryptCC($plainText, $key)
    {
        $key = self::hextobin(md5($key));
        $initVector = pack('C*', 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F);
        $openMode = openssl_encrypt($plainText, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $initVector);
        $encryptedText = bin2hex($openMode);

        return $encryptedText;
    }

    public static function decryptCC($encryptedText, $key)
    {
        $key = self::hextobin(md5($key));
        $initVector = pack('C*', 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F);
        $encryptedText = self::hextobin($encryptedText);
        $decryptedText = openssl_decrypt($encryptedText, 'AES-128-CBC', $key, OPENSSL_RAW_DATA, $initVector);

        return $decryptedText;
    }

    public static function pkcs5_padCC($plainText, $blockSize)
    {
        $pad = $blockSize - (strlen($plainText) % $blockSize);

        return $plainText.str_repeat(chr($pad), $pad);
    }

    public static function hextobin($hexString)
    {
        $length = strlen($hexString);
        $binString = '';
        $count = 0;
        while ($count < $length) {
            $subString = substr($hexString, $count, 2);
            $packedString = pack('H*', $subString);
            if ($count == 0) {
                $binString = $packedString;
            } else {
                $binString .= $packedString;
            }

            $count += 2;
        }

        return $binString;
    }

    public static function webhook($request)
    {
        try {

            error_reporting(0);
            $encPaymentRes = $request->encResp;
            $decPaymentRes = self::decryptCC($encPaymentRes, env('CCAVENUE_WORKING_KEY'));
            $paymentValues = explode('&', $decPaymentRes);
            for ($i = 0; $i < count($paymentValues); $i++) {
                $payment = explode('=', $paymentValues[$i]);
                if ($i == 0) {
                    $order_id = next($payment);
                }
                if ($i == 2) {
                    $transaction_id = next($payment);
                }
                if ($i == 3) {
                    $payment_status = next($payment);
                }
            }

            $paymentTransaction = PaymentTransactions::where([
                'item_id' => $order_id, 'type' => $request->type,
            ])->first();

            if ($paymentTransaction) {
                self::updatePaymentTransactionId($paymentTransaction, $transaction_id);
                if ($payment_status === CCAvenueEvent::SUCCESS) {
                    return self::updatePaymentStatus($paymentTransaction, PaymentStatus::COMPLETED);
                }

                if ($payment_status === CCAvenueEvent::FAILURE
                  || $payment_status === CCAvenueEvent::ABORTED) {

                    return self::updatePaymentStatus($paymentTransaction, PaymentStatus::FAILED);
                }
            }

            return $paymentTransaction;

        } catch (Exception $e) {

            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
