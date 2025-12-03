@extends('admin.layouts.master')
@section('title', __('static.system_tools.activity_logs'))
@section('content')
<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <div class="contentbox-subtitle">
                <h3>{{ __('static.system_tools.activity_logs') }}</h3>
                <div class="subtitle-button-group">
                    <form action="{{ route('admin.activity-log.deleteAll') }}" method="POST" style="display: inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-outline">
                            <i class="ri-delete-bin-5-line"></i> {{ __('static.delete_all') }}
                        </button>
                    </form>

                </div>
            </div>
        </div>
        <div class="activity-logs-table">
            <x-table :columns="$tableConfig['columns']" 
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
