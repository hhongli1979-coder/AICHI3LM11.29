@extends('admin.layouts.master')
@section('title', __('static.languages.edit'))
@section('content')
<div class="language-main">
    <form id="languageForm" action="{{ route('admin.language.update', $language?->id) }}" method="POST" enctype="multipart/form-data">
        @method('PUT')
        @csrf
        @include('admin.language.fields')
    </form>
</div>
@endsection
