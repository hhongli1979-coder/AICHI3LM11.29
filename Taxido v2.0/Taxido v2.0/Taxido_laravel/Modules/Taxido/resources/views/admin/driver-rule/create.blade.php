@extends('admin.layouts.master')
@section('title', __('taxido::static.driver_rules.add'))
@section('content')
<div class="banner-create">
    <form id="driverRuleForm" action="{{ route('admin.driver-rule.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('taxido::admin.driver-rule.fields')
        </div>
    </form>
</div>
@endsection
