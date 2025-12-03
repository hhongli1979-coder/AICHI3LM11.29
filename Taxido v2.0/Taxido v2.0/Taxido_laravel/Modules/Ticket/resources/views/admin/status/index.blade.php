@extends('admin.layouts.master')
@section('title', __('ticket::static.status.status'))
@section('content')
<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <div class="contentbox-subtitle">
                <h3>{{ __('ticket::static.status.statuses') }}</h3>
                <div class="subtitle-button-group">
                    @can('ticket.status.create')
                        <button class="add-spinner btn btn-outline" data-url="{{ route('admin.status.create') }}">
                            <i class="ri-add-line"></i> {{ __('ticket::static.status.add_new') }}
                        </button>
                    @endcan
                </div>
            </div>
        </div>
        <div class="status-table">
            <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']" :filters="$tableConfig['filters']"
                :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                :actionButtons="$tableConfig['actionButtons']" :modalActionButtons="$tableConfig['modalActionButtons']"
                :bulkactions="$tableConfig['bulkactions']" :search="true">
            </x-table>
        </div>
    </div>
</div>
@endsection