@extends('admin.layouts.master')
@section('title', __('taxido::static.driver_documents.add'))
@section('content')
<div class="banner-create">
    <form id="driverDocumentForm" action="{{ route('admin.driver-document.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('taxido::admin.driver-document.fields')
        </div>
    </form>
</div>
@endsection
