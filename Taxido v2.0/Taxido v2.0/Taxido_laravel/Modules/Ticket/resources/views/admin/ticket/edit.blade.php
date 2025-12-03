@extends('admin.layouts.master')
@section('title', __('ticket::static.ticket.add'))
@section('content')
<div class="ticket-create">
    <form id="ticketForm" action="{{ route('admin.ticket.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('ticket::admin.ticket.fields')
        </div>
    </form>
</div>
@endsection
