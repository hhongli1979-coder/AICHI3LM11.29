@extends('admin.layouts.master')
@section('title', __('static.users.users'))
@section('content')
    @includeIf('inc.modal', [
        'export' => true,
        'routes' => 'admin.user.export',
        'import' => true,
        'route' => 'admin.user.import.csv',
        'instruction_file' => 'admin/import/users',
        'example_file' => 'admin/import/example/users.csv',
    ])
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle ">
                    <h3>{{ __('static.users.users') }}</h3>
                    <div class="subtitle-button-group">
                        @can('user.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.user.create') }}">
                                <i class="ri-add-line"></i> {{ __('static.users.add_new') }}
                            </button>
                        @endcan
                        @can('user.index')
                        @if($tableConfig['total'] > 0)
                            <button class="btn btn-outline" data-bs-toggle="modal" data-bs-target="#exportModal">
                                <i class="ri-download-line"></i>{{ __('static.export.export') }}
                            </button>
                        @endif
                        @endcan
                        @can('user.create')
                            <button class="btn btn-outline" data-bs-toggle="modal" data-bs-target="#importModal"
                                id="importButton" data-model="user">
                                <i class="ri-upload-line"></i>{{ __('static.import.import') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="user-table">
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
