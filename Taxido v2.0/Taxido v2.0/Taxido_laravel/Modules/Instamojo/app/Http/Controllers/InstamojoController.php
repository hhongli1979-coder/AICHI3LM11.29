<?php

namespace Modules\Instamojo\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Instamojo\Payment\Instamojo;

class InstamojoController extends Controller
{
    public function status(Request $request)
    {
        return Instamojo::status($request);
    }

    public function webhook(Request $request)
    {
        return Instamojo::webhook($request);
    }
}
