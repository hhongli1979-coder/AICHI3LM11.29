@extends('admin.layouts.master')
@section('title', __('ticket::static.priority.add'))
@section('content')
    <div class="priority-create">
        <form id="priorityForm" action="{{ route('admin.priority.store') }}" method="POST" enctype="multipart/form-data">
            @method('POST')
            @csrf
            @include('ticket::admin.priority.fields')
        </form>
    </div>
@endsection
