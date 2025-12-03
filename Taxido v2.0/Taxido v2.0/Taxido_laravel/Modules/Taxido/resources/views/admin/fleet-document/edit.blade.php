@extends('admin.layouts.master')
@section('title', __('taxido::static.fleet_documents.edit'))
@section('content')
<div class="banner-main">
    <form id="fleetDocumentForm" action="{{ route('admin.fleet-document.update', $fleetDocument->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.fleet-document.fields')
        </div>
    </form>
</div>
@endsection
