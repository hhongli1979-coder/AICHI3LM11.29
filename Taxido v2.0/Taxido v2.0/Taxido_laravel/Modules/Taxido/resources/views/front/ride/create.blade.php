@use('Modules\Taxido\Models\Service')
@use('Modules\Taxido\Enums\ServicesEnum')
@use('Modules\Taxido\Models\HourlyPackage')
@php
$services = Service::whereNull('deleted_at')?->where('type','cab')->where('status', true)?->get();
$paymentMethodList = getPaymentMethodList();
$ambulanceServiceId = getServiceIdBySlug(ServicesEnum::AMBULANCE);
$ambulances = getAmbulances();
$hourlyPackages = HourlyPackage::whereNull('deleted_at')->where('status', true)->get();
$settings = getTaxidoSettings();
@endphp

@extends('front.layouts.master')
@section('title', __('taxido::static.ride.index'))

@push('css')
<!-- Select2 css-->
<link rel="stylesheet" href="{{ asset('css/vendors/select2.css') }}">

<!-- Toastr css -->
<link rel="stylesheet" as="style" href="{{ asset('admin/css/vendors/toastr.min.css') }}" media="print" onload="this.media='all'">
@endpush

@section('content')
<!-- Create Ride Section Start -->
<section class="create-ride-section">
  <div class="container">
    <form id="rideForm" method="POST" enctype="multipart/form-data">
      @method('POST')
      @csrf
      <div class="row g-md-4 g-3">
        <div class="col-12">
          <div class="alert alert-message alert-dismissible" role="alert">
              <span><i class="ri-alert-fill"></i> {{ __('taxido::front.rides.warning_note') }}</span>
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <i class="ri-close-line"></i>
              </button>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="left-map-box">
            <div class="save-address-map-box">
              <div class="">
                <!-- Placeholder for when map is not visible -->
                <div id="map-placeholder" style="display: none; height: 500px; width: 100%; background-color: #f0f0f0; text-align: center; padding-top: 200px;">
                  <p style="font-size: 18px; color: #333;">
                    {{ __('taxido::front.rides.location_permission_denied') }}<br>
                    <small>{{ __('taxido::front.rides.allow_location_permission') }}</small>
                  </p>
                  <!-- Optional: Add a static image -->
                  <!-- <img src="{{ asset('images/map-placeholder.png') }}" alt="Map Placeholder" style="max-width: 100%; height: auto;" /> -->
                </div>
                <div id="map" style="height: 500px; width: 100%;"></div>
              </div>
              <ul class="duration-distance-box">
                <li>{{ __('taxido::front.rides.duration') }}: <span id="duration">00 Min</span></li>
                <li>{{ __('taxido::front.rides.distance') }}: <span id="distance-label">0.00 KM</span></li>
                <input type="hidden" id="distance" class="distance-input" name="distance">
                <input type="hidden" id="duration" class="duration-input" name="duration">
              </ul>
            </div>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="right-details-box">
            <div class="dashboard-title">
              <h3>{{ __('taxido::front.rides.ride_booking') }}</h3>
            </div>

            <div class="row g-sm-4 g-3">
              <!-- Service -->
              <div class="col-xl-6 col-lg-12 col-md-6">
                <div class="form-box">
                  <label class="form-label">{{ __('taxido::static.rides.service') }}<span class="text-danger">*</span></label>
                  <div class="select-item">
                    <select id="service_id" class="form-select form-select-transparent select2-option" data-placeholder="{{ __('taxido::static.rides.select_service') }}">
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

              <!-- Service Category -->
              <div class="col-xl-6 col-lg-12 col-md-6">
                <div class="form-box service-category-container">
                  <label class="form-label"
                    for="service_category_id">{{ __('taxido::static.rides.service_category') }}<span class="text-danger">*</span></label>
                  <div class="select-item">
                    <select class="form-select form-select-transparent select2-option"
                      data-placeholder="{{ __('taxido::static.rides.select_service_category') }}"
                      id="service_category_id" name="service_category_id">
                    </select>
                    <span id="slug-loader" class="spinner-border ride-loader" role="status" style="display: none;"></span>
                    @error('service_category_id')
                      <span class="invalid-feedback d-block" role="alert">
                        <strong>{{ $message }}</strong>
                      </span>
                    @enderror
                  </div>
                </div>
              </div>

              <!-- Ambulance -->
              <div class="col-xl-6 col-lg-12 col-md-6" id="ambulance_div" style="display:none">
                <div class="form-group row">
                  <label class="col-12" for="ambulance_id">{{ __('taxido::static.rides.ambulance') }}<span class="text-danger">*</span></label>
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

              <!-- Pickup Location -->
              <div class="col-xl-6 col-lg-12 col-md-6" id="pickup-location-div">
                <div class="form-box">
                  <label for="pickUp" class="form-label">{{ __('taxido::front.rides.pick_up_location') }}</label>
                  <div class="location-row">
                    <input type="text" id="pickup-input" name="locations[]"
                      class="form-control white-from-control ui-widget autocomplete-google location-input"
                      placeholder="{{ __('taxido::static.rides.enter_pickup_location') }}">
                    <input type="hidden" id="pickup-lat" class="lat-input" name="location_coordinates[0][lat]">
                    <input type="hidden" id="pickup-lng" class="lng-input" name="location_coordinates[0][lng]">
                  </div>
                </div>
              </div>

              <!-- Destination Location -->
              <div class="col-xl-6 col-lg-12 col-md-6" id="destination-location-div">
                <div class="form-box">
                  <label for="destination" class="form-label">{{ __('taxido::front.rides.destination_location') }}</label>
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

              <div class="col-12" id="start-time-field" style="display: none;">
                <!-- Start Time Location -->
                <div class="start-time-container">
                  <div class="form-box">
                    <label class="form-label" for="start_time">{{ __('taxido::static.rides.end_date_time') }}<span class="text-danger">*</span></label>
                    <input id="start_time" class="form-control white-from-control flatpickr" type="datetime-local"
                      placeholder="{{ __('taxido::static.rides.select_end_date_and_time') }}"
                      name="start_time" />
                    @error('start_time')
                    <span class="invalid-feedback d-block" role="alert">
                      <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                  </div>
                </div>
              </div>

              <div class="col-12" id="hourly-packages-list-container" style="display: none;">
                <!-- Hourly Package -->
                <div class="hourly-packages-list-container">
                  <div class="form-box">
                    <label class="form-label"
                      for="package_id">{{ __('taxido::static.rides.hourly_package') }}<span class="text-danger">*</span></label>
                    <div class="select-item">
                      <select id="hourly_package_id" class="form-control select-2" name="hourly_package_id"
                        data-placeholder="{{ __('taxido::static.rides.select_package') }}">
                        <option></option>
                        @foreach ($hourlyPackages as $hourlyPackage)
                          <option value="{{ $hourlyPackage->id }}">
                            {{ $hourlyPackage->hour }} hour - {{ $hourlyPackage->distance }} {{ $hourlyPackage->distance_type }}
                          </option>
                        @endforeach
                      </select>
                      @error('hourly_package_id')
                        <span class="invalid-feedback d-block" role="alert">
                          <strong>{{ $message }}</strong>
                        </span>
                      @enderror
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12" id="select_vehicle_type_box">
                <!-- Select Vehicle Slider Box -->
                <div class="select-vehicles-box vehicle-type-slider-container">
                  <label class="form-label">{{ __('taxido::front.select_vehicle_type') }}</label>
                  <div class="swiper mySwiper vehicle-slider-box">
                    <div class="vehicle-spinner-box" id="vehicleTypeBoxSpinner" style="display: none;">
                      <div class="spinner-border">
                        <span class="visually-hidden">{{ __('taxido::front.rides.loading') }}</span>
                      </div>
                    </div>
                    <input type="hidden" name="currency_code" id="currency-code-input">
                      <div class="swiper-wrapper vehicle-type-slider-box">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Note -->
              <div class="col-12">
                <div class="form-box">
                  <label for="note" class="form-label">{{ __('taxido::front.rides.note') }}</label>
                  <div class="location-row" id="location-container">
                    <textarea class="form-control white-from-control" name="description" rows="4" cols="100" placeholder="{{ __('taxido::front.rides.write_note') }}"></textarea>
                  </div>
                </div>
              </div>

              <!-- Book Now Btn -->
              <div class="col-12">
                <button type="button" id="bookRideBtn" class="btn confirm-btn gradient-bg-color">
                  <span role="status">{{ __('taxido::front.rides.book_ride') }}</span>
                  <span id="book-ride-spinner" class="spinner-border spinner-border-sm" style="display:none"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</section>
<!-- Vehicle Details -->

<!-- Find Drivers -->
<div class="modal fade theme-modal find-driver-modal" id="findDriverModal" data-ride_id="">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body">
        <div class="cancel-ride-box">
          <div id="timer" class="set-timer">
            <span id="countdown"></span>
          </div>
          <p>{{ __('taxido::front.rides.find_driver_note') }}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="cancelRideBtn">{{ __('taxido::front.rides.cancel_ride') }}</button>
      </div>
    </div>
  </div>
</div>

<div class="vehicle-detail-modals">
</div>

<!-- Book Ride Modal Start -->
<div class="modal fade theme-modal book-ride-modal" id="bookRideSuccessModal">
  <div class="modal-dialog modal-dialog-centered custom-width">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">{{ __('taxido::front.rides.ride_book_successfully') }}</h3>
        <button type="button" class="btn-close" data-bs-dismiss="modal">
          <i class="ri-close-line"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="ride-success-box">
          <img src="{{ asset('images/gif/1.gif') }}" class="img-fluid" />
          <p>{{ __('taxido::front.rides.sent_request') }}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn gradient-bg-color w-100" data-bs-dismiss="modal">{{ __('taxido::front.rides.okay') }}</button>
      </div>
    </div>
  </div>
</div>
@endsection

@push('scripts')
<!-- Select2 -->
<script src="{{ asset('js/select2.full.min.js') }}"></script>
<script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAP_API_KEY') }}&libraries=places,geometry,drawing&callback=initMap" defer></script>

<!-- Firebase SDK -->
<script src="{{ asset('js/firebase/firebase-app-compat.js')}}"></script>
<script src="{{ asset('js/firebase/firebase-firestore-compat.js')}}"></script>

<script>
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

  const defaultDistanceUnit = "{{$settings['ride']['distance_unit']}}";
  const findDriverTimeMin = "{{$settings['ride']['find_driver_time_limit']}}";
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Declare global variables
  let pickupLatLng = null;
  let destinationLatLng = null;
  let directionsService = null;
  let directionsRenderer = null;
  let map = null; // Declare map variable globally

  function toggleMapVisibility(showMap) {
    if (showMap) {
      $('#map').show();
      $('#map-placeholder').hide();
    } else {
      $('#map').hide();
      $('#map-placeholder').show();
    }
  }

  function updateRoute(callback) {
    console.log("updated route", pickupLatLng, destinationLatLng);
    // Reset distance input to avoid stale values
    $("#distance").val("");
    $("#distance-label").text(`0.00 ${defaultDistanceUnit}`);
    $("#duration").text("00");

    if (pickupLatLng && destinationLatLng && directionsService && directionsRenderer) {
      const request = {
        origin: pickupLatLng,
        destination: destinationLatLng,
        travelMode: 'DRIVING'
      };

      directionsService.route(request, function(result, status) {
        console.log(result, status, "OK_RESULT");
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
          const route = result.routes[0].legs[0];
          const distance = (route.distance.value / 1000).toFixed(2);
          const duration = route.duration.text;
          document.getElementById("distance-label").textContent = `${distance} ${defaultDistanceUnit}`;
          document.getElementById("duration").textContent = duration;

          $("#distance").val(distance);
          $("#duration").val(duration);
          $("#distance_type").val(defaultDistanceUnit);
          callback(distance);
        } else {
          console.error("Directions request failed:", status);
          $("#distance").val("");
          $('.vehicle-type-slider-box').empty().append(`<div class="data-not-found-box"><span>{{ __('taxido::front.rides.unable_distance_calculation') }}</span></div>`);
          callback(null); // Call callback with null to indicate failure
        }
      });
    } else {
      $('.vehicle-type-slider-box').empty().append(`<div class="data-not-found-box"><span>{{ __('taxido::front.rides.select_location_note') }}</span></div>`);
      callback(null); // Call callback with null to indicate failure
    }
  }

  window.initMap = function() {
    // Initially hide the map and show the placeholder until geolocation is confirmed
    toggleMapVisibility(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var userLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          // Initialize the map
          map = new google.maps.Map(document.getElementById("map"), {
            center: userLatLng,
            zoom: 15
          });

          // Show the map and hide the placeholder
          toggleMapVisibility(true);

          // Reverse geocode to get address
          $.ajax({
            url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + userLatLng.lat + "," + userLatLng.lng + "&key={{ env('GOOGLE_MAP_API_KEY') }}",
            type: "GET",
            success: function(response) {
              if (response.results && response.results?.length > 0) {
                $("#pickup-input").val(response.results[0]?.formatted_address);
                document.getElementById("pickup-lat").value = userLatLng.lat;
                document.getElementById("pickup-lng").value = userLatLng.lng;
                pickupLatLng = {
                  lat: userLatLng.lat,
                  lng: userLatLng.lng
                };
              } else {
                $("#pickup-input").val("");
              }
            },
            error: function() {
              console.error("Geocode request failed");
            }
          });

          // Add marker at user's location
          var marker = new google.maps.Marker({
            position: userLatLng,
            map: map,
            title: "You are here!"
          });

          directionsService = new google.maps.DirectionsService();
          directionsRenderer = new google.maps.DirectionsRenderer();
          directionsRenderer.setMap(map);

          const pickupInput = document.getElementById("pickup-input");
          const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput, {
            types: ['geocode']
          });

          const destinationInput = document.getElementById("destination-input");
          const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, {
            types: ['geocode']
          });

          pickupAutocomplete.addListener('place_changed', function() {
            const place = pickupAutocomplete.getPlace();
            if (place.geometry) {
              pickupLatLng = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              };
              document.getElementById("pickup-lat").value = pickupLatLng.lat;
              document.getElementById("pickup-lng").value = pickupLatLng.lng;
              updateRoute(function(distance) {
                if (distance) {
                  var serviceId = $('#service_id').val();
                  var serviceCategoryID = $('#service_category_id').val();
                  var serviceCategoryType = $('#service_category_id').find(':selected').data('cat-type');
                  if (serviceId && serviceCategoryID && pickupLatLng && destinationLatLng && (serviceCategoryType === 'package' || distance)) {
                    loadVehiclesSliderBox(serviceId, serviceCategoryID, pickupLatLng, destinationLatLng, serviceCategoryType);
                  }
                }
              });
            }
          });

          destinationAutocomplete.addListener('place_changed', function() {
            const place = destinationAutocomplete.getPlace();
            if (place.geometry) {
              destinationLatLng = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              };
              document.getElementById("destination-lat").value = destinationLatLng.lat;
              document.getElementById("destination-lng").value = destinationLatLng.lng;
              updateRoute(function(distance) {
                if (distance) {
                  var serviceId = $('#service_id').val();
                  var serviceCategoryID = $('#service_category_id').val();
                  var serviceCategoryType = $('#service_category_id').find(':selected').data('cat-type');
                  if (serviceId && serviceCategoryID && pickupLatLng && destinationLatLng && (serviceCategoryType === 'package' || distance)) {
                    loadVehiclesSliderBox(serviceId, serviceCategoryID, pickupLatLng, destinationLatLng, serviceCategoryType);
                  }
                }
              });
            }
          });
        },
        function(error) {
          console.error("Geolocation failed:", error.message);
          // Keep the placeholder visible and show an alert
          toggleMapVisibility(false);
          alert("{{ __('taxido::front.rides.location_permission_denied') }} Please allow location access to use the map.");
          $('#bookRideBtn').find('span[role="status"]').text('Book Ride');
          $('#book-ride-spinner').hide();
          $('#bookRideBtn').removeAttr('disabled');
        }
      );
    } else {
      // Geolocation not supported
      toggleMapVisibility(false);
      alert("{{ __('taxido::front.rides.geolocation_not_supported') }}");
      $('#bookRideBtn').find('span[role="status"]').text('Book Ride');
      $('#book-ride-spinner').hide();
      $('#bookRideBtn').removeAttr('disabled');
    }
  };

  function loadVehiclesSliderBox(serviceId, serviceCategoryID, pickUpLocation, destinationLatLng, serviceCategoryType) {
    let url = "{{ route('api.vehicle.location') }}";
    let destLat = $('#destination-lat').val();
    let destLng = $('#destination-lng').val();
    let distanceValue = $('#distance').val(); // Get distance from input
    let durationValue = $('#duration').val();

    $('.vehicle-type-slider-box')?.empty();
    $('.vehicle-detail-modals')?.empty();
    if (serviceId && serviceCategoryID && pickUpLocation && (serviceCategoryType === 'package' || (destLat && destLng && distanceValue))) {
      $('#vehicleTypeBoxSpinner').show();
      $.ajax({
        url: url,
        data: {
          service_id: serviceId,
          service_category_id: serviceCategoryID,
          locations: [pickUpLocation, destinationLatLng],
          distance: serviceCategoryType === 'package' ? null : distanceValue,
          duration: serviceCategoryType === 'package' ? null : durationValue,
          current_time: new Date().toLocaleTimeString('en-GB', { hour12: false })
        },
        type: "POST",
        success: function(data, status) {
          $('#vehicleTypeBoxSpinner').hide();
          let distUnit = 'KM';
          if (data && data.length > 0) {
            $.each(data, function(index, item) {
              
              $('#currency-code-input').val(item.currency_code);
              if(item?.charges?.distance_unit == 'mi') {
                distUnit = 'Miles';
              }
              document.getElementById("distance-label").textContent = `${item?.charges?.total_distance} ${distUnit}`;
              document.getElementById("duration").textContent = item?.charges?.duration;
              console.log("ITEM ==>", item);
              let remainBaseDistance = 0;
              if(item.charges.total_distance > item.charges.base_distance) {
                remainBaseDistance = (item.charges.total_distance - item.charges.base_distance)?.toFixed(2);
              }
              $('.vehicle-type-slider-box').append(`
                <div class="swiper-slide">
                    <div class="vehicles-box">
                        <input class="form-check-input" type="radio" name="vehicle_type_id"
                            id="vehicleTypeSliderBox-${item.id}" value="${item.id}">
                        <div class="vehicles-image">
                            <img src="${item.vehicle_image_url}" class="img-fluid" loading="lazy"/>
                        </div>
                        <div class="vehicles-name">
                            <h5>${item.name}</h5>
                            <h5 class="price">${item.currency_symbol}${item?.charges?.total}</h5>
                            <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#vehicleDetailModal-${item.id}">
                                info
                            </button>
                        </div>
                    </div>
                </div>
              `);
              $('.vehicle-detail-modals').append(`
                <div class="modal fade theme-modal vehicle-detail-modal" id="vehicleDetailModal-${item.id}" data-ride_id="">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-body">
                        <div class="cancel-ride-box">
                          <div class="vehicles-image">
                            <img src="${item.vehicle_image_url}" id="vehicle-image" class="img-fluid" loading="lazy"/>
                          </div>
                          <div class="vehicles-name">
                            <h5 id="vehicle-name">${item.name}</h5>
                          </div>
                          <ul class="vehicles-list">
                            <li>Base Fare Charge: <span>${item.currency_symbol} ${item?.charges?.base_fare_charge}</span></li>
                            <li><div>Additional Distance Charge: <span>(${remainBaseDistance} ${item?.charges?.distance_unit} X ${item.currency_symbol} ${item?.vehicle_type_zone?.per_distance_charge})</span></div><span>${item.currency_symbol} ${item?.charges?.additional_distance_charge}</span></li>
                            <li><div>Additional Minute Charge: <span>(${item?.charges?.duration} X ${item.currency_symbol}${item?.vehicle_type_zone?.per_minute_charge})</span></div> <span>${item.currency_symbol} ${item?.charges?.additional_minute_charge}</span></li>
                            <li>Platform Fee: <span>${item?.currency_symbol} ${item?.charges?.platform_fee}</span></li>
                            <li>Tax: <span>${item?.currency_symbol} ${item?.charges?.tax}</span></li>
                            <li>Commission: <span>${item?.currency_symbol} ${item?.charges?.commission}</span></li>
                            <li class="total-box">Total: <span>${item?.currency_symbol} ${item?.charges?.total}</span></li>
                          </ul>
                        </div>
                        <p class="waiting-text">Waiting Charges of <span>${item.currency_symbol} ${item?.vehicle_type_zone?.waiting_charge}</span> per minutes apply after the driver has been waiting for ${item?.vehicle_type_zone?.free_waiting_time_after_start_ride} minutes.</p>
                        <p class="cancel-text">Cancellation Charge <span>${item.currency_symbol} ${item?.vehicle_type_zone?.cancellation_charge_for_rider}</span>.</p>
                        <p>Maximum Seat: <span> ${item.max_seat}</span></p>
                        </div>
                      <div class="modal-footer">
                        <button type="button" class="btn gradient-bg-color w-100" data-bs-dismiss="modal" id="closeButton">{{ __('taxido::front.rides.close') }}</button>
                      </div>
                    </div>
                  </div>
                </div>
              `);
            });
          } else {
            $('.vehicle-type-slider-box').empty().append(`<div class="data-not-found-box"><span>{{ __('taxido::front.rides.no_vehicles_available') }}</span></div>`);
          }
        },
        error: function(xhr, status, error) {
          $('#vehicleTypeBoxSpinner').hide();
          $('.vehicle-type-slider-box').empty().append(`<div class="data-not-found-box"><span>${xhr.responseJSON?.message || 'Error loading vehicles'}</span></div>`);
        },
      });
    } else {
      $('#vehicleTypeBoxSpinner').hide();
      $('.vehicle-type-slider-box').empty().append(`<div class="data-not-found-box"><span>{{ __('taxido::front.rides.required_field_note') }}</span></div>`);
    }
  }

  $(document).ready(function() {
    const ambulanceId = <?php echo $ambulanceServiceId; ?>;
    const serviceCategoryContainer = $('.service-category-container');

    const optionFormat = (item) => {
      if (!item.id) {
        return item.text;
      }

      var span = document.createElement('span');
      var html = '';
      html += '<div class="selected-item">';
      html += '<img src="' + item.element.getAttribute('image') +
        '" class="img-fluid" alt="' + item.text + '"/>';
      html += '<div class="detail">';
      html += '<h6>' + item.text + '</h6>';
      html += '<p>' + item.element.getAttribute('sub-title') + '</p>';
      html += '</div>';
      html += '</div>';
      span.innerHTML = html;
      return $(span);
    };

    $('.select2-option').select2({
      placeholder: "Select an option",
      templateSelection: optionFormat,
      templateResult: optionFormat
    });

    $('.select-2').select2();
    $('#service_id').on('change', function() {
      $('#service_category_id').empty();
      $('#service_category_id').attr('disabled', 'disabled');
      var serviceId = $(this).val();
      if (serviceId != ambulanceId) {
        loadServiceCategories(serviceId);
        serviceCategoryContainer.show();
        $('#ambulance_div').hide();
      } else {
        $('#ambulance_div').show();
        serviceCategoryContainer.hide();
      }

      // Trigger updateRoute if locations are available
      var serviceCategoryID = $('#service_category_id').val();
      var serviceCategoryType = $('#service_category_id').find(':selected').data('cat-type');
      var pickUpLocation = {
        lat: $('#pickup-lat').val(),
        lng: $('#pickup-lng').val()
      };
      if (pickupLatLng && (serviceCategoryType === 'package' || destinationLatLng)) {
        updateRoute(function(distance) {
          if (serviceId && serviceCategoryID && pickUpLocation && (serviceCategoryType === 'package' || distance)) {
            loadVehiclesSliderBox(serviceId, serviceCategoryID, pickUpLocation, destinationLatLng, serviceCategoryType);
          }
        });
      }
    });

    function loadServiceCategories(serviceId) {
      let url = "{{ route('serviceCategory.index') }}";
      if (serviceId) {
        $.ajax({
          url: url + '?service_id=' + serviceId + '&type=web',
          type: "GET",
          success: function(data) {
            $('#service_category_id').empty();
            $('#service_category_id').append('<option value=""></option>');
            $.each(data.data, function(index, item) {
              $('#service_category_id').append('<option value="' + item.id + '" sub-title="(' + item.service_type + ')" image="' + item.service_category_image_url + '" data-cat-type="' + item.type + '">' + item.name + '</option>');
            });
            $('#service_category_id').removeAttr('disabled');
          },
          error: function(xhr, status, error) {
            console.log("Error status: " + status);
            console.log("Error response: " + xhr.responseText);
            console.log("Error code: " + error);
            $('#service_category_id').empty();
          },
        });
      } else {
        $('#service_category_id').empty();
        $('#service_category_id').append('<option value=""></option>');
      }
    }

    $('#service_category_id').on('change', function() {
      var serviceCategoryID = $(this).val();
      var serviceCategoryType = $(this).find(':selected').data('cat-type');
      if (serviceCategoryType == 'schedule') {
        $('#start-time-field').show();
      } else if (serviceCategoryType == 'package') {
        $('#destination-location-div').hide();
        $('#hourly-packages-list-container').show();
      } else {
        $('#start-time-field').hide();
        $('#hourly-packages-list-container').hide();
        $('#destination-location-div').show();
      }

      // Trigger updateRoute if locations are available (except for package category)
      var serviceId = $('#service_id').val();
      var pickUpLocation = {
        lat: $('#pickup-lat').val(),
        lng: $('#pickup-lng').val()
      };
      if (serviceCategoryType === 'package' && serviceId && serviceCategoryID && pickUpLocation) {
        loadVehiclesSliderBox(serviceId, serviceCategoryID, pickUpLocation, destinationLatLng, serviceCategoryType);
      } else if (pickupLatLng && destinationLatLng) {
        updateRoute(function(distance) {
          if (serviceId && serviceCategoryID && pickUpLocation && distance) {
            loadVehiclesSliderBox(serviceId, serviceCategoryID, pickUpLocation, destinationLatLng, serviceCategoryType);
          }
        });
      }
    });

    // Book Ride Request
    $('#bookRideBtn').on('click', function() {
      $('#book-ride-spinner').show();
      $('#bookRideBtn').attr('disabled', 'disabled');
      $(this).find('span[role="status"]').text('Booking...');
      const formData = {
        service_id: $('#service_id').val(),
        service_category_id: $('#service_category_id').val(),
        location_coordinates: [{
          lat: $('#pickup-lat').val(),
          lng: $('#pickup-lng').val(),
        }, {
          lat: $('#destination-lat').val(),
          lng: $('#destination-lng').val(),
        }],
        locations: [
          $('#pickup-input').val(),
          $('#destination-input').val(),
        ],
        currency_code: $('#currency-code-input').val() || null,
        start_time: $('#start_time').val() || null,
        hourly_package_id: $('#hourly_package_id').val() || null,
        vehicle_type_id: $('input[name="vehicle_type_id"]:checked').val(),
        note: $('textarea[name="description"]').val(),
        distance: $('#distance').val() || null,
        duration: $('#duration').text(),
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'pending',
      };

      // Validate required fields
      if (!formData.service_id || !formData.service_category_id || !formData.locations[0] || (!formData.hourly_package_id && !formData.locations[1])) {
        alert('Please fill in all required fields.');
        $('#bookRideBtn').find('span[role="status"]').text('Book Ride');
        $('#book-ride-spinner').hide();
        $('#bookRideBtn').removeAttr('disabled');
        return;
      }

      $.ajax({
        url: "{{ route('front.cab.ride-request.store') }}",
        type: "POST",
        data: {
          _token: "{{ csrf_token() }}",
          ride_data: formData
        },
        success: function(response) {
          if (response.success) {
            $('#findDriverModal').modal('show');
            $('#findDriverModal').data('ride_id', response.ride_id);
            $('#acceptRideModal').data('ride_id', response.ride_id);
            startPollingForDriverResponse(response.ride_id);
            startCountdown();
          } else {
            alert("{{ __('taxido::front.rides.field_ride_request') }}");
            $('#book-ride-spinner').hide();
            $('#bookRideBtn').find('span[role="status"]').text('Book Ride');
            $('#bookRideBtn').removeAttr('disabled');
          }
        },
        error: function(xhr, error) {
          alert(JSON.parse(xhr.responseText)?.message);
          $('#book-ride-spinner').hide();
          $('#bookRideBtn').find('span[role="status"]').text('Book Ride');
          $('#bookRideBtn').removeAttr('disabled');
        }
      });
    });

    function startPollingForDriverResponse(rideReqId) {
      const instantRef = db.collection('ride_requests').doc(rideReqId.toString()).collection('instantRide').doc(rideReqId.toString());
      const unsubscribe = instantRef.onSnapshot((doc) => {
        if (doc.exists) {
          const instantData = doc.data();
          const rideStatus = instantData.status;
          const ride_id = instantData.ride_id;
          if (rideStatus === 'accepted') {
            unsubscribe();
            $('#findDriverModal').modal('hide');
            if (instantData?.ride_id != 'undefined') {
              $('#findDriverModal').one('hidden.bs.modal', function() {
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open');
                $('#bookRideSuccessModal').modal('show');
                setTimeout(() => {
                  window.location.href = "{{ route('front.cab.ride.show', ['ride_id' => ':ride_id']) }}".replace(':ride_id', ride_id);
                }, 6000);
              });
            }
          } else if (rideStatus === 'rejected' || rideStatus === 'cancelled') {
            unsubscribe();
            $('#findDriverModal').modal('hide');
            console.log("REJECTED OR cancelled", rideStatus);
            $('#book-ride-spinner').hide();
            $('#bookRideBtn').find('span[role="status"]').text('Book Ride');
            $('#bookRideBtn').removeAttr('disabled');
          }
        } else {
          unsubscribe();
          $('#findDriverModal').modal('hide');
          $('#book-ride-spinner').hide();
          $('#bookRideBtn').find('span[role="status"]').text('Book Ride');
          $('#bookRideBtn').removeAttr('disabled');
        }
      }, (error) => {
        $('#findDriverModal').modal('hide');
        $('#book-ride-spinner').hide();
        $('#bookRideBtn').find('span[role="status"]').text('Book Ride');
        $('#bookRideBtn').removeAttr('disabled');
      });

      $('#findDriverModal').data('unsubscribe', unsubscribe);
    }

   function startCountdown(minutesCount = 3) {
    let timeLeft = minutesCount * 60; // convert minutes to seconds
    const countdownElement = $('#countdown');

    const timerInterval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;

      countdownElement.text(
        `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
      );

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        cancelRide();
      }

      timeLeft--;
    }, 1000);

    $('#findDriverModal').data('timerInterval', timerInterval);
  }

    function cancelRide(cancelMessage = null) {
      const rideId = $('#findDriverModal').data('ride_id').toString();
      const unsubscribe = $('#findDriverModal').data('unsubscribe');
      const timerInterval = $('#findDriverModal').data('timerInterval');

      if (timerInterval) {
        clearInterval(timerInterval);
        $('#findDriverModal').data('timerInterval', null);
        $('#countdown').text("");
      }

      if (unsubscribe) {
        unsubscribe();
      }

      if (rideId) {
        const instantRef = db.collection('ride_requests').doc(rideId).collection('instantRide').doc(rideId);
        instantRef.get()
          .then((doc) => {
            if (doc.exists) {
              const instantData = doc.data();
              const eligibleDriverIds = instantData.eligible_driver_ids || [];
              const deleteDriverPromises = eligibleDriverIds.map(driverId => {
                return db.collection('driver_ride_requests').doc(driverId.toString()).delete()
                  .catch(error => {
                    console.error(`Error deleting driver_ride_request for driver ${driverId}:`, error);
                  });
              });
              return Promise.all(deleteDriverPromises);
            } else {
              console.warn("instant document does not exist for rideId:", rideId);
              return Promise.resolve();
            }
          })
          .then(() => {
            return db.collection('ride_requests').doc(rideId).collection('instantRide').doc(rideId).delete();
          })
          .then(() => {
            return db.collection('ride_requests').doc(rideId).delete();
          })
          .then(() => {
            $('#findDriverModal').modal('hide');
            toastr.error(cancelMessage ?? "{{ __('taxido::front.rides.driver_not_found') }}");
            $('#book-ride-spinner').hide();
            $('#bookRideBtn').find('span[role="status"]').text('Book Ride');
            $('#bookRideBtn').removeAttr('disabled');
          })
          .catch((error) => {
            console.error("Error during cleanup process:", error);
            $('#findDriverModal').modal('hide');
            toastr.error('Failed to delete ride request.');
            $('#book-ride-spinner').hide();
            $('#bookRideBtn').find('span[role="status"]').text('Book Ride');
            $('#bookRideBtn').removeAttr('disabled');
          });
      } else {
        $('#findDriverModal').modal('hide');
        toastr.error("{{ __('taxido::front.rides.driver_not_found') }}");
        $('#book-ride-spinner').hide();
        $('#bookRideBtn').find('span[role="status"]').text('Book Ride');
        $('#bookRideBtn').removeAttr('disabled');
      }
    }

    $('#cancelRideBtn').on('click', function() {
      cancelRide('Ride cancelled successfully.');
    });

    $('.alert-dismissible .close').on('click', function() {
      $(this).closest('.alert-dismissible').fadeOut('slow', function() {
        $(this).remove();
      });
    });
  });
</script>
@endpush
