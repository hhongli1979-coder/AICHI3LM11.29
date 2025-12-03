@extends('ticket::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('ticket.name') !!}</p>
@endsection
