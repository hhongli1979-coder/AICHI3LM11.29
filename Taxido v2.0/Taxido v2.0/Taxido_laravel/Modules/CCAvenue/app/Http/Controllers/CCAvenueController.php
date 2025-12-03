<?php

namespace Modules\CCAvenue\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\CCAvenue\Payment\CCAvenue;

class CCAvenueController extends Controller
{
    public function webhook(Request $request)
    {
        return CCAvenue::webhook($request);
    }
}
