@extends('admin.layouts.master')
@section('title', __('static.pages.add'))
@section('content')
<div class="page-main">
    <form id="pageForm" action="{{ route('admin.page.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        @include('admin.page.fields')
    </form>
</div>
@endsection
