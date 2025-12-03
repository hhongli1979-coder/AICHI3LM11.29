@extends('admin.layouts.master')
@section('title', __('taxido::static.banners.add'))
@section('content')
<div class="banner-create">
    <form id="bannerForm" action="{{ route('admin.banner.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('taxido::admin.banner.fields')
        </div>
    </form>
</div>
@endsection
