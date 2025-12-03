@extends('admin.layouts.master')
@section('title', __('taxido::static.commission_histories.commission_histories'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.commission_histories.commission_histories') }}</h3>
                </div>
            </div>
            <div class="cab-commission-history-table">
                <x-table :columns="$tableConfig['columns']" 
                         :data="$tableConfig['data']" 
                         :filters="$tableConfig['filters']" 
                         :actions="$tableConfig['actions']" 
                         :total="$tableConfig['total']"
                         :bulkactions="$tableConfig['bulkactions']"
                         :showCheckbox="false"
                         :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection