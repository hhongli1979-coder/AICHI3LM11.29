@extends('admin.layouts.master')
@section('title', __('taxido::static.riders.riders'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.riders.riders') }}</h3>
                    <div class="subtitle-button-group">
                        @can('rider.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.rider.create') }}">
                                <i class="ri-add-line"></i> {{ __('taxido::static.riders.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="rider-table">
                <x-table :columns="$tableConfig['columns']" 
                         :data="$tableConfig['data']" 
                         :filters="$tableConfig['filters']" 
                         :actions="$tableConfig['actions']" 
                         :actionButtons="$tableConfig['actionButtons']"
                         :total="$tableConfig['total']" 
                         :bulkactions="$tableConfig['bulkactions']" 
                         :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
