@extends('admin.layouts.master')
@section('title', __('taxido::static.preferences.add'))
@section('content')
<div class="preference-create">
    <form id="preferenceForm" action="{{ route('admin.preference.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('taxido::admin.preference.fields')
        </div>
    </form>
</div>
@endsection
