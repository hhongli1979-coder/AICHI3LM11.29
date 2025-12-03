@extends('razorpay::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('razorpay.name') !!}</p>
@endsection
