@extends('admin.layouts.master')
@section('title', __('taxido::static.documents.add_document'))
@section('content')
    <div class="document-main">
        <form id="documentForm" action="{{ route('admin.document.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            @include('taxido::admin.document.fields')
        </form>
    </div>
@endsection
