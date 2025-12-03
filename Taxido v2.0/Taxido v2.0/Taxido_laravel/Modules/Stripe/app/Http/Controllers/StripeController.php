<?php

namespace Modules\Stripe\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Stripe\Payment\Stripe;
use App\Http\Controllers\Controller;

class StripeController extends Controller
{
    public function webhook(Request $request)
    {
        return Stripe::webhook($request);
    }
}
