@extends('admin.layouts.master')
@section('title', __('static.pages.pages'))
@section('content')
    @includeIf('inc.modal', [
        'export' => true,
        'routes' => 'admin.page.export',
        'import' => true,
        'route' => 'admin.page.import.csv',
        'instruction_file' => 'admin/import/pages',
        'example_file' => 'admin/import/example/pages.csv',
    ])

    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('static.pages.pages') }}</h3>
                    <div class="subtitle-button-group">
                        @can('page.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.page.create') }}">
                                <i class="ri-add-line"></i> {{ __('static.pages.add_new') }}
                            </button>
                        @endcan
                        @can('page.index')
                        @if($tableConfig['total'] > 0)
                            <button class="btn btn-outline" data-bs-toggle="modal" data-bs-target="#exportModal">
                                <i class="ri-download-line"></i> {{ __('static.export.export') }}
                            </button>
                        @endif
                        @endcan
                        @can('page.create')
                            <button class="btn btn-outline" data-bs-toggle="modal" data-bs-target="#importModal"
                                id="importButton" data-model="page">
                                <i class="ri-upload-line"></i> {{ __('static.import.import') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="page-table">
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
