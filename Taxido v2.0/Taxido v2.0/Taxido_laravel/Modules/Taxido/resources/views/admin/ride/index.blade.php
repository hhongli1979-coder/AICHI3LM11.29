@extends('admin.layouts.master')
@section('title', __('taxido::static.rides.rides'))
@section('content')
    @includeIf('inc.modal', ['export' => true, 'routes' => 'admin.ride.export'])
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.rides.rides') }}</h3>
                    <div class="subtitle-button-group">
                        @can('ride.index')
                            <button class="btn btn-outline" data-bs-toggle="modal" data-bs-target="#exportModal"
                                data-action="{{ route('admin.ride.export') }}">
                                <i class="ri-download-line"></i>{{ __('static.export.export') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="rider-table">
                <x-table :columns="$tableConfig['columns']" 
                         :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                    :bulkactions="$tableConfig['bulkactions']" :actionButtons="$tableConfig['actionButtons']" :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
