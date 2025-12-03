@extends('admin.layouts.master')
@section('title', __('ticket::static.knowledge.knowledges'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('Knowledges') }}</h3>
                    <div class="subtitle-button-group">
                        @can('ticket.knowledge.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.knowledge.create') }}">
                                <i class="ri-add-line"></i> {{ __('ticket::static.knowledge.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="knowledge-table">
                <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                    :bulkactions="$tableConfig['bulkactions']" :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
