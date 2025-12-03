@extends('admin.layouts.master')
@section('title', __('ticket::static.ticket.ticket'))
@section('content')
<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <div class="contentbox-subtitle">
                <h3>{{ __('ticket::static.ticket.ticket') }}</h3>
                @can('ticket.ticket.create')
                    <a href="{{ route('admin.ticket.create') }}" class="btn btn-outline">
                        <i class="ri-add-line"></i>{{ __('ticket::static.ticket.add_new') }}</a>
                @endcan
            </div>
        </div>
        <div class="ticket-table">
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