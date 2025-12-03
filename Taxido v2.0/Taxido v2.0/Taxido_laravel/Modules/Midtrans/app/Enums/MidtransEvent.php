<?php

namespace Modules\Midtrans\Enums;

enum MidtransEvent: string
{
    const PENDING = 'pending';

    const CAPTURE = 'capture';
}
