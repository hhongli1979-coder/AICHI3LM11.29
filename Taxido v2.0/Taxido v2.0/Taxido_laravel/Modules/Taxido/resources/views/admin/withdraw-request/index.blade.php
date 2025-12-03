@extends('admin.layouts.master')
@section('title', __('taxido::static.withdraw_requests.title'))
@section('content')
@includeIf('inc.modal', ['export' => true, 'routes' => 'admin.withdraw-request.export'])
<div class="row g-4 wallet-main mb-4">
    @if (Auth::user()->hasRole('driver'))
        <div class="col-xxl-8 col-xl-7">
            @includeIf('taxido::admin.withdraw-request.amount')
        </div>
        <div class="col-xxl-4 col-xl-5">
            @includeIf('taxido::admin.withdraw-request.drivers')
        </div>
    @endif
</div>
<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title justify-unset">
            <h3>{{ __('taxido::static.withdraw_requests.title') }}</h3>
            @can('withdraw_request.index')
                @if($tableConfig['total'] > 0)
                    <button class="btn btn-outline" data-bs-toggle="modal" data-bs-target="#exportModal">
                        <i class="ri-download-line"></i>{{ __('static.export.export') }}
                    </button>
                @endif
            @endcan
        </div>
        <div class="withdrawRequest-table">
            <x-table
                :columns="$tableConfig['columns']"
                :data="$tableConfig['data']"
                :filters="$tableConfig['filters']" 
                :total="''"
                :bulkactions="$tableConfig['bulkactions']"
                :viewActionBox="$tableConfig['viewActionBox']"
                :search="true">
            </x-table>
        </div>
    </div>
</div>
@endsection