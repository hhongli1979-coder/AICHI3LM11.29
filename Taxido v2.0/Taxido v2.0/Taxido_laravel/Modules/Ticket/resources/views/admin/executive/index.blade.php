@extends('admin.layouts.master')
@section('title', __('ticket::static.executive.executive'))
@section('content')
<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <div class="contentbox-subtitle">
                <h3>{{ __('ticket::static.executive.support_executive') }}</h3>
                <div class="subtitle-button-group">
                    @can('ticket.executive.create')
                        <button class="add-spinner btn btn-outline" data-url="{{ route('admin.executive.create') }}">
                            <i class="ri-add-line"></i>{{ __('ticket::static.executive.add_new') }}
                        </button>
                    @endcan
                </div>
            </div>
        </div>
        <div class="executive-table">
            <x-table
                :columns="$tableConfig['columns']"
                :data="$tableConfig['data']"
                :filters="$tableConfig['filters']"
                :actions="$tableConfig['actions']"
                :total="$tableConfig['total']"
                :actionButtons="$tableConfig['actionButtons']"
                :bulkactions="$tableConfig['bulkactions']"
                :search="true">
            </x-table>
        </div>
    </div>
</div>
@endsection


