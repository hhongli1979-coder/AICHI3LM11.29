@extends('admin.layouts.master')
@section('title', __('ticket::static.department.department'))
@section('content')
<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <div class="contentbox-subtitle">
                <h3>{{ __('ticket::static.department.department') }}</h3>
                 <div class="subtitle-button-group">
                    @can('ticket.department.create')
                        <button class="add-spinner btn btn-outline" data-url="{{ route('admin.department.create') }}">
                            <i class="ri-add-line"></i> {{ __('ticket::static.department.add_new') }}
                        </button>
                    @endcan
                </div>
            </div>
        </div>
        <div class="department-table">
            <x-table
                :columns="$tableConfig['columns']"
                :data="$tableConfig['data']"
                :filters="$tableConfig['filters']"
                :actions="$tableConfig['actions']"
                :total="$tableConfig['total']"
                :actionButtons="$tableConfig['actionButtons']"
                :modalActionButtons="$tableConfig['modalActionButtons']"
                :bulkactions="$tableConfig['bulkactions']"
                :search="true">
            </x-table>
        </div>
    </div>
</div>
@endsection


