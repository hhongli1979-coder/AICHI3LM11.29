@extends('admin.layouts.master')
@section('title', __('taxido::static.preferences.edit'))
@section('content')
<div class="preference-main">
    <form id="preferenceForm" action="{{ route('admin.preference.update', $preference->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.preference.fields')
        </div>
    </form>
</div>
@endsection
