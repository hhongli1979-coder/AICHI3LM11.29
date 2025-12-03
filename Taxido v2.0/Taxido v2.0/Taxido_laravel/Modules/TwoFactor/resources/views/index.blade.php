@extends('twofactor::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('twofactor.name') !!}</p>
@endsection
