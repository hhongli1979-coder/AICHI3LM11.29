<?php

namespace Modules\Midtrans\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Midtrans\Payment\Midtrans;

class MidtransController extends Controller
{
    public function webhook(Request $request)
    {
        return Midtrans::webhook($request);
    }
}
