@extends('admin.layouts.master')
@section('title', __('static.blogs.edit_blog'))
@section('content')
    <div class="">
        <form id="blogForm" action="{{ route('admin.blog.update', $blog->id) }}" method="POST" enctype="multipart/form-data">
            <div class="row g-xl-4 g-3">
                @method('PUT')
                @csrf
                @include('admin.blog.fields')
            </div>
        </form>
    </div>
@endsection
