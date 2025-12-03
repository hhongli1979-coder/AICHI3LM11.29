@extends('admin.layouts.master')
@section('title', __('static.landing_pages.subscribers'))
@section('content')
<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <div class="contentbox-subtitle">
                <h3>{{ __('static.landing_pages.subscribers') }}</h3>
                <div class="subtitle-button-group">
                </div>
            </div>
        </div>


        <div class="subscribes-table">
            <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']" :filters="$tableConfig['filters']"
                :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                :bulkactions="$tableConfig['bulkactions']" :search="true">
            </x-table>
        </div>
    </div>
</div>
@endsection
