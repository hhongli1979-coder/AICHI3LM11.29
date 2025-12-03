@extends('admin.layouts.master')
@section('title', __('taxido::static.airports.edit'))
@section('content')
<div class="airport-main">
    <form id="airportForm" action="{{ route('admin.airport.update', $airport->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.airport.fields')
        </div>
    </form>
</div>
@endsection
