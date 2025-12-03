@extends('admin.layouts.master')
@section('title', __('static.tags.tags'))
@section('content')
<div class="row ga- category-main g-md-4 g-3">
    <div class="col-xl-4">
        <div class="p-sticky">
            <form id="tagForm" action="{{ route('admin.tag.store') }}" method="POST">
                @csrf
                @include('admin.tag.fields')
            </form>
        </div>
    </div>
    <div class="col-xl-8">
        <div class="contentbox">
            <div class="inside">
                <div class="contentbox-title">
                    <h3>{{ __('static.tags.tags') }}</h3>
                </div>
                <div class="tag-table">
                    <x-table 
                        :columns="$tableConfig['columns']" 
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
    </div>
</div>
@endsection
