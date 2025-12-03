@extends('admin.layouts.master')
@section('title', __('taxido::static.cancellation-reasons.edit'))
@section('content')
<div class="cancellationReason-main">
    <form id="cancellationReasonForm" action="{{ route('admin.cancellation-reason.update', $cancellationReason->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.cancellation-reason.fields')
        </div>
    </form>
</div>
@endsection
