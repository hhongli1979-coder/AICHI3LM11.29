@extends('admin.layouts.master')
@section('title', __('static.currencies.add_currency'))
@section('content')
<div class="currency-create">
    <form id="currencyForm" action="{{ route('admin.currency.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('admin.currency.fields')
        </div>
    </form>
</div>
@endsection
