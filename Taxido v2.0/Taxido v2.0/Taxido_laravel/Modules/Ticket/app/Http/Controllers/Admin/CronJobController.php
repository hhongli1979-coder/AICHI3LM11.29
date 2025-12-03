<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Artisan;

class CronJobController extends Controller
{
    public function incoming()
    {
        Artisan::call('command:piping');
    }
}