<?php

namespace App\Enums;

enum PaymentType: string
{
    const WALLET = 'wallet';

    const BANK = 'bank';

    const PAYPAL = 'paypal';
}
