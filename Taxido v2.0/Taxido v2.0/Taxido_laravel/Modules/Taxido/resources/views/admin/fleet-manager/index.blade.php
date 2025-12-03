@extends('admin.layouts.master')
@section('title', __('taxido::static.fleet_managers.all'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.fleet_managers.all') }}</h3>
                    <div class="subtitle-button-group">
                        <button class="add-spinner btn btn-outline" data-url="{{ route('admin.fleet-manager.create') }}">
                            <i class="ri-add-line"></i> {{ __('taxido::static.fleet_managers.add_new') }}
                        </button>
                    </div>
                </div>
            </div>
            <div class="fleet-manager-table">
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
