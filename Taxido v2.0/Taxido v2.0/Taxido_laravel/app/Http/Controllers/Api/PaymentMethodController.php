<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class PaymentMethodController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return getPaymentMethodList();
    }
}
