@extends('admin.layouts.master')
@section('title', __('taxido::static.hourly_package.hourly_packages'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.hourly_package.hourly_package') }}</h3>
                    <div class="subtitle-button-group">
                        @can('hourly_package.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.hourly-package.create') }}">
                                <i class="ri-add-line"></i> {{ __('taxido::static.hourly_package.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="hourlyPackage-table">
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
