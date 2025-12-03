@extends('admin.layouts.master')
@section('title', __('static.pages.edit_page'))
@section('content')
<div class="page-main">
    <form id="pageForm" action="{{ route('admin.page.update', $page->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        @include('admin.page.fields')
    </form>
</div>
@endsection
