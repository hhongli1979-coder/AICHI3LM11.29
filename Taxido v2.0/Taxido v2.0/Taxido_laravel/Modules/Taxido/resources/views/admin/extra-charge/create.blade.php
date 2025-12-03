@extends('admin.layouts.master')
@section('title', __('taxido::static.extra_charges.add'))
@section('content')
<div class="banner-create">
    <form id="extraChargeForm" action="{{ route('admin.extra-charge.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('taxido::admin.extra-charge.fields')
        </div>
    </form>
</div>
@endsection
