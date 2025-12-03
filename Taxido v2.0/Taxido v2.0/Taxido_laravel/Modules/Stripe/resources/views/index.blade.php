@extends('stripe::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('stripe.name') !!}</p>
@endsection
