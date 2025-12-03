@extends('admin.layouts.master')
@section('title', __('taxido::static.surge_prices.add'))
@section('content')
    <div class="surgePrice-create">
        <form id="surgePriceForm" action="{{ route('admin.surge-price.store') }}" method="POST" enctype="multipart/form-data">
            @method('POST')
            @csrf
            @include('taxido::admin.surge-price.fields')
        </form>
    </div>
@endsection
