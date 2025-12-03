@extends('admin.layouts.master')
@section('title', __('taxido::static.driver_rules.edit'))
@section('content')
<div class="banner-main">
    <form id="driverRuleForm" action="{{ route('admin.driver-rule.update', $driverRule->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.driver-rule.fields')
        </div>
    </form>
</div>
@endsection
