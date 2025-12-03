@extends('admin.layouts.master')
@section('title', __('taxido::static.soses.edit'))
@section('content')
    <div class="banner-main">
        <form id="sosForm" action="{{ route('admin.sos.update', ['sos' => $sos->id]) }}" method="POST"
            enctype="multipart/form-data">
            <div class="row g-xl-4 g-3">
                @method('PUT')
                @csrf
                @include('taxido::admin.sos.fields')
            </div>
        </form>
    </div>
@endsection
