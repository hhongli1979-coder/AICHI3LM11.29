@extends('admin.layouts.master')
@section('title', __('taxido::static.rental_vehicle.rental_vehicles'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.rental_vehicle.rental_vehicles') }}</h3>
                    <div class="subtitle-button-group">
                        <button class="add-spinner btn btn-outline" data-url="{{ route('admin.rental-vehicle.create') }}">
                            <i class="ri-add-line"></i> {{ __('taxido::static.riders.add_new') }}
                        </button>
                    </div>
                </div>
            </div>
            <div class="vehiclerental-table">
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
