@extends('admin.layouts.master')
@section('title', __('taxido::static.surge_prices.edit'))
@section('content')
<div class="banner-main">
    <form id="surgePriceForm" action="{{ route('admin.surge-price.update', $surgePrice->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.surge-price.fields')
        </div>
    </form>
</div>
@endsection
