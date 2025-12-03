@extends('admin.layouts.master')
@section('title', __('static.taxes.edit'))
@section('content')
<div class="tax-main">
    <form id="taxForm" action="{{ route('admin.tax.update', $tax->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        @include('admin.tax.fields')
    </form>
</div>
@endsection
