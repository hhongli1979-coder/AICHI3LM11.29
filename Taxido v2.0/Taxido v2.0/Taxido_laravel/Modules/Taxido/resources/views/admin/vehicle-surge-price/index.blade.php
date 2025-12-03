@extends('admin.layouts.master')
@section('title', __('taxido::static.surge_prices.vehicle_surge_price'))
@section('content')
    <div class="row g-xl-4 g-3">
        <div class="col-xl-8">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ __('taxido::static.surge_prices.vehicle_surge_price') }} @isset($vehicleName)
                            <span class="text-primary">({{ Str::title($vehicleName) }})</span>
                        @endisset</h3>

                        <button type="button" class="btn btn-calculate" data-bs-toggle="modal"
                            data-bs-target="#fareCalculationModal">
                            <i class="ri-information-line"></i>
                            {{ __('taxido::static.surge_prices.how_is_this_calculated') }}
                        </button>
                    </div>

                    <div id="success-message" class="alert alert-success d-none"></div>
                    <div id="error-message" class="alert alert-danger d-none"></div>
                    <div class="accordion fare-accordion" id="surgePriceAccordion">
                        @foreach ($zones as $zone)
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="heading-{{ $zone->id }}">
                                    <button class="accordion-button collapsed justify-start" type="button"
                                        data-bs-toggle="collapse" data-bs-target="#collapse-{{ $zone->id }}"
                                        data-zone-id="{{ $zone->id }}" data-zone-name="{{ $zone->name }}"
                                        data-currency-symbol="{{ $zone->currency?->symbol ?? getDefaultCurrency()?->symbol }}"
                                        data-currency-code="{{ $zone->currency?->code ?? getDefaultCurrency()?->code }}"
                                        data-distance-type="{{ $zone->distance_type }}"
                                        data-vehicle-type-id="{{ $vehicleTypeId }}">
                                        {{ $zone->name }} ({{ $zone->currency?->code ?? getDefaultCurrency()?->code }} -
                                        {{ ucfirst($zone->distance_type) }})
                                    </button>
                                </h2>
                                <div id="collapse-{{ $zone->id }}" class="accordion-collapse collapse"
                                    data-bs-parent="#surgePriceAccordion">
                                    <div class="accordion-body">
                                        <form class="surge-price-form" data-zone-id="{{ $zone->id }}">
                                            @csrf
                                            <input type="hidden" name="zone_id" value="{{ $zone->id }}">
                                            <input type="hidden" name="vehicle_type_id" value="{{ $vehicleTypeId }}">

                                            @php
                                                // Fetch surge prices for this zone and vehicle type
                                                $zoneSurgePrices = $vehicleSurgePrices->where('zone_id', $zone->id);
                                            @endphp

                                            @foreach ($surgePrices as $surgePrice)
                                                @php
                                                    $existingPrice = $zoneSurgePrices
                                                        ->where('surge_price_id', $surgePrice->id)
                                                        ->first();
                                                @endphp
                                                <div class="form-group row">
                                                    <div class="col-12">
                                                        <h5 class="timer-price"> <span>{{ $surgePrice->day }}
                                                                ({{ $surgePrice->start_time }} -
                                                                {{ $surgePrice->end_time }})
                                                            </span></h5>
                                                    </div>
                                                    <input type="hidden"
                                                        name="surge_prices[{{ $surgePrice->id }}][surge_price_id]"
                                                        value="{{ $surgePrice->id }}">
                                                    <input type="hidden" name="surge_prices[{{ $surgePrice->id }}][id]"
                                                        class="price-id" value="{{ $existingPrice->id ?? '' }}"
                                                        data-surge-price-id="{{ $surgePrice->id }}">
                                                    <div class="col-12">
                                                        <div class="form-group row">
                                                            <label for="amount-{{ $surgePrice->id }}"
                                                                class="col-md-2">{{ __('taxido::static.surge_prices.amount') }}</label>
                                                            <div class="col-md-10">
                                                                <div class="input-group">
                                                                    <span
                                                                        class="input-group-text currency-symbol">{{ $zone->currency?->symbol ?? getDefaultCurrency()?->symbol }}</span>
                                                                    <input type="number" class="form-control amount-field"
                                                                        id="amount-{{ $surgePrice->id }}"
                                                                        name="surge_prices[{{ $surgePrice->id }}][amount]"
                                                                        step="0.01"
                                                                        value="{{ $existingPrice->amount ?? '' }}" required
                                                                        placeholder="Enter amount">
                                                                    <span class="invalid-feedback d-none"
                                                                        id="amount-{{ $surgePrice->id }}-error"></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            @endforeach
                                            <button type="button" class="btn ms-auto btn-primary save-surge-price-btn"
                                                @if (!$vehicleTypeId) disabled title="Save the vehicle type first to set surge prices" @endif>{{ __('taxido::static.surge_prices.save_surge_prices') }}</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-4">
            <div class="p-sticky">
                <div class="contentbox">
                    <div class="inside">
                        <div class="contentbox-title">
                            <h3>{{ __('taxido::static.surge_prices.publish') }}</h3>
                        </div>
                        <div class="vehicle-detail-box">
                            <div class="cancel-ride-box">
                                <div class="vehicles-image">
                                    <img src="{{ $vehicleType?->vehicle_image?->original_url }}" id="vehicle-image" class="img-fluid"
                                        loading="lazy">
                                </div>
                                <div class="vehicles-name">
                                    <h5 id="vehicle-name">{{ $vehicleType?->name }}</h5>
                                </div>
                                <ul class="vehicles-list" data-zone-id="{{ $zones->first()->id }}">
                                    <li>{{ __('taxido::static.surge_prices.base_fare_charge') }}: <span><span
                                                class="currency-symbol">{{ $zones->first()->currency?->symbol ?? getDefaultCurrency()?->symbol }}</span>101.38</span>
                                    </li>
                                    <li>
                                        <div>{{ __('taxido::static.surge_prices.additional_distance_charge') }}:
                                            <span>(5.2Km X $8.3)</span>
                                        </div><span><span
                                                class="currency-symbol">{{ $zones->first()->currency?->symbol ?? getDefaultCurrency()?->symbol }}</span>
                                            42.90</span>
                                    </li>
                                    <li>
                                        <div>{{ __('taxido::static.surge_prices.additional_minute_charge') }}: <span>(5.2Km
                                                X $8.3)</span></div> <span><span
                                                class="currency-symbol">{{ $zones->first()->currency?->symbol ?? getDefaultCurrency()?->symbol }}</span>
                                            12.50</span>
                                    </li>
                                    <li>{{ __('taxido::static.surge_prices.platform_fee') }}: <span><span
                                                class="currency-symbol">{{ $zones->first()->currency?->symbol ?? getDefaultCurrency()?->symbol }}</span>
                                            10.00</span></li>
                                    <li>{{ __('taxido::static.surge_prices.tax') }}: <span class="danger"><span
                                                class="currency-symbol">{{ $zones->first()->currency?->symbol ?? getDefaultCurrency()?->symbol }}</span>
                                            5.98</span></li>
                                    <li>{{ __('taxido::static.surge_prices.commission') }}: <span><span
                                                class="currency-symbol">{{ $zones->first()->currency?->symbol ?? getDefaultCurrency()?->symbol }}</span>
                                            10.00</span></li>
                                    <li class="total-box">{{ __('taxido::static.surge_prices.total') }}: <span><span
                                                class="currency-symbol">{{ $zones->first()->currency?->symbol ?? getDefaultCurrency()?->symbol }}</span>
                                            101.38</span></li>
                                </ul>
                            </div>
                            <p class="waiting-text">{{ __('taxido::static.surge_prices.waiting_charges') }} <span><span
                                        class="currency-symbol">{{ $zones->first()->currency?->symbol ?? getDefaultCurrency()?->symbol }}</span>
                                    1</span> per minutes apply after the driver has been waiting for 2 minutes.</p>
                            <p class="cancel-text">{{ __('taxido::static.surge_prices.cancellation_charge') }} <span><span
                                        class="currency-symbol">{{ $zones->first()->currency?->symbol ?? getDefaultCurrency()?->symbol }}</span>
                                    10</span>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for Detailed Fare Calculation Instructions -->
    <div class="modal fade fare-calculation-modal fare-content-calculation" id="fareCalculationModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="fareCalculationModalLabel">
                        {{ __('taxido::static.surge_prices.surge_price_calculation') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal">
                        <i class="ri-close-line"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div>
                        <p>The surge price is applied dynamically based on:</p>
                        <ul class="vehicle-listing">
                            <li><strong>Zone</strong> – e.g., Manhattan, London</li>
                            <li><strong>Time Range</strong> – e.g., Thursday (15:00 - 04:00)</li>
                            <li><strong>Distance or Duration Unit</strong> – e.g., INR per Km or USD per Mile</li>
                        </ul>
                        <p class="vehicle-example">
                            If a ride occurs within the surge time range in a specific zone, the configured surge amount is
                            added per unit.<br>
                            <span>
                                <strong>Example:</strong><br>
                                Base Fare = ₹50<br>
                                Distance = 5 Km<br>
                                Price per Km = ₹10<br>
                                Surge = ₹2 (per Km)<br>
                                <strong>Total Fare = Base Fare + (Distance × (Price per Km + Surge)) = ₹50 + (5 × (10 + 2)) = ₹110</strong>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        $(document).ready(function() {
            if ($('.accordion-item').length > 0) {
                const firstZone = $('.accordion-item').first();
                const firstZoneId = firstZone.find('.accordion-button').data('zone-id');
                firstZone.find('.accordion-collapse').addClass('show');
                firstZone.find('.accordion-button').removeClass('collapsed');

                $('.zone-details').addClass('d-none');
                $(`.zone-details[data-zone-id="${firstZoneId}"]`).removeClass('d-none');
            }

            $('.accordion-button').on('click', function() {
                const zoneId = $(this).data('zone-id');
                const currencySymbol = $(this).data('currency-symbol');
                const currencyCode = $(this).data('currency-code');

                $('.vehicles-list .currency-symbol').text(currencySymbol);

                $('.zone-details').addClass('d-none');
                $(`.zone-details[data-zone-id="${zoneId}"]`).removeClass('d-none');

                $(`.zone-details[data-zone-id="${zoneId}"] .currency-symbol`).text(currencySymbol);
            });

            $('.surge-price-form').each(function() {
                $(this).validate({
                    ignore: [],
                    rules: {
                        'surge_prices[*][amount]': {
                            required: true,
                            number: true,
                            min: 0,
                            max: 100
                        }
                    },
                    errorPlacement: function(error, element) {
                        const errorId = element.attr('id') + '-error';
                        $('#' + errorId).text(error.text()).removeClass('d-none');
                    }
                });
            });

            $('.save-surge-price-btn').on('click', function() {
                const $button = $(this);
                const $form = $button.closest('.surge-price-form');
                $('.invalid-feedback', $form).addClass('d-none');

                if (!$form.valid()) {
                    return;
                }

                $button.html('<span class="spinner-border spinner-border-sm"></span> Saving...');
                $button.prop('disabled', true);

                const formData = $form.serializeArray();
                const data = {
                    vehicle_type_id: $form.find('input[name="vehicle_type_id"]').val(),
                    zone_id: $form.find('input[name="zone_id"]').val(),
                    surge_prices: []
                };

                formData.forEach(function(item) {
                    if (item.name.includes('surge_prices')) {
                        const matches = item.name.match(/surge_prices\[(\d+)\]\[(\w+)\]/);
                        if (matches) {
                            const surgePriceId = matches[1];
                            const field = matches[2];
                            let surgePrice = data.surge_prices.find(sp => sp.surge_price_id ===
                                surgePriceId);
                            if (!surgePrice) {
                                surgePrice = {
                                    surge_price_id: surgePriceId
                                };
                                data.surge_prices.push(surgePrice);
                            }
                            surgePrice[field] = item.value;
                        }
                    }
                });

                $.ajax({
                    url: "{{ url('admin/vehicle-surge-prices') }}",
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        'Accept': 'application/json'
                    },
                    data: data,
                    dataType: 'json',
                    success: function(response) {
                        $button.html('Save Surge Prices');
                        $button.prop('disabled', false);
                        toastr.success('Surge prices saved successfully!');
                    },
                    error: function(xhr) {
                        $button.html('Save Surge Prices');
                        $button.prop('disabled', false);
                        if (xhr.status === 422) {
                            showErrors(xhr.responseJSON.errors, $form);
                        } else {
                            toastr.error(xhr.responseJSON?.message ||
                                'Error saving surge price data.');
                        }
                    }
                });
            });

            function showErrors(errors, $form) {
                $.each(errors, function(field, messages) {
                    const errorId = field.replace(/\./g, '-') + '-error';
                    const $errorElement = $('#' + errorId, $form);
                    if ($errorElement.length) {
                        $errorElement.text(messages[0]).removeClass('d-none');
                    } else {
                        toastr.error(messages[0]);
                    }
                });
            }
        });
    </script>
@endpush
