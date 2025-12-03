@extends('admin.layouts.master')
@section('title', __('taxido::static.drivers.unverified_driver'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.drivers.unverified_driver') }}</h3>
                    <div class="subtitle-button-group">
                        @can('driver.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.driver.create') }}">
                                <i class="ri-add-line"></i> {{ __('taxido::static.drivers.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="driver-table">
                <x-table :columns="$tableConfig['columns']"
                         :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :actionButtons="$tableConfig['actionButtons']"
                    :total="$tableConfig['total']" :bulkactions="$tableConfig['bulkactions']" :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
