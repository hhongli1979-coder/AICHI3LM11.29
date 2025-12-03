@extends('admin.layouts.master')
@section('title', __('taxido::static.wallets.wallet'))
@section('content')
    <div class="row g-4 wallet-main mb-4">
        @canAny(['driver_wallet.credit', 'driver_wallet.debit'])
        <div class="col-xxl-4 col-xl-5">
            @includeIf('taxido::admin.driver-wallet.drivers')
        </div>
        <div class="col-xxl-8 col-xl-7">
            @includeIf('taxido::admin.driver-wallet.amount')
        </div>
        @endcanAny
        @if(!auth()?->user()?->can('driver_wallet.credit') && !auth()?->user()?->can('driver_wallet.debit'))
        <div class="col-xxl-12">
            @includeIf('taxido::admin.driver-wallet.amount')
        </div>
        @endif
    </div>
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <h3>{{__('taxido::static.wallets.transaction')}}</h3>
            </div>
            <div class="driverWallet-table">
                <x-table
                :columns="$tableConfig['columns']"
                :data="$tableConfig['data']"
                :filters="[]"
                :actions="[]"
                :total="''"
                :bulkactions="[]"
                :showCheckbox="false"
                :search="true">
            </x-table>
            </div>
        </div>
    </div>
@endsection
