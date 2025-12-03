@extends('admin.layouts.master')
@section('title', __('taxido::static.drivers.edit'))
@section('content')
    <div class="">
        <form id="driverForm" action="{{ route('admin.driver.update', $driver->id) }}" method="POST"
            enctype="multipart/form-data">
            {{-- <div class="row g-xl-4 g-3"> --}}
            @method('PUT')
            @csrf
            @include('taxido::admin.driver.fields')
            {{-- </div> --}}
        </form>
    </div>
@endsection
