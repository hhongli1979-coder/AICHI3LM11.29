@use('Modules\Taxido\Models\Rider')
@use('Modules\Taxido\Models\Service')
@use('Modules\Taxido\Models\VehicleType')
@use('Modules\Taxido\Enums\ServicesEnum')
@use('Modules\Taxido\Models\HourlyPackage')
@use('Modules\Taxido\Enums\ServiceCategoryEnum')
@php
$riders = Rider::whereNull('deleted_at')->where('status', true)?->get();
$vehicleTypes = VehicleType::whereNull('deleted_at')->where('status', true)?->get();
$services = Service::whereNull('deleted_at')->where('status', true)->where('slug', ServicesEnum::CAB)?->get();
$packages = HourlyPackage::whereNull('deleted_at')->where('status', true)->get();
$packageId = getServiceCategoryIdBySlug(ServiceCategoryEnum::PACKAGE);
$scheduleId = getServiceCategoryIdBySlug(ServiceCategoryEnum::SCHEDULE);
$rentalId = getServiceCategoryIdBySlug(ServiceCategoryEnum::RENTAL);
$PaymentMethodList = getPaymentMethodList();
$ambulanceServiceId = getServiceIdBySlug(ServicesEnum::AMBULANCE);
$ambulances = getAmbulances();
@endphp
@extends('admin.layouts.master')
@push('css')
<link rel="stylesheet" href="{{ asset('css/vendors/flatpickr.min.css')}}">
@endpush

@section('content')
<div class="ride-create">
    <form id="rideForm" action="{{ route('admin.ride-request.store') }}" method="POST" enctype="multipart/form-data">
        @method('POST')
        @csrf
        <div class="contentbox">
            <div class="inside">
                <div class="contentbox-title">
                    <h3>{{ __('Create Ride Request') }}</h3>
                </div>

                <div class="row g-md-4 g-3">
                    <div class="col-12">
                        <div class="left-map-box">
                            <div class="save-address-map-box">
                                <div class="alert alert-warning">
                                    Ride requests from the admin and web currently support only on-demand cab services. Bidding rides are not supported - please ensure bidding is disabled in <a href="{{route('admin.taxido-setting.index')}}">App Settings</a>.
                                </div>
                                <div class="position-relative">
                                    <div id="map" style="height: 350px;"></div>
                                    <ul class="duration-distance-box">
                                        <li>Duration: <span id="duration">00</span></li>
                                        <input type="hidden" id="distance" class="distance-input" name="distance">
                                        <input type="hidden" id="distance_type" class="distance-input" name="distance_type">
                                        <li>Distance: <span id="distance-span">{{ setDistanceUnit()}}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                        <div class="form-group row">
                            <label class="col-12" for="rider_id">{{ __('taxido::static.rides.rider') }}<span>*</span></label>
                            <div class="col-12 select-item">
                                <select class="form-select form-select-transparent select2-option" name="rider_id"
                                    id="rider_id" data-placeholder="{{ __('taxido::static.wallets.select_rider') }}">
                                    <option></option>
                                    @foreach ($riders as $rider)
                                    <option value="{{ $rider->id }}" sub-title="{{ $rider->email }}"
                                        image="{{ $rider?->profile_image ? $rider?->profile_image?->original_url : asset('images/user.png') }}">
                                        {{ $rider->name }}
                                    </option>
                                    @endforeach
                                </select>
                                @error('rider_id')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                                <span class="text-gray">
                                    {{ __('taxido::static.wallets.add_rider_message') }}
                                    <a href="{{ route('admin.rider.create') }}" class="text-primary">
                                        <b>{{ __('taxido::static.here') }}</b>
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                        <div class="form-group row">
                            <label class="col-12" for="service_id">{{ __('taxido::static.rides.service') }}<span>*</span></label>
                            <div class="col-12 select-item">
                                <select id="service_id" class="form-select form-select-transparent select2-option"
                                    name="service_id" data-placeholder="{{ __('taxido::static.rides.select_service') }}">
                                    <option></option>
                                    @foreach ($services as $service)
                                    <option value="{{ $service->id }}" sub-title="{{ $service->description }}"
                                        image="{{ $service?->service_image ? $service?->service_image?->original_url : asset('images/user.png') }}">
                                        {{ $service->name }}
                                    </option>
                                    @endforeach
                                </select>
                                @error('service_id')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6 service-category-container">
                        <div class="form-group row">
                            <label class="col-12"
                                for="service_category_id">{{ __('taxido::static.rides.service_category') }}<span>*</span></label>
                            <div class="col-12 select-item">
                                <select class="form-select form-select-transparent select2-option"
                                    data-placeholder="{{ __('taxido::static.rides.select_service_category') }}"
                                    id="service_category_id" name="service_category_id">
                                </select>
                                <span id="slug-loader" class="spinner-border ride-loader" role="status"
                                    style="display: none;"></span>
                                @error('service_category_id')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <!-- Pickup Location -->
                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6" id="pickup-location-div">
                        <div class="form-group row">
                            <label class="col-12" for="locations">{{ __('taxido::static.rides.pickup_location') }}</label>
                            <div class="col-12" id="location-container">
                                <div class="location-row">
                                    <input type="text" id="pickup-input" name="locations[]"
                                        class="form-control ui-widget autocomplete-google location-input"
                                        placeholder="{{ __('taxido::static.rides.enter_pickup_location') }}">
                                    <input type="hidden" id="pickup-lat" class="lat-input" name="location_coordinates[0][lat]">
                                    <input type="hidden" id="pickup-lng" class="lng-input" name="location_coordinates[0][lng]">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Destination Location -->
                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6" id="destination-location-div">
                        <div class="form-group row">
                            <label for="destination" class="form-label">{{ __('taxido::static.rides.destination_location') }}</label>
                            <div class="col-12" id="destination-location-container">
                                <div class="location-row">
                                    <input type="text" id="destination-input" name="locations[]"
                                        class="form-control white-from-control ui-widget autocomplete-google location-input"
                                        placeholder="{{ __('taxido::static.rides.enter_destination_location') }}">
                                    <input type="hidden" id="destination-lat" class="lat-input" name="location_coordinates[1][lat]">
                                    <input type="hidden" id="destination-lng" class="lng-input" name="location_coordinates[1][lng]">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-8" id="rental-locations-form" style="display: none;">
                        <div class="form-group row">
                            <div class="col-6">
                                <div class="form-group row">
                                    <label class="col-12"
                                        for="rental_pickup_location">{{ __('taxido::static.rides.pickup_location') }}<span>*</span></label>
                                    <div class="col-12" id="rental-location-container">
                                        <div class="rental-location-row">
                                            <input type="text"
                                                class="form-control ui-widget autocomplete-google location-input"
                                                name="rental_locations[]" id="rental_pickup_location"
                                                placeholder="{{ __('taxido::static.rides.enter_pickup_location') }}">
                                            <input type="hidden" class="lat-input"
                                                name="rental_location_coordinates[0][lat]">
                                            <input type="hidden" class="lng-input"
                                                name="rental_location_coordinates[0][lng]">
                                        </div>
                                    </div>
                                    @error('rental_locations[]')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-6">
                                <div class="form-group row">
                                    <label class="col-12"
                                        for="rental_destination_location">{{ __('taxido::static.rides.destination_location') }}<span>*</span></label>
                                    <div class="col-12" id="rental-location-container-2">
                                        <div class="rental-location-row">
                                            <input type="text"
                                                class="form-control ui-widget autocomplete-google location-input"
                                                name="rental_locations[]" id="rental_destination_location"
                                                placeholder="{{ __('taxido::static.rides.enter_destination_location') }}">
                                            <input type="hidden" class="lat-input"
                                                name="rental_location_coordinates[1][lat]">
                                            <input type="hidden" class="lng-input"
                                                name="rental_location_coordinates[1][lng]">
                                        </div>
                                    </div>
                                    @error('rental_locations[]')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6" id="packages-list-container" style="display: none;">
                        <div class="form-group row">
                            <label class="col-12"
                                for="package_id">{{ __('taxido::static.rides.hourly_package') }}<span>*</span></label>
                            <div class="col-12 select-item">
                                <select id="hourly_package_id" class="form-control select-2" name="hourly_package_id"
                                    data-placeholder="{{ __('taxido::static.rides.select_package') }}">
                                    <option></option>
                                    @foreach ($packages as $package)
                                    <option value="{{ $package->id }}">
                                        {{ $package->hour }} hour - {{ $package->distance }} {{ $package->distance_type }}
                                    </option>
                                    @endforeach
                                </select>
                                @error('hourly_package_id')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                                <span class="text-gray">
                                    {{ __('taxido::static.hourly_package.no_hourly_package_message') }}
                                    <a href="{{ route('admin.hourly-package.create') }}" class="text-primary">
                                        <b>{{ __('taxido::static.here') }}</b>
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6" id="start-time-container" style="display: none;">
                        <div class="form-group row">
                            <label class="col-12"
                                for="start_time">{{ __('taxido::static.rides.start_date_time') }}<span>*</span></label>
                            <div class="col-12">
                                <input id="start_time" class="form-control flatpickr" type="text"
                                    placeholder="{{ __('taxido::static.rides.select_start_date_and_time') }}"
                                    name="start_time" />
                            </div>
                            @error('start_time')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6" id="end-time-container" style="display: none;">
                        <div class="form-group row">
                            <label class="col-12"
                                for="end_time">{{ __('taxido::static.rides.end_date_time') }}<span>*</span></label>
                            <div class="col-12">
                                <input id="end_time" class="form-control flatpickr" type="text"
                                    placeholder="{{ __('taxido::static.rides.select_end_date_and_time') }}"
                                    name="end_time" />
                            </div>
                            @error('end_time')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6 vehicle-type-container">
                        <div class="form-group row">
                            <label class="col-12"
                                for="vehicle_type_id">{{ __('taxido::static.rides.vehicle_type') }}<span>*</span></label>
                            <div class="col-12 select-item">
                                <select class="form-select form-select-transparent select2-option" name="vehicle_type_id" id="vehicle_type_id"
                                    data-placeholder="{{ __('taxido::static.drivers.select_vehicle') }}">
                                    <option></option>
                                </select>
                                @error('vehicle_type_id')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                                <span id="vehicle-slug-loader" class="spinner-border ride-loader" role="status"
                                    style="display: none;">
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                        <div class="form-group row">
                            <label class="col-12" for="driver_assign">{{ __('taxido::static.rides.driver_assign') }} </label>
                            <div class="col-12">
                                <div class="switch-field form-control">
                                    <input value="automatic" type="radio" name="driver_assign" id="driver_assign_automatic"/>
                                    <label for="driver_assign_automatic">{{ __('taxido::static.rides.automatic') }}</label>
                                    <input value="manual" type="radio" name="driver_assign" id="driver_assign_manual" checked/>
                                    <label for="driver_assign_manual">{{ __('taxido::static.rides.manual') }}</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6" id="drivers_div"  style="display: block;">
                        <div class="form-group row">
                            <label for="driver"
                                class="col-12">{{ __('taxido::static.rides.driver') }}<span>*</span></label>
                            <div class="col-12">
                                <select class="select-2 form-control driver-control" id="driver" name="driver"
                                    data-placeholder="{{ __('taxido::static.rides.select_driver') }}">
                                    <option></option>
                                </select>
                                <span id="no-drivers-message" class="text-danger" style="display: none;">
                                    {{ __('taxido::static.rides.no_drivers_found') }}
                                </span>
                                @error('driver')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                                <span class="text-gray">
                                    {{ __('taxido::static.wallets.add_driver_message') }}
                                    <a href="{{ route('admin.driver.create') }}" class="text-primary">
                                        <b>{{ __('taxido::static.here') }}</b>
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6" id="cargo_image_div" style="display: none;">
                        <div class="form-group row">
                            <label class="col-12" for="cargo_image_id">
                                {{ __('taxido::static.rides.cargo_image') }}
                            </label>
                            <div class="col-12">
                                <div class="form-group">
                                    <x-image :name="'cargo_image_id'" :data="old('cargo_image_id')" :text="''"
                                        :multiple="false"></x-image>
                                    @error('cargo_image_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6" id="rental-vehicle" style="display: none;">
                        <div class="form-group row">
                            <label class="col-12"
                                for="rental_vehicle">{{ __('taxido::static.rides.rental_vehicle') }}<span>*</span></span></label>
                            <div class="col-12 select-item">
                                <select class="form-control select-2" name="rental_vehicle_id" id="rental_vehicle_id"
                                    data-placeholder="{{ __('taxido::static.drivers.select_rental_vehicle') }}">
                                    <option></option>
                                </select>
                                @error('rental_vehicle_id')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                                <span id="rental-slug-loader" class="spinner-border ride-loader" role="status"
                                    style="display: none;"></span>
                                <span class="text-gray">
                                    {{ __('taxido::static.drivers.no_rental_message') }}
                                    <a href="{{ route('admin.rental-vehicle.create') }}" class="text-primary">
                                        <b>{{ __('taxido::static.here') }}</b>
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6" id="weight_div" style="display: none;">
                        <div class="form-group row">
                            <label class="col-12" for="weight">
                                {{ __('taxido::static.rides.weight') }}<span>*</span>
                            </label>
                            <div class="col-12 amount">
                                <div class="w-100">
                                    <input class="form-control" type="number" id="weight" name="weight"
                                        min="0" value="{{ old('weight') }}"
                                        placeholder="{{ __('taxido::static.rides.enter_weight') }}">
                                    @error('weight')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-8" id="parcel-container" style="display: none;">
                        <div class="form-group row g-sm-4 g-3">
                            <div class="col-sm-6">
                                <div class="form-group row">
                                    <label class="col-12" for="name">
                                        {{ __('taxido::static.rides.receiver_full_name') }}<span>*</span>
                                    </label>
                                    <div class="col-12">
                                        <input class="form-control" type="text" id="parcel_receiver[name]"
                                            name="parcel_receiver[name]"
                                            placeholder="{{ __('taxido::static.rides.enter_receiver_full_name') }}">
                                        @error('parcel_receiver[name]')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group row">
                                    <label class="col-12"
                                        for="phone">{{ __('taxido::static.rides.receiver_phone') }}<span>*</span></label>
                                    <div class="col-12">
                                        <div class="input-group mb-3 phone-detail row g-0 phone-details-2">
                                            <div class="col-sm-1">
                                                <select class="select-2 form-control" id="select-country-code"
                                                    name="parcel_receiver[country_code]">
                                                    @foreach (getCountryCodes() as $option)
                                                    <option class="option" value="{{ $option->calling_code }}"
                                                        data-image="{{ asset('images/flags/' . $option->flag) }}">
                                                        {{ $option->calling_code }}
                                                    </option>
                                                    @endforeach
                                                </select>
                                            </div>
                                            <div class="col-sm-11">
                                                <input class="form-control" type="number"
                                                    name="parcel_receiver[phone]" id="parcel_receiver[phone]"
                                                    placeholder="{{ __('taxido::static.rides.enter_receiver_phone') }}">
                                            </div>
                                            @error('parcel_receiver[phone]')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6" id="ambulance_div" style="display:none">
                        <div class="form-group row">
                            <label class="col-12"
                                for="ambulance_id">{{ __('taxido::static.rides.ambulance') }}<span>*</span></label>
                            <div class="col-12 select-item">
                                <select class="form-select select-2" name="ambulance_id"
                                    id="ambulance_id" data-placeholder="{{ __('taxido::static.rides.select_ambulance') }}">
                                    <option></option>
                                    @foreach ($ambulances as $ambulance)
                                    <option value="{{ $ambulance?->id }}">
                                        {{ $ambulance?->name }}
                                    </option>
                                    @endforeach
                                </select>
                                @error('ambulance_id')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="form-group row" id="with-driver-container" style="display: none;">
                        <label class="col-md-2" for="with_driver">{{ __('taxido::static.rental_vehicle.with_driver') }}</label>
                        <div class="col-md-10">
                            <label class="switch">
                                <input class="form-control" type="hidden" name="is_with_driver" value="0">
                                <input class="form-check-input" type="checkbox" id="is_with_driver"
                                    name="is_with_driver" value="1" @checked(old('is_with_driver', true))>
                                <span class="switch-state"></span>
                            </label>
                            @error('is_with_driver')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                        <div class="form-group row">
                            <label class="col-12" for="description">{{ __('Note') }}</label>
                            <div class="col-12">
                                <div class="position-relative">
                                    <textarea class="form-control" placeholder="{{ __('Write here..') }}"
                                        rows="4" id="description" name="description" cols="50">{{ old('description') }}</textarea>
                                    <i class="ri-file-copy-line copy-icon" data-target="#description"></i>
                                </div>
                            </div>
                            @error('description')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-12">
                        <div class="submit-btn">
                            <button type="submit" name="save" class="btn btn-solid spinner-btn"><i class="ri-save-line text-white lh-1"></i>{{ __('Book Ride Request') }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAP_API_KEY') }}&libraries=places,geometry,drawing&callback=initMap" defer></script>

<!-- Firebase SDK (included for compatibility, though not used directly) -->
<script src="{{ asset('js/firebase/firebase-app-compat.js')}}"></script>
<script src="{{ asset('js/firebase/firebase-firestore-compat.js')}}"></script>

<script>
    let map, directionsService, directionsRenderer;
    let pickupLatLng = null, destinationLatLng = null;
    let driverMarkers = [];

    function clearDriverMarkers() {
        driverMarkers.forEach(marker => marker.setMap(null));
        driverMarkers = [];
    }

    function fetchAndDisplayDrivers(lat, lng, serviceId = null, serviceCategoryId = null, vehicleTypeId = null) {
        clearDriverMarkers();
        const $driverSelect = $('#driver');
        $driverSelect.empty().append('<option></option>');
        $driverSelect.prop('disabled', true);
        $('#no-drivers-message').hide();

        let url = "{{ route('admin.fetch-drivers', ['lat' => '__lat__', 'lng' => '__lng__']) }}";
        url = url.replace('__lat__', lat).replace('__lng__', lng);

        if (serviceId) url += '/' + serviceId;
        if (serviceCategoryId) url += '/' + serviceCategoryId;
        if (vehicleTypeId) url += '/' + vehicleTypeId;

        $.ajax({
            url: url,
            type: 'GET',
            success: function(response) {
                let driversFound = false;
                response.forEach(driver => {
                    const driverLat = parseFloat(driver.lat);
                    const driverLng = parseFloat(driver.lng);

                    if (isNaN(driverLat) || isNaN(driverLng)) {
                        console.warn(`Invalid lat/lng for driver ${driver.name}:`, driver.lat, driver.lng);
                        return;
                    }

                    // Add driver to dropdown
                    const option = $('<option></option>')
                        .val(driver.id)
                        .text(driver.name)
                        .attr('sub-title', driver.phone || 'N/A')
                        .attr('image', driver.profile_image_url);
                    $driverSelect.append(option);

                    // Add marker to map
                    const markerIcon = {
                        url: driver.vehicle_map_icon_url,
                        scaledSize: new google.maps.Size(40, 40)
                    };
                    const marker = new google.maps.Marker({
                        position: { lat: driverLat, lng: driverLng },
                        map: map,
                        icon: markerIcon,
                        title: `Driver: ${driver.name}`
                    });

                    // Add info window
                    const infoWindow = new google.maps.InfoWindow({
                        content: `
                            <div class="driver-location-box">
                                <div class="vehicle-image">
                                    <img src="${driver.profile_image_url}" class="img-fluid" />
                                </div>
                                <h5><span>${driver.name || 'Unknown Driver'}</span></h5>
                                <ul class="location-list">
                                    <li class="rate-box">Rating: <span><i class="ri-star-fill"></i> ${driver.rating}</span></li>
                                    <li>Vehicle: <span>${driver.vehicle_type_id}</span></li>
                                    <li>Phone: <span>${driver.phone}</span></li>
                                    <li>Model: <span>${driver.vehicle_model}</span></li>
                                    <li>Plate Number: <span>${driver.plate_number}</span></li>
                                </ul>
                            </div>
                        `
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });

                    driverMarkers.push(marker);
                    driversFound = true;
                });

                if (!driversFound) {
                    toastr.warning("{{ __('taxido::static.rides.no_drivers_found') }}", {
                        closeButton: true,
                        progressBar: true,
                        timeOut: 5000
                    });
                    $('#driver').empty().append('<option></option>').prop('disabled', true);
                } else {
                    console.log('Drivers found:', $driverSelect.find('option').length - 1);
                }

                $driverSelect.prop('disabled', false);
                $driverSelect.trigger('change');
            },
            error: function(xhr, status, error) {
                console.error("Error fetching drivers:", error);
                $('#no-drivers-message').show();
                toastr.error("Error fetching drivers. Please try again.", {
                    closeButton: true,
                    progressBar: true,
                    timeOut: 5000
                });
                $driverSelect.prop('disabled', false);
                $('#driver').empty().append('<option></option>').prop('disabled', true);
            }
        });
    }

    window.initMap = function() {
        let distanceType = 'km', distanceLabel = 'KM';

        // Initialize Directions Service and Renderer
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();

        // Initialize map with a default center
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            center: { lat: 0, lng: 0 }
        });
        directionsRenderer.setMap(map);

        // Debounce function to prevent rapid calls
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Function to update route and display distance/duration
        const updateRoute = debounce(function() {
            if (pickupLatLng && destinationLatLng) {
                const request = {
                    origin: pickupLatLng,
                    destination: destinationLatLng,
                    travelMode: google.maps.TravelMode.DRIVING
                };

                if (pickupLatLng) {
                    let url = "{{ route('get.zoneId') }}";
                    $.ajax({
                        url: url + '?lat=' + pickupLatLng.lat + '&lng=' + pickupLatLng.lng,
                        type: "GET",
                        success: function(zone) {
                            if (zone?.success !== false) {
                                distanceType = zone.distance_type;
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error("Zone fetch error:", status, error);
                        },
                    });
                }

                directionsService.route(request, function(result, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsRenderer.setDirections(result);
                        const route = result.routes[0].legs[0];
                        let distance = (route.distance.value / 1000).toFixed(2);
                        const duration = route.duration.text;

                        if (distanceType === "mile") {
                            distance = (distance * 0.62137119).toFixed(2);
                            distanceLabel = 'Miles';
                        }

                        document.getElementById("distance-span").textContent = `${distance} ${distanceLabel}`;
                        document.getElementById("duration").textContent = duration;
                        document.getElementById("distance").value = distance;
                        document.getElementById("distance_type").value = distanceType;
                    } else {
                        console.error("Directions request failed:", status);
                        document.getElementById("distance-span").textContent = `0.00 ${distanceLabel}`;
                        document.getElementById("duration").textContent = "00";
                        document.getElementById("distance").value = 0.0;
                        document.getElementById("distance_type").value = distanceType;

                        console.log("ELSE DIRECTION: ",pickupLatLng, destinationLatLng )
                        directionsRenderer.setDirections({ routes: [] });
                        if (status === "ZERO_RESULTS") {
                            alert("No route could be found between the selected locations. Please try different locations.");
                        }
                    }
                });
            } else {
                directionsRenderer.setDirections({ routes: [] });
                document.getElementById("distance-span").textContent = "0.00 KM";
                document.getElementById("duration").textContent = "00";
                document.getElementById("distance").value = "";
                document.getElementById("distance_type").value = "";
            }
        }, 300);

        // Wait for DOM to be ready before initializing autocomplete
        document.addEventListener('DOMContentLoaded', function() {
            const pickupInput = document.getElementById("pickup-input");
            const destinationInput = document.getElementById("destination-input");

            if (!pickupInput || !destinationInput) {
                console.error("Input elements not found:", { pickupInput, destinationInput });
                alert("Error: Input fields for pickup or destination not found.");
                return;
            }

            // Clear any existing autocomplete bindings
            google.maps.event.clearInstanceListeners(pickupInput);
            google.maps.event.clearInstanceListeners(destinationInput);

            // Initialize Autocomplete
            const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput, {
                types: ['geocode']
            });
            const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, {
                types: ['geocode']
            });

            // Handle pickup location change
            pickupAutocomplete.addListener('place_changed', function() {
                const place = pickupAutocomplete.getPlace();
                if (place.geometry && place.geometry.location) {
                    pickupLatLng = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    };
                    document.getElementById("pickup-lat").value = pickupLatLng.lat;
                    document.getElementById("pickup-lng").value = pickupLatLng.lng;
                    map.setCenter(pickupLatLng);
                    updateRoute();

                    // Fetch drivers based on new pickup location
                    const serviceId = $('#service_id').val();
                    const serviceCategoryId = $('#service_category_id').val();
                    const vehicleTypeId = $('#vehicle_type_id').val();
                    fetchAndDisplayDrivers(pickupLatLng?.lat, pickupLatLng?.lng, serviceId, serviceCategoryId, vehicleTypeId);
                } else {
                    pickupLatLng = null;
                    document.getElementById("pickup-lat").value = "";
                    document.getElementById("pickup-lng").value = "";
                    updateRoute();
                    clearDriverMarkers();
                    $('#driver').empty().append('<option></option>').prop('disabled', true);
                    $('#no-drivers-message').show();
                }
            });

            // Handle destination location change
            destinationAutocomplete.addListener('place_changed', function() {
                const place = destinationAutocomplete.getPlace();
                if (place.geometry && place.geometry.location) {
                    destinationLatLng = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    };
                    document.getElementById("destination-lat").value = destinationLatLng.lat;
                    document.getElementById("destination-lng").value = destinationLatLng.lng;
                    updateRoute();
                } else {
                    destinationLatLng = null;
                    document.getElementById("destination-lat").value = "";
                    document.getElementById("destination-lng").value = "";
                    updateRoute();
                }
            });

            // Get user's current location and show all online drivers by default
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const userLatLng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    // Update map center
                    map.setCenter(userLatLng);

                    // Add marker at user's location
                    new google.maps.Marker({
                        position: userLatLng,
                        map: map,
                        title: "You are here!"
                    });

                    // Reverse geocode to get address for pickup
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ location: userLatLng }, function(results, status) {
                        if (status === google.maps.GeocoderStatus.OK && results[0]) {
                            pickupInput.value = results[0].formatted_address;
                            pickupLatLng = userLatLng;
                            document.getElementById("pickup-lat").value = pickupLatLng.lat;
                            document.getElementById("pickup-lng").value = pickupLatLng.lng;
                            google.maps.event.trigger(pickupAutocomplete, 'place_changed');
                            // Fetch all online drivers by default
                            if(pickupLatLng?.lat != undefined && pickupLatLng?.lng != undefined) {
                                fetchAndDisplayDrivers(pickupLatLng?.lat, pickupLatLng?.lng);
                            }
                        } else {
                            console.error("Geocoding failed:", status);
                            pickupInput.value = "";
                            if(userLatLng?.lat != undefined && userLatLng?.lng != undefined) {
                                fetchAndDisplayDrivers(userLatLng?.lat, userLatLng?.lng);
                            }
                        }
                    });
                }, function(error) {
                    console.error("Geolocation failed:", error.message);
                    alert("Failed to get your location.");
                    fetchAndDisplayDrivers(0, 0);
                });
            } else {
                console.error("Geolocation not supported by browser");
                alert("Geolocation is not supported by your browser.");
                fetchAndDisplayDrivers(0, 0);
            }
        });
    };
</script>

<script>
    (function($) {
        "use strict";

        $("#rideForm").validate({
            ignore: [],
            rules: {
                "rider_id": "required",
                "service_id": "required",
                "service_category_id": {
                    required: function() {
                        return $('#service_id').val() != <?php echo $ambulanceServiceId; ?>;
                    }
                },
                "vehicle_type_id": {
                    required: function() {
                        return $('#service_id').val() != <?php echo $ambulanceServiceId; ?>;
                    }
                },
                "driver": {
                    required: function() {
                        const isManual = $('#driver_assign_manual').is(':checked');
                        return isManual && $('#service_category_id').val() != <?php echo $rentalId; ?>;
                    }
                },
                "weight": {
                    required: setParcelRule
                },
                "parcel_receiver[phone]": {
                    required: setParcelRule
                },
                "parcel_receiver[name]": {
                    required: setParcelRule
                },
                "rental_locations[]": {
                    required: setLocationRule
                },
                'start_time': {
                    required: setStartTimeRule
                },
                'rental_vehicle_id': {
                    required: setRentalRule
                },
                'end_time': {
                    required: setRentalRule
                },
                'hourly_package_id': {
                    required: setPackageRule
                },
                "locations[]": {
                    required: true
                }
            }
        });

        const packageId = <?php echo $packageId; ?>;
        const scheduleId = <?php echo $scheduleId; ?>;
        const rentalId = <?php echo $rentalId; ?>;
        const parcelId = <?php echo getServiceIdBySlug(ServicesEnum::PARCEL); ?>;
        const freightId = <?php echo getServiceIdBySlug(ServicesEnum::FREIGHT); ?>;
        const ambulanceId = <?php echo $ambulanceServiceId; ?>;
        const $serviceCategoryDropdown = $('#service_category_id');
        const $packagesContainer = $('#packages-list-container');
        const $startTimeContainer = $('#start-time-container');
        const $endTimeContainer = $('#end-time-container');
        const $locationRows = $('#locations-form');
        const $rentalLocationRows = $('#rental-locations-form');
        const $rentalVehicle = $('#rental-vehicle');
        const $weight = $('#weight_div');
        const $cargoImage = $('#cargo_image_div');
        const $parcelContainer = $('#parcel-container');
        const $vehicleTypeContainer = $('.vehicle-type-container');
        const $serviceCategoryContainer = $('.service-category-container');
        const $addLocationButton = $('#add-location-container');

        function toggleDriverDiv() {
            const isManual = $('#driver_assign_manual').is(':checked');
            const $driverDiv = $('#drivers_div');
            const $driverSelect = $('#driver');

            if (isManual) {
                $driverDiv.show();
                $driverSelect.prop('required', true);
            } else {
                $driverDiv.hide();
                $driverSelect.prop('required', false);
                $driverSelect.val('').trigger('change');
            }
        }

        toggleDriverDiv();

        $('input[name="driver_assign"]').on('change', function() {
            toggleDriverDiv();
            updateDrivers();
        });

        function updateFormVisibility() {
            const selectedService = parseInt($('#service_id').val(), 10);
            const selectedCategory = parseInt($serviceCategoryDropdown.val(), 10);
            $packagesContainer.hide();
            $startTimeContainer.hide();
            $endTimeContainer.hide();
            $locationRows.hide();
            $rentalLocationRows.hide();
            $rentalVehicle.hide();
            $parcelContainer.hide();
            $weight.hide();
            $cargoImage.hide();
            $('#with-driver-container').hide();
            $('#drivers_div').show();
            $addLocationButton.show();

            if (selectedService === ambulanceId) {
                $vehicleTypeContainer.hide();
                $serviceCategoryContainer.hide();
                $locationRows.show();
                $('#drivers_div').hide();
                $('#ambulance_div').show();
                $addLocationButton.hide();
                $('#location-container .location-row:gt(0)').remove();
            } else {
                $vehicleTypeContainer.show();
                $serviceCategoryContainer.show();
                $('#ambulance_div').hide();
                if (selectedCategory === packageId) {
                    $packagesContainer.show();
                    $rentalLocationRows.show();
                } else if (selectedCategory === scheduleId) {
                    if (selectedService !== freightId) {
                        $startTimeContainer.show();
                    }
                    $locationRows.show();
                } else if (selectedCategory === rentalId) {
                    $startTimeContainer.show();
                    $endTimeContainer.show();
                    $rentalLocationRows.show();
                    $rentalVehicle.show();
                    $('#with-driver-container').show();
                    $('#drivers_div').hide();
                } else {
                    $locationRows.show();
                }

                if (selectedService === parcelId) {
                    $parcelContainer.show();
                    $weight.show();
                }

                if (selectedService === freightId) {
                    $cargoImage.show();
                }
            }
        }

        function updateDrivers() {
            const lat = parseFloat($('#pickup-lat').val());
            const lng = parseFloat($('#pickup-lng').val());
            const serviceId = $('#service_id').val();
            const serviceCategoryId = $('#service_category_id').val();
            const vehicleTypeId = $('#vehicle_type_id').val();

            if (!isNaN(lat) && !isNaN(lng)) {
                fetchAndDisplayDrivers(lat, lng, serviceId, serviceCategoryId, vehicleTypeId);
            } else {
                console.warn('Invalid lat/lng for driver fetch:', lat, lng);
                // $('#no-drivers-message').show();
                $('#driver').empty().append('<option></option>').prop('disabled', true);
            }
        }

        $('#service_id').on('change', function() {
            $('#service_category_id').empty().prop('disabled', true);
            $('#vehicle_type_id').empty().prop('disabled', true);
            const serviceId = $(this).val();
            if (serviceId != ambulanceId) {
                loadServiceCategories(serviceId);
            }
            updateFormVisibility();
            updateDrivers();
        });

        $('#service_category_id').on('change', function() {
            const serviceId = $('#service_id').val();
            const serviceCategoryId = $(this).val();
            $('#vehicle_type_id').empty().prop('disabled', true);
            loadVehicles(serviceId, serviceCategoryId);
            updateFormVisibility();
            updateDrivers();
        });

        $('#vehicle_type_id').on('change', function() {
            const vehicleTypeId = $(this).val();
            loadRentalVehicles(vehicleTypeId);
            updateDrivers();
        });

        $('#rider_id').on('change', function() {
            updateDrivers();
        });

        function initializeAutocomplete($inputRow) {
            const $locationInput = $inputRow.find('.location-input');
            const $latInput = $inputRow.find('.lat-input');
            const $lngInput = $inputRow.find('.lng-input');
            const autocomplete = new google.maps.places.Autocomplete($locationInput[0]);
            autocomplete.addListener('place_changed', function() {
                const place = autocomplete.getPlace();
                if (place.geometry) {
                    $latInput.val(place.geometry.location.lat());
                    $lngInput.val(place.geometry.location.lng());
                    updateDrivers();
                }
            });
        }

        $(window).on('load', function() {
            if (typeof google !== 'undefined') {
                initializeAutocomplete($('#location-container .location-row').first());
                initializeAutocomplete($('#rental-location-container .rental-location-row').first());
                initializeAutocomplete($('#rental-location-container-2 .rental-location-row').first());
            }
            updateFormVisibility();
        });

        let locationIndex = 1;
        $('#add-location').click(function() {
            const totalLocations = $('#location-container .location-row').length;
            const isFirstLocation = totalLocations === 0;

            const newRow = $(`
                    <div class="row g-2 mt-3">
                        <div class="custom-col-md-11 ms-0">
                            <div class="location-row">
                                <input type="text" class="form-control ui-widget autocomplete-google location-input" name="locations[]" placeholder="${isFirstLocation ? '{{ __('taxido::static.rides.enter_pickup_location') }}' : '{{ __('taxido::static.rides.enter_destination_location') }}'}">
                                <input type="hidden" class="lat-input" name="location_coordinates[${locationIndex}][lat]">
                                <input type="hidden" class="lng-input" name="location_coordinates[${locationIndex}][lng]">
                            </div>
                        </div>
                        <div class="custom-col-md-1 ms-0">
                            <button type="button" class="btn remove-location w-100 justify-content-center btn-sm h-100">
                                <i class="ri-delete-bin-line text-danger"></i>
                            </button>
                        </div>
                    </div>`);

            $('#location-container').append(newRow);
            locationIndex++;
            initializeAutocomplete(newRow);
        });

        $('#location-container').on('click', '.remove-location', function() {
            $(this).closest('.row').remove();
            updateDrivers();
        });

        const optionFormat = (item) => {
            if (!item.id) {
                return item.text;
            }

            var span = document.createElement('span');
            var html = '';
            html += '<div class="selected-item">';
            html += '<img src="' + item.element.getAttribute('image') +
                '" class="rounded-circle h-30 w-30" alt="' + item.text + '"/>';
            html += '<div class="detail">'
            html += '<h6>' + item.text + '</h6>';
            html += '<p>' + item.element.getAttribute('sub-title') + '</p>';
            html += '</div>';
            html += '</div>';
            span.innerHTML = html;
            return $(span);
        }

        $('.select2-option').select2({
            placeholder: "Select an option",
            templateSelection: optionFormat,
            templateResult: optionFormat
        });

        $('#driver').select2({
            placeholder: "{{ __('taxido::static.rides.select_driver') }}",
            templateSelection: optionFormat,
            templateResult: optionFormat
        });

        function loadServiceCategories(serviceId) {
            let url = "{{ route('serviceCategory.index') }}";
            if (serviceId) {
                $.ajax({
                    url: url + '?service_id=' + serviceId,
                    type: "GET",
                    success: function(data) {
                        $('#service_category_id').empty().append('<option value=""></option>');
                        $.each(data.data, function(index, item) {
                            if (item.id !== <?php echo $rentalId; ?> && item.id !== <?php echo $packageId; ?>) {
                                $('#service_category_id').append('<option value="' + item.id + '" sub-title="(' + item.service_type + ')" image="' + item.service_category_image_url + '">' + item.name + '</option>');
                            }
                        });
                        $('#service_category_id').prop('disabled', false);
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching service categories:", error);
                        $('#service_category_id').empty().append('<option value=""></option>');
                    },
                });
            } else {
                $('#service_category_id').empty().append('<option value=""></option>');
            }
        }

        function loadVehicles(serviceId, serviceCategoryId, selectedVehicleId = null) {
            let url = "{{ route('vehicleType.index') }}";
            $('#vehicle_type_id').prop('disabled', true);
            if (serviceCategoryId) {
                $.ajax({
                    url: url + '?service_id=' + serviceId + '&service_category_id=' + serviceCategoryId,
                    type: "GET",
                    success: function(data) {
                        $('#vehicle_type_id').empty().append('<option></option>');
                        $.each(data.data, function(index, item) {
                            var option = '<option value="' + item.id + '" sub-title="(' + item.slug + ')" image="' + item.vehicle_image_url + '">' + item.name + '</option>';
                            if (String(item.id) === String(selectedVehicleId)) {
                                option = '<option value="' + item.id + '" sub-title="(' + item.slug + ')" image="' + item.vehicle_image_url + '" selected>' + item.name + '</option>';
                            }
                            $('#vehicle_type_id').append(option);
                        });
                        $('#vehicle_type_id').prop('disabled', false);
                        $('#vehicle_type_id').val(selectedVehicleId).trigger('change');
                    },
                    error: function() {
                        console.error('Error fetching vehicle types');
                        $('#vehicle_type_id').empty().append('<option></option>');
                        $('#vehicle_type_id').prop('disabled', false);
                    },
                });
            } else {
                $('#vehicle_type_id').empty().append('<option></option>');
                $('#vehicle_type_id').prop('disabled', false);
            }
        }

        function loadRentalVehicles(vehicleTypeId, selectedRentalVehicleId = null) {
            let url = "{{ route('admin.rental-vehicle.filter', '') }}";
            if (vehicleTypeId) {
                $.ajax({
                    url: url + '/' + vehicleTypeId,
                    type: "GET",
                    success: function(data) {
                        $('#rental_vehicle_id').empty().append('<option></option>');
                        $.each(data, function(id, name) {
                            var option = new Option(name, id);
                            if (String(id) === String(selectedRentalVehicleId)) {
                                $(option).prop("selected", true);
                            }
                            $('#rental_vehicle_id').append(option);
                        });
                        $('#rental_vehicle_id').prop('disabled', false);
                        $('#rental_vehicle_id').val(selectedRentalVehicleId).trigger('change');
                    },
                    error: function() {
                        console.error('Error fetching rental vehicles');
                        $('#rental_vehicle_id').empty().append('<option></option>');
                        $('#rental_vehicle_id').prop('disabled', false);
                    }
                });
            } else {
                $('#rental_vehicle_id').empty().append('<option></option>');
                $('#rental_vehicle_id').prop('disabled', false);
            }
        }

        $('.flatpickr').flatpickr({
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            minDate: "today",
            time_24hr: true
        });

        function setParcelRule() {
            return $('#service_id').val() == parcelId;
        }

        function setLocationRule() {
            return $('#service_category_id').val() == rentalId || $('#service_category_id').val() == packageId;
        }

        function setRentalRule() {
            return $('#service_category_id').val() == rentalId;
        }

        function setStartTimeRule() {
            return ($('#service_category_id').val() == rentalId || $('#service_category_id').val() == scheduleId) && $('#service_id').val() != freightId;
        }

        function setPackageRule() {
            return $('#service_category_id').val() == packageId;
        }

        $('form').on('submit', function(event) {
            const selectedDriver = $('#driver').val();
            if ($('#service_category_id').val() != rentalId && $('#service_id').val() != ambulanceId && !selectedDriver && $('#driver_assign_manual').is(':checked')) {
                event.preventDefault();
                toastr.error("{{ __('taxido::static.rides.no_driver_selected') }}", {
                    closeButton: true,
                    progressBar: true,
                    timeOut: 5000
                });
                $('.spinner-btn').prop('disabled', false);
            }
        });
    })(jQuery);
</script>
@endpush
