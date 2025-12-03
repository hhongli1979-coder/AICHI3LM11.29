@use('Modules\Taxido\Enums\ServiceCategoryEnum')
@use('Modules\Taxido\Enums\ServicesEnum')
@use('Modules\Taxido\Enums\RideStatusEnum')
@php
    $settings = getTaxidoSettings();
    $ridestatuscolorClasses = getRideStatusColorClasses();
    $rideLocationCoordinates = $ride->location_coordinates ?? [];
    $sosLocationCoordinates = $sosAlert->location_coordinates ?? [];
@endphp
@extends('admin.layouts.master')
@section('title', __('taxido::static.soses.sos_details'))
@section('content')
<div class="row ride-dashboard">
    <div class="col-12">
        <div class="default-sorting mt-0">
            <div class="welcome-box">
                <div class="d-flex justify-content-between align-items-center">
                    <h2>{{ __('taxido::static.soses.sos_details') }}</h2>
                    <div class="sos-status">
                        <form action="{{ route('admin.sos-alerts.update-status', $sosAlert->id) }}" method="POST">
                            @csrf
                            <select name="status" class="form-select" onchange="this.form.submit()">
                                <option value="requested" {{ $sosAlert?->status?->slug == 'requested' ? 'selected' : '' }}>Requested</option>
                                <option value="processing" {{ $sosAlert?->status?->slug == 'processing' ? 'selected' : '' }}>Processing</option>
                                <option value="completed" {{ $sosAlert?->status?->slug == 'completed' ? 'selected' : '' }}>Completed</option>
                            </select>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @if($ride)
        <div class="col-xxl-6">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <h5 class="m-0">{{ __('taxido::static.rides.general_detail') }}</h5>
                    </div>
                </div>
                <div class="card-body pt-0">
                    <ul class="ride-details-list">
                        <li>
                            {{ __('taxido::static.rides.ride_id') }}: <span class="bg-light-primary">#{{ $ride?->ride_number }}</span>
                        </li>
                        @if ($ride?->start_time)
                            <li>
                                {{ __('taxido::static.rides.start_date_time') }}: 
                                <span>{{ $ride?->start_time->format('Y-m-d H:i:s A') }}</span>
                            </li>
                        @endif
                        @if (in_array($ride?->service_category?->slug, [ServiceCategoryEnum::PACKAGE, ServiceCategoryEnum::RENTAL]))
                            <li>
                                {{ __('taxido::static.rides.end_date_time') }}: 
                                <span>{{ $ride->end_time?->format('Y-m-d H:i:s A') }}</span>
                            </li>
                        @endif
                        <li>
                            {{ __('taxido::static.rides.ride_status') }}: 
                            <span class="badge badge-{{ $ridestatuscolorClasses[ucfirst($ride?->ride_status?->name)] }}">
                                {{ ucfirst($ride?->ride_status?->name) }}
                            </span>
                        </li>
                        <li>
                            {{ __('taxido::static.rides.service') }}: <span>{{ $ride?->service?->name }}</span>
                        </li>
                        <li>
                            {{ __('taxido::static.rides.service_category') }}: <span>{{ $ride?->service_category?->name }}</span>
                        </li>
                        <li>
                            {{ __('taxido::static.rides.otp') }}: <span>{{ $ride?->otp }}</span>
                        </li>
                        @if (in_array($ride?->service?->slug, [ServicesEnum::PARCEL]))
                            <li>
                                {{ __('taxido::static.rides.parcel_otp') }}: <span>{{ $ride?->parcel_delivered_otp }}</span>
                            </li>
                            <li>
                                {{ __('taxido::static.rides.weight') }}: <span>{{ $ride?->weight }}</span>
                            </li>
                        @endif
                        @if (!in_array($ride?->service_category?->slug, [ServiceCategoryEnum::RENTAL]))
                            <li>
                                {{ __('taxido::static.rides.ride_distance') }}: 
                                <span>{{ $ride?->distance }} {{ $ride?->distance_unit }}</span>
                            </li>
                        @endif
                        <li>
                            {{ __('taxido::static.rides.zone') }}: 
                            <span>{{ $ride?->zones?->pluck('name')->implode(', ') ?? 'N/A' }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    @endif

    <div class="col-xxl-6">
        <div class="card">
            <div class="card-header card-no-border">
                <div class="header-top">
                    <h5 class="m-0">{{ __('taxido::static.soses.sos_details') }}</h5>
                </div>
            </div>
            <div class="card-body pt-0">
                <ul class="ride-details-list">          
                    <li>
                        {{ __('taxido::static.soses.status') }}: 
                        <span class="badge badge-{{ $sosAlert->status?->slug == 'completed' ? 'success' : ($sosAlert->status?->slug == 'processing' ? 'warning' : 'danger') }}">
                            {{ ucfirst($sosAlert?->status?->name ) }}
                        </span>
                    </li>
                    <li>
                        {{ __('taxido::static.soses.alert_time') }}: 
                        <span>{{ $sosAlert->created_at->format('Y-m-d H:i:s A') }}</span>
                    </li>
                    <li>
                        {{ __('taxido::static.soses.created_by') }}: 
                        <span>{{ ($sosAlert->created_by?->name ?? 'N/A') }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="col-xxl-12">
        <div class="card">
            <div class="card-header card-no-border">
                <div class="header-top">
                    <h5 class="m-0">{{ __('taxido::static.soses.location_map') }}</h5>
                </div>
            </div>
            <div class="card-body pt-0">
                <div id="map-view" style="height: 500px; width: 100%;"></div>
                @if($settings['location']['map_provider'] == 'google_map')
                    @include('taxido::admin.sos-alert.google', ['rideLocationCoordinates' => $rideLocationCoordinates, 'sosLocationCoordinates' => $sosLocationCoordinates])
                @elseif($settings['location']['map_provider'] == 'osm')
                    @include('taxido::admin.sos-alert.osm')
                @endif
            </div>
        </div>
    </div>
</div>
@endsection