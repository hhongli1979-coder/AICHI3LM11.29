@extends('admin.layouts.master')
@section('title', __('taxido::static.cancellation-reasons.add'))
@section('content')
<div class="cancellationReason-create">
    <form id="cancellationReasonForm" action="{{ route('admin.cancellation-reason.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('taxido::admin.cancellation-reason.fields')
        </div>
    </form>
</div>
@endsection
