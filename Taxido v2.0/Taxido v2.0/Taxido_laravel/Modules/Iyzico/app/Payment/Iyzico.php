<?php

namespace Modules\Iyzico\Payment;

use Exception;
use Iyzipay\Options;
use Iyzipay\Model\Buyer;
use Iyzipay\Model\Locale;
use Iyzipay\Model\Address;
use Illuminate\Support\Str;
use Iyzipay\Model\Currency;
use App\Enums\PaymentStatus;
use Iyzipay\Model\BasketItem;
use Iyzipay\Model\CheckoutForm;
use App\Http\Traits\PaymentTrait;
use Iyzipay\Model\BasketItemType;
use App\Models\PaymentTransactions;
use App\Http\Traits\TransactionsTrait;
use Iyzipay\Model\PayWithIyzicoInitialize;
use Iyzipay\Request\RetrieveCheckoutFormRequest;
use Iyzipay\Request\CreatePayWithIyzicoInitializeRequest;

class Iyzico
{

  use TransactionsTrait, PaymentTrait;

  public static function getPaymentBaseUrl()
  {
    $payment_base_url = 'https://api.iyzipay.com';
    if (config('iyzico.configs.iyzico_sandbox_mode')) {
      $payment_base_url = 'https://sandbox-api.iyzipay.com';
    }
    return $payment_base_url;
  }

  public static function getOptions()
  {
    $options = new Options();
    $options->setApiKey(config('iyzico.configs.iyzico_api_key'));
    $options->setSecretKey(config('iyzico.configs.iyzico_secret_key'));
    $options->setBaseUrl(self::getPaymentBaseUrl());
    return $options;
  }

  public static function initializeRequest($obj, $request)
  {
    $currencyCode = getDefaultCurrencyCode();
    $init = new CreatePayWithIyzicoInitializeRequest();
    $init->setConversationId("Order #". $obj?->id);
    $init->setLocale(Locale::EN);
    $init->setPrice(currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), roundNumber($obj->total)));
    $init->setPaidPrice(currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), roundNumber($obj->total)));
    $init->setCurrency($request->currency_code ?? getDefaultCurrencyCode());
    $data = [
      'item_id' => $obj->id,
      'type' => $request->type,
  ];
    $init->setCallbackUrl(route('iyzico.webhook', $data));
    return $init;
  }

  public static function setBuyer($obj, $init)
  {
    $buyer = new Buyer();
    $buyer->setId(Str::uuid());
    $buyer->setName("N/A");
    $buyer->setSurname("N/A");
    $buyer->setEmail("xxxx@xxxx.com");
    $buyer->setIdentityNumber("12345");
    $buyer->setRegistrationAddress('N/A');
    $buyer->setIp(request()?->ip());
    $buyer->setCity("N/A");
    $buyer->setCountry("N/A");
    $buyer->setZipCode("N/A");
    $init->setBuyer($buyer);
    return $init;
  }

  public static function setBuyerShippingAddress($obj, $init)
  {
    $shippingAddress = new Address();
    $shippingAddress->setContactName("N/A");
    $shippingAddress->setCity("N/A");
    $shippingAddress->setCountry("N/A");
    $shippingAddress->setAddress("N/A");
    $init->setShippingAddress($shippingAddress);
    return $init;
  }

  public static function setBuyerBillingAddress($obj, $init)
  {
    $billingAddress = new Address();
    $billingAddress->setContactName("N/A");
    $billingAddress->setCity("N/A");
    $billingAddress->setCountry("N/A");
    $billingAddress->setAddress("N/A");

    $init->setBillingAddress($billingAddress);
    return $init;
  }


  public static function basketItem($obj, $init)
  {
    $items = [];
    $basketItem = new BasketItem();
    $basketItem->setId("#" . $obj->id);
    $basketItem->setName(env('APP_NAME'));
    $basketItem->setCategory1(env('APP_NAME'));
    $basketItem->setItemType(BasketItemType::PHYSICAL);
    $basketItem->setPrice($obj->total);
    $items[] = $basketItem;
    $init->setBasketItems($items);

    return $init;
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
        'payment_method' => config('iyzico.name'),
        'payment_status' => PaymentStatus::PENDING,
        'type' => $request->type,
        'request_type' => $request->request_type,
        'redirect_url' => $request->redirect_url
      ]);

      $options = self::getOptions();
      $init = self::initializeRequest($obj, $request);
      $init = self::setBuyer($obj, $init);
      $init = self::setBuyerShippingAddress($obj, $init);
      $init = self::setBuyerBillingAddress($obj, $init);
      $init = self::basketItem($obj, $init);

      $payment = PayWithIyzicoInitialize::create($init, $options);
      if ($payment->getStatus() == "failure") {
        throw new Exception($payment->getErrorMessage(), 500);
      }
      self::updatePaymentTransactionId($paymentTransaction, $transaction_id);
                return [
                    'item_id' => $obj?->id,
                    'url' => $payment?->getPayWithIyzicoPageUrl(),
                    'transaction_id' => $transaction_id,
                    'is_redirect' => true,
                    'type' => $request->type,
                ];
    } catch (Exception $e) {

      self::updatePaymentStatus($paymentTransaction, PaymentStatus::FAILED);
      throw new Exception($e->getMessage(), $e->getCode());
    }
  }

  public static function webhook($request)
  {
    try {
      $options = self::getOptions();
      $checkOutReq = new RetrieveCheckoutFormRequest();
      $checkOutReq->setLocale(Locale::EN);
      $checkOutReq->setToken($request->token);
      $response = CheckoutForm::retrieve($checkOutReq, $options);
      $result = $response->getRawResult();
      $payment = json_decode($result, true);
      if ($payment) {
        $paymentTransaction = PaymentTransactions::where([
          'item_id' => $request->item_id, 'type' => $request->type,
          ])->first();
        $transaction_id = $payment['paymentId'];
        self::updatePaymentTransactionId($paymentTransaction, $transaction_id);
        if ($payment['status'] == 'success') {
          self::updatePaymentStatus($paymentTransaction, PaymentStatus::COMPLETED);
        } else if ($payment['status'] == 'failure') {
          self::updatePaymentStatus($paymentTransaction, PaymentStatus::FAILED);
        }
      }

      return self::updatePaymentStatus($paymentTransaction, PaymentStatus::COMPLETED);

    } catch (Exception $e) {

      self::updatePaymentStatus($paymentTransaction, PaymentStatus::FAILED);
      throw new Exception($e->getMessage(), $e->getCode());
    }
  }
}
