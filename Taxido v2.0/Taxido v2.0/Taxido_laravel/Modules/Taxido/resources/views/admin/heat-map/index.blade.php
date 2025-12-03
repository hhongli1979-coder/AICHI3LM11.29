@php
 $settings = getTaxidoSettings();
@endphp
@extends('admin.layouts.master')
@section('title', __('taxido::static.heatmaps.ride_request_heatmap'))
@section('content')
    <div class="map-section">
        <div class="contentbox">
            <div class="inside">
                <div class="contentbox-title">
                    <div class="contentbox-subtitle">
                        <h3>{{ __('taxido::static.heatmaps.heat_map') }}</h3>
                    </div>

                </div>
                <div class="alert alert-info ms-0 w-100" role="alert">
                    {{ __('taxido::static.heatmaps.text') }}
                </div>
                <div class="map-box">
                    <div id="map"></div>
                </div>
            </div>
        </div>
    </div>
@endsection

@if ($settings['location']['map_provider'] == 'google_map')
    @includeIf('taxido::admin.heat-map.google')
@elseif($settings['location']['map_provider'] == 'osm')
    @includeIf('taxido::admin.heat-map.osm')
@endif
