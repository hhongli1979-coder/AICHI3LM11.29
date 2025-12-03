@extends('admin.layouts.master')
@section('title', __('static.blogs.blogs'))
@section('content')
    @includeIf('inc.modal', [
        'export' => true,
        'routes' => 'admin.blog.export',
        'import' => true,
        'route' => 'admin.blog.import.csv',
        'instruction_file' => 'admin/import/blogs',
        'example_file' => 'admin/import/example/blogs.csv',
    ])
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('static.blogs.blogs') }}</h3>
                    <div class="subtitle-button-group">
                        @can('blog.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.blog.create') }}">
                                <i class="ri-add-line"></i> {{ __('static.blogs.add_new') }}
                            </button>
                        @endcan
                        @can('blog.index')
                        @if($tableConfig['total'] > 0)
                            <button class="btn btn-outline" data-bs-toggle="modal" data-bs-target="#exportModal">
                                <i class="ri-download-line"></i>{{ __('static.export.export') }}
                            </button>
                        @endif
                        @endcan
                        @can('blog.create')
                            <button class="btn btn-outline" data-bs-toggle="modal" data-bs-target="#importModal"
                                id="importButton" data-model="blog">
                                <i class="ri-upload-line"></i>{{ __('static.import.import') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="blog-table">
                <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                    :bulkactions="$tableConfig['bulkactions']" :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
