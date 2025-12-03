@extends('admin.layouts.master')
@section('title', __('static.currencies.currencies'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('static.currencies.currencies') }}</h3>
                    <div class="subtitle-button-group">
                        @can('currency.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.currency.create') }}">
                                <i class="ri-add-line"></i> {{ __('static.currencies.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="currency-table">
                <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                    :bulkactions="$tableConfig['bulkactions']" :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
