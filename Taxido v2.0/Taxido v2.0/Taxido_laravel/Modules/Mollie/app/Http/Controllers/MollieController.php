<?php

namespace Modules\Mollie\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Mollie\Payment\Mollie;
use App\Http\Controllers\Controller;

class MollieController extends Controller
{
    public function status(Request $request)
    {
        return Mollie::status($request);
    }

    public function webhook(Request $request)
    {
        return Mollie::webhook($request);
    }
}
