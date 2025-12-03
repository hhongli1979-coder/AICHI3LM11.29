@extends('nexmo::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('nexmo.name') !!}</p>
@endsection
