@extends('admin.layouts.master')

@section('title', __('taxido::static.peakZones.add'))

@section('content')
@php
$settings = getTaxidoSettings();
@endphp
<div class="row">
    <div class="m-auto col-12-8">
        <div class="card-body">
            <div class="row g-4">
                <div class="col-xl-7 order-xl-1 order-last">
                    <form id="peakZoneForm" action="{{ route('admin.peakZone.store') }}" method="POST"
                        enctype="multipart/form-data">
                        @csrf
                        @include('taxido::admin.zone.fields')
                    </form>
                </div>
                <div class="col-xl-5 order-xl-2 order-1">
                    <div class="map-instruction">
                        <h4>{{ __('taxido::static.peakZones.map_instruction_heading') }}</h4>
                        <p>{{ __('taxido::static.peakZones.map_instruction_title') }}</p>
                        <div class="map-detail">
                            <i class="ri-drag-move-fill"></i>
                            {{ __('taxido::static.peakZones.map_instruction_paragraph_1') }}
                        </div>
                        <div class="map-detail">
                            <i class="ri-map-pin-line"></i>
                            {{ __('taxido::static.peakZones.map_instruction_paragraph_2') }}
                        </div>

                        @if ($settings['location']['map_provider'] == 'google_map')
                            <img src="{{ Module::asset('taxido:images/taxido-map.gif') }}" class="notify-img">
                        @elseif($settings['location']['map_provider'] == 'osm')
                            <img src="{{ Module::asset('taxido:images/taxido-osm.gif') }}" class="notify-img">
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
