<?php

namespace Modules\Sslcommerz\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Sslcommerz\Payment\Sslcommerz;

class SslcommerzController extends Controller
{
    public function webhook(Request $request)
    {
        return Sslcommerz::webhook($request);
    }
}
