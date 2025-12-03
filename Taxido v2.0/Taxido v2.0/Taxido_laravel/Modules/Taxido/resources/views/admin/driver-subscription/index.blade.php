@extends('admin.layouts.master')
@section('title', __('taxido::static.subscriptions.driver_subscription'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.subscriptions.driver_subscription') }}</h3>
                    <div class="subtitle-button-group">
                        @can('plan.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.plan.create') }}">
                                <i class="ri-add-line"></i> {{ __('taxido::static.plans.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="subscription-table">
                <x-table :columns="$tableConfig['columns']" 
                         :data="$tableConfig['data']" 
                         :filters="$tableConfig['filters']" 
                         :actions="$tableConfig['actions']"
                         :total="$tableConfig['total']"
                         :bulkactions="$tableConfig['bulkactions']" 
                         :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
