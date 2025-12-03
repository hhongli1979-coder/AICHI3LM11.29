@extends('admin.layouts.master')
@section('title', __('static.taxes.taxes'))
@section('content')
<div class="tax-create">
    <form id="taxForm" action="{{ route('admin.tax.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('admin.tax.fields')
        </div>
    </form>
</div>
@endsection
