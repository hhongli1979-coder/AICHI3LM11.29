@extends('admin.layouts.master')
@section('title', __('taxido::static.dispatchers.edit'))
@section('content')
<div class="dispatcher-main">
    <form id="dispatcherForm" action="{{ route('admin.dispatcher.update', $dispatcher->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.dispatcher.fields')
        </div>
    </form>
</div>
@endsection
