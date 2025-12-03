@extends('admin.layouts.master')
@section('title', __('taxido::static.coupons.coupons'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.coupons.coupons') }}</h3>
                    <div class="subtitle-button-group">
                        @can('coupon.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.coupon.create') }}">
                                <i class="ri-add-line"></i> {{ __('taxido::static.coupons.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="coupon-table">
                <x-table :columns="$tableConfig['columns']" 
                         :data="$tableConfig['data']" 
                         :filters="$tableConfig['filters']" 
                         :actions="$tableConfig['actions']" 
                         :total="$tableConfig['total']"
                         :bulkactions="$tableConfig['bulkactions']" :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
