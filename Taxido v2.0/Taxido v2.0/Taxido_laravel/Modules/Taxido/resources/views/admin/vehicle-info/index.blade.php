@extends('admin.layouts.master')
@section('title', __('taxido::static.fleet_vehicles.fleet_vehicles'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ $title }}</h3>
                    <div class="subtitle-button-group">
                        @can('vehicle_info.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.vehicle-info.create') }}">
                                <i class="ri-add-line"></i> {{ __('taxido::static.drivers.add_new') }}
                            </button>
                        @endcan

                    </div>
                </div>
            </div>
            <div class="vehicle-info-table">
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


