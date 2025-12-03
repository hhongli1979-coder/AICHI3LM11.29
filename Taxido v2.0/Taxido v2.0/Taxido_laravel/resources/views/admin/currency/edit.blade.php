@extends('admin.layouts.master')
@section('title', __('static.currencies.edit_currency'))
@section('content')
<div class="currency-main">
    <form id="currencyForm" action="{{ route('admin.currency.update', $currency->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('admin.currency.fields')
        </div>
    </form>
</div>
@endsection



