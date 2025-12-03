@extends('admin.layouts.master')
@section('title', __('taxido::static.extra_charges.edit'))
@section('content')
<div class="banner-main">
    <form id="extraChargeForm" action="{{ route('admin.extra-charge.update', $extraCharge->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.extra-charge.fields')
        </div>
    </form>
</div>
@endsection
