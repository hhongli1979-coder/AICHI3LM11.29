@use('Modules\Taxido\Enums\ServiceCategoryEnum')
@use('Modules\Taxido\Enums\ServicesEnum')
@use('Modules\Taxido\Enums\RideStatusEnum')
@php
    $locations = $rideRequest->locations;
    $locationCoordinates = $rideRequest->location_coordinates;
    $settings = getTaxidoSettings();
    $paymentLogoUrl = getPaymentLogoUrl($rideRequest->payment_method);
    $currencySymbol = getDefaultCurrencySymbol();
    $cs = $rideRequest?->currency_symbol ?? $currencySymbol;
    $paymentstatuscolorClasses = getPaymentStatusColorClasses();
    $ridestatuscolorClasses = getRideStatusColorClasses();
@endphp
@extends('admin.layouts.master')
@section('title', __('taxido::static.rides.riderequests'))
@section('content')
    <div class="row ride-dashboard">
        <div class="col-12">
            <div class="default-sorting mt-0">
                <div class="welcome-box">
                    <div class="d-flex">
                        <h2>{{ __('taxido::static.rides.ride_request_details') }}</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-6">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header card-no-border">
                            <div class="header-top">
                                <h5 class="m-0">{{ __('taxido::static.rides.general_detail') }}</h5>
                            </div>
                        </div>
                        <div class="card-body pt-0">
                            <ul class="ride-details-list">
                                <li>
                                    {{ __('taxido::static.rides.service') }} :
                                    <span id="service-name">{{ $rideRequest->service->name }}</span>
                                </li>
                                <li>
                                    {{ __('taxido::static.rides.service_category') }} :
                                    <span id="service-category">{{ $rideRequest?->service_category?->name }}</span>
                                </li>
                                @if($rideRequest?->service?->name == ServicesEnum::PARCEL)
                                <li><strong>{{ __('taxido::static.rides.parcel_otp') }}: </strong>
                                    <span id="parcel-otp">{{ $rideRequest?->parcel_delivered_otp }}</span>
                                </li>
                                @endif
                                <li>
                                    {{ __('taxido::static.rides.ride_distance') }} :
                                    <span id="ride-distance">{{ $rideRequest?->distance }} {{ $rideRequest?->distance_unit ?? 'KM' }}</span>
                                </li>
                                <li>
                                    {{ __('taxido::static.rides.total') }} :
                                    <span id="ride-fare">{{ $cs . number_format(round($rideRequest?->total, 2), 2) }}</span>
                                </li>
                                <li>
                                    {{ __('taxido::static.rides.payment_method') }} :
                                    <span>
                                        <img class="img-fluid h-30" alt="" id="payment-method-img"
                                            src="{{ $paymentLogoUrl ?: asset('images/payment/cod.png') }}">
                                    </span>
                                </li>
                                <li>
                                    {{ __('taxido::static.rides.status') }} :
                                    <span id="ride-status" class="badge badge-{{ \Modules\Taxido\Models\RideStatus::getColorCodeByStatus($rideRequest?->status) }}">
                                        {{ \Modules\Taxido\Models\RideStatus::getDescriptionByStatus($rideRequest?->status) }}
                                    </span>
                                </li>

                                <li>
                                    {{ __('taxido::static.rides.cancellation_reason') }} :
                                    <span id="cancellation-reason">
                                        {{ $rideRequest->cancellation_reason}}
                                    </span>
                                </li>

                                <ul class="list-unstyled mt-3">

                                </ul>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-xxl-12">
                    <div class="row">
                        <div class="col-xxl-12">
                            <div class="card">
                                <div class="card-header card-no-border">
                                    <div class="header-top">
                                        <h5 class="m-0">{{ __('taxido::static.rides.rider_information') }}</h5>
                                    </div>
                                </div>
                                <div class="card-body pt-0">
                                    <div class="personal h-custom-scrollbar">
                                        <div class="information">
                                            <div class="border-image">
                                                <div class="profile-img">
                                                    <div class="initial-letter">
                                                         <span id="rider-initial">{{ strtoupper($rideRequest?->rider['name'][0] ?? 'G') }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="personal-rating">
                                                <h5 id="rider-name">{{ $rideRequest['rider']['name']  ?? 'G' }}</h5>
                                                <div class="rating">
                                                    <span>{{ __('taxido::static.rides.rating') }}:</span>
                                                    <span id="rider-rating">
                                                            @php
                                                                $averageRating = 0;
                                                                if (
                                                                    isset($rideRequest['rider']['reviews']) &&
                                                                    count($rideRequest['rider']['reviews']) > 0
                                                                ) {
                                                                    $averageRating = (int) collect(
                                                                        $rideRequest['rider']['reviews'],
                                                                    )->avg('rating');
                                                                }
                                                                $totalStars = 5;
                                                            @endphp
                                                            @for ($i = 0; $i < $averageRating; $i++)
                                                                <img src="{{ asset('images/dashboard/star.svg') }}"
                                                                    alt="Filled Star">
                                                            @endfor
                                                            @for ($i = $averageRating; $i < $totalStars; $i++)
                                                                <img src="{{ asset('images/dashboard/outline-star.svg') }}"
                                                                    alt="Outlined Star">
                                                            @endfor
                                                        </span>
                                                </div>
                                            </div>
                                        </div>
                                        <ul class="personal-details-list">
                                            <li>
                                                {{ __('taxido::static.rides.email') }}:
                                                <span id="rider-email">{{ $rideRequest->rider['email'] ?? 'N/A'}} </span>
                                            </li>
                                            @if(isset($rideRequest->rider['phone']) && isset($rideRequest->rider['country_code']))
                                                @php
                                                    $contactNumber = '+'.$rideRequest->rider['country_code'].$rideRequest->rider['phone'];
                                                @endphp
                                            @else
                                                @php
                                                    $contactNumber = 'N/A';
                                                @endphp
                                            @endif
                                            <li>
                                                {{ __('taxido::static.rides.contact_number') }}:
                                                <span id="rider-phone">
                                                    {{ $contactNumber }}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12" id="driverInformationCard" style="display: none;">
                    <div class="card">
                        <div class="card-header card-no-border">
                            <div class="header-top">
                                <h5 class="m-0">{{ __('taxido::static.rides.driver_information') }}</h5>
                            </div>
                        </div>
                        <div class="card-body pt-0">
                            <div class="personal h-custom-scrollbar">
                                <div class="information" id="driver-info">
                                    <div class="border-image">
                                        <div class="profile-img">
                                            <div class="initial-letter">
                                                <span id="driver-initial"></span>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="personal-rating">
                                        <h5 class="text-decoration-none" id="driver-name">Waiting for driver...</h5>
                                        <div class="rating">
                                            <span>
                                                {{ __('taxido::static.rides.rating') }}:
                                            </span>
                                            <span id="driver-rating">

                                            </span>
                                        </div>
                                    </div>

                                </div>
                                <!-- <div class="information-details"> -->
                                    <ul class="personal-details-list">
                                        <li>
                                            {{ __('taxido::static.rides.phone') }}:
                                            <span id="driver-phone">N/A</span>
                                        </li>
                                        <li>{{ __('taxido::static.riders.vehicle_num') }}:
                                            <span id="vehicle-plate-number">
                                            N/A
                                            </span>

                                        </li>
                                        <li id="driver-phone">
                                            {{ __('taxido::static.rides.vehicle_model') }}:
                                            <span id="vehicle-model">N/A</span>
                                        </li>
                                        @if (!in_array($rideRequest?->service_category?->slug, [ServiceCategoryEnum::RENTAL]))
                                        <li>
                                            <span>{{ __('taxido::static.rides.vehicle_type') }}: </span>
                                            <div class="vehicle-image">
                                                <img id="vehicle-type-image" src="" class="img-fluid">
                                            </div>
                                            <span id="vehicle-type-name">N/A</span>
                                        </li>
                                        @endif
                                    </ul>

                                <!-- </div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-6">
            <div class="card maps-view h-auto">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('taxido::static.rides.map_view') }}</h5>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-0">
                    <div class="map-view" id="map-view" loading="lazy"></div>
                    <div class="accordion" id="location-view">
                        <div class="accordion-item location-details">
                            <div class="accordion-header contentbox-title">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#location-viewCollapse">
                                    <h4>{{ __('taxido::static.rides.location_details') }}</h4>
                                </button>
                            </div>
                            <div id="location-viewCollapse" class="accordion-collapse collapse show"
                                data-bs-parent="#location-view">
                                <div class="accordion-body">
                                    <div class="">
                                        <ul class="tracking-path" id="locations-list">
                                            @php
                                                $points = range('A', 'Z');
                                            @endphp
                                            @foreach ($rideRequest->locations as $index => $location)
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
                    </div>
                </div>
            </div>

            @if($rideRequest->ride_status_activities->isNotEmpty())
            <div class="card m-0 h-auto">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div class="booking-title">
                            <h5 class="m-0">Ride #{{ $rideRequest->ride_number }} Activities</h5>
                            <h6>Created {{ $rideRequest->created_at->format('j F Y, h:i A') }}</h6>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="booking-details-box">
                        <div class="booking-content">
                            <ul class="booking-number-list">
                                @foreach($rideRequest->ride_status_activities->sortByDesc('created_at') as $activity)
                                    <li>
                                        <div class="activity-dot"></div>
                                        <div class="circle {{ \Modules\Taxido\Models\RideStatus::getActivityClassByStatus($activity->status) }}"></div>
                                        <div class="booking-number-box">
                                            <div class="left-box">
                                                <h6 class="date">{{ \Carbon\Carbon::parse($activity->created_at)->format('d-m-Y') }}</h6>
                                                <h6 class="name">{{ ucfirst(str_replace('_', ' ', $activity->status)) }}</h6>
                                                <h6 class="text-pra">{{ $activity->ride_status ? $activity->ride_status->description : \Modules\Taxido\Models\RideStatus::getDescriptionByStatus($activity->status) }}</h6>
                                            </div>
                                            <div class="right-box">
                                                <h6>{{ \Carbon\Carbon::parse($activity->created_at)->format('h:i A') }}</h6>
                                            </div>
                                        </div>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            @endif
        </div>
        @if (in_array($rideRequest?->service?->slug, [ServicesEnum::PARCEL]))
        <div class="col-xxl-5">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="parcel-box">
                            <div class="left-box">
                                <img id="cargo-image" src="{{ $rideRequest->cargo_image?->original_url ?? asset('images/nodata1.webp') }}"
                                    class="img-fluid" alt="">
                            </div>
                            <ul class="right-list">
                                <li><span>{{ __('taxido::static.rides.receiver_name') }}:</span>
                                    <span id="receiver-name">{{ $rideRequest?->parcel_receiver['name'] }}</span>
                                </li>
                                <li>
                                    <span>{{ __('taxido::static.rides.receiver_no') }}:</span>
                                    <span id="receiver-phone">
                                        @if(isDemoModeEnabled())
                                            {{ __('taxido::static.demo_mode') }}
                                        @else
                                            +{{ $rideRequest?->parcel_receiver['country_code'] ?? '' }} {{ $rideRequest?->parcel_receiver['phone'] ?? '' }}
                                        @endif
                                    </span>
                                </li>
                                <li><span>{{ __('taxido::static.rides.parcel_otp') }}:</span>
                                    <span id="parcel-otp-display">{{ $rideRequest?->parcel_delivered_otp }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        @endif
    </div>
@endsection

@if ($settings['location']['map_provider'] == 'google_map')
    @includeIf('taxido::admin.ride.google')
@elseIf($settings['location']['map_provider'] == 'osm')
    @includeIf('taxido::admin.ride.osm')
@endif

@push('scripts')
<!-- Firebase SDK -->
<script src="{{ asset('js/firebase/firebase-app-compat.js')}}"></script>
<script src="{{ asset('js/firebase/firebase-firestore-compat.js')}}"></script>

<script>
    // Firebase configuration
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
    const rideStatusColorClasses = @json($ridestatuscolorClasses);

    // Get the ride request ID from the PHP variable
    const rideRequestId = "{{ $rideRequest->id }}";

    // Function to render rating stars
    function renderRating(rating) {
        let stars = '';
        const totalStars = 5;
        for (let i = 0; i < rating; i++) {
            stars += `<img src="{{ asset('images/dashboard/star.svg') }}" alt="Filled Star">`;
        }
        for (let i = rating; i < totalStars; i++) {
            stars += `<img src="{{ asset('images/dashboard/outline-star.svg') }}" alt="Outlined Star">`;
        }
        return stars;
    }

    // Function to update driver details
    function updateDriverDetails(driverId) {
        if (!driverId) {
            $('#driverInformationCard').hide(); // Keep card hidden if no driverId
            return;
        }

        // Fetch driver details from driverTrack collection
        db.collection('driverTrack')
            .doc(driverId.toString())
            .get()
            .then((driverDoc) => {
                if (driverDoc.exists) {
                    const driverData = driverDoc.data();
                    let driverName = driverData.driver_name + " (" + driverId + ")";
                    $('#driver-name').text(driverData.driver_name ? driverName : 'Unknown');
                    $('#driver-initial').text(driverData.driver_name ? driverData.driver_name[0].toUpperCase() : '');
                    $('#vehicle-model').text(driverData.vehicle_model || 'N/A');
                    $('#driver-rating').html(renderRating(driverData.rating_count || 0));
                    $('#driver-phone').text(driverData.phone || 'N/A');
                    $('#vehicle-plate-number').text(driverData.vehicle_plate_number || 'N/A');
                    if ($('#vehicle-type-name').length) {
                        $('#vehicle-type-name').text(driverData.vehicle_type || 'N/A');
                        $('#vehicle-type-image').attr('src', driverData.vehicle_type_image || '');
                    }
                    $('#driverInformationCard').show();
                } else {
                    $('#driverInformationCard').hide();
                }
            })
            .catch((error) => {
                console.error("Error fetching driverTrack data: ", error);
                $('#driverInformationCard').hide();
            });
    }

    function checkSubcollections() {
        const subcollections = ['instantRide', 'bids', 'ambulance_request', 'rental_request'];
        let foundDriverId = null;

        Promise.all(subcollections.map(subcollection =>
            db.collection('ride_requests').doc(rideRequestId).collection(subcollection).get()
        )).then(results => {
            for (let i = 0; i < results.length; i++) {
                if (!results[i].empty) {
                    // Get the first document from the subcollection
                    const doc = results[i].docs[0];
                    const data = doc.data();
                    if (data.current_driver_id) {
                        foundDriverId = data.current_driver_id;
                        break;
                    }
                }
            }

            if (foundDriverId) {
                updateDriverDetails(foundDriverId); // Fetch driver details if driverId found
            } else {
                $('#driverInformationCard').hide(); // Keep card hidden if no driverId
            }
        }).catch(error => {
            console.error("Error checking subcollections: ", error);
            $('#driverInformationCard').hide(); // Keep card hidden on error
        });
    }

    // Listen for real-time updates from ride_requests collection
    db.collection('ride_requests').doc(rideRequestId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                $('#service-name').text(data?.service?.name || '');
                $('#service-category').text(data?.service_category?.name || '');
                $('#ride-distance').text(`${data?.distance || '0.0'} ${data?.distance_unit || 'KM'}`);
                $('#ride-fare').text(`{{ $cs }}${Math.round(data?.total * 100) / 100 || 0}`);
                $('#payment-method-img').attr('src', data?.payment_method === 'cash' ?
                    "{{ asset('images/payment/cod.png') }}" : "{{ asset('images/payment/cod.png') }}");

                $('#rider-name').text(data.rider?.name || 'Unknown');
                $('#rider-initial').text(data.rider?.name ? data.rider.name[0].toUpperCase() : '');
                $('#rider-rating').html(renderRating(data.rider?.rating_count || 0));
                $('#cancellation-reason').text(data.cancellation_reason);

                // Update locations
                let locationsHtml = '';
                const points = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
                data.locations.forEach((location, index) => {
                    const isLast = index === data.locations.length - 1;
                    locationsHtml += `
                        <li class="${isLast ? 'end-point' : 'stop-point'}">
                            ${location}<span>${points[index]}</span>
                        </li>`;
                });
                $('#locations-list').html(locationsHtml);

                let rideStatus = data.status?.charAt(0)?.toUpperCase() + data.status?.slice(1);
                let badgeColor = rideStatusColorClasses[rideStatus] || 'secondary';
                $('#ride-status').text(rideStatus).removeClass().addClass(`badge badge-${badgeColor}`);

                const rideId = data.ride_id;
                if (badgeColor === 'accepted' && rideId) {
                    db.collection('rides')
                        .doc(rideId.toString())
                        .get()
                        .then((rideDoc) => {
                            if (rideDoc.exists) {
                                window.location.href = `/admin/ride/details/${rideId}`;
                            } else {
                                console.info("Fetching ride ID: " + rideId);
                            }
                        })
                        .catch((error) => {
                            console.error("Error fetching ride data: ", error);
                        });
                }

                // Check subcollections for current_driver_id
                checkSubcollections();
            } else {
                $('#driverInformationCard').hide(); // Keep card hidden if ride request doesn't exist
            }
        }, (error) => {
            console.error("Error listening to ride_requests updates: ", error);
            $('#driverInformationCard').hide(); // Keep card hidden on error
        });

    // Initial check for subcollections
    checkSubcollections();
</script>
@endpush
