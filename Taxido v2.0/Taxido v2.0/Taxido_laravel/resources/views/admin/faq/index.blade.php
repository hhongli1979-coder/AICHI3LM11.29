@extends('admin.layouts.master')
@section('title', __('static.faqs.faqs'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('static.faqs.faqs') }}</h3>
                    <div class="subtitle-button-group">
                        @can('faq.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.faq.create') }}">
                                <i class="ri-add-line"></i> {{ __('static.faqs.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="faq-table">
                <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                    :bulkactions="$tableConfig['bulkactions']" :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
