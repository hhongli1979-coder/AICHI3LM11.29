@use('Modules\Taxido\Enums\ServicesEnum')
@use('App\Enums\PaymentStatus')
@use('Modules\Taxido\Enums\RideStatusEnum')
@use('Modules\Taxido\Enums\ServiceCategoryEnum')
@php
    $locations = is_array($ride->locations ?? null) ? $ride->locations : [];
    $settings = getTaxidoSettings();
    $ridestatuscolorClasses = getRideStatusColorClasses();
    $paymentstatuscolorClasses = getPaymentStatusColorClasses();
    $locationCoordinates = $ride->location_coordinates ?? [];
    $paymentLogoUrl = getPaymentLogoUrl(strtolower($ride->payment_method ?? 'cash'));
    $currencySymbol = getDefaultCurrencySymbol();
    $cs = $ride?->currency_symbol ?? $currencySymbol;
@endphp

@push('css')
    <style>
        /* Ensure map container has proper dimensions */
        #tracking-map {
            width: 100%;
            height: 100%;
            position: relative;
        }

        /* Custom marker styles */
        .gm-style-iw {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Fix for SVG icons */
        img[src*=".svg"] {
            width: 40px !important;
            height: 40px !important;
        }
    </style>
@endpush

@extends('front.layouts.master')
@section('title', "Ride Tracking - $ride->ride_number ?? '' ")
@section('content')

    <div class="tracking-container">
        <!-- Map Section -->
        <div class="map-section">
            <div id="tracking-map"></div>
            <!-- Map Controls - Only center and map type buttons -->
            <div class="map-controls">
                <button class="map-control-btn" id="centerOnDriverBtn" title="Center on Driver">
                    <i class="ri-focus-3-line"></i>
                </button>
                <button class="map-control-btn" id="toggleMapTypeBtn" title="Toggle Map Type">
                    <i class="ri-map-2-line"></i>
                </button>
            </div>
        </div>

        <!-- Ride Details Sidebar -->
        <div class="details-sidebar custom-scrollbar" id="detailsSidebar">
            <div class="sidebar-header">
                <div class="sidebar-title">Ride Details</div>
                <button class="sidebar-toggle" id="closeSidebarBtn">
                    <i class="ri-arrow-down-s-line"></i>
                </button>
            </div>

            <!-- Ride Header Section -->
            <div class="ride-header" id="rideHeader">
                <div class="ride-status-indicator">
                    <div class="status-dot"></div>
                    <span class="badge" id="ride-status">
                        {{ ucfirst($ride->ride_status['name'] ?? 'Unknown') }}
                    </span>
                </div>

                <div class="ride-number" id="ride-number">
                    #{{ $ride->ride_number ?? '' }}
                </div>

                @if ($ride->otp)
                    <div class="badge badge-info" id="otp">
                        OTP: {{ $ride->otp }}
                    </div>
                @endif
            </div>

            <!-- Enhanced Timeline Activities Section -->
            <div class="status-activities">
                <h3 class="activities-title">
                    <i class="ri-history-line"></i>
                    Ride Timeline
                </h3>
                <div class="timeline" id="timeline-activities">
                    @php
                        $activities = $ride->ride_status_activities ?? collect([]);
                        $currentStatus = $ride->ride_status['name'] ?? '';
                        $hasActivities = count($activities) > 0;
                    @endphp

                    @if ($hasActivities)
                        @foreach ($activities->sortBy('created_at') as $activity)
                            @php
                                $statusName = $activity->ride_status->name ?? $activity->status;
                                $statusTime = $activity->changed_at ?? $activity->created_at;
                                $isCurrent = $statusName === $currentStatus;
                            @endphp
                            <div class="timeline-item {{ $isCurrent ? 'current' : '' }}">
                                <div class="timeline-marker bg-success"></div>
                                <div class="timeline-content">
                                    <div>
                                        <div class="timeline-status">{{ ucfirst(str_replace('_', ' ', $statusName)) }}</div>
                                        <div class="timeline-description"></div>
                                    </div>
                                    <div class="timeline-time">
                                        {{ \Carbon\Carbon::parse($statusTime)->format('M j, g:i A') }}</div>
                                </div>
                            </div>
                        @endforeach
                    @else
                        <!-- Fallback timeline -->
                        <div class="timeline-item current">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <div>
                                    <div class="timeline-status">{{ ucfirst(str_replace('_', ' ', $currentStatus)) }}</div>
                                    <div class="timeline-description">Current ride status</div>
                                </div>
                                <div class="timeline-time">{{ now()->format('M j, g:i A') }}</div>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <div>
                                    <div class="timeline-status">Requested</div>
                                    <div class="timeline-description">A new ride was requested by the rider</div>
                                </div>
                                <div class="timeline-time">
                                    {{ \Carbon\Carbon::parse($ride->created_at)->format('M j, g:i A') }}</div>
                            </div>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Add this after the Ride Header Section -->
<!-- Start Ride Location Section -->
@php
    $hasStartRideLocation = !empty($ride->start_ride_locations) && !empty($ride->start_ride_coordinates);
    $startRideLocationText = is_array($ride->start_ride_locations) ? ($ride->start_ride_locations[0] ?? '') : $ride->start_ride_locations;
@endphp

@if($hasStartRideLocation)
<div class="accordion-section">
    <div class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#startRideCollapse">
            <i class="ri-map-pin-line me-2"></i>
            Ride Start Location
        </button>
    </div>
    <div id="startRideCollapse" class="accordion-collapse collapse" data-bs-parent="#rideDetailsAccordion">
        <div class="accordion-body">
            <div class="info-section">
                <div id="start-ride-location">
                    <!-- Dynamic content will be inserted here -->
                </div>
            </div>
        </div>
    </div>
</div>
@endif

<!-- Real-time Driver Position Section -->
<div class="accordion-section">
    <div class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#driverPositionCollapse">
            <i class="ri-navigation-line me-2"></i>
            Live Driver Position
        </button>
    </div>
    <div id="driverPositionCollapse" class="accordion-collapse collapse" data-bs-parent="#rideDetailsAccordion">
        <div class="accordion-body">
            <div class="info-section">
                <div id="driver-current-position" class="text-muted">
                    <div style="text-align: center; padding: 20px;">
                        <i class="ri-map-pin-time-line" style="font-size: 24px;"></i>
                        <div>Waiting for driver location...</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Route Information Section -->
<div class="accordion-section">
    <div class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#routeInfoCollapse">
            <i class="ri-road-map-line me-2"></i>
            Route Information
        </button>
    </div>
    <div id="routeInfoCollapse" class="accordion-collapse collapse" data-bs-parent="#rideDetailsAccordion">
        <div class="accordion-body">
            <div class="info-section">
                <ul class="info-list">
                    <li>
                        <span class="info-label">Total Stops</span>
                        <span class="info-value">{{ count($locations) }}</span>
                    </li>
                    <li>
                        <span class="info-label">Route Type</span>
                        <span class="info-value">Multi-stop Route</span>
                    </li>
                    <li>
                        <span class="info-label">Tracking</span>
                        <span class="info-value badge bg-success">Live</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>

            <!-- Enhanced Locations Accordion -->
            <div class="accordion-section">
                <div class="accordion-header">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                        data-bs-target="#locationsCollapse">
                        <i class="ri-map-pin-line me-2"></i>
                        Location Details
                    </button>
                </div>
                <div id="locationsCollapse" class="accordion-collapse collapse show" data-bs-parent="#rideDetailsAccordion">
                    <div class="accordion-body">
                        <div class="info-section">
                            <ul class="tracking-path" id="locations-list">
                                @php
                                    $points = range('A', 'Z');
                                @endphp
                                @foreach ($locations as $index => $location)
                                    @if ($loop->last)
                                        <li class="end-point">
                                            {{ $location }}<span>{{ $points[$index] }}</span>
                                        </li>
                                    @else
                                        <li class="stop-point">
                                            {{ $location }}<span>{{ $points[$index] }}</span>
                                        </li>
                                    @endif
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Rider Information Section -->
            <div class="accordion-section">
                <div class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#riderCollapse">
                        <i class="ri-user-line me-2"></i>
                        Rider Details
                    </button>
                </div>
                <div id="riderCollapse" class="accordion-collapse collapse" data-bs-parent="#rideDetailsAccordion">
                    <div class="accordion-body">
                        <div class="info-section">
                            <div class="user-info">
                                @if (isset($ride?->rider['profile_image_url']))
                                    <img class="user-avatar" id="rider-profile-img"
                                        src="{{ $ride?->rider['profile_image_url'] }}"
                                        alt="{{ $ride?->rider['name'] ?? 'Rider' }}">
                                @else
                                    <div class="user-initial" id="rider-initial-letter">
                                        {{ strtoupper(substr($ride?->rider['name'] ?? 'R', 0, 1)) }}
                                    </div>
                                @endif

                                <div class="user-details">
                                    <h4 id="rider-name">{{ $ride?->rider['name'] ?? 'Unknown Rider' }}</h4>
                                    <div class="user-rating">
                                        <i class="ri-star-fill"></i>
                                        <span id="rider-rating">{{ $ride?->rider['rating_count'] ?? '0' }}</span>
                                    </div>
                                </div>
                            </div>

                            <ul class="info-list">
                                @if (isset($ride?->rider['email']) && !isDemoModeEnabled())
                                    <li>
                                        <span class="info-label">Email</span>
                                        <span class="info-value"
                                            id="rider-email">{{ $ride?->rider['email'] ?? 'N/A' }}</span>
                                    </li>
                                @endif

                                @if (isset($ride?->rider['country_code']) && isset($ride?->rider['phone']) && !isDemoModeEnabled())
                                    <li>
                                        <span class="info-label">Phone</span>
                                        <span class="info-value" id="rider-phone">
                                            +{{ $ride?->rider['country_code'] ?? '' }} {{ $ride?->rider['phone'] ?? '' }}
                                        </span>
                                    </li>
                                @endif
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Driver Information Section -->
            <div class="accordion-section">
                <div class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#driverCollapse">
                        <i class="ri-user-line me-2"></i>
                        Driver Details
                    </button>
                </div>
                <div id="driverCollapse" class="accordion-collapse collapse" data-bs-parent="#rideDetailsAccordion">
                    <div class="accordion-body">
                        <div class="info-section">
                            <div class="user-info">
                                @if (isset($ride?->driver['profile_image_url']))
                                    <img class="user-avatar" id="driver-profile-img"
                                        src="{{ $ride?->driver['profile_image_url'] }}"
                                        alt="{{ $ride?->driver['name'] ?? 'Driver' }}">
                                @else
                                    <div class="user-initial" id="driver-initial-letter">
                                        {{ strtoupper(substr($ride?->driver['name'] ?? 'D', 0, 1)) }}
                                    </div>
                                @endif

                                <div class="user-details">
                                    <h4 id="driver-name">{{ $ride?->driver['name'] ?? 'Unknown Driver' }}</h4>
                                    <div class="user-rating">
                                        <i class="ri-star-fill"></i>
                                        <span id="driver-rating">{{ $ride?->driver['rating_count'] ?? '0' }}</span>
                                    </div>
                                </div>
                            </div>

                            <ul class="info-list">
                                @if (isset($ride?->driver['email']) && !isDemoModeEnabled())
                                    <li>
                                        <span class="info-label">Email</span>
                                        <span class="info-value"
                                            id="driver-email">{{ $ride?->driver['email'] ?? 'N/A' }}</span>
                                    </li>
                                @endif

                                @if (isset($ride?->driver['country_code']) && isset($ride?->driver['phone']) && !isDemoModeEnabled())
                                    <li>
                                        <span class="info-label">Phone</span>
                                        <span class="info-value" id="driver-phone">
                                            +{{ $ride?->driver['country_code'] ?? '' }}
                                            {{ $ride?->driver['phone'] ?? '' }}
                                        </span>
                                    </li>
                                @endif
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Vehicle Information Section -->
            <div class="accordion-section">
                <div class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#vehicleCollapse">
                        <i class="ri-car-line me-2"></i>
                        Vehicle Details
                    </button>
                </div>
                <div id="vehicleCollapse" class="accordion-collapse collapse" data-bs-parent="#rideDetailsAccordion">
                    <div class="accordion-body">
                        <div class="info-section">
                            <ul class="info-list">
                                @if (isset($ride?->vehicle_type['name']))
                                    <li>
                                        <span class="info-label">Vehicle Type</span>
                                        <span class="info-value">
                                            @if (isset($ride?->vehicle_type['vehicle_image_url']))
                                                <img class="vehicle-image" id="vehicle-image"
                                                    src="{{ $ride?->vehicle_type['vehicle_image_url'] }}"
                                                    alt="{{ $ride?->vehicle_type['name'] }}">
                                            @endif
                                            <span id="vehicle-type-name">{{ $ride?->vehicle_type['name'] }}</span>
                                        </span>
                                    </li>
                                @endif

                                @if (isset($ride?->vehicle_type['plate_number']))
                                    <li>
                                        <span class="info-label">Plate Number</span>
                                        <span class="info-value"
                                            id="vehicle-plate-number">{{ $ride?->vehicle_type['plate_number'] }}</span>
                                    </li>
                                @endif
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Ride Details Section -->
            <div class="accordion-section">
                <div class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#rideDetailsCollapse">
                        <i class="ri-information-line me-2"></i>
                        Ride Details
                    </button>
                </div>
                <div id="rideDetailsCollapse" class="accordion-collapse collapse" data-bs-parent="#rideDetailsAccordion">
                    <div class="accordion-body">
                        <div class="info-section">
                            <ul class="info-list">
                                <li>
                                    <span class="info-label">Service</span>
                                    <span class="info-value"
                                        id="service-name">{{ $ride->service['name'] ?? 'N/A' }}</span>
                                </li>
                                <li>
                                    <span class="info-label">Service Category</span>
                                    <span class="info-value"
                                        id="service-category-name">{{ $ride->service_category['name'] ?? 'N/A' }}</span>
                                </li>
                                <li>
                                    <span class="info-label">Distance</span>
                                    <span class="info-value" id="ride-distance">{{ $ride?->distance ?? '0' }}
                                        {{ $ride?->distance_unit ?? 'km' }}</span>
                                </li>
                                @if (isset($ride->service['slug']) &&
                                        in_array($ride->service['slug'], [
                                            \Modules\Taxido\Enums\ServicesEnum::PARCEL,
                                            \Modules\Taxido\Enums\ServicesEnum::FREIGHT,
                                        ]))
                                    <li>
                                        <span class="info-label">Weight</span>
                                        <span class="info-value" id="weight">{{ $ride?->weight ?? 'N/A' }}</span>
                                    </li>
                                @endif
                                <li>
                                    <span class="info-label">Payment Method</span>
                                    <span class="info-value" id="payment-method">
                                        <img class="payment-image" alt="Payment method"
                                            src="{{ $paymentLogoUrl ?: asset('images/payment/cod.png') }}">
                                    </span>
                                </li>
                                <li>
                                    <span class="info-label">Payment Status</span>
                                    <span class="info-value">
                                        <span class="badge-warning" id="payment-status">
                                            {{ ucfirst(strtolower($ride->payment_status ?? 'Pending')) }}
                                        </span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Price Details Section -->
            <div class="accordion-section">
                <div class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#priceCollapse">
                        <i class="ri-money-dollar-circle-line me-2"></i>
                        Price Details
                    </button>
                </div>
                <div id="priceCollapse" class="accordion-collapse collapse" data-bs-parent="#rideDetailsAccordion">
                    <div class="accordion-body">
                        <div class="info-section">
                            <ul class="info-list">
                                <li>
                                    <span class="info-label">Ride Fare</span>
                                    <span class="info-value"
                                        id="ride-fare-detail">{{ $cs . number_format(round($ride->ride_fare ?? 0, 2), 2) }}</span>
                                </li>

                                @if (($ride->additional_distance_charge ?? 0) > 0)
                                    <li>
                                        <span class="info-label">Additional Distance Charge</span>
                                        <span class="info-value"
                                            id="additional-distance-charge">{{ $cs . number_format(round($ride->additional_distance_charge, 2), 2) }}</span>
                                    </li>
                                @endif

                                @if (($ride->additional_minute_charge ?? 0) > 0)
                                    <li>
                                        <span class="info-label">Additional Minute Charge</span>
                                        <span class="info-value"
                                            id="additional-minute-charge">{{ $cs . number_format(round($ride->additional_minute_charge, 2), 2) }}</span>
                                    </li>
                                @endif

                                @if (($ride->additional_weight_charge ?? 0) > 0)
                                    <li>
                                        <span class="info-label">Additional Weight Charge</span>
                                        <span class="info-value"
                                            id="additional-weight-charge">{{ $cs . number_format(round($ride->additional_weight_charge, 2), 2) }}</span>
                                    </li>
                                @endif

                                @if (($ride->waiting_charges ?? 0) > 0)
                                    <li>
                                        <span class="info-label">Waiting Charges</span>
                                        <span class="info-value"
                                            id="waiting-charges">{{ $cs . number_format(round($ride->waiting_charges, 2), 2) }}</span>
                                    </li>
                                @endif

                                @if (($ride->bid_extra_amount ?? 0) > 0)
                                    <li>
                                        <span class="info-label">Bid Extra Amount</span>
                                        <span class="info-value"
                                            id="bid-extra-amount">{{ $cs . number_format(round($ride->bid_extra_amount, 2), 2) }}</span>
                                    </li>
                                @endif

                                <li class="price-total">
                                    <span class="info-label">Subtotal</span>
                                    <span class="info-value"
                                        id="subtotal">{{ $cs . number_format(round($ride->sub_total ?? 0, 2), 2) }}</span>
                                </li>

                                <li>
                                    <span class="info-label">Platform Fee</span>
                                    <span class="info-value"
                                        id="platform-fees">{{ $cs . number_format(round($ride->platform_fees ?? 0, 2), 2) }}</span>
                                </li>
                                <li>
                                    <span class="info-label">Tax</span>
                                    <span class="info-value"
                                        id="tax">{{ $cs . number_format(round($ride->tax ?? 0, 2), 2) }}</span>
                                </li>
                                <li>
                                    <span class="info-label">Admin Commission</span>
                                    <span class="info-value"
                                        id="admin-commission">{{ $cs . number_format(round($ride->commission ?? 0, 2), 2) }}</span>
                                </li>

                                <li class="price-total price-success">
                                    <span class="info-label">Total Bill</span>
                                    <span class="info-value"
                                        id="total-bill">{{ $cs . number_format(round($ride->total ?? 0, 2), 2) }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification Container -->
    <div id="toast-container"></div>
@endsection


@push('scripts')
    <!-- Firebase SDK -->
    <script src="{{ asset('js/firebase/firebase-app-compat.js') }}"></script>
    <script src="{{ asset('js/firebase/firebase-firestore-compat.js') }}"></script>

    <!-- Dynamic Map Provider Scripts -->
    @if ($settings['location']['map_provider'] == 'google_map')
        <script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAP_API_KEY') }}&libraries=geometry,places,marker&v=beta"></script>
    @elseif ($settings['location']['map_provider'] == 'osm')
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js"></script>
        <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css" />
    @endif

    @if ($settings['location']['map_provider'] == 'google_map')
        <script>
            // Enhanced Google Maps Manager Class with AdvancedMarkerElement
            class GoogleMapManager {
                constructor(config) {
                    this.config = config;
                    this.map = null;
                    this.driverMarker = null;
                    this.routePolyline = null;
                    this.directionsService = null;
                    this.directionsRenderer = null;
                    this.locationMarkers = [];
                    this.startRideMarker = null;
                    this.routeCoordinates = [];
                    this.startRideInfoWindow = null;
                }

                async initialize() {
                    const start = {
                        lat: parseFloat(this.config.locationCoordinates[0].lat),
                        lng: parseFloat(this.config.locationCoordinates[0].lng)
                    };

                    const mapOptions = {
                        zoom: 13,
                        center: start,
                        mapId: 'TRACKING_MAP_ID',
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                        zoomControl: false,
                        styles: [
                            {
                                "featureType": "administrative",
                                "elementType": "geometry",
                                "stylers": [{"visibility": "off"}]
                            },
                            {
                                "featureType": "poi",
                                "stylers": [{"visibility": "simplified"}]
                            },
                            {
                                "featureType": "road",
                                "elementType": "labels.icon",
                                "stylers": [{"visibility": "off"}]
                            },
                            {
                                "featureType": "transit",
                                "stylers": [{"visibility": "off"}]
                            }
                        ]
                    };

                    this.map = new google.maps.Map(document.getElementById("tracking-map"), mapOptions);

                    // Initialize Advanced Markers
                    await this.initializeAdvancedMarkers();

                    this.directionsService = new google.maps.DirectionsService();
                    this.directionsRenderer = new google.maps.DirectionsRenderer({
                        map: this.map,
                        suppressMarkers: true,
                        preserveViewport: false,
                        polylineOptions: {
                            strokeColor: '#3a86ff',
                            strokeOpacity: 0.8,
                            strokeWeight: 6
                        }
                    });

                    this.calculateRoute();
                    this.addAdvancedLocationMarkers();
                    this.addStartRideLocationMarker();
                }

                async initializeAdvancedMarkers() {
                    if (typeof google.maps.marker.AdvancedMarkerElement === 'undefined') {
                        console.error('AdvancedMarkerElement is not available.');
                        return false;
                    }
                    console.log('AdvancedMarkerElement is available');
                    return true;
                }

                calculateRoute() {
                    if (this.config.locationCoordinates.length >= 2) {
                        const origin = new google.maps.LatLng(
                            parseFloat(this.config.locationCoordinates[0].lat),
                            parseFloat(this.config.locationCoordinates[0].lng)
                        );
                        const destination = new google.maps.LatLng(
                            parseFloat(this.config.locationCoordinates[this.config.locationCoordinates.length - 1].lat),
                            parseFloat(this.config.locationCoordinates[this.config.locationCoordinates.length - 1].lng)
                        );

                        const waypoints = this.config.locationCoordinates.slice(1, -1).map(coord => ({
                            location: new google.maps.LatLng(parseFloat(coord.lat), parseFloat(coord.lng)),
                            stopover: true
                        }));

                        const request = {
                            origin: origin,
                            destination: destination,
                            waypoints: waypoints,
                            optimizeWaypoints: false,
                            travelMode: google.maps.TravelMode.DRIVING
                        };

                        this.directionsService.route(request, (result, status) => {
                            if (status === 'OK') {
                                this.directionsRenderer.setDirections(result);
                                const route = result.routes[0];

                                // Store route coordinates for real-time tracking
                                this.routeCoordinates = this.extractRouteCoordinates(result);

                                this.map.fitBounds(route.bounds);
                                console.log('Route calculated successfully', this.routeCoordinates.length + ' points');
                            } else {
                                console.error('Directions request failed: ' + status);
                                this.drawFallbackRoute();
                            }
                        });
                    }
                }

                extractRouteCoordinates(result) {
                    const route = result.routes[0];
                    const coordinates = [];

                    route.legs.forEach(leg => {
                        leg.steps.forEach(step => {
                            step.path.forEach(point => {
                                coordinates.push({
                                    lat: point.lat(),
                                    lng: point.lng()
                                });
                            });
                        });
                    });

                    return coordinates;
                }

                drawFallbackRoute() {
                    if (this.config.locationCoordinates.length >= 2) {
                        const path = this.config.locationCoordinates.map(coord =>
                            new google.maps.LatLng(parseFloat(coord.lat), parseFloat(coord.lng))
                        );

                        this.routePolyline = new google.maps.Polyline({
                            path: path,
                            geodesic: true,
                            strokeColor: '#3a86ff',
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                            map: this.map
                        });

                        const bounds = new google.maps.LatLngBounds();
                        path.forEach(point => bounds.extend(point));
                        this.map.fitBounds(bounds);
                    }
                }

                addAdvancedLocationMarkers() {
                    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                    this.config.locationCoordinates.forEach((coord, index) => {
                        const position = {
                            lat: parseFloat(coord.lat),
                            lng: parseFloat(coord.lng)
                        };

                        const isStart = index === 0;
                        const isEnd = index === this.config.locationCoordinates.length - 1;

                        const marker = new google.maps.marker.AdvancedMarkerElement({
                            position: position,
                            map: this.map,
                            title: `${labels[index]}: ${this.config.locations[index] || 'Location'}`,
                            content: this.createLocationMarkerContent(labels[index], isStart, isEnd)
                        });

                        const infoWindow = new google.maps.InfoWindow({
                            content: `
                                <div style="padding: 8px; color:#333; min-width: 200px;">
                                    <strong>${isStart ? '🚗 Start' : isEnd ? '🏁 Destination' : '📍 Stop ' + labels[index]}</strong>
                                    <div style="margin-top: 5px;">${this.config.locations[index] || 'Location'}</div>
                                    ${coord.address ? `<div style="font-size: 12px; color: #666;">${coord.address}</div>` : ''}
                                </div>
                            `
                        });

                        marker.addListener('click', () => {
                            infoWindow.open(this.map, marker);
                        });

                        this.locationMarkers.push(marker);
                    });
                }

                createLocationMarkerContent(label, isStart = false, isEnd = false) {
                    const container = document.createElement('div');

                    if (isStart) {
                        container.innerHTML = `
                            <div style="
                                background: #4CAF50;
                                color: white;
                                border: 3px solid white;
                                border-radius: 50%;
                                width: 28px;
                                height: 28px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 14px;
                                font-weight: bold;
                                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                            ">🚗</div>
                        `;
                    } else if (isEnd) {
                        container.innerHTML = `
                            <div style="
                                background: #FF5722;
                                color: white;
                                border: 3px solid white;
                                border-radius: 50%;
                                width: 28px;
                                height: 28px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 14px;
                                font-weight: bold;
                                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                            ">🏁</div>
                        `;
                    } else {
                        container.style.cssText = `
                            background: #3a86ff;
                            color: white;
                            border: 2px solid white;
                            border-radius: 50%;
                            width: 24px;
                            height: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                            font-weight: bold;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        `;
                        container.textContent = label;
                    }

                    return container;
                }

                addStartRideLocationMarker() {
                    // Add start ride location marker if available
                    if (this.config.startRideLocation && this.config.startRideCoordinates) {
                        const position = {
                            lat: parseFloat(this.config.startRideCoordinates.lat),
                            lng: parseFloat(this.config.startRideCoordinates.lng)
                        };

                        this.startRideMarker = new google.maps.marker.AdvancedMarkerElement({
                            position: position,
                            map: this.map,
                            title: 'Ride Start Location',
                            content: this.createStartRideMarkerContent()
                        });

                        this.startRideInfoWindow = new google.maps.InfoWindow({
                            content: `
                                <div style="padding: 12px; color:#333; min-width: 250px;">
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                        <span style="font-size: 20px;">📍</span>
                                        <strong style="font-size: 16px;">Ride Started Here</strong>
                                    </div>
                                    <div style="margin-bottom: 8px;">
                                        <div style="font-weight: 500; color: #555;">${this.config.startRideLocation}</div>
                                        ${this.config.startRideCoordinates.address ?
                                            `<div style="font-size: 12px; color: #777; margin-top: 4px;">${this.config.startRideCoordinates.address}</div>` : ''}
                                    </div>
                                    <div style="font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 8px;">
                                        Coordinates: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}
                                    </div>
                                </div>
                            `
                        });

                        this.startRideMarker.addListener('click', () => {
                            this.startRideInfoWindow.open(this.map, this.startRideMarker);
                        });

                        console.log('Start ride location marker added');
                    }
                }

                createStartRideMarkerContent() {
                    const container = document.createElement('div');
                    container.innerHTML = `
                        <div style="
                            background: #FF9800;
                            color: white;
                            border: 3px solid white;
                            border-radius: 50%;
                            width: 32px;
                            height: 32px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 16px;
                            font-weight: bold;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                            animation: pulse 2s infinite;
                            cursor: pointer;
                        ">📍</div>
                        <style>
                            @keyframes pulse {
                                0% { transform: scale(1); }
                                50% { transform: scale(1.2); }
                                100% { transform: scale(1); }
                            }
                        </style>
                    `;
                    return container;
                }

                // Method to show start ride location on map
                showStartRideLocation() {
                    if (this.startRideMarker) {
                        // Center map on start ride location
                        this.map.panTo(this.startRideMarker.position);
                        this.map.setZoom(16);

                        // Open info window
                        this.startRideInfoWindow.open(this.map, this.startRideMarker);

                        // Add highlight effect
                        this.highlightStartRideMarker();

                        return true;
                    }
                    return false;
                }

                highlightStartRideMarker() {
                    if (this.startRideMarker && this.startRideMarker.content) {
                        const contentElement = this.startRideMarker.content;
                        const markerElement = contentElement.querySelector('div');

                        // Add highlight animation
                        markerElement.style.animation = 'pulse 0.5s ease-in-out 3';
                        markerElement.style.borderColor = '#FF5722';
                        markerElement.style.boxShadow = '0 0 20px rgba(255, 152, 0, 0.8)';

                        // Reset after animation
                        setTimeout(() => {
                            markerElement.style.animation = 'pulse 2s infinite';
                            markerElement.style.borderColor = 'white';
                            markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
                        }, 1500);
                    }
                }

                createDriverMarker(position, heading, driverData) {
                    console.log("Creating Advanced Driver Marker", driverData);

                    const vehicleImage = driverData.vehicle_map_icon_url && this.isValidImageUrl(driverData.vehicle_map_icon_url)
                        ? driverData.vehicle_map_icon_url
                        : this.config.defaultVehicleImage;

                    console.log("Using vehicle image:", vehicleImage);

                    const markerContent = this.createDriverMarkerContent(vehicleImage, driverData.name, heading);

                    this.driverMarker = new google.maps.marker.AdvancedMarkerElement({
                        position: position,
                        map: this.map,
                        title: driverData.name || 'Driver',
                        content: markerContent,
                        gmpClickable: true
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `
                            <div style="padding: 8px; min-width: 180px;">
                                <strong>👤 ${driverData.name || 'Driver'}</strong>
                                <div>🚗 ${driverData.vehicle_type || 'Vehicle'}</div>
                                <div>📱 Status: Active</div>
                                <div>📍 Real-time Tracking</div>
                            </div>
                        `
                    });

                    this.driverMarker.addListener('click', () => {
                        infoWindow.open(this.map, this.driverMarker);
                    });

                    console.log("Advanced Driver marker created successfully");
                    return this.driverMarker;
                }

                createDriverMarkerContent(vehicleImage, driverName, heading) {
                    const container = document.createElement('div');
                    container.className = 'driver-marker';
                    container.style.cssText = `
                        position: relative;
                        width: 50px;
                        height: 50px;
                        transition: all 0.5s ease;
                    `;

                    container.innerHTML = `
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background-image: url('${vehicleImage}');
                            background-size: contain;
                            background-repeat: no-repeat;
                            background-position: center;
                            transform: rotate(${heading}deg);
                            filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
                        "></div>
                        <div style="
                            position: absolute;
                            bottom: -8px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 3px 8px;
                            border-radius: 12px;
                            font-size: 9px;
                            white-space: nowrap;
                            border: 2px solid white;
                            font-weight: bold;
                        ">${driverName || 'Driver'}</div>
                    `;

                    return container;
                }

                smoothMoveMarker(toPosition, heading, duration = 1000) {
                    if (!this.driverMarker) {
                        console.warn("Driver marker not available for movement");
                        return;
                    }

                    const fromPosition = this.driverMarker.position;
                    const startTime = performance.now();

                    const startLat = fromPosition.lat;
                    const startLng = fromPosition.lng;
                    const deltaLat = toPosition.lat - startLat;
                    const deltaLng = toPosition.lng - startLng;

                    const animate = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easedProgress = this.easeInOutCubic(progress);

                        const newLat = startLat + deltaLat * easedProgress;
                        const newLng = startLng + deltaLng * easedProgress;
                        const newPos = { lat: newLat, lng: newLng };

                        this.driverMarker.position = newPos;
                        this.updateDriverMarkerRotation(heading);

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    requestAnimationFrame(animate);
                }

                updateDriverMarkerRotation(heading) {
                    if (this.driverMarker && this.driverMarker.content) {
                        const contentElement = this.driverMarker.content;
                        const vehicleElement = contentElement.querySelector('div[style*="background-image"]');
                        if (vehicleElement) {
                            vehicleElement.style.transform = `rotate(${heading}deg)`;
                        }
                    }
                }

                easeInOutCubic(t) {
                    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                }

                calculateHeading(from, to) {
                    if (!from || !to) return 0;

                    try {
                        return google.maps.geometry.spherical.computeHeading(from, to);
                    } catch (error) {
                        console.warn('Error calculating heading:', error);
                        return 0;
                    }
                }

                centerOnDriver() {
                    if (this.driverMarker) {
                        this.map.panTo(this.driverMarker.position);
                        this.map.setZoom(16);
                    }
                }

                toggleMapType() {
                    const currentType = this.map.getMapTypeId();
                    this.map.setMapTypeId(currentType === google.maps.MapTypeId.ROADMAP ?
                        google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP);
                }

                resize() {
                    if (this.map) {
                        setTimeout(() => {
                            google.maps.event.trigger(this.map, 'resize');
                        }, 100);
                    }
                }

                isValidImageUrl(url) {
                    if (!url) return false;

                    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
                    const hasValidExtension = imageExtensions.some(ext =>
                        url.toLowerCase().includes(ext)
                    );

                    return hasValidExtension && url.startsWith('http');
                }
            }
        </script>
    @endif

    <script>
        // Enhanced Real-time Tracking JavaScript
        (function() {
            'use strict';

            // Configuration and Constants
            const CONFIG = {
                rideId: {{ $ride->id }},
                driverId: {{ $ride->driver_id ?? 'null' }},
                mapProvider: '{{ $settings['location']['map_provider'] }}',
                currencySymbol: '{{ $cs }}',
                locationCoordinates: @json($locationCoordinates),
                locations: @json($locations),
                startRideLocation: @json($ride->start_ride_locations ?? []),
                startRideCoordinates: @json($ride->start_ride_coordinates ? $ride->start_ride_coordinates[0] : null),
                defaultVehicleImage: '{{ asset('images/Frame.png') }}',
                defaultImage: '{{ asset('images/user.png') }}',
                firebase: {
                    apiKey: "{{ env('FIREBASE_API_KEY') }}",
                    authDomain: "{{ env('FIREBASE_AUTH_DOMAIN') }}",
                    projectId: "{{ env('FIREBASE_PROJECT_ID') }}",
                    storageBucket: "{{ env('FIREBASE_STORAGE_BUCKET') }}",
                    messagingSenderId: "{{ env('FIREBASE_MESSAGING_SENDER_ID') }}",
                    appId: "{{ env('FIREBASE_APP_ID') }}",
                    measurementId: "{{ env('FIREBASE_MEASUREMENT_ID') }}"
                }
            };

            // Initialize Firebase
            firebase.initializeApp(CONFIG.firebase);
            const db = firebase.firestore();

            // Enhanced Tracking Manager Class
            class EnhancedTrackingManager {
                constructor() {
                    this.mapManager = null;
                    this.unsubscribeRide = null;
                    this.unsubscribeDriver = null;
                    this.lastDriverLocation = null;
                    this.previousPosition = null;
                    this.isSidebarOpen = window.innerWidth >= 768;
                    this.isAdvancedMarkersAvailable = false;

                    this.init();
                }

                async init() {
                    this.setupEventListeners();
                    await this.initializeMap();
                    this.startRealTimeTracking();
                    this.setupResponsiveLayout();
                    this.updateStartRideLocationInSidebar();
                    this.showToast('Ride tracking started', 'success');
                }

                setupEventListeners() {
                    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
                    if (closeSidebarBtn) {
                        closeSidebarBtn.addEventListener('click', () => this.toggleSidebar());
                    }

                    document.getElementById('centerOnDriverBtn')?.addEventListener('click', () => this.centerOnDriver());
                    document.getElementById('toggleMapTypeBtn')?.addEventListener('click', () => this.toggleMapType());

                    window.addEventListener('resize', () => this.handleResize());
                    window.addEventListener('beforeunload', () => this.cleanup());
                }

                async initializeMap() {
                    if (CONFIG.mapProvider === 'google_map') {
                        this.mapManager = new GoogleMapManager(CONFIG);
                        if (this.mapManager) {
                            await this.mapManager.initialize();
                            this.isAdvancedMarkersAvailable = await this.mapManager.initializeAdvancedMarkers();
                        }
                    } else if (CONFIG.mapProvider === 'osm') {
                        console.log('OSM map provider selected');
                    }
                }

                startRealTimeTracking() {
                    if (CONFIG.rideId) {
                        const rideRef = db.collection('rides').doc(CONFIG.rideId.toString());
                        this.unsubscribeRide = rideRef.onSnapshot(
                            (doc) => this.handleRideUpdate(doc),
                            (error) => this.handleError('Ride tracking error', error)
                        );
                    }

                    if (CONFIG.driverId) {
                        const driverRef = db.collection('driverTrack').doc(CONFIG.driverId.toString());
                        this.unsubscribeDriver = driverRef.onSnapshot(
                            (doc) => this.handleDriverLocationUpdate(doc),
                            (error) => this.handleError('Driver location error', error)
                        );
                    }
                }

                handleRideUpdate(doc) {
                    if (!doc.exists) {
                        this.showError('Ride not found');
                        return;
                    }

                    const rideData = doc.data();
                    this.updateRideDetails(rideData);
                    this.updateTimelineActivities(rideData);
                    this.updateHeaderGradient(rideData.ride_status?.name);
                }

                handleDriverLocationUpdate(doc) {
                    if (!doc.exists) {
                        console.log('Driver location not available in Firebase');
                        return;
                    }

                    const driverData = doc.data();
                    console.log("Received driver data:", driverData);

                    const lat = parseFloat(driverData.lat);
                    const lng = parseFloat(driverData.lng);

                    if (isNaN(lat) || isNaN(lng)) {
                        console.warn('Invalid driver coordinates:', driverData);
                        return;
                    }

                    const newPosition = { lat, lng };
                    let heading = parseInt(driverData.heading) || 0;

                    // Calculate heading if we have previous position
                    if (this.previousPosition && this.mapManager) {
                        const fromLatLng = new google.maps.LatLng(this.previousPosition.lat, this.previousPosition.lng);
                        const toLatLng = new google.maps.LatLng(lat, lng);
                        const calculatedHeading = this.mapManager.calculateHeading(fromLatLng, toLatLng);

                        if (Math.abs(calculatedHeading - heading) > 10) {
                            heading = calculatedHeading;
                        }
                    }

                    console.log(`Driver position: ${lat}, ${lng}, heading: ${heading}`);

                    if (!this.mapManager.driverMarker) {
                        console.log("Creating new driver marker");
                        this.mapManager.createDriverMarker(newPosition, heading, driverData);
                    } else {
                        console.log("Moving existing driver marker");
                        this.mapManager.smoothMoveMarker(newPosition, heading);
                    }

                    this.previousPosition = newPosition;
                    this.lastDriverLocation = { lat, lng, heading };

                    // Update driver position in sidebar
                    this.updateDriverPositionInSidebar(newPosition, heading);
                }

                updateDriverPositionInSidebar(position, heading) {
                    const driverPositionElement = document.getElementById('driver-current-position');
                    if (driverPositionElement) {
                        driverPositionElement.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span>📍</span>
                                <div>
                                    <div style="font-weight: bold;">Current Position</div>
                                    <div style="font-size: 12px; color: #666;">
                                        Lat: ${position.lat.toFixed(6)}, Lng: ${position.lng.toFixed(6)}
                                    </div>
                                    <div style="font-size: 12px; color: #666;">
                                        Heading: ${heading}°
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }

                updateStartRideLocationInSidebar() {
                    // Handle array format for startRideLocation
                    const startRideLocation = Array.isArray(CONFIG.startRideLocation)
                        ? CONFIG.startRideLocation[0]
                        : CONFIG.startRideLocation;

                    if (startRideLocation && CONFIG.startRideCoordinates) {
                        const startRideElement = document.getElementById('start-ride-location');
                        if (startRideElement) {
                            startRideElement.innerHTML = `
                                <div style="display: flex; flex-direction: column; gap: 12px;">
                                    <div style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #fff3cd; border-radius: 8px; border: 1px solid #ffeaa7;">
                                        <span style="font-size: 20px;">📍</span>
                                        <div style="flex: 1;">
                                            <div style="font-weight: bold; color: #856404;">Ride Started From</div>
                                            <div style="font-size: 14px; color: #856404;">${startRideLocation}</div>
                                            ${CONFIG.startRideCoordinates.address ?
                                                `<div style="font-size: 12px; color: #8d6e10; margin-top: 4px;">${CONFIG.startRideCoordinates.address}</div>` : ''}
                                        </div>
                                    </div>
                                    <button id="showStartRideBtn" class="btn btn-warning btn-sm" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                        <i class="ri-map-pin-line"></i>
                                        Show on Map
                                    </button>
                                    <div style="font-size: 11px; color: #666; text-align: center;">
                                        Coordinates: ${CONFIG.startRideCoordinates.lat.toFixed(6)}, ${CONFIG.startRideCoordinates.lng.toFixed(6)}
                                    </div>
                                </div>
                            `;

                            // Re-attach event listener for the new button
                            document.getElementById('showStartRideBtn')?.addEventListener('click', () => this.showStartRideLocation());
                        }
                    }
                }

                showStartRideLocation() {
                    if (this.mapManager) {
                        const success = this.mapManager.showStartRideLocation();
                        if (success) {
                            this.showToast('Showing ride start location on map', 'success');

                            // Auto-expand the start ride section
                            const startRideCollapse = document.getElementById('startRideCollapse');
                            const startRideButton = document.querySelector('[data-bs-target="#startRideCollapse"]');
                            if (startRideCollapse && !startRideCollapse.classList.contains('show')) {
                                startRideButton.click();
                            }
                        } else {
                            this.showToast('Start ride location not available', 'warning');
                        }
                    }
                }

                updateTimelineActivities(rideData) {
                    const timelineContainer = document.getElementById('timeline-activities');
                    if (timelineContainer && rideData.ride_status_activities) {
                        timelineContainer.innerHTML = '';

                        const sortedActivities = [...rideData.ride_status_activities].sort((a, b) =>
                            new Date(a.changed_at || a.created_at) - new Date(b.changed_at || b.created_at)
                        );

                        const currentStatus = rideData.ride_status?.name;

                        sortedActivities.forEach(activity => {
                            const statusName = activity.ride_status?.name || activity.status;
                            const statusTime = activity.changed_at || activity.created_at;
                            const description = activity.description || this.getStatusDescription(statusName);
                            const isCurrent = statusName === currentStatus;

                            const timelineItem = document.createElement('div');
                            timelineItem.className = `timeline-item ${isCurrent ? 'current' : ''}`;
                            timelineItem.innerHTML = `
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <div>
                                        <div class="timeline-status">${this.formatStatusName(statusName)}</div>
                                        <div class="timeline-description">${description}</div>
                                    </div>
                                    <div class="timeline-time">${this.formatTimestamp(statusTime)}</div>
                                </div>
                            `;
                            timelineContainer.appendChild(timelineItem);
                        });
                    }
                }

                getStatusDescription(status) {
                    const descriptions = {
                        'requested': 'A new ride was requested by the rider',
                        'accepted': 'The driver accepted the ride and is on the way to the pickup location',
                        'arrived': 'The driver arrived at the pickup location',
                        'started': 'The ride is in progress',
                        'completed': 'The ride has been completed successfully',
                        'cancelled': 'The ride was cancelled'
                    };
                    return descriptions[status?.toLowerCase()] || 'Status updated';
                }

                formatStatusName(statusName) {
                    return statusName ? statusName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown Status';
                }

                formatTimestamp(timestamp) {
                    if (!timestamp) return '';
                    try {
                        const date = new Date(timestamp);
                        return date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    } catch (e) {
                        return 'Invalid Date';
                    }
                }

                updateRideDetails(rideData) {
                    this.updateElement('ride-number', `#${rideData.ride_number || ''}`);
                    if (rideData.otp) {
                        this.updateElement('otp', `OTP: ${rideData.otp}`);
                    }

                    const statusElement = document.getElementById('ride-status');
                    if (statusElement && rideData.ride_status) {
                        statusElement.textContent = (rideData.ride_status.name || '').toUpperCase();
                        statusElement.className = `badge badge-${this.getStatusColor(rideData.ride_status.name)}`;
                    }

                    const paymentStatusElement = document.getElementById('payment-status');
                    if (paymentStatusElement && rideData.payment_status) {
                        paymentStatusElement.textContent = rideData.payment_status.toUpperCase();
                        paymentStatusElement.className = `badge badge-${this.getStatusColor(rideData.payment_status, true)}`;
                    }

                    this.updateElement('service-name', rideData.service?.name || 'N/A');
                    this.updateElement('service-category-name', rideData.service_category?.name || 'N/A');
                    this.updateElement('ride-distance', `${rideData.distance || '0'} ${rideData.distance_unit || 'km'}`);

                    if (rideData.driver) {
                        this.updateDriverInfo(rideData.driver);
                    }

                    if (rideData.rider) {
                        this.updateRiderInfo(rideData.rider);
                    }

                    if (rideData.vehicle_type) {
                        this.updateVehicleInfo(rideData.vehicle_type);
                    }

                    this.updatePricing(rideData);
                }

                getStatusColor(status, isPayment = false) {
                    if (isPayment) {
                        switch (status.toLowerCase()) {
                            case 'completed': return 'success';
                            case 'pending': return 'warning';
                            case 'failed': return 'danger';
                            default: return 'info';
                        }
                    } else {
                        switch (status.toLowerCase()) {
                            case 'accepted': return 'success';
                            case 'in_progress': return 'info';
                            case 'completed': return 'success';
                            case 'cancelled': return 'danger';
                            case 'pending': return 'warning';
                            default: return 'primary';
                        }
                    }
                }

                updateDriverInfo(driver) {
                    this.updateElement('driver-name', driver.name || 'N/A');
                    this.updateElement('driver-email', driver.email || 'N/A');
                    this.updateElement('driver-phone', `+${driver.country_code || ''} ${driver.phone || ''}`);
                    this.updateElement('driver-rating', `${driver.rating_count || 0}`);

                    const profileImg = document.getElementById('driver-profile-img');
                    const initialLetter = document.getElementById('driver-initial-letter');

                    if (driver.profile_image_url && profileImg) {
                        profileImg.src = driver.profile_image_url;
                        profileImg.style.display = 'block';
                        if (initialLetter) initialLetter.style.display = 'none';
                    } else if (initialLetter) {
                        initialLetter.textContent = (driver.name?.[0] || 'D').toUpperCase();
                        initialLetter.style.display = 'flex';
                        if (profileImg) profileImg.style.display = 'none';
                    }
                }

                updateRiderInfo(rider) {
                    this.updateElement('rider-name', rider.name || 'N/A');
                    this.updateElement('rider-email', rider.email || 'N/A');
                    this.updateElement('rider-phone', `+${rider.country_code || ''} ${rider.phone || ''}`);
                    this.updateElement('rider-rating', `${rider.rating_count || 0}`);

                    const profileImg = document.getElementById('rider-profile-img');
                    const initialLetter = document.getElementById('rider-initial-letter');

                    if (rider.profile_image_url && profileImg) {
                        profileImg.src = rider.profile_image_url;
                        profileImg.style.display = 'block';
                        if (initialLetter) initialLetter.style.display = 'none';
                    } else if (initialLetter) {
                        initialLetter.textContent = (rider.name?.[0] || 'R').toUpperCase();
                        initialLetter.style.display = 'flex';
                        if (profileImg) profileImg.style.display = 'none';
                    }
                }

                updateVehicleInfo(vehicle) {
                    this.updateElement('vehicle-type-name', vehicle.name || 'N/A');
                    this.updateElement('vehicle-plate-number', vehicle.plate_number || 'N/A');

                    const vehicleImg = document.getElementById('vehicle-image');
                    if (vehicleImg && vehicle.vehicle_image_url) {
                        vehicleImg.src = vehicle.vehicle_image_url;
                    }
                }

                updatePricing(rideData) {
                    const cs = CONFIG.currencySymbol;
                    this.updateElement('ride-fare-detail', `${cs}${Number(rideData.ride_fare || 0).toFixed(2)}`);
                    this.updateElement('subtotal', `${cs}${Number(rideData.sub_total || 0).toFixed(2)}`);
                    this.updateElement('total-bill', `${cs}${Number(rideData.total || 0).toFixed(2)}`);

                    if (rideData.platform_fees) {
                        this.updateElement('platform-fees', `${cs}${Number(rideData.platform_fees).toFixed(2)}`);
                    }
                    if (rideData.tax) {
                        this.updateElement('tax', `${cs}${Number(rideData.tax).toFixed(2)}`);
                    }
                    if (rideData.commission) {
                        this.updateElement('admin-commission', `${cs}${Number(rideData.commission).toFixed(2)}`);
                    }
                }

                toggleSidebar() {
                    const sidebar = document.getElementById('detailsSidebar');
                    const toggleBtn = document.getElementById('closeSidebarBtn');
                    if (sidebar && toggleBtn) {
                        this.isSidebarOpen = !this.isSidebarOpen;
                        sidebar.classList.toggle('open', this.isSidebarOpen);
                        toggleBtn.classList.toggle('open', this.isSidebarOpen);
                    }
                }

                centerOnDriver() {
                    if (this.mapManager) {
                        this.mapManager.centerOnDriver();
                    } else {
                        this.showToast('Driver location not available', 'warning');
                    }
                }

                toggleMapType() {
                    if (this.mapManager) {
                        this.mapManager.toggleMapType();
                    }
                }

                handleResize() {
                    const isDesktop = window.innerWidth >= 768;
                    if (isDesktop) {
                        this.isSidebarOpen = true;
                        const sidebar = document.getElementById('detailsSidebar');
                        if (sidebar) {
                            sidebar.classList.remove('open');
                        }
                    } else {
                        this.isSidebarOpen = false;
                    }

                    setTimeout(() => {
                        if (this.mapManager) {
                            this.mapManager.resize();
                        }
                    }, 300);
                }

                cleanup() {
                    if (this.unsubscribeRide) {
                        this.unsubscribeRide();
                    }
                    if (this.unsubscribeDriver) {
                        this.unsubscribeDriver();
                    }
                }

                updateElement(id, content) {
                    const element = document.getElementById(id);
                    if (element) {
                        element.textContent = content;
                    }
                }

                showToast(message, type = 'info') {
                    const toastContainer = document.getElementById('toast-container');
                    const toast = document.createElement('div');
                    toast.className = `toast ${type}`;
                    toast.innerHTML = `
                        <i class="ri-information-line"></i>
                        <span>${message}</span>
                    `;

                    toastContainer.appendChild(toast);

                    setTimeout(() => {
                        toast.remove();
                    }, 3000);
                }

                showError(message) {
                    console.error(message);
                    this.showToast(message, 'error');
                }

                handleError(context, error) {
                    console.error(`${context}:`, error);
                    this.showError(`${context}: ${error.message}`);
                }

                setupResponsiveLayout() {
                    const handleResponsiveChanges = () => {
                        const isDesktop = window.innerWidth >= 768;
                        const sidebar = document.getElementById('detailsSidebar');

                        if (isDesktop) {
                            this.isSidebarOpen = true;
                            if (sidebar) {
                                sidebar.classList.remove('open');
                            }
                        } else {
                            this.isSidebarOpen = false;
                            if (sidebar) {
                                sidebar.classList.remove('open');
                            }
                        }
                    };

                    handleResponsiveChanges();
                    window.addEventListener('resize', handleResponsiveChanges);
                }

                updateHeaderGradient(status) {
                    const header = document.getElementById('rideHeader');
                    if (header) {
                        switch (status?.toLowerCase()) {
                            case 'accepted':
                                header.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';
                                break;
                            case 'in_progress':
                                header.style.background = 'linear-gradient(135deg, #2196f3, #1976d2)';
                                break;
                            case 'completed':
                                header.style.background = 'linear-gradient(135deg, #4caf50, #388e3c)';
                                break;
                            case 'cancelled':
                                header.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
                                break;
                            case 'pending':
                                header.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
                                break;
                            default:
                                header.style.background = 'linear-gradient(135deg, #3a86ff, #2667cc)';
                        }
                    }
                }
            }

            // Initialize when DOM is loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    new EnhancedTrackingManager();
                });
            } else {
                new EnhancedTrackingManager();
            }
        })();
    </script>
@endpush

@push('css')
<style>
    /* Advanced Marker Styles */
    .location-marker, .driver-marker {
        pointer-events: auto;
        cursor: pointer;
    }

    .gmp-map .advanced-marker {
        z-index: 1000;
    }

    /* Ensure map container has proper dimensions */
    #tracking-map {
        width: 100%;
        height: 100%;
        position: relative;
        background-color: #f8f9fa;
    }

    /* Custom info windows */
    .gm-style-iw {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 200px !important;
    }

    .gm-style-iw button {
        display: none !important;
    }

    /* Pulse animation for start ride marker */
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }

    /* Sidebar enhancements */
    .details-sidebar {
        overflow-y: auto;
    }

    .tracking-path {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    /* Button styles */
    .btn-warning {
        background: linear-gradient(135deg, #FF9800, #F57C00);
        border: none;
        color: white;
        font-weight: 500;
    }

    .btn-warning:hover {
        background: linear-gradient(135deg, #F57C00, #EF6C00);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
    }
</style>
@endpush


