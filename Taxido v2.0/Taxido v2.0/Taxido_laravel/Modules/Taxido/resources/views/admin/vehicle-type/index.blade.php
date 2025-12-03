@extends('admin.layouts.master')
@section('title', __('taxido::static.vehicle_types.vehicles'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.vehicle_types.vehicles') }}</h3>
                    <div class="subtitle-button-group">
                        @can('vehicle_type.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ getVehicleCreateRoute() }}">
                                <i class="ri-add-line"></i> {{ __('taxido::static.vehicle_types.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="vehicle-table">
                <x-table :columns="$tableConfig['columns']" 
                         :data="$tableConfig['data']" 
                         :filters="$tableConfig['filters']" 
                         :actions="$tableConfig['actions']" 
                         :total="$tableConfig['total']"
                         :bulkactions="$tableConfig['bulkactions']" 
                         :actionButtons="$tableConfig['actionButtons']" 
                         :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
