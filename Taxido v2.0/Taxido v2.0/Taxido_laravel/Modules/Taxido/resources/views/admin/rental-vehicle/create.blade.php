@extends('admin.layouts.master')
@section('title',  __('taxido::static.rental_vehicle.add'))
@section('content')
<div class="banner-create">
    <form id="rentalVehicleForm" action="{{ route('admin.rental-vehicle.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('taxido::admin.rental-vehicle.fields')
        </div>
    </form>
</div>
@endsection
