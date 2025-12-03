@extends('admin.layouts.master')
@section('title', __('taxido::static.onboardings.edit'))
@section('content')
<div class="banner-main">
    <form id="onboardingForm" action="{{ route('admin.onboarding.update', $onboarding->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.onboarding.fields')
        </div>
    </form>
</div>
@endsection
