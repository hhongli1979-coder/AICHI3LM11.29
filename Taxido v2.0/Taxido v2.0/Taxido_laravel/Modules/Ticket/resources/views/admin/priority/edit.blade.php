@extends('admin.layouts.master')
@section('title', __('ticket::static.priority.edit'))
@section('content')
<div class="priority-create">
    <form id="priority" action="{{ route('admin.priority.update', $priority->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('ticket::admin.priority.fields')
        </div>
    </form>
</div>
@endsection
