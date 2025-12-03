@extends('admin.layouts.master')
@section('title', __('static.cronjobs.cronjobs'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('static.cronjobs.cronjobs') }}</h3>
                    <div class="subtitle-button-group">
                        <button class="add-spinner btn btn-outline" data-url="{{ route('admin.cron-job.create') }}">
                            <i class="ri-add-line"></i> {{ __('static.cronjobs.add_new') }}
                        </button>
                    </div>
                </div>
            </div>
            <div class="cronjob-table">
                <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                    :bulkactions="$tableConfig['bulkactions']" :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
