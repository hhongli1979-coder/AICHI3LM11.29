@extends('admin.layouts.master')
@section('title', __('taxido::static.reviews.reviews'))
@section('content')
<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <div class="contentbox-subtitle">
                <h3>{{ __('taxido::static.reviews.reviews') }}</h3>
            </div>
        </div>
        <div class="driverReview-table">
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
