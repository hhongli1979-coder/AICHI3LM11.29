@extends('twilio::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('twilio.name') !!}</p>
@endsection
