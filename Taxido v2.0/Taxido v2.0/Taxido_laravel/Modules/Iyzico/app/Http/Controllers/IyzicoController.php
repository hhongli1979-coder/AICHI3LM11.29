<?php

namespace Modules\Iyzico\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Iyzico\Payment\Iyzico;

class IyzicoController extends Controller
{
    public function webhook(Request $request)
    {
        return Iyzico::webhook($request);
    }
}
