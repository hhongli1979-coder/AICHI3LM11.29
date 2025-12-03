@extends('admin.layouts.master')
@section('title', __('ticket::static.status.add'))
@section('content')
    <div class="status-create">
        <form id="statusForm" action="{{ route('admin.status.store') }}" method="POST" enctype="multipart/form-data">
            @method('POST')
            @csrf
            @include('ticket::admin.status.fields')
        </form>
    </div>
@endsection
