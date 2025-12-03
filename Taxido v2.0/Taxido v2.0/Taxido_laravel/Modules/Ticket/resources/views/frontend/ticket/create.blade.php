@extends('front.layouts.master')
@section('title', __('ticket::static.ticket.add'))
@section('content')

    {{-- Ticket section start --}}
    <section class="ticket-create-section section-b-space">
        <div class="container">
            <form id="ticketForm" action="{{ route('ticket.store') }}" method="POST" enctype="multipart/form-data">
                @method('POST')
                @csrf
                @include('ticket::frontend.ticket.fields')
            </form>
        </div>
    </section>
    {{-- Ticket section End --}}
@endsection
