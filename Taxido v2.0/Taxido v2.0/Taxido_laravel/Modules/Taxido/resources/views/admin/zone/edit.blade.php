@extends('admin.layouts.master')
@section('title', __('taxido::static.zones.edit'))
@section('content')
<div class="zone-main">
    <form id="zoneForm" action="{{ route('admin.zone.update', $zone->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.zone.fields')
        </div>
    </form>
</div>
@endsection
