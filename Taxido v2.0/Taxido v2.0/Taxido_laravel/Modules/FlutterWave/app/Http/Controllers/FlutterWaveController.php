<?php

namespace Modules\FlutterWave\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\FlutterWave\Payment\FlutterWave;

class FlutterWaveController extends Controller
{
    public function webhook(Request $request)
    {
        return FlutterWave::webhook($request);
    }
}
