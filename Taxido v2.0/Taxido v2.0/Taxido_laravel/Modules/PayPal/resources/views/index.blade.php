@extends('paypal::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('paypal.name') !!}</p>
@endsection
