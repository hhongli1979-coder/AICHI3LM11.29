@extends('mollie::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('mollie.name') !!}</p>
@endsection
