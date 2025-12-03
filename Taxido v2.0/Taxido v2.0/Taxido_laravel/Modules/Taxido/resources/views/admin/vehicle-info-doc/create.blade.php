@extends('admin.layouts.master')
@section('title', __('taxido::static.fleet_vehicle_documents.add'))
@section('content')
<div class="banner-create">
    <form id="vehicleInfoDocForm" action="{{ route('admin.vehicleInfoDoc.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('taxido::admin.vehicle-info-doc.fields')
        </div>
    </form>
</div>
@endsection
