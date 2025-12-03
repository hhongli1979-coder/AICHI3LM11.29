@extends('admin.layouts.master')
@section('title', __('taxido::static.wallets.wallet'))
@section('content')
    <div class="row g-4 wallet-main mb-4">
        @canAny(['rider_wallet.credit', 'rider_wallet.debit'])
            <div class="col-xxl-4 col-xl-5">
                @includeIf('taxido::admin.rider-wallet.riders')
            </div>
            <div class="col-xxl-8 col-xl-7">
                @includeIf('taxido::admin.rider-wallet.amount')
            </div>
        @endcanAny
        @if(!auth()?->user()?->can('rider_wallet.credit') && !auth()?->user()?->can('rider_wallet.debit'))
            <div class="col-xxl-12">
                @includeIf('taxido::admin.rider-wallet.amount')
            </div>
        @endif
    </div>
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <h3>{{ __('taxido::static.wallets.transaction') }}</h3>
            </div>
            <div class="riderWallet-table">
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
