@extends('admin.layouts.master')
@section('title', __('taxido::static.coupons.add_coupon'))
@section('content')
<div class="coupon-create">
    <form id="couponForm" action="{{ route('admin.coupon.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('taxido::admin.coupon.fields')
        </div>
    </form>
</div>
@endsection
