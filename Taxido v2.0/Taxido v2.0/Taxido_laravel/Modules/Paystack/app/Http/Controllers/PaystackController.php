<?php

namespace Modules\Paystack\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Paystack\Payment\Paystack;

class PaystackController extends Controller
{
    public function webhook(Request $request)
    {
        return Paystack::webhook($request);
    }
}
