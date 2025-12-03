@extends('admin.layouts.master')
@section('title', __('taxido::static.documents.documents'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.documents.documents') }}</h3>
                    <div class="subtitle-button-group">
                        @can('document.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.document.create') }}">
                                <i class="ri-add-line"></i> {{ __('taxido::static.documents.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="document-table">
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
