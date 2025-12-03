@extends('admin.layouts.master')
@section('title', __('taxido::static.hourly_package.add'))
@section('content')
    <div class="banner-create">
        <form id="hourlyPackageForm" action="{{ route('admin.hourly-package.store') }}" method="POST"
            enctype="multipart/form-data">
            {{-- <div class="row g-xl-4 g-3"> --}}
            @method('POST')
            @csrf
            @include('taxido::admin.hourly-package.fields')
            {{-- </div> --}}
        </form>
    </div>
@endsection
