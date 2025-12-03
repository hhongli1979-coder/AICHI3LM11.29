@extends('admin.layouts.master')
@section('title', __('static.tags.tags'))
@section('content')
    <div class="row category-main g-md-4 g-3">
        <div class="col-xxl-4 col-xl-5">
            <div class="p-sticky">
                <form id="tagForm" action="{{ route('admin.tag.update', $tag->id) }}" method="POST">
                    @method('PUT')
                    @csrf
                    @include('admin.tag.fields')
                </form>
            </div>
        </div>
        <div class="col-xxl-8 col-xl-7">
            <div class="contentbox">
                <div class="inside">
                    <div class="tag-table">
                        <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                            :bulkactions="$tableConfig['bulkactions']" :search="true">
                        </x-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
