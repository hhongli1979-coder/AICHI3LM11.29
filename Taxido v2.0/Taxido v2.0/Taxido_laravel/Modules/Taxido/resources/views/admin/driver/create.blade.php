@extends('admin.layouts.master')
@section('title', __('taxido::static.drivers.add_driver'))
@section('content')
    <div class="">
        <form id="driverForm" action="{{ route('admin.driver.store') }}" method="POST" enctype="multipart/form-data">
            @method('POST')
            @csrf
            @include('taxido::admin.driver.fields')
        </form>
    </div>
@endsection
