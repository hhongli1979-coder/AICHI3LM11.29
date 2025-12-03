@extends('admin.layouts.master')
@section('title', __('taxido::static.surge_prices.surge_prices'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.surge_prices.surge_prices') }}</h3>
                    <div class="subtitle-button-group">
                        <button class="add-spinner btn btn-outline" data-url="{{ route('admin.surge-price.create') }}">
                            <i class="ri-add-line"></i> {{ __('taxido::static.surge_prices.add_new') }}
                        </button>
                    </div>
                </div>
            </div>
            <div class="surgePrice-table">
                <x-table :columns="$tableConfig['columns']"
                    :data="$tableConfig['data']"
                    :filters="$tableConfig['filters']"
                    :actions="$tableConfig['actions']"
                    :total="$tableConfig['total']"
                    :bulkactions="$tableConfig['bulkactions']"
                    :search="true" />
            </div>
        </div>
    </div>
@endsection
