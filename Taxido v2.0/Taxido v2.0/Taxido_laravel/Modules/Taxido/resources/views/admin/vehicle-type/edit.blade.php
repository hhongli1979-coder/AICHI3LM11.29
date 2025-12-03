@extends('admin.layouts.master')
@section('title', __('taxido::static.vehicle_types.edit'))
@section('content')
    <div class="banner-main">
        <form id="vehicleForm" action="{{ route('admin.vehicle-type.update', $vehicleType->id) }}" method="POST"
            enctype="multipart/form-data">
            @method('PUT')
            @csrf
            <input type="hidden" name="req_service" value="{{request()->service}}" />
            @include('taxido::admin.vehicle-type.fields')
        </form>
        @include('taxido::admin.vehicle-type.zone-price')
    </div>
@endsection
