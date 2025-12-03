<?php

namespace Modules\RazorPay\Enums;

enum RazorPayEvent: string
{
    const PAID = 'payment_link.paid';

    const PARTIALLY_PAID = 'payment_link.partially_paid';

    const CANCELLED = 'payment_link.cancelled';

    const EXPIRED = 'payment_link.expired';

    const COMPLETED = 'paid';

    const FAILED = 'failed';
}
