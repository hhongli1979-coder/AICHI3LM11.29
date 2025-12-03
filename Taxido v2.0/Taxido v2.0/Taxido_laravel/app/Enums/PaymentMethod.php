<?php

namespace App\Enums;

enum PaymentMethod
{
    const COD = 'cash';
    const CASH = 'cash';
    const WALLET = 'wallet';
    const PAYPAL = 'paypal';
    const STRIPE = 'stripe';
    const MOLLIE = 'mollie';
    const BKASH = 'bkash';
    const FLUTTERWAVE = 'flutterwave';
    const MIDTRANS = 'midtrans';
    const INSTAMOJO = 'instamojo';
    const IYZICO = 'iyzico';
    const PAYSTACK = 'paystack';
    const SSLCOMMERZ = 'sslcommerz';
    const CCAVENUE = 'ccavenue';
    const RAZORPAY = 'razorpay';
    const ALL_PAYMENT_METHODS = [
        'cash', 'paypal', 'stripe', 'mollie', 'razorpay','flutterWave','midtrans','instamojo','iyzico','paystack','sslcommerz','ccavenue'
    ];
}
