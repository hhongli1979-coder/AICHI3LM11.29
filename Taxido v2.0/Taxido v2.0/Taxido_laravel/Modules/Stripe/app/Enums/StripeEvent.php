<?php

namespace Modules\Stripe\Enums;

enum StripeEvent: string
{
    const PAID = 'paid';

    const FAILED = 'failed';
}
