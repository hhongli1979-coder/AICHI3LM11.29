<?php

namespace App\Enums;

enum PaymentStatus: string
{
    const COMPLETED = 'COMPLETED';
    const PENDING = 'PENDING';
    const PROCESSING = 'PROCESSING';
    const FAILED = 'FAILED';
    const EXPIRED = 'EXPIRED';
    const REFUNDED = 'REFUND';
    const CANCELLED = 'CANCELLED';
    const AWAITING_FOR_APPROVAL = 'AWAITING_FOR_APPROVAL';
    const ALL = [
        'Completed',
        'Pending',
        'Failed',
        'Expired',
        'Refund',
        'Cancelled',
        'Awaiting For Approval'
    ];

}
