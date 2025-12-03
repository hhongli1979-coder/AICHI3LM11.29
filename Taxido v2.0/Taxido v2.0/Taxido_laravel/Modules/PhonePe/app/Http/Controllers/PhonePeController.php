<?php

namespace Modules\PhonePe\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\PhonePe\Payment\PhonePe;

class PhonePeController extends Controller
{
    public function webhook(Request $request)
    {
        return PhonePe::webhook($request);
    }
}
