<?php

namespace Modules\BKash\Http\Controllers;

use Illuminate\Http\Request;
use Modules\BKash\Payment\BKash;
use App\Http\Controllers\Controller;

class BKashController extends Controller
{
    public function webhook(Request $request)
    {
        return BKash::webhook($request->token);
    }
}
