@extends('admin.layouts.master')
@section('title', __('static.languages.add'))
@section('content')
<div class="language-create">
    <form id="languageForm" action="{{ route('admin.language.store') }}" method="POST" enctype="multipart/form-data">
        @method('POST')
        @csrf
        @include('admin.language.fields')
    </form>
</div>
@endsection
