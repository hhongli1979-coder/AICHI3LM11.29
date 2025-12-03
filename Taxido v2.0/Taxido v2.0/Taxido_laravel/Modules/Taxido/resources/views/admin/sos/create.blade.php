@extends('admin.layouts.master')
@section('title', __('taxido::static.soses.add'))
@section('content')
    <div class="sos-create">
        <form id="sosForm" action="{{ route('admin.sos.store') }}" method="POST" enctype="multipart/form-data">
            @method('POST')
            @csrf
            @include('taxido::admin.sos.fields')
        </form>
    </div>
@endsection
