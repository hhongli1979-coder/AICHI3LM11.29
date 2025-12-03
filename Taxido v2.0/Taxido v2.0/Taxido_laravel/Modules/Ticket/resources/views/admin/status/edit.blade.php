@extends('admin.layouts.master')
@section('title', __('ticket::static.status.edit'))
@section('content')
    <div class="status-create">
        <form id="status" action="{{ route('admin.status.update', $status->id) }}" method="POST"
            enctype="multipart/form-data">

            @method('PUT')
            @csrf
            @include('ticket::admin.status.fields')
        </form>
    </div>
@endsection
