@extends('admin.layouts.master')
@section('title',__('taxido::static.services.' . request()->service). ' '.__('taxido::static.service_categories.serviceCategory'))
@section('content')
<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <div class="contentbox-subtitle">
                <h3>{{__('taxido::static.services.' . request()->service) }}    {{ __('taxido::static.service_categories.serviceCategory') }}</h3>
            </div>
        </div>
        <div class="serviceCategory-table">
            <x-table
                :columns="$tableConfig['columns']"
                :data="$tableConfig['data']"
                :filters="$tableConfig['filters']"
                :actions="$tableConfig['actions']"
                :total="$tableConfig['total']"
                :bulkactions="$tableConfig['bulkactions']"
                :search="true">
            </x-table>
        </div>
    </div>
</div>
@endsection


