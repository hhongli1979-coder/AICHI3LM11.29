@extends('admin.layouts.master')
@section('title', __('ticket::static.ticket.add'))
@section('content')
    <div class="ticket-create">
        <form id="ticketForm" action="{{ route('admin.ticket.store') }}" method="POST" enctype="multipart/form-data">
            @method('POST')
            @csrf
            @include('ticket::admin.ticket.fields')
        </form>
    </div>
@endsection
