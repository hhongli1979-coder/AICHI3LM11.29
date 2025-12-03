@extends('admin.layouts.master')
@section('title', __('taxido::static.fleet_withdraw_requests.title'))
@section('content')
@includeIf('inc.modal')
    <div class="row g-4 wallet-main mb-4">
        @if (Auth::user()->hasRole('fleet_manager'))
        <div class="col-xxl-8 col-xl-7">
            @includeIf('taxido::admin.fleet-withdraw-request.amount')
        </div>
        <div class="col-xxl-4 col-xl-5">
            @includeIf('taxido::admin.fleet-withdraw-request.fleet_managers')
        </div>
        @endif
    </div>
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title justify-unset">
                <h3>{{__('taxido::static.fleet_withdraw_requests.title')}}</h3>
            </div>
            <div class="fleetWithdrawRequest-table">
                <x-table
                    :columns="$tableConfig['columns']"
                    :data="$tableConfig['data']"
                    :filters="[]"
                    :actions="[]"
                    :total="''"
                    :bulkactions="$tableConfig['bulkactions']"
                    :viewActionBox="$tableConfig['viewActionBox']"
                    :showCheckbox="false"
                    :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
