@use('Modules\Taxido\Models\Zone')
@use('Modules\Taxido\Models\Ride')
@php
    $settings = getTaxidoSettings();
    $vehicleTypes = getVehicleType();
    $activeTab = 'all';
    $ride = Ride::latest()->first();
@endphp

@extends('admin.layouts.master')
@section('title', __('taxido::static.drivers.driver_location'))
@section('content')
    <div class="search-box">
        <div class="row g-0">
            <div class="custom-col-xxl-3 custom-col-lg-4">
                <button class="btn toggle-menu">
                    <i class="ri-menu-2-line"></i>
                </button>
                <div class="left-location-box custom-scrollbar">
                    <div class="title">
                        <h4>{{ __('taxido::static.locations.taxi_drivers') }}</h4>
                        <button class="location-close-btn btn d-xl-none">
                            <i class="ri-close-line"></i>
                        </button>
                    </div>
                    <div class="search-input">
                        <div class="position-relative w-100">
                            <input type="search" id="driver-search"
                                placeholder="{{ __('taxido::static.locations.search_driver') }}" class="form-control">
                            <i class="ri-search-line"></i>
                        </div>
                    </div>

                    <ul class="nav nav-tabs driver-tabs custom-scrollbar" id="myTab">
                        <li class="nav-item">
                            <button class="nav-link {{ $activeTab == 'all' ? 'active' : '' }}" id="all-tab"
                                data-bs-toggle="tab" data-bs-target="#all-pane">
                                {{ __('taxido::static.locations.all') }} <span class="driver-count"
                                    id="all-count">(0)</span>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link {{ $activeTab == 'onride' ? 'active' : '' }}" id="onride-tab"
                                data-bs-toggle="tab" data-bs-target="#onride-pane">
                                {{ __('taxido::static.locations.onride') }} <span class="driver-count"
                                    id="onride-count">(0)</span>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link {{ $activeTab == 'online' ? 'active' : '' }}" id="online-tab"
                                data-bs-toggle="tab" data-bs-target="#online-pane">
                                {{ __('taxido::static.locations.online') }} <span class="driver-count"
                                    id="online-count">(0)</span>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" id="offline-tab" data-bs-toggle="tab" data-bs-target="#offline-pane">
                                {{ __('taxido::static.locations.offline') }} <span class="driver-count"
                                    id="offline-count">(0)</span>
                            </button>
                        </li>
                    </ul>
                    <div id="no-data-message" class="no-data">
                        <img src="{{ asset('images/no-data.png') }}" alt="no-data" loading="lazy">
                        <h6 class="mt-2">{{ __('taxido::static.drivers.no_driver_found') }}</h6>
                    </div>
                    <div class="tab-content driver-content" id="myTabContent">

                        <div class="tab-pane fade {{ $activeTab == 'all' ? 'show active' : '' }}" id="all-pane">
                            <div class="accordion location-accordion" id="driver-list-all">
                            </div>
                        </div>

                        <div class="tab-pane fade {{ $activeTab == 'onride' ? 'show active' : '' }}" id="onride-pane">
                            <div class="accordion location-accordion" id="driver-list-onride">
                            </div>
                        </div>

                        <div class="tab-pane fade {{ $activeTab == 'online' ? 'show active' : '' }}" id="online-pane">
                            <div class="accordion location-accordion" id="driver-list-online">
                            </div>
                        </div>

                        <div class="tab-pane fade" id="offline-pane">
                            <div class="accordion location-accordion" id="driver-list-offline">
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div class="custom-col-xxl-9 custom-col-lg-8">
                <div class="location-map">
                    <div id="map_canvas"></div>
                    <div class="location-top-select">
                        <div class="accordion" id="accordionExample">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne">{{ __('taxido::static.vehicle_types.vehicle') }}</button>
                                </h2>
                                <div id="collapseOne" class="accordion-collapse collapse"
                                    data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <ul class="driver-category-box" id="vehicle-type-list">
                                            @if ($vehicleTypes->isEmpty())
                                                <div class="no-data" id="no-vehicle-types">
                                                    <img src="{{ asset('images/no-data.png') }}" alt="no-data"
                                                        loading="lazy">
                                                    <h6 class="mt-2">
                                                        {{ __('taxido::static.vehicle_types.no_vehicle_types_found') }}
                                                    </h6>
                                                </div>
                                            @else
                                                <li class="category-input">
                                                    <input class="form-control" type="text" id="vehicle-type-search"
                                                        placeholder="{{ __('taxido::static.vehicle_types.search_vehicle_types') }}"
                                                        onkeyup="filterVehicleTypes()">
                                                </li>
                                                @foreach ($vehicleTypes as $vehicleType)
                                                    <li class="vehicle-list"
                                                        data-name="{{ strtolower($vehicleType['name']) }}">
                                                        <div class="form-check">
                                                            <input class="form-check-input vehicle-filter" type="checkbox"
                                                                value="{{ $vehicleType['id'] }}"
                                                                id="vehicle-{{ $vehicleType['id'] }}">
                                                            <label for="vehicle-{{ $vehicleType['id'] }}">
                                                                <img src="{{ $vehicleType['image'] }}"
                                                                    alt="{{ $vehicleType['name'] }} image"
                                                                    class="vehicle-icon img-fluid">
                                                                {{ $vehicleType['name'] }}
                                                            </label>
                                                        </div>
                                                    </li>
                                                @endforeach
                                            @endif
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@if ($settings['location']['map_provider'] == 'google_map')
    @includeIf('taxido::admin.driver-location.google')
@elseif($settings['location']['map_provider'] == 'osm')
    @includeIf('taxido::admin.driver-location.osm')
@endif

@push('scripts')
    <script>
        $(".select-ride-btn").click(function() {
            $(".driver-category-box").addClass("show");
        });
       
        $(".location-close-btn").click(function() {
            $(".driver-category-box").removeClass("show");
        });

        $(".toggle-menu").on("click", function () {
            $(".left-location-box").toggleClass("show");
        });

        // Close sidebar on close button click
        $(".location-close-btn").on("click", function () {
            $(".left-location-box").removeClass("show");
        });

        // Search functionality
        document.getElementById('driver-search').addEventListener('input', function(e) {
            const searchQuery = e.target.value?.toLowerCase();
            const allDrivers = document.querySelectorAll('.driver-item');
            let foundDriver = false;

            allDrivers.forEach(function(driverItem) {
                const driverName = driverItem.querySelector('.name').textContent.toLowerCase();
                if (driverName.includes(searchQuery)) {
                    driverItem.style.display = 'block';
                    foundDriver = true;
                } else {
                    driverItem.style.display = 'none';
                }
            });

            document.getElementById('no-data-message').style.display = foundDriver ? 'none' : 'flex';
        });

        // Vehicle type filter
        function filterVehicleTypes() {
            const searchTerm = document.getElementById("vehicle-type-search").value.toLowerCase();
            const vehicleLists = document.querySelectorAll("#vehicle-type-list .vehicle-list");
            vehicleLists.forEach(function(listItem) {
                const vehicleName = listItem.getAttribute("data-name");
                listItem.style.display = vehicleName.includes(searchTerm) ? "block" : "none";
            });
        }

        // Initialize Bootstrap tooltips
        $(function() {
            $('[data-toggle="tooltip"]').tooltip()
        })
    </script>
@endpush
