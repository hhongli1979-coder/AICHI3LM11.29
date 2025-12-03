<?php

namespace Modules\PayPal\Http\Controllers;

use Illuminate\Http\Request;
use Modules\PayPal\Payment\PayPal;
use App\Http\Controllers\Controller;

class PayPalController extends Controller
{
    public function status(Request $request)
    {
        return PayPal::status($request->token);
    }

    public function webhook(Request $request)
    {
        return PayPal::webhook($request);
    }
}
