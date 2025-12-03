@extends('admin.layouts.master')
@section('title', __('taxido::static.referrals.referrals'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.referrals.referrals') }}</h3>
                </div>
            </div>
            <div class="referral-table">
                <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                    :bulkactions="$tableConfig['bulkactions']" :actionButtons="$tableConfig['actionButtons']" :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
