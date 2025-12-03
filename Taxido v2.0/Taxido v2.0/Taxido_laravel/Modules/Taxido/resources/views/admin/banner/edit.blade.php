@extends('admin.layouts.master')
@section('title', __('taxido::static.banners.edit'))
@section('content')
<div class="banner-main">
    <form id="bannerForm" action="{{ route('admin.banner.update', $banner->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.banner.fields')
        </div>
    </form>
</div>
@endsection
