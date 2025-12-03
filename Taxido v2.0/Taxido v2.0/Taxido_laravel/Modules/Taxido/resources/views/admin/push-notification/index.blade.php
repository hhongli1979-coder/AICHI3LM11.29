@extends('admin.layouts.master')
@section('title', __('taxido::static.push_notification.all'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.push_notification.all') }}</h3>
                    <div class="subtitle-button-group">
                        @can('push_notification.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.push-notification.create') }}">
                                <i class="ri-add-line"></i> {{ __('taxido::static.push_notification.send') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="pushNotification-table">
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
