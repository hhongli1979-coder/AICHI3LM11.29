@extends('taxido::front.account.master')
@section('title', __('taxido::front.location'))

@section('detailBox')
<div class="dashboard-details-box">
    <div class="dashboard-title">
        <h3>{{ isset($location) && $location ? __('taxido::front.edit_address') : __('taxido::front.add_address') }}</h3>
    </div>

    <form class="location-details-box" id="locationForm" action="{{ isset($location) ? route('front.cab.location.update', $location->id) : route('front.cab.location.store') }}" method="POST">
        @csrf
        @if(isset($location) && $location)
            @method('PUT')
        @endif
        <div class="form-box form-icon">
            <label class="form-label">{{ __('taxido::front.select_category') }}</label>
            <ul class="radio-group-list">
                @foreach(['Home', 'Work', 'Other'] as $type)
                    <li>
                        <input type="radio" class="form-check-input" name="type" id="{{ strtolower($type) }}" value="{{ $type }}"
                            {{ (isset($location) && $location && $location->type === $type) || old('type') === $type ? 'checked' : '' }}>
                        <label class="form-check-label" for="{{ strtolower($type) }}">
                            <span class="circle"></span>
                            {{ $type }}
                        </label>
                    </li>
                @endforeach
                @error('type')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </ul>
        </div>
        <div class="form-box form-icon">
            <label for="title" class="form-label">{{ __('taxido::front.title') }}</label>
            <div class="position-relative">
                <i class="ri-text"></i>
                <input type="text" class="form-control form-control-white" name="title" id="title" placeholder="{{ __('taxido::front.enter_title') }}"
                    value="{{ old('title', isset($location) && $location ? $location->title : '') }}">
                @error('title')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>
        </div>

        <div class="form-box form-icon">
            <label for="location" class="form-label">{{ __('taxido::front.address') }}</label>
            <div class="position-relative">
                <i class="ri-map-pin-line"></i>
                <input type="text" class="form-control form-control-white" id="location" name="location"
                    value="{{ old('location', isset($location) && $location ? $location->location : '') }}" placeholder="{{ __('taxido::front.select_address') }}" readonly>
                @error('location')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>
        </div>
        <div class="form-box form-icon">
            <label class="form-label">{{ __('taxido::static.zones.search_location') }}</label>
            <div class="position-relative">
                <i class="ri-search-2-line"></i>
                <input id="search-box" class="form-control form-control-white" type="text" placeholder="{{ __('taxido::static.zones.search_locations') }}">
                <ul id="suggestions-list" class="map-location-list custom-scrollbar mt-1"></ul>
            </div>
        </div>
        <div class="form-box form-icon">
            <label class="form-label">{{ __('taxido::static.zones.map') }}</label>
            <div>
                <div class="map-warper rounded overflow-hidden border" style="height: 400px;">
                    <div id="map-container" style="width: 100%; height: 100%;"></div>
                </div>
                <!-- Parse JSON coordinates if stored as JSON -->
                @php
                    $coordinates = isset($location) && $location && isset($location->coordinates) ? json_decode($location->coordinates, true) : null;
                    $lat = $coordinates && isset($coordinates['lat']) ? $coordinates['lat'] : old('latitude', '');
                    $lng = $coordinates && isset($coordinates['lng']) ? $coordinates['lng'] : old('longitude', '');
                @endphp
                <input type="hidden" name="latitude" id="latitude" value="{{ $lat }}">
                <input type="hidden" name="longitude" id="longitude" value="{{ $lng }}">
                @error('latitude')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
                @error('longitude')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>
        </div>
        <div class="modal-footer">
            <a href="{{ route('front.cab.location.index') }}" class="btn cancel-btn">{{ __('taxido::front.cancel') }}</a>
            <button type="submit" class="btn gradient-bg-color spinner-btn">{{ __('taxido::front.confirm_location') }}</button>
        </div>
    </form>
</div>
@endsection

@push('scripts')
<script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAP_API_KEY') }}&libraries=places&callback=initMap" async defer></script>
<script>
    let map, marker, searchBox;

    function initMap() {
        const latValue = document.getElementById('latitude').value;
        const lngValue = document.getElementById('longitude').value;
        console.log('Latitude:', latValue, 'Longitude:', lngValue);

        const initialLat = parseFloat(latValue) || 21.1702; // Default to Surat, India
        const initialLng = parseFloat(lngValue) || 72.8311; // Default to Surat, India
        const defaultCenter = { lat: initialLat, lng: initialLng };

        map = new google.maps.Map(document.getElementById('map-container'), {
            center: defaultCenter,
            zoom: 14,
        });

        marker = new google.maps.Marker({
            map: map,
            position: defaultCenter,
            draggable: true
        });

        updatePositionFields(marker.getPosition());

        marker.addListener('dragend', function () {
            updatePositionFields(marker.getPosition());
            geocodeLatLng(marker.getPosition());
        });

        if (latValue && lngValue) {
            geocodeLatLng(defaultCenter);
        } else if (document.getElementById('location').value) {
            geocodeAddress(document.getElementById('location').value);
        }

        setupSearchBox();
    }

    function updatePositionFields(position) {
        document.getElementById('latitude').value = position.lat().toFixed(6);
        document.getElementById('longitude').value = position.lng().toFixed(6);
    }

    function setupSearchBox() {
        const input = document.getElementById('search-box');
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        autocomplete.addListener('place_changed', function () {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;

            map.panTo(place.geometry.location);
            map.setZoom(15);
            marker.setPosition(place.geometry.location);
            updatePositionFields(place.geometry.location);
            document.getElementById('location').value = place.formatted_address || '';
        });
    }

    function geocodeLatLng(latlng) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK' && results[0]) {
                document.getElementById('location').value = results[0].formatted_address;
                console.log('Geocoded address:', results[0].formatted_address);
            } else {
                console.error('Geocoding failed:', status);
                document.getElementById('location').value = '';
            }
        });
    }

    function geocodeAddress(address) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                map.panTo(location);
                marker.setPosition(location);
                updatePositionFields(location);
                document.getElementById('location').value = results[0].formatted_address;
                console.log('Geocoded coordinates from address:', location.lat(), location.lng());
            } else {
                console.error('Geocoding address failed:', status);
            }
        });
    }
</script>
<script>
    (function($) {
        "use strict";
        $(document).ready(function() {
            $("#locationForm").validate({
                ignore: [],
                rules: {
                    "type": "required",
                    "title": {
                        required: true
                    },
                    "location": {
                        required: true
                    },
                },
            });
        });
    })(jQuery);
</script>
@endpush
