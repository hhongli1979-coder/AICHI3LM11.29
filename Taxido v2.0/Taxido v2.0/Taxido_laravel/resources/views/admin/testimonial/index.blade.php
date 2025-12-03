@extends('admin.layouts.master')
@section('title', __('static.testimonials.testimonials'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('static.testimonials.testimonials') }}</h3>
                    <div class="subtitle-button-group">
                        @can('testimonial.create')
                            <button class="add-spinner btn btn-outline" data-url="{{ route('admin.testimonial.create') }}">
                                <i class="ri-add-line"></i> {{ __('static.testimonials.add_new') }}
                            </button>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="testimonial-table">
                <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                    :bulkactions="$tableConfig['bulkactions']" :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection
