@extends('admin.layouts.master')
@section('title', __('static.languages.languages'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('static.languages.languages') }}</h3>
                    <div class="subtitle-button-group">
                        @can('language.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.language.create') }}">
                                <i class="ri-add-line"></i> {{ __('static.languages.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="language-table">
                <x-table :columns="$tableConfig['columns']" 
                         :data="$tableConfig['data']" 
                         :filters="$tableConfig['filters']" 
                         :actions="$tableConfig['actions']" 
                         :total="$tableConfig['total']"
                         :bulkactions="$tableConfig['bulkactions']" 
                         :actionButtons="$tableConfig['actionButtons']" 
                         :modalActionButtons="$tableConfig['modalActionButtons']" 
                         :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
