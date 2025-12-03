@extends('admin.layouts.master')
@section('title', 'Vehicle Type Zones')
@push('css')
    <link rel="stylesheet" type="text/css" href="{{ asset('css/vendors/swiper-slider.css') }}">
@endpush

@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>
                        Vehicle Type Zones
                        @isset($vehicleName)
                            <span class="text-primary">({{ Str::title($vehicleName) }})</span>
                        @endisset
                    </h3>
                    <button type="button" class="btn btn-calculate ms-auto" data-bs-toggle="modal"
                        data-bs-target="#fareCalculationModal">
                        <i class="ri-information-line"></i> Calculated
                    </button>
                </div>
            </div>

            <div class="vehicle-type-zone-table">
                <div class="table-main">
                    <div id="success-message" class="alert alert-success d-none"></div>
                    <div id="error-message" class="alert alert-danger d-none"></div>
                    <div class="table-responsive custom-scrollbar">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Zone Name</th>
                                    <th>Currency Code</th>
                                    <th>Distance Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($zones as $zone)
                                    <tr>
                                        <td>{{ $zone->name }}</td>
                                        <td>{{ $zone->currency?->code ?? getDefaultCurrency()?->code }}</td>
                                        <td>{{ ucfirst($zone->distance_type) }}</td>
                                        <td>
                                            <button type="button" class="btn btn-primary set-price-btn"
                                                data-zone-id="{{ $zone->id }}" data-zone-name="{{ $zone->name }}"
                                                data-currency-symbol="{{ $zone->currency?->symbol ?? getDefaultCurrency()?->symbol }}"
                                                data-distance-type="{{ $zone->distance_type }}"
                                                data-vehicle-type-id="{{ $vehicleTypeId }}"
                                                @if (!$vehicleTypeId) disabled title="Save the vehicle type first to set zone prices" @endif>
                                                <span class="spinner-border spinner-border-sm d-none"></span>
                                                Set Price
                                            </button>
                                            <button type="button" class="btn btn-success ms-2 add-incentive-btn"
                                                data-zone-id="{{ $zone->id }}" data-zone-name="{{ $zone->name }}"
                                                data-incentive-currency-symbol="{{ $zone->currency?->symbol ?? getDefaultCurrency()?->symbol }}"
                                                data-vehicle-type-id="{{ $vehicleTypeId }}"
                                                @if (!$vehicleTypeId) disabled title="Save the vehicle type first to set incentives" @endif>
                                                <span class="spinner-border spinner-border-sm d-none"></span>
                                                Add Incentive
                                            </button>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        @use('App\Models\Tax')
        @use('Modules\Taxido\Models\Airport')
        @use('Modules\Taxido\Models\VehicleType')
        @use('Modules\Taxido\Models\Preference')
        @use('Modules\Taxido\Enums\ServicesEnum')
        @php
            $taxes = Tax::where('status', true)->get(['id', 'name']);
            $airports = Airport::where('status', true)->get(['id', 'name']);
            $vehicleType = VehicleType::find($vehicleTypeId);
            $preferences = Preference::where('status', true)->get(['id', 'name']);
        @endphp

        <!-- Price Modal -->
        <div class="modal fade set-price-modal" data-bs-backdrop="static" data-bs-keyboard="false" id="priceModal">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Set Price for <span id="zoneName"></span></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="priceForm" action="{{ route('admin.vehicle-type-zones.store') }}" method="POST">
                            @csrf
                            @method('POST')
                            <input type="hidden" name="zone_id" id="zoneId">
                            <input type="hidden" name="vehicle_type_id" id="vehicleTypeId">

                            <div class="row g-sm-4 g-3">
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="base_fare_charge" class="form-label">Base Fare
                                            Charge<span>*</span></label>
                                        <div class="input-group">
                                            <span
                                                class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                            <input type="number" class="form-control" id="base_fare_charge"
                                                name="base_fare_charge" step="0.01" required
                                                placeholder="Enter base fare charge">
                                            <span class="invalid-feedback d-none" id="base_fare_charge_error"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="base_distance" class="form-label">Base Distance (<i
                                                id="distanceUnit">Km</i>)<span>*</span></label>
                                        <input type="number" class="form-control" id="base_distance" name="base_distance"
                                            step="0.01" required placeholder="Enter base distance">
                                        <span class="invalid-feedback d-none" id="base_distance_error"></span>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="per_distance_charge" class="form-label">Per Distance Charge (<i
                                                id="distanceUnitPrice">Km</i>)<span>*</span></label>
                                        <div class="input-group">
                                            <span
                                                class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                            <input type="number" class="form-control" id="per_distance_charge"
                                                name="per_distance_charge" step="0.01" required
                                                placeholder="Enter per distance charge">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="per_minute_charge" class="form-label">Per Minute
                                            Charge<span>*</span></label>
                                        <div class="input-group">
                                            <span
                                                class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                            <input type="number" class="form-control" id="per_minute_charge"
                                                name="per_minute_charge" step="0.01" required
                                                placeholder="Enter per minute charge">
                                        </div>
                                    </div>
                                </div>
                                @if (in_array($vehicleType->services?->type, [ServicesEnum::FREIGHT, ServicesEnum::PARCEL]))
                                    <div class="col-xl-4 col-lg-6">
                                        <div class="form-group m-0">
                                            <label for="per_weight_charge" class="form-label">Per Weight Charge</label>
                                            <div class="input-group">
                                                <span
                                                    class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                                <input type="number" class="form-control" id="per_weight_charge"
                                                    name="per_weight_charge" step="0.01"
                                                    placeholder="Enter per weight charge">
                                            </div>
                                        </div>
                                    </div>
                                @endif
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="waiting_charge" class="form-label">Waiting Charge</label>
                                        <div class="input-group">
                                            <span
                                                class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                            <input type="number" class="form-control" id="waiting_charge"
                                                name="waiting_charge" step="0.01" placeholder="Enter waiting charge">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="free_waiting_time_before_start_ride" class="form-label">Free Wait
                                            Time</label>
                                        <input type="number" class="form-control"
                                            id="free_waiting_time_before_start_ride"
                                            name="free_waiting_time_before_start_ride" step="0.0.1"
                                            placeholder="Enter free waiting time before start">
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="free_waiting_time_after_start_ride" class="form-label">Free Wait Time
                                            After Start Ride</label>
                                        <input type="number" class="form-control"
                                            id="free_waiting_time_after_start_ride"
                                            name="free_waiting_time_after_start_ride" step="0.0.1"
                                            placeholder="Enter free waiting time after start">
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group">
                                        <label for="cancellation_charge_for_rider" class="form-label">Cancellation Charge
                                            for Rider</label>
                                        <div class="input-group">
                                            <span
                                                class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                            <input type="number" class="form-control" id="cancellation_charge_for_rider"
                                                name="cancellation_charge_for_rider" step="0.01"
                                                placeholder="Enter rider cancellation charge">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="cancellation_charge_for_driver" class="form-label">Cancellation Charge
                                            for Driver</label>
                                        <div class="input-group">
                                            <span
                                                class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                            <input type="number" class="form-control"
                                                id="cancellation_charge_for_driver" name="cancellation_charge_for_driver"
                                                step="0.01" placeholder="Enter driver cancellation charge">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="commission_type" class="form-label">Commission
                                            Type<span>*</span></label>
                                        <select class="form-select" id="commission_type" name="commission_type" required>
                                            <option value="fixed">Fixed</option>
                                            <option value="percentage">Percentage</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0" id="commission_rate_field">
                                        <label for="commission_rate" class="form-label">Commission
                                            Rate<span>*</span></label>
                                        <div class="input-group" id="commission_input_group">
                                            <span class="input-group-text currency-symbol"
                                                id="currencyIcon">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                            <input type="number" class="form-control" id="commission_rate"
                                                name="commission_rate" step="0.01" required
                                                placeholder="Enter commission rate">
                                            <span class="input-group-text d-none" id="percentageIcon">%</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="charge_goes_to" class="form-label">Charge Goes To</label>
                                        <select class="form-select" id="charge_goes_to" name="charge_goes_to" required>
                                            <option value="admin">Admin</option>
                                            <option value="driver">Driver</option>
                                            <option value="fleet">Company</option>
                                        </select>
                                        <span class="invalid-feedback d-none" id="charge_goes_to_error"></span>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="is_allow_tax" class="form-label">Allow Tax</label>
                                        <div class="editor-space">
                                            <label class="switch">
                                                <input type="hidden" name="is_allow_tax" value="0">
                                                <input class="form-check-input" id="is_allow_tax" type="checkbox"
                                                    name="is_allow_tax" value="1">
                                                <span class="switch-state"></span>
                                            </label>
                                        </div>
                                        <span class="invalid-feedback d-none" id="is_allow_tax_error"></span>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6 d-none" id="tax_selection_field">
                                    <div class="form-group m-0">
                                        <label for="tax_id" class="form-label">Tax</label>
                                        <div class="flex-reverse">
                                            <select class="form-select select-2" id="tax_id" name="tax_id"
                                                data-placeholder="Select Tax">
                                                <option value="">Select Tax</option>
                                                @foreach ($taxes as $tax)
                                                    <option value="{{ $tax->id }}">{{ $tax->name }}</option>
                                                @endforeach
                                            </select>
                                            <span class="invalid-feedback d-none" id="tax_id_error"></span>
                                        </div>
                                        <span class="text-gray mt-1">
                                            No tax message
                                            <a href="{{ @route('admin.tax.index') }}" class="text-primary">
                                                <b>here</b>
                                            </a>
                                        </span>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="is_allow_airport_charge" class="form-label">Allow Airport
                                            Charge</label>
                                        <div class="editor-space">
                                            <input type="hidden" name="is_allow_airport_charge" value="0">
                                            <input class="checkbox_animated" id="is_allow_airport_charge" type="checkbox"
                                                name="is_allow_airport_charge" value="1">
                                        </div>
                                        <span class="invalid-feedback d-none" id="is_allow_airport_charge_error"></span>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-6 d-none" id="airport_selection_field">
                                    <div class="form-group m-0">
                                        <label for="airport_charge_rate" class="form-label">Airport Charge Rate</label>
                                        <div class="input-group" id="airport_charge_rate_div">
                                            <input type="number" class="form-control" id="airport_charge_rate"
                                                name="airport_charge_rate" step="0.01" required
                                                placeholder="Enter Airport Charge rate">
                                            <span class="input-group-text d-none" id="percentageIcon">%</span>
                                        </div>
                                        <span class="invalid-feedback d-none" id="airport_id_error"></span>
                                    </div>
                                </div>

                                <!-- Allow Preference -->
                                <div class="col-xl-4 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="is_allow_preference" class="form-label">Allow Preference</label>
                                        <div class="editor-space">
                                            <label class="switch">
                                                <input type="hidden" name="is_allow_preference" value="0">
                                                <input class="form-check-input" id="is_allow_preference" type="checkbox"
                                                    name="is_allow_preference" value="1">
                                                <span class="switch-state"></span>
                                            </label>
                                        </div>
                                        <span class="invalid-feedback d-none" id="is_allow_preference_error"></span>
                                    </div>
                                </div>
                                <div class="col-12" id="preferences-section" style="display: none;">
                                    <div id="preference-list" class="mb-3">
                                        <!-- Preferences will be loaded here -->
                                    </div>
                                    <div class="row g-sm-4 g-3 mb-3" id="add-preference-form">
                                        <div class="col-xl-4 col-lg-6">
                                            <div class="form-group m-0">
                                                <label for="preference_id" class="form-label">Select Preference</label>
                                                <select class="form-select" id="preference_id_new">
                                                    <option value="">Select Preference</option>
                                                    @foreach ($preferences as $preference)
                                                        <option value="{{ $preference->id }}">{{ $preference->name }}
                                                        </option>
                                                    @endforeach
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-xl-4 col-lg-6">
                                            <div class="form-group m-0">
                                                <label for="preference_price" class="form-label">Preference Price</label>
                                                <div class="input-group">
                                                    <span
                                                        class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                                    <input type="number" class="form-control" id="preference_price_new"
                                                        step="0.01" placeholder="Enter preference price">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xl-4 col-lg-6">
                                            <div class="form-group m-0">
                                                <button type="button" class="btn btn-sm btn-primary"
                                                    id="add-preference-btn">Add Preference</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" name="id" id="priceId">
                            <div class="footer">
                                <button type="button" class="btn cancel" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-solid" id="savePriceBtn">Save Prices</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Incentive Configuration Modal -->
        <div class="modal fade incentive-modal" data-bs-backdrop="static" data-bs-keyboard="false" id="incentiveModal">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Configure Incentives for <span id="incentiveZoneName"></span></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="incentiveForm">
                            @csrf
                            <input type="hidden" name="zone_id" id="incentiveZoneId">
                            <input type="hidden" name="vehicle_type_id" id="incentiveVehicleTypeId">

                            <div class="row g-sm-4 g-3 mb-4">
                                <div class="col-xl-6 col-lg-6">
                                    <div class="form-group m-0">
                                        <label for="period_type" class="form-label">Incentive Period<span>*</span></label>
                                        <select class="form-select" id="period_type" name="period_type" required>
                                            <option value="">Select Period Type</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                        <span class="invalid-feedback d-none" id="period_type_error"></span>
                                    </div>
                                </div>
                                <div class="col-xl-6 col-lg-6">
                                    <div class="form-group m-0">
                                        <label class="form-label">Currency</label>
                                        <div class="input-group">
                                            <span
                                                class="input-group-text incentive-currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                            <input type="text" class="form-control"
                                                value="Currency will be applied to all levels" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="incentive-levels-container">
                                <h6 class="mb-3">Incentive Levels (Up to 5 levels)</h6>
                                <div id="incentive-levels">
                                    <!-- Dynamic incentive levels will be added here -->
                                </div>
                                <button type="button" class="btn btn-outline-primary btn-sm" id="add-level-btn">
                                    <i class="ri-add-line"></i> Add Level
                                </button>
                            </div>

                            <div class="footer mt-4">
                                <button type="button" class="btn cancel" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-solid" id="saveIncentiveBtn">Save
                                    Incentives</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Detailed Fare Calculation Instructions -->
        <div class="modal fade fare-calculation-modal" id="fareCalculationModal">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="fareCalculationModalLabel">
                            Fare Calculation Instructions
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal">
                            <i class="ri-close-line"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="swiper face-calculation-slider theme-pagination">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide">
                                    <h5 class="modal-title">Key Fields and Usage</h5>
                                    <div class="table-responsive">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Field</th>
                                                    <th>Description</th>
                                                    <th>Where Used</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><code>base_fare_charge</code></td>
                                                    <td>Initial fixed amount charged at the start of the ride (₹20)</td>
                                                    <td>Apply to cab, freight, and parcel service</td>
                                                </tr>
                                                <tr>
                                                    <td><code>base_distance</code></td>
                                                    <td>Initial distance included in the base fare charge (2 km)</td>
                                                    <td>Apply to cab, freight, and parcel service</td>
                                                </tr>
                                                <tr>
                                                    <td><code>per_distance_charge</code></td>
                                                    <td>Additional cost per kilometer beyond base distance (₹5/km)</td>
                                                    <td>Apply to cancel service</td>
                                                </tr>
                                                <tr>
                                                    <td><code>per_minute_charge</code></td>
                                                    <td>Additional cost based on ride duration (₹0.5/min)</td>
                                                    <td>Apply to cab and freight service</td>
                                                </tr>
                                                <tr>
                                                    <td><code>waiting_charge</code></td>
                                                    <td>Cost charged for each minute the driver waits (₹1), applicable after
                                                        free waiting time</td>
                                                    <td>Apply to cab and freight service</td>
                                                </tr>
                                                <tr>
                                                    <td><code>free_waiting_time_before_start</code></td>
                                                    <td>Initial waiting period before ride starts (2 minutes) with no charge
                                                    </td>
                                                    <td>Apply to cab and freight service</td>
                                                </tr>
                                                <tr>
                                                    <td><code>free_waiting_time_after_start</code></td>
                                                    <td>Additional waiting period after ride begins (not specified) with no
                                                        charge</td>
                                                    <td>Apply to cab and freight service</td>
                                                </tr>
                                                <tr>
                                                    <td><code>cancellation_charge_rider</code></td>
                                                    <td>Fee charged to rider for cancellation (₹10)</td>
                                                    <td>Apply to cancel service</td>
                                                </tr>
                                                <tr>
                                                    <td><code>cancellation_charge_driver</code></td>
                                                    <td>Fee charged to driver for cancellation (₹15)</td>
                                                    <td>Apply to cancel service</td>
                                                </tr>
                                                <tr>
                                                    <td><code>commission_type</code></td>
                                                    <td>Method of commission applied to ride fare (Fixed)</td>
                                                    <td>Apply to all services</td>
                                                </tr>
                                                <tr>
                                                    <td><code>commission_rate</code></td>
                                                    <td>Fixed commission amount taken from ride fare ($10)</td>
                                                    <td>Apply to all services</td>
                                                </tr>
                                                <tr>
                                                    <td><code>charge_goes_to</code></td>
                                                    <td>Recipient of the commission (Rider)</td>
                                                    <td>Apply to all services</td>
                                                </tr>
                                                <tr>
                                                    <td><code>allow_tax</code></td>
                                                    <td>Toggle to include tax in fare calculation (enabled)</td>
                                                    <td>Apply to all services</td>
                                                </tr>
                                                <tr>
                                                    <td><code>tax</code></td>
                                                    <td>Tax rate or amount to be applied if allowed (not specified)</td>
                                                    <td>Apply to all services</td>
                                                </tr>
                                                <tr>
                                                    <td><code>allow_airport_charge</code></td>
                                                    <td>Toggle to include airport surcharge in fare (enabled)</td>
                                                    <td>Apply to cab service</td>
                                                </tr>
                                                <tr>
                                                    <td><code>airport_charge_rate</code></td>
                                                    <td>Additional charge for rides involving an airport (₹2)</td>
                                                    <td>Apply to cab service</td>
                                                </tr>
                                                <tr>
                                                    <td><code>per_weight_charge</code></td>
                                                    <td>Additional cost based on weight (not specified)</td>
                                                    <td>Apply to freight and parcel service</td>
                                                </tr>
                                                <tr>
                                                    <td><code>allow_preference</code></td>
                                                    <td>Toggle to include preferences with additional charges (enabled)</td>
                                                    <td>Apply to all services</td>
                                                </tr>
                                                <tr>
                                                    <td><code>preference_price</code></td>
                                                    <td>Additional charge for selected preferences (e.g., ₹50 for luggage)
                                                    </td>
                                                    <td>Apply to all services when allow_preference is enabled</td>
                                                </tr>
                                                <tr>
                                                    <td><code>allow_incentive</code></td>
                                                    <td>Toggle to enable driver incentives based on ride targets (enabled)
                                                    </td>
                                                    <td>Apply to all services</td>
                                                </tr>
                                                <tr>
                                                    <td><code>incentive_period</code></td>
                                                    <td>Period for ride target calculation (Daily or Weekly)</td>
                                                    <td>Apply to all services when allow_incentive is enabled</td>
                                                </tr>
                                                <tr>
                                                    <td><code>incentive_target_rides</code></td>
                                                    <td>Minimum number of rides to qualify for incentive (e.g., 10 rides)
                                                    </td>
                                                    <td>Apply to all services when allow_incentive is enabled</td>
                                                </tr>
                                                <tr>
                                                    <td><code>incentive_amount</code></td>
                                                    <td>Amount awarded to driver for meeting ride target (e.g., ₹500)</td>
                                                    <td>Apply to all services when allow_incentive is enabled</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="slider-bottom-box">
                                <div class="swiper-button-prev">
                                    <i class="ri-arrow-left-s-line"></i>
                                </div>
                                <div class="swiper-button-next">
                                    <i class="ri-arrow-right-s-line"></i>
                                </div>
                            </div>
                            <div class="swiper-pagination"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('scripts')
    <!-- Swiper JS -->
    <script src="{{ asset('js/swiper-slider/swiper.js') }}"></script>
    <script src="{{ asset('js/swiper-slider/custom-slider.js') }}"></script>

    <script>
        $(document).ready(function() {
            const $priceModal = $('#priceModal');
            const $priceForm = $('#priceForm');
            const $successMessage = $('#success-message');
            const $errorMessage = $('#error-message');
            const $saveButton = $('#savePriceBtn');
            const $closeButton = $priceModal.find('.btn-close');
            const $taxSelectionField = $('#tax_selection_field');
            const $taxIdSelect = $('#tax_id');
            const $isAllowTax = $('#is_allow_tax');
            const $isAllowAirportCharge = $('#is_allow_airport_charge');
            const $airportSelectionField = $('#airport_selection_field');
            const $isAllowPreference = $('#is_allow_preference');
            const $preferencesSection = $('#preferences-section');
            const $preferenceList = $('#preference-list');
            const $addPreferenceForm = $('#add-preference-form');
            const $addPreferenceBtn = $('#add-preference-btn');
            const $preferenceSelect = $('#preference_id_new');
            const $preferencePrice = $('#preference_price_new');

            let availablePreferences = @json($preferences);
            let selectedPreferences = [];

            // Handle preference toggle
            $isAllowPreference.on('change', function() {
                const isPreferenceEnabled = $(this).is(':checked');
                $preferencesSection.toggle(isPreferenceEnabled);
                $addPreferenceForm.toggleClass('d-none', !isPreferenceEnabled);
                $addPreferenceBtn.toggleClass('d-none', !isPreferenceEnabled);

                if (!isPreferenceEnabled) {
                    $addPreferenceForm.addClass('d-none');
                    selectedPreferences = [];
                    renderPreferences();
                }
                toggleAddPreferenceButton();
            });



            // Handle add preference button click
            $addPreferenceBtn.on('click', function() {
                const preferenceId = $preferenceSelect.val();
                const price = $preferencePrice.val();

                if (!preferenceId || !price || price <= 0) {
                    toastr.warning('Please select a preference and enter a valid price.');
                    return;
                }

                const preference = availablePreferences.find(p => p.id == preferenceId);
                if (preference && !selectedPreferences.some(p => p.id == preferenceId)) {
                    selectedPreferences.push({
                        id: preference.id,
                        name: preference.name,
                        price: parseFloat(price)
                    });
                    renderPreferences();
                    $preferenceSelect.val('');
                    $preferencePrice.val('');
                    updatePreferenceDropdown();
                    toggleAddPreferenceButton();
                }
            });

            // Update preference dropdown to exclude selected preferences
            function updatePreferenceDropdown() {
                $preferenceSelect.empty();
                $preferenceSelect.append('<option value="">Select Preference</option>');
                const available = availablePreferences.filter(p => !selectedPreferences.some(sp => sp.id == p.id));
                available.forEach(pref => {
                    $preferenceSelect.append(`<option value="${pref.id}">${pref.name}</option>`);
                });
            }

            // Render selected preferences with remove buttons
            function renderPreferences() {
                $preferenceList.empty();
                const currencySymbol = $('.currency-symbol').first().text();
                selectedPreferences.forEach((pref, index) => {
                    $preferenceList.append(`
                        <div class="row g-sm-4 g-3 mb-2 preference-item" data-index="${index}">
                            <div class="col-xl-4 col-lg-6">
                                <div class="form-group m-0">
                                    <label class="form-label">Preference</label>
                                    <input type="hidden" name="preferences[${index}][id]" value="${pref.id}">
                                    <input type="text" class="form-control" value="${pref.name}" readonly>
                                </div>
                            </div>
                            <div class="col-xl-4 col-lg-6">
                                <div class="form-group m-0">
                                    <label class="form-label">Preference Price</label>
                                    <div class="input-group">
                                        <span class="input-group-text currency-symbol">${currencySymbol}</span>
                                        <input type="number" class="form-control" name="preferences[${index}][price]" value="${pref.price}" step="0.01" required>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-4 col-lg-6">
                                <div class="form-group m-0">
                                    <button type="button" class="btn btn-sm btn-danger remove-preference" data-index="${index}">Remove</button>
                                </div>
                            </div>
                        </div>
                    `);
                });
                bindRemovePreferenceButtons();
            }

            // Bind remove preference buttons
            function bindRemovePreferenceButtons() {
                $('.remove-preference').off('click').on('click', function() {
                    const index = $(this).data('index');
                    selectedPreferences.splice(index, 1);
                    renderPreferences();
                    updatePreferenceDropdown();
                    toggleAddPreferenceButton();
                });
            }

            // Toggle visibility of Add Preference button based on available preferences
            function toggleAddPreferenceButton() {
                if (availablePreferences.length === selectedPreferences.length) {
                    $addPreferenceForm.addClass('d-none');
                } else {
                    $addPreferenceForm.removeClass('d-none');
                }
            }

            // Initialize form validation
            $('#priceForm').validate({
                ignore: [],
                rules: {
                    "base_fare_charge": {
                        required: true,
                        min: 0
                    },
                    "base_distance": {
                        required: true,
                        min: 0
                    },
                    "per_distance_charge": {
                        required: true,
                        min: 0
                    },
                    "per_minute_charge": {
                        required: true,
                        min: 0
                    },
                    "per_weight_charge": {
                        min: 0
                    },
                    "waiting_charge": {
                        min: 0
                    },
                    "free_waiting_time_before_start_ride": {
                        min: 0
                    },
                    "free_waiting_time_after_start_ride": {
                        min: 0
                    },
                    "cancellation_charge_for_rider": {
                        min: 0
                    },
                    "cancellation_charge_for_driver": {
                        min: 0
                    },
                    "commission_type": "required",
                    "commission_rate": {
                        required: true,
                        number: true,
                        min: 0
                    },
                    "charge_goes_to": "required",
                    "tax_id": {
                        required: function() {
                            return $isAllowTax.is(':checked');
                        }
                    },
                    "airport_charge_rate": {
                        required: function() {
                            return $isAllowAirportCharge.is(':checked');
                        },
                        min: 0,
                        max: 3
                    },

                    "preferences[][price]": {
                        required: true,
                        min: 0
                    }
                },
                messages: {
                    "tax_id": {
                        required: "Please select a tax"
                    },
                    "airport_charge_rate": {
                        required: "Please enter airport charge rate"
                    },

                    "preferences[][price]": {
                        required: "Please enter a preference price",
                        min: "Preference price must be at least 0"
                    }
                },
                errorPlacement: function(error, element) {
                    if (element.parent('.input-group').length) {
                        error.insertAfter(element.parent());
                    } else {
                        error.insertAfter(element);
                    }
                }
            });

            // Handle commission type change
            $('#commission_type').on('change', function() {
                const commissionType = $(this).val();
                const $currencyIcon = $('#currencyIcon');
                const $percentageIcon = $('#percentageIcon');
                if (commissionType === 'percentage') {
                    $currencyIcon.addClass('d-none');
                    $percentageIcon.removeClass('d-none');
                } else {
                    $currencyIcon.removeClass('d-none');
                    $percentageIcon.addClass('d-none');
                }
            });

            // Handle Set Price button click
            $('.set-price-btn').on('click', function() {
                const $button = $(this);
                const $spinner = $button.find('.spinner-border');
                const zoneId = $button.data('zone-id');
                const zoneName = $button.data('zone-name');
                const distanceType = $button.data('distance-type');
                const vehicleTypeId = $button.data('vehicle-type-id');
                const currencySymbol = $button.data('currency-symbol');

                if (!vehicleTypeId) {
                    toastr.warning('Please save the vehicle type first to set zone prices.');
                    return;
                }

                $spinner.removeClass('d-none');
                $button.prop('disabled', true);
                let url = "{{ url('admin/vehicle-type-zones') }}";

                $.ajax({
                    url: url + `/${vehicleTypeId}/${zoneId}`,
                    method: 'GET',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        'Accept': 'application/json'
                    },
                    success: function(data) {
                        $spinner.addClass('d-none');
                        $button.prop('disabled', false);
                        $('#zoneName').text(zoneName);
                        $('#zoneId').val(zoneId);
                        $('#vehicleTypeId').val(vehicleTypeId);
                        $('#distanceUnit').text(distanceType === 'mile' ? 'Mile' : 'Km');
                        $('#distanceUnitPrice').text(distanceType === 'mile' ? 'Mile' : 'Km');
                        $('.currency-symbol').text(currencySymbol);

                        $priceForm[0]?.reset();
                        $('.invalid-feedback').addClass('d-none');
                        selectedPreferences = [];
                        if (data?.vehicleTypeZone) {
                            $('#priceId').val(data.vehicleTypeZone.id);
                            $('#base_fare_charge').val(data.vehicleTypeZone.base_fare_charge);
                            $('#base_distance').val(data.vehicleTypeZone.base_distance);
                            $('#per_distance_charge').val(data.vehicleTypeZone
                                .per_distance_charge);
                            $('#per_minute_charge').val(data.vehicleTypeZone.per_minute_charge);
                            $('#per_weight_charge').val(data.vehicleTypeZone
                                .per_weight_charge || '');
                            $('#waiting_charge').val(data.vehicleTypeZone.waiting_charge || '');
                            $('#free_waiting_time_before_start_ride').val(data.vehicleTypeZone
                                .free_waiting_time_before_start_ride || '');
                            $('#free_waiting_time_after_start_ride').val(data.vehicleTypeZone
                                .free_waiting_time_after_start_ride || '');
                            $('#is_allow_tax').prop('checked', data.vehicleTypeZone
                                .is_allow_tax);
                            $('#tax_id').val(data.vehicleTypeZone.tax_id || '').trigger(
                                'change');
                            $('#is_allow_airport_charge').prop('checked', data.vehicleTypeZone
                                .is_allow_airport_charge);
                            $('#airport_charge_rate').val(data.vehicleTypeZone
                                .airport_charge_rate || '');
                            $('#cancellation_charge_for_rider').val(data.vehicleTypeZone
                                .cancellation_charge_for_rider || '');
                            $('#cancellation_charge_for_driver').val(data.vehicleTypeZone
                                .cancellation_charge_for_driver || '');
                            $('#charge_goes_to').val(data.vehicleTypeZone.charge_goes_to);
                            $('#commission_type').val(data.vehicleTypeZone.commission_type);
                            $('#commission_rate').val(data.vehicleTypeZone.commission_rate);
                            $('#is_allow_preference').prop('checked', data.vehicleTypeZone
                                .is_allow_preference);


                            // Load preferences
                            if (data.vehicleTypeZone.preferences) {
                                selectedPreferences = data.vehicleTypeZone.preferences.map(
                                    pref => ({
                                        id: pref.id,
                                        name: pref.name,
                                        price: pref.pivot.price
                                    }));
                                renderPreferences();
                                updatePreferenceDropdown();
                            }

                            // Show/hide preferences section
                            $preferencesSection.toggle(data.vehicleTypeZone
                            .is_allow_preference);
                            $addPreferenceForm.toggleClass('d-none', !data.vehicleTypeZone
                                .is_allow_preference);

                            // Show/hide tax field based on checkbox
                            $taxSelectionField.toggleClass('d-none', !data.vehicleTypeZone
                                .is_allow_tax);
                            if (data.vehicleTypeZone.is_allow_tax) {
                                $taxIdSelect.attr('required', 'required');
                            } else {
                                $taxIdSelect.removeAttr('required');
                            }

                            // Show/hide airport field based on checkbox
                            $airportSelectionField.toggleClass('d-none', !data.vehicleTypeZone
                                .is_allow_airport_charge);
                            if (data.vehicleTypeZone.is_allow_airport_charge) {
                                $('#airport_charge_rate').attr('required', 'required');
                            } else {
                                $('#airport_charge_rate').removeAttr('required');
                            }



                            $('#commission_type').trigger('change');
                        } else {
                            $('#priceId').val('');
                            $('#is_allow_tax').prop('checked', false);
                            $('#is_allow_airport_charge').prop('checked', false);
                            $('#is_allow_preference').prop('checked', false);

                            $taxSelectionField.addClass('d-none');
                            $airportSelectionField.addClass('d-none');

                            $preferencesSection.hide();
                            $addPreferenceForm.addClass('d-none');
                            $taxIdSelect.removeAttr('required');
                            $('#airport_charge_rate').removeAttr('required');

                            $('#commission_type').trigger('change');
                            selectedPreferences = [];
                            renderPreferences();
                            updatePreferenceDropdown();
                        }

                        $('#commission_rate_field').show();
                        $priceModal.modal('show');
                        toggleAddPreferenceButton();
                    },
                    error: function(xhr) {
                        $spinner.addClass('d-none');
                        $button.prop('disabled', false);
                        toastr.error(xhr.responseJSON?.message || 'Error fetching price data.');
                    }
                });
            });

            $saveButton.on('click', function() {
                $('.invalid-feedback').addClass('d-none');
                if (!$priceForm.valid()) {
                    return;
                }

                $saveButton.html(
                '<span class="spinner-border spinner-border-sm spinner"></span> Saving...');
                $saveButton.prop('disabled', true);
                $closeButton.prop('disabled', true);

                const priceId = $('#priceId').val();
                const url = priceId ? "{{ url('/admin/vehicle-type-zones') }}/" + priceId :
                    "{{ url('/admin/vehicle-type-zones') }}";
                const method = priceId ? 'PUT' : 'POST';

                $.ajax({
                    url: url,
                    method: method,
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        'Accept': 'application/json'
                    },
                    data: $priceForm.serialize(),
                    dataType: 'json',
                    success: function(data) {
                        $saveButton.html('Save Prices');
                        $saveButton.prop('disabled', false);
                        $closeButton.prop('disabled', false);
                        if (data.success) {
                            toastr.success('Price saved successfully');
                            $priceModal.modal('hide');
                            // location.reload();
                        } else {
                            showErrors(data.errors);
                        }
                    },
                    error: function(xhr) {
                        $saveButton.html('Save Prices');
                        $saveButton.prop('disabled', false);
                        $closeButton.prop('disabled', false);
                        if (xhr.status === 422) {
                            showErrors(xhr.responseJSON.errors);
                        } else {
                            toastr.error(xhr.responseJSON?.message ||
                                'Error saving price data.');
                        }
                    }
                });
            });

            function showErrors(errors) {
                $.each(errors, function(field, messages) {
                    const $errorElement = $(`#${field}_error`);
                    if ($errorElement.length) {
                        $errorElement.text(messages[0]).removeClass('d-none');
                    }
                });
            }

            // Incentive Modal Functionality
            const $incentiveModal = $('#incentiveModal');
            const $incentiveForm = $('#incentiveForm');
            const $saveIncentiveButton = $('#saveIncentiveBtn');
            const $incentiveCloseButton = $incentiveModal.find('.btn-close');
            let incentiveLevelCount = 0;
            const maxLevels = 5;

            // Handle Add Incentive button click
            $('.add-incentive-btn').on('click', function() {
                const $button = $(this);
                const $spinner = $button.find('.spinner-border');
                const zoneId = $button.data('zone-id');
                const zoneName = $button.data('zone-name');
                const vehicleTypeId = $button.data('vehicle-type-id');
                const currencySymbol = $button.data('incentive-currency-symbol');

                console.log("INCENTIVE Currency Symbol", currencySymbol)

                if (!vehicleTypeId) {
                    toastr.error('Please save the vehicle type first to set incentives.');
                    return;
                }

                // Show spinner
                $spinner.removeClass('d-none');
                $button.prop('disabled', true);

                // Set modal data
                $('#incentiveZoneName').text(zoneName);
                $('#incentiveZoneId').val(zoneId);
                $('#incentiveVehicleTypeId').val(vehicleTypeId);
                $('.incentive-currency-symbol').text(currencySymbol);

                // Load existing incentive data
                loadIncentiveData(vehicleTypeId, zoneId, function() {
                    $spinner.addClass('d-none');
                    $button.prop('disabled', false);
                    $incentiveModal.modal('show');
                });
            });

            function loadIncentiveData(vehicleTypeId, zoneId, callback) {
                $.ajax({
                    url: "{{ url('/admin/vehicle-type-zones/incentive-data') }}",
                    method: 'GET',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        'Accept': 'application/json'
                    },
                    data: {
                        vehicle_type_id: vehicleTypeId,
                        zone_id: zoneId
                    },
                    success: function(response) {
                        // Reset form
                        resetIncentiveForm();

                        if (response.success && response.data) {
                            // Load daily levels if they exist
                            if (response.data.daily_levels && response.data.daily_levels.length > 0) {
                                $('#period_type').val('daily');
                                response.data.daily_levels.forEach(function(level) {
                                    addIncentiveLevel(level.level_number, level.target_rides,
                                        level.incentive_amount, level.id);
                                });
                            }
                            // Load weekly levels if they exist and no daily levels
                            else if (response.data.weekly_levels && response.data.weekly_levels.length >
                                0) {
                                $('#period_type').val('weekly');
                                response.data.weekly_levels.forEach(function(level) {
                                    addIncentiveLevel(level.level_number, level.target_rides,
                                        level.incentive_amount, level.id);
                                });
                            }
                        }

                        if (callback) callback();
                    },
                    error: function(xhr) {
                        toastr.error(xhr.responseJSON?.message || 'Error loading incentive data.');
                        if (callback) callback();
                    }
                });
            }

            function resetIncentiveForm() {
                $('#period_type').val('');
                $('#incentive-levels').empty();
                incentiveLevelCount = 0;
                $('.invalid-feedback').addClass('d-none');
            }

            function addIncentiveLevel(levelNumber = null, targetRides = '', incentiveAmount = '', levelId = '') {
                if (incentiveLevelCount >= maxLevels) {
                    toastr.warning('Maximum 5 levels allowed.');
                    return;
                }

                incentiveLevelCount++;
                const actualLevelNumber = levelNumber || incentiveLevelCount;

                const levelHtml = `
                    <div class="incentive-level-item border rounded p-3 mb-3" data-level="${actualLevelNumber}">
                        <input type="hidden" name="levels[${actualLevelNumber}][id]" value="${levelId}">
                        <input type="hidden" name="levels[${actualLevelNumber}][level_number]" value="${actualLevelNumber}">
                        <div class="row g-3">
                            <div class="col-md-1">
                                <div class="form-group m-0">
                                    <label class="form-label">Level - ${actualLevelNumber}</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group m-0">
                                    <label class="form-label">Target Rides<span>*</span></label>
                                    <input type="number" class="form-control target-rides-input"
                                           name="levels[${actualLevelNumber}][target_rides]"
                                           value="${targetRides}"
                                           min="1" step="1" required
                                           placeholder="Enter target rides">
                                    <span class="invalid-feedback d-none" id="target_rides_${actualLevelNumber}_error"></span>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group m-0">
                                    <label class="form-label">Incentive Amount<span>*</span></label>
                                    <div class="input-group">
                                        <span class="input-group-text incentive-currency-symbol">${ $('.add-incentive-btn')?.data('incentive-currency-symbol')}</span>
                                        <input type="number" class="form-control"
                                               name="levels[${actualLevelNumber}][incentive_amount]"
                                               value="${incentiveAmount}"
                                               min="0.01" step="0.01" required
                                               placeholder="Enter amount">
                                    </div>
                                    <span class="invalid-feedback d-none" id="incentive_amount_${actualLevelNumber}_error"></span>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group m-0">
                                    <label class="form-label">&nbsp;</label>
                                    <div>
                                        <button type="button" class="btn btn-danger btn-sm remove-level-btn">
                                            <i class="ri-delete-bin-line"></i> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                $('#incentive-levels').append(levelHtml);
                updateAddLevelButton();
                validateProgressiveTargets();
            }

            // Add level button click
            $('#add-level-btn').on('click', function() {
                addIncentiveLevel();
            });

            // Remove level button click
            $(document).on('click', '.remove-level-btn', function() {
                $(this).closest('.incentive-level-item').remove();
                incentiveLevelCount--;
                updateAddLevelButton();
                reorderLevels();
                validateProgressiveTargets();
            });

            function updateAddLevelButton() {
                const $addBtn = $('#add-level-btn');
                if (incentiveLevelCount >= maxLevels) {
                    $addBtn.hide();
                } else {
                    $addBtn.show();
                }
            }

            function reorderLevels() {
                let newCount = 0;
                $('#incentive-levels .incentive-level-item').each(function() {
                    newCount++;
                    $(this).attr('data-level', newCount);
                    $(this).find('.badge').text(newCount);
                    $(this).find('input[name*="[level_number]"]').val(newCount);

                    // Update input names
                    $(this).find('input, select').each(function() {
                        const name = $(this).attr('name');
                        if (name && name.includes('levels[')) {
                            const newName = name.replace(/levels\[\d+\]/, `levels[${newCount}]`);
                            $(this).attr('name', newName);
                        }
                    });
                });
                incentiveLevelCount = newCount;
            }

            // Real-time validation for progressive targets
            $(document).on('input', '.target-rides-input', function() {
                validateProgressiveTargets();
            });

            function validateProgressiveTargets() {
                let isValid = true;
                const levels = [];

                $('#incentive-levels .incentive-level-item').each(function() {
                    const levelNumber = parseInt($(this).attr('data-level'));
                    const targetRides = parseInt($(this).find('.target-rides-input').val()) || 0;
                    levels.push({
                        level: levelNumber,
                        target: targetRides,
                        element: $(this)
                    });
                });

                // Sort by level number
                levels.sort((a, b) => a.level - b.level);

                // Validate progressive targets
                for (let i = 0; i < levels.length; i++) {
                    const current = levels[i];
                    const $errorElement = current.element.find(`#target_rides_${current.level}_error`);

                    if (i > 0) {
                        const previous = levels[i - 1];
                        if (current.target <= previous.target) {
                            $errorElement.text(
                                `Target rides must be greater than Level ${previous.level} (${previous.target} rides)`
                                ).removeClass('d-none');
                            isValid = false;
                        } else {
                            $errorElement.addClass('d-none');
                        }
                    } else {
                        $errorElement.addClass('d-none');
                    }
                }

                return isValid;
            }

            // Save incentive configuration
            $saveIncentiveButton.on('click', function() {
                $('.invalid-feedback').addClass('d-none');

                // Validate form
                let isValid = true;

                // Check period type
                if (!$('#period_type').val()) {
                    $('#period_type_error').text('Please select a period type.').removeClass('d-none');
                    isValid = false;
                }

                // Check if at least one level exists
                if (incentiveLevelCount === 0) {
                    toastr.error('Please add at least one incentive level.');
                    isValid = false;
                }

                // Validate progressive targets
                if (!validateProgressiveTargets()) {
                    isValid = false;
                }

                // Validate required fields
                $('#incentive-levels input[required]').each(function() {
                    if (!$(this).val()) {
                        const fieldName = $(this).attr('name');
                        const levelMatch = fieldName.match(/levels\[(\d+)\]\[(\w+)\]/);
                        if (levelMatch) {
                            const level = levelMatch[1];
                            const field = levelMatch[2];
                            $(`#${field}_${level}_error`).text('This field is required.')
                                .removeClass('d-none');
                        }
                        isValid = false;
                    }
                });

                if (!isValid) {
                    return;
                }

                // Show spinner and disable buttons
                $saveIncentiveButton.html(
                    '<span class="spinner-border spinner-border-sm spinner"></span> Saving...');
                $saveIncentiveButton.prop('disabled', true);
                $incentiveCloseButton.prop('disabled', true);

                $.ajax({
                    url: "{{ url('/admin/vehicle-type-zones/save-incentive-configuration') }}",
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        'Accept': 'application/json'
                    },
                    data: $incentiveForm.serialize(),
                    dataType: 'json',
                    success: function(data) {
                        $saveIncentiveButton.html('Save Incentives');
                        $saveIncentiveButton.prop('disabled', false);
                        $incentiveCloseButton.prop('disabled', false);

                        if (data.success) {
                            toastr.success('Incentive configuration saved successfully!');
                            $incentiveModal.modal('hide');
                        } else {
                            showIncentiveErrors(data.errors);
                        }
                    },
                    error: function(xhr) {
                        $saveIncentiveButton.html('Save Incentives');
                        $saveIncentiveButton.prop('disabled', false);
                        $incentiveCloseButton.prop('disabled', false);

                        if (xhr.status === 422) {
                            showIncentiveErrors(xhr.responseJSON.errors);
                        } else {
                            toastr.error(xhr.responseJSON?.message ||
                                'Error saving incentive configuration.');
                        }
                    }
                });
            });

            function showIncentiveErrors(errors) {
                $.each(errors, function(field, messages) {
                    let $errorElement;

                    // Handle nested field names like levels.1.target_rides
                    if (field.includes('levels.')) {
                        const parts = field.split('.');
                        if (parts.length === 3) {
                            const level = parts[1];
                            const fieldName = parts[2];
                            $errorElement = $(`#${fieldName}_${level}_error`);
                        }
                    } else {
                        $errorElement = $(`#${field}_error`);
                    }

                    if ($errorElement && $errorElement.length) {
                        rrorElement.text(messages[0]).removeClass('d-none');
                    }
                });
            }
        });
    </script>
@endpush
