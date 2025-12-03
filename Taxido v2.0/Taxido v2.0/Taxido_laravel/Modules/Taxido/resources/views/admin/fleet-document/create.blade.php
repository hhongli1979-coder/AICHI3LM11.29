@extends('admin.layouts.master')
@section('title', __('taxido::static.fleet_documents.add'))
@section('content')
<div class="banner-create">
    <form id="fleetDocumentForm" action="{{ route('admin.fleet-document.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('taxido::admin.fleet-document.fields')
        </div>
    </form>
</div>
@endsection
