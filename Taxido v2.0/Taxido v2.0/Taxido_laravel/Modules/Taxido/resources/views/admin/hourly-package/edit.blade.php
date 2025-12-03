@extends('admin.layouts.master')
@section('title', __('taxido::static.hourly_package.edit'))
@section('content')
<div class="banner-main">
    <form id="hourlyPackageForm" action="{{ route('admin.hourly-package.update', $hourlyPackage->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.hourly-package.fields')
        </div>
    </form>
</div>
@endsection
