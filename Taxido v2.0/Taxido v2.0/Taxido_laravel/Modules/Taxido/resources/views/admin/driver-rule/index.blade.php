@extends('admin.layouts.master')
@section('title', __('taxido::static.driver_rules.driver_rules'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.driver_rules.driver_rules') }}</h3>
                    <div class="subtitle-button-group">
                        @can('driver_rule.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.driver-rule.create') }}">
                                <i class="ri-add-line"></i> {{ __('taxido::static.driver_rules.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="driverRule-table">
                <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                    :bulkactions="$tableConfig['bulkactions']" :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
