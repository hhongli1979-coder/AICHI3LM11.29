@extends('admin.layouts.master')
@section('title', __('taxido::static.notices.notice'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.notices.notices') }}</h3>
                    <div class="subtitle-button-group">
                        @can('notice.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.notice.create') }}">
                                <i class="ri-add-line"></i> {{ __('taxido::static.notices.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="notice-table">
                <x-table :columns="$tableConfig['columns']" 
                         :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                         :bulkactions="$tableConfig['bulkactions']" :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
