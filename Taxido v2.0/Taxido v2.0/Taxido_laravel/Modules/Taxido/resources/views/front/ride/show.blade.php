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

@extends('front.layouts.master')
@section('title', __('taxido::front.ride'))
@section('content')

    <!-- Create Ride Section Start -->
    <section class="create-ride-section section-b-space">
        <div class="container">
            <div class="row g-md-4 g-3">
                <div class="col-xl-5">
                    <div class="left-map-box">
                        <div class="map-view" id="map-view" loading="lazy"></div>
                        <div class="accordion location-view-accordion" id="location-view">
                            <div class="accordion-item">
                                <div class="accordion-header">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#location-viewCollapse">{{ __('taxido::static.rides.location_details') }}</button>
                                </div>
                                <div id="location-viewCollapse" class="accordion-collapse collapse show"
                                    data-bs-parent="#location-view">
                                    <div class="accordion-body">
                                        <ul class="tracking-path">
                                            @foreach ($locations as $index => $location)
                                                @if ($loop->last)
                                                    <li class="end-point">
                                                        <i class="ri-map-pin-2-fill"></i> <span>{{ $location }}</span>
                                                    </li>
                                                @else
                                                    <li class="stop-point">
                                                        <i class="ri-registered-line"></i> <span>{{ $location }}</span>
                                                    </li>
                                                @endif
                                            @endforeach
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-7">
                    <div class="right-details-box">
                        <div class="dashboard-title">
                            <h3>{{ __('taxido::static.rides.ride_details') }}</h3>
                            <div class="ride-details-box">
                                <ul class="date-time-list">
                                    <li><i
                                            class="ri-calendar-2-line"></i>{{ \Carbon\Carbon::parse($ride?->created_at)->format('d M, Y') }}
                                    </li>
                                </ul>
                                <ul class="badge-group-list">
                                    <li>
                                        <span class="badge badge-primary" id="ride-number">#{{ $ride?->ride_number }}</span>
                                    </li>
                                    @if ($ride->otp)
                                        <li>
                                            <span class="badge badge-otp"
                                                id="otp">{{ __('taxido::static.rides.otp') }}:
                                                {{ $ride->otp }}</span>
                                        </li>
                                    @endif
                                </ul>
                            </div>
                        </div>
                        <div class="general-details-box">
                            <div class="general-title">
                                <h3>{{ __('taxido::static.rides.general_detail') }}</h3>
                            </div>
                            <ul class="general-details-list">
                                <li>{{ __('taxido::static.rides.service') }} <span
                                        id="service-name">{{ $ride->service['name'] }}</span></li>
                                <li>{{ __('taxido::static.rides.service_category') }} <span
                                        id="service-category-name">{{ $ride->service_category['name'] }}</span></li>
                                <li>{{ __('taxido::static.rides.ride_distance') }} <span
                                        id="ride-distance">{{ $ride?->distance }} {{ $ride?->distance_unit }}</span></li>
                                @if (isset($ride->service['slug']) && in_array($ride->service['slug'], [ServicesEnum::PARCEL, ServicesEnum::FREIGHT]))
                                    <li>{{ __('taxido::static.rides.weight') }} <span
                                            id="weight">{{ $ride?->weight ?? null }}</span></li>
                                @endif
                                <li>{{ __('taxido::static.rides.ride_fare') }} <span
                                        id="ride-fare">{{ $cs . number_format(round($ride?->ride_fare, 2), 2) }}</span>
                                </li>
                                <li>{{ __('taxido::static.rides.payment_method') }} <span id="payment-method">
                                        <img class="img-fluid payment-img" alt=""
                                            src="{{ $paymentLogoUrl ?: asset('images/payment/cod.png') }}">
                                    </span></li>
                                <li>
                                    {{ __('taxido::static.rides.payment_status') }}
                                    <span
                                        class="badge badge-{{ $paymentstatuscolorClasses[ucfirst($ride->payment_status ?? 'PENDING')] }}"
                                        id="payment-status">
                                        {{ ucfirst(strtolower($ride->payment_status)) }}
                                    </span>
                                </li>
                                <li>
                                    {{ __('taxido::static.rides.ride_status') }}
                                    <span
                                        class="badge badge-{{ $ridestatuscolorClasses[ucfirst($ride->ride_status['name'])] }}"
                                        id="ride-status">
                                        {{ ucfirst($ride->ride_status['name']) }}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div class="general-details-box">
                            <div class="general-title">
                                <h3>{{ __('taxido::static.rides.driver_detail') }}</h3>
                            </div>
                            <div class="personal">
                                <div class="information">
                                    <div class="border-image">
                                        <div class="profile-img">
                                            @if (isset($ride?->driver['profile_image_url']))
                                                <img id="driver-profile-img"
                                                    src="{{ $ride?->driver['profile_image_url'] }}"
                                                    alt="{{ $ride?->driver['name'] }}">
                                            @else
                                                <div class="initial-letter" id="driver-initial-letter">
                                                    <span>{{ strtoupper($ride?->driver['name'][0]) }}</span>
                                                </div>
                                            @endif
                                        </div>
                                    </div>
                                    <div class="personal-rating">
                                        <h5>
                                            <a href="javascript:void(0)" class="text-decoration-none"
                                                id="driver-name">{{ $ride?->driver['name'] }}</a>
                                        </h5>
                                        <div class="rating">
                                            <span>{{ __('taxido::static.riders.rating') }}:
                                                <i class="ri-star-fill"></i>
                                                <span id="driver-rating">({{ $ride?->driver['rating_count'] }})</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ul class="personal-details-list">
                                    @if (isset($ride?->driver['email']))
                                        <li><span>{{ __('taxido::static.rides.email') }} : </span>
                                            @if (isDemoModeEnabled())
                                                {{ __('taxido::static.demo_mode') }}
                                            @else
                                                <span id="driver-email">{{ $ride?->driver['email'] ?? '' }}</span>
                                            @endif
                                        </li>
                                    @endif
                                    @if (isset($ride?->driver['country_code']) && isset($ride?->driver['phone']))
                                        <li><span>{{ __('taxido::static.rides.phone') }} :</span>
                                            @if (isDemoModeEnabled())
                                                {{ __('taxido::static.demo_mode') }}
                                            @else
                                                <span id="driver-phone">+{{ $ride?->driver['country_code'] ?? '' }}
                                                    {{ $ride?->driver?->phone ?? '' }}</span>
                                            @endif
                                        </li>
                                    @endif
                                    @if (isset($ride?->vehicle_type['plate_number']))
                                        <li><span>{{ __('taxido::static.riders.vehicle_num') }}: </span><span
                                                id="vehicle-plate-number">{{ $ride?->vehicle_type['plate_number'] ?? '' }}</span>
                                        </li>
                                    @endif
                                    @if (isset($ride?->vehicle_type['vehicle_image_url']))
                                        <li><span>{{ __('taxido::static.rides.vehicle_type') }}: </span>
                                            <div class="vehicle-image">
                                                <img id="vehicle-image"
                                                    src="{{ $ride?->vehicle_type['vehicle_image_url'] }}" class="img-fluid"
                                                    alt="{{ $ride?->vehicle_type['name'] }}">
                                            </div>
                                            <span id="vehicle-type-name">( {{ $ride?->vehicle_type['name'] }})</span>
                                        </li>
                                    @endif
                                </ul>
                            </div>
                        </div>

                        @if (isset($ride->service['slug']) && in_array($ride->service['slug'], [ServicesEnum::PARCEL, ServicesEnum::FREIGHT]))
                            <div class="general-details-box">
                                <div class="general-title">
                                    <h3>{{ __('taxido::front.rides.cargo_details') }}</h3>
                                </div>
                                <div class="cargo-box">
                                    <div class="left-box">
                                        <img id="cargo-image"
                                            src="{{ $ride->cargo_image?->original_url ?? asset('images/nodata1.webp') }}"
                                            class="img-fluid" alt="Cargo Image">
                                    </div>
                                    <ul class="right-list">
                                        @if ($ride->parcel_receiver)
                                            <li><strong><span>{{ __('taxido::static.rides.receiver_name') }}:</span></strong><span
                                                    id="receiver-name">{{ $ride->parcel_receiver['name'] }}</span></li><br>
                                            <li><strong><span>{{ __('taxido::static.rides.receiver_no') }}:</span></strong>
                                                @if (isDemoModeEnabled())
                                                    {{ __('taxido::static.demo_mode') }}
                                                @else
                                                    <span
                                                        id="receiver-phone">+{{ $ride->parcel_receiver['country_code'] ?? '' }}
                                                        {{ $ride->parcel_receiver['phone'] ?? '' }}</span>
                                                @endif
                                            </li>
                                        @endif
                                    </ul>
                                </div>
                            </div>
                        @endif

                        @if (isset($ride->service_category['slug']) && in_array($ride->service_category['slug'], [ServiceCategoryEnum::RENTAL]))
                            <div class="col-12">
                                <div class="card">
                                    <div class="driver-box">
                                        <div class="left-box">
                                            <img id="rental-vehicle-image"
                                                src="{{ $ride?->rental_vehicle?->normal_image?->original_url ?? asset('images/nodata1.webp') }}"
                                                class="img-fluid" alt="">
                                        </div>
                                        <ul class="api-right-list">
                                            <li><span>{{ __('taxido::static.rides.vehicle_name') }}:</span>
                                                <span id="rental-vehicle-name">{{ $ride?->rental_vehicle?->name }}</span>
                                            </li>
                                            @if ($ride?->is_with_driver == 1)
                                                <li><span>{{ __('taxido::static.rides.assign_driver_name') }}:</span>
                                                    <span
                                                        id="assigned-driver-name">{{ $ride?->assigned_driver['name'] }}</span>
                                                </li>
                                                <li>
                                                    <span>{{ __('taxido::static.rides.assign_driver_no') }}:</span>
                                                    @if (isDemoModeEnabled())
                                                        {{ __('taxido::static.demo_mode') }}
                                                    @else
                                                        <span
                                                            id="assigned-driver-phone">+{{ $ride?->assigned_driver['country_code'] ?? '' }}
                                                            {{ $ride?->assigned_driver['phone'] ?? '' }}</span>
                                                    @endif
                                                </li>
                                            @else
                                                <li><span>{{ __('taxido::static.rides.driver_name') }}:</span>
                                                    <span id="driver-name">{{ $ride?->driver?->name }}</span>
                                                </li>
                                                <li><span>{{ __('taxido::static.rides.driver_no') }}:</span>
                                                    <span id="driver-phone">{{ $ride?->driver?->phone }}</span>
                                                </li>
                                            @endif
                                            <li><span>{{ __('taxido::static.rides.vehicle_registration_no') }}:</span>
                                                <span
                                                    id="rental-vehicle-registration">{{ $ride?->rental_vehicle?->registration_no }}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        @endif

                        <div class="general-details-box">
                            <div class="general-title">
                                <h3>{{ __('taxido::static.rides.price_details') }}</h3>
                                @if ($ride?->payment_status == PaymentStatus::COMPLETED)
                                    @if ($ride->invoice_id)
                                        <a href="{{ route('front.cab.ride.invoice', $ride->invoice_id) }}"
                                            class="btn gradient-bg-color invoice-btn">
                                            <i
                                                class="ri-download-line d-md-inline-block d-none"></i>{{ __('taxido::static.rides.invoice') }}
                                        </a>
                                    @endif
                                @endif
                            </div>
                            <ul class="general-details-list">
                                <li>{{ __('taxido::static.rides.ride_fare') }}<span
                                        id="ride-fare">{{ $cs . number_format(round($ride->ride_fare, 2), 2) }}</span>
                                </li>
                                @if ($ride->additional_distance_charge > 0)
                                    <li>{{ __('taxido::static.rides.additional_distance_charge') }}<span
                                            id="additional-distance-charge">{{ $cs . number_format(round($ride->additional_distance_charge, 2), 2) }}</span>
                                    </li>
                                @endif
                                @if ($ride->additional_minute_charge > 0)
                                    <li>{{ __('taxido::static.rides.additional_minute_charge') }}<span
                                            id="additional-minute-charge">{{ $cs . number_format(round($ride->additional_minute_charge, 2), 2) }}</span>
                                    </li>
                                @endif
                                @if ($ride->additional_weight_charge > 0)
                                    <li>{{ __('taxido::static.rides.additional_weight_charge') }}<span
                                            id="additional-weight-charge">{{ $cs . number_format(round($ride->additional_weight_charge, 2), 2) }}</span>
                                    </li>
                                @endif
                                @if ($ride->waiting_charges > 0)
                                    <li>{{ __('taxido::static.rides.waiting_charges') }}<span
                                            id="waiting-charges">{{ $cs . number_format(round($ride->waiting_charges, 2), 2) }}</span>
                                    </li>
                                @endif
                                @if ($ride->bid_extra_amount > 0)
                                    <li>{{ __('taxido::static.rides.bid_extra_amount') }}<span
                                            id="bid-extra-amount">{{ $cs . number_format(round($ride->bid_extra_amount, 2), 2) }}</span>
                                    </li>
                                @endif

                                <li class="t-success">{{ __('taxido::static.rides.subtotal') }}<span class="t-success"
                                        id="subtotal">{{ $cs . number_format(round($ride->sub_total, 2), 2) }}</span>
                                </li>

                                <li>{{ __('taxido::static.rides.platform_fee') }}<span
                                        id="platform-fees">{{ $cs . number_format(round($ride->platform_fees, 2), 2) }}</span>
                                </li>
                                <li>{{ __('taxido::static.rides.tax') }}<span
                                        id="tax">{{ $cs . number_format(round($ride->tax, 2), 2) }}</span></li>
                                <li>{{ __('taxido::static.rides.admin_commission') }}<span
                                        id="admin-commission">{{ $cs . number_format(round($ride->commission, 2), 2) }}</span>
                                </li>
                                <li class="total">{{ __('taxido::front.total_bill') }}<span class="t-success"
                                        id="total-bill">{{ $cs . number_format(round($ride->total, 2), 2) }}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Create Ride Section End -->

    <!-- Book Ride Modal End -->
@endsection

@if ($settings['location']['map_provider'] == 'google_map')
    @includeIf('taxido::admin.ride.google')
@elseIf($settings['location']['map_provider'] == 'osm')
    @includeIf('taxido::admin.ride.osm')
@endif

@push('scripts')
    <!-- Firebase SDK -->
    <script src="{{ asset('js/firebase/firebase-app-compat.js') }}"></script>
    <script src="{{ asset('js/firebase/firebase-firestore-compat.js') }}"></script>

    <script>
        // Define color classes for badges (replicating PHP functions in JavaScript)
        const rideStatusColorClasses = @json($ridestatuscolorClasses);
        const paymentStatusColorClasses = @json($paymentstatuscolorClasses);

        // Firebase Configuration
        const firebaseConfig = {
            apiKey: "{{ env('FIREBASE_API_KEY') }}",
            authDomain: "{{ env('FIREBASE_AUTH_DOMAIN') }}",
            projectId: "{{ env('FIREBASE_PROJECT_ID') }}",
            storageBucket: "{{ env('FIREBASE_STORAGE_BUCKET') }}",
            messagingSenderId: "{{ env('FIREBASE_MESSAGING_SENDER_ID') }}",
            appId: "{{ env('FIREBASE_APP_ID') }}",
            measurementId: "{{ env('FIREBASE_MEASUREMENT_ID') }}"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        $(document).ready(function() {
            const rideId = <?php echo $ride->id; ?>;
            const rideRef = db.collection('rides').doc(rideId.toString());

            // Listen in realtime
            const unsubscribe = rideRef.onSnapshot((doc) => {
                if (doc.exists) {
                    const rideData = doc.data();
                    console.log("Ride document updated:", rideData);

                    // --- Update Ride Details ---
                    $("#ride-number").text(`#${rideData.ride_number || ''}`);
                    $("#otp").text(rideData.otp ? `OTP: ${rideData.otp}` : "");
                    $("#ride-distance").text(`${rideData.distance || 0} ${rideData.distance_unit || "km"}`);
                    $("#ride-fare").text(
                        `${rideData.currency_symbol || "$"}${Number(rideData.ride_fare || 0).toFixed(2)}`
                    );
                    $("#payment-method img").attr("src", rideData.payment_method === "cash" ?
                        "{{ asset('images/payment/cod.png') }}" : "");
                    $("#payment-status")
                        .text(rideData.payment_status || "")
                        .removeClass()
                        .addClass(
                            `badge badge-${paymentStatusColorClasses[rideData.payment_status] || ''}`);
                    $("#ride-status")
                        .text(rideData.ride_status?.name || "")
                        .removeClass()
                        .addClass(
                            `badge badge-${rideStatusColorClasses[rideData.ride_status?.name] || ''}`);
                    $("#service-name").text(rideData.service?.name || "");
                    $("#service-category-name").text(rideData.service_category?.name || "");

                    // --- Driver Details ---
                    if (rideData.driver) {
                        $("#driver-name").text(rideData.driver.name || "N/A");
                        $("#driver-email").text(rideData.driver.email || "N/A");
                        $("#driver-phone").text(
                            `+${rideData.driver.country_code || ''} ${rideData.driver.phone || ''}`);
                        $("#driver-rating").text(`(${rideData.driver.rating_count || 0})`);
                        if (rideData.driver.profile_image_url) {
                            $("#driver-profile-img").attr("src", rideData.driver.profile_image_url).show();
                            $("#driver-initial-letter").hide();
                        } else {
                            $("#driver-initial-letter").text(rideData.driver.name?.[0].toUpperCase() || "")
                                .show();
                            $("#driver-profile-img").hide();
                        }
                    }

                    // --- Vehicle ---
                    if (rideData.vehicle_type) {
                        $("#vehicle-plate-number").text(rideData.vehicle_type.plate_number || "N/A");
                        $("#vehicle-type-name").text(rideData.vehicle_type.name || "N/A");
                        if (rideData.vehicle_type.vehicle_image_url) {
                            $("#vehicle-image").attr("src", rideData.vehicle_type.vehicle_image_url);
                        }
                    }

                    // --- Price ---
                    $("#subtotal").text(
                        `${rideData.currency_symbol || "$"}${Number(rideData.sub_total || 0).toFixed(2)}`
                    );
                    $("#total-bill").text(
                        `${rideData.currency_symbol || "$"}${Number(rideData.total || 0).toFixed(2)}`);

                    // --- Cargo ---
                    if (rideData.cargo_image_url) {
                        $("#cargo-image").attr("src", rideData.cargo_image_url);
                    }
                    if (rideData.parcel_receiver) {
                        $("#receiver-name").text(rideData.parcel_receiver.name || "N/A");
                        $("#receiver-phone").text(
                            `+${rideData.parcel_receiver.country_code || ''} ${rideData.parcel_receiver.phone || ''}`
                        );
                    }

                    // --- Rental ---
                    if (rideData.rental_vehicle) {
                        $("#rental-vehicle-name").text(rideData.rental_vehicle.name || "N/A");
                        $("#rental-vehicle-registration").text(rideData.rental_vehicle.registration_no ||
                            "N/A");
                        if (rideData.rental_vehicle.normal_image?.original_url) {
                            $("#rental-vehicle-image").attr("src", rideData.rental_vehicle.normal_image
                                .original_url);
                        }
                    }
                    if (rideData.is_with_driver == 1 && rideData.assigned_driver) {
                        $("#assigned-driver-name").text(rideData.assigned_driver.name || "N/A");
                        $("#assigned-driver-phone").text(
                            `+${rideData.assigned_driver.country_code || ''} ${rideData.assigned_driver.phone || ''}`
                        );
                    }

                } else {
                    console.log("Ride document does not exist!");
                }
            }, (error) => {
                console.error("Error listening to ride document:", error);
            });

            // Unsubscribe when page is closed
            $(window).on("unload", function() {
                unsubscribe();
            });
        });
    </script>
@endpush
