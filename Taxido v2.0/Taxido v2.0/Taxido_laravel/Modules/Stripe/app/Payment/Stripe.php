<?php

namespace Modules\Stripe\Payment;

use Exception;
use Stripe\StripeClient;
use App\Enums\PaymentStatus;
use App\Http\Traits\PaymentTrait;
use App\Models\PaymentTransactions;
use Modules\Stripe\Enums\StripeEvent;
use App\Http\Traits\TransactionsTrait;

class Stripe
{
    use PaymentTrait, TransactionsTrait;

    public static function getProvider()
    {
        return new StripeClient(env('STRIPE_SECRET_KEY'));
    }

    private static function getOrCreateStripeCustomer($provider, $user)
    {
        return $provider->customers->create([
            'email' => $user->email,
            'name' => $user->name,
        ]);
    }

    public static function getPlanInterval($plan)
    {
        switch($plan->duration) {
            case 'monthly':
                return 'month';
            case'yearly':
                return 'year';
            case 'weekly':
                return 'week';
            case 'daily':
                return 'day';
        }

        return $plan->duration;
    }

    private static function getOrCreatePrice($provider, $obj, $request)
    {
        $product = $provider->products->create([
            'name' => config('app.name') . ' Subscription',
        ]);

        $price = $provider->prices->create([
            'product' => $product->id,
            'unit_amount' => currencyConvert($request->currency_code ?? getDefaultCurrencyCode(),roundNumber($obj->total)) * 100,
            'currency' => $request->currency_code ?? getDefaultCurrencyCode(),
            'recurring' => [
                'interval' => self::getPlanInterval($obj?->plan),
            ],
        ]);

       return $price;
    }

    public static function createSubscription($provider, $obj, $request)
    {
        $price = self::getOrCreatePrice($provider , $obj, $request);
        $transaction = $provider->checkout->sessions->create([
            'mode' => 'subscription',
            'success_url' => route('stripe.webhook', ['item_id' => $obj?->id, 'type' =>  $request->type]),
            'cancel_url' => route('stripe.webhook', ['item_id' => $obj?->id, 'type' =>  $request->type]),
            'metadata' => [
                'order_number' => $obj?->id,
            ],
            'line_items' => [
                [
                    'price' => $price->id,
                    'quantity' => 1,
                ],
            ],
        ]);

        return $transaction;
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
                'payment_method' => config('stripe.name'),
                'payment_status' => PaymentStatus::PENDING,
                'type' => $request->type,
                'request_type' => $request->request_type,
                'redirect_url' => $request->redirect_url
            ]);

            $provider = self::getProvider();
            if ($request->type == 'subscription') {
                $transaction = self::createSubscription($provider, $obj, $request);
            } else {
                $transaction = $provider->checkout->sessions->create([
                    'mode' => 'payment',
                    'success_url' => route('stripe.webhook', ['item_id' => $obj?->id, 'type' => $request->type]),
                    'cancel_url' => route('stripe.webhook', ['item_id' => $obj?->id, 'type' => $request->type]),
                    'metadata' => [
                        'order_number' => $obj?->id,
                    ],
                    'line_items' => [
                        [
                            'price_data' => [
                                'currency' => $request->currency_code ?? getDefaultCurrencyCode(),
                                'product_data' => [
                                    'name' => config('app.name'),
                                ],
                                'unit_amount' => currencyConvert($request->currency_code ?? getDefaultCurrencyCode(), roundNumber($obj->total))* 100 ,
                            ],
                            'quantity' => 1,
                        ],
                    ],
                ]);
            }

            if ($transaction) {
                self::updatePaymentTransactionId($paymentTransaction, $transaction?->id);
                return [
                    'item_id' => $obj?->id,
                    'url' => $transaction->url,
                    'transaction_id' => $transaction->id,
                    'is_redirect' => true,
                    'type' => $request->type,
                ];
            }

            throw new Exception('Something went to wrong in stripe gateway', 500);
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

            $provider = self::getProvider();
            $payment = $provider->checkout->sessions?->retrieve($paymentTransaction->transaction_id);
            switch ($payment->payment_status) {
                case StripeEvent::PAID:
                    $status = PaymentStatus::COMPLETED;
                    break;

                case StripeEvent::FAILED:
                    $status = PaymentStatus::FAILED;
                    break;

                default:
                    $status = PaymentStatus::PENDING;
            }

            return self::updatePaymentStatus($paymentTransaction, $status);

        } catch (Exception $e) {

            self::updatePaymentStatusByType($request->item_id, $request->type, PaymentStatus::FAILED);
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
