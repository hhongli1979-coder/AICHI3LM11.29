@use('Modules\Taxido\Models\Zone')
@use('Modules\Taxido\Models\Rider')
@use('Modules\Taxido\Models\Service')
@use('Modules\Taxido\Models\VehicleType')
@use('Modules\Taxido\Models\ServiceCategory')
@php
    $zones = Zone::where('status', true)?->get(['id', 'name']);
    $riders = Rider::where('status', true)?->get(['id', 'name']);
    $services = Service::where('status', true)?->get(['id', 'name']);
    $vehicleTypes = VehicleType::where('status', true)?->get(['id', 'name']);
    $serviceCategories = ServiceCategory::where('status', true)?->get(['id', 'name']);
@endphp
<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">

                    <div class="contentbox-title">
                        <h3>{{ isset($coupon) ? __('taxido::static.coupons.edit_coupon') : __('taxido::static.coupons.add_coupon') }}
                            ({{ request('locale', app()->getLocale()) }})
                        </h3>
                    </div>

                    <ul class="nav nav-tabs horizontal-tab custom-scroll" id="couponTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <a class="nav-link active" id="general-tab" data-bs-toggle="tab" href="#general"
                                type="button" role="tab" aria-controls="general" aria-selected="true">
                                <i class="ri-settings-line"></i>
                                {{ __('taxido::static.coupons.general') }}
                                <i class="ri-error-warning-line danger errorIcon"></i>
                            </a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="restriction-tab" data-bs-toggle="tab" href="#restriction"
                                type="button" role="tab" aria-controls="restriction" aria-selected="true">
                                <i class="ri-spam-2-line"></i>
                                {{ __('taxido::static.coupons.restriction') }}
                                <i class="ri-error-warning-line danger errorIcon"></i>
                            </a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="usage-tab" data-bs-toggle="tab" href="#usage" role="tab"
                                type="button" aria-controls="usage" aria-selected="true">
                                <i class="ri-pie-chart-line"></i>
                                {{ __('taxido::static.coupons.usage') }}
                                <i class="ri-error-warning-line danger errorIcon"></i>
                            </a>
                        </li>
                    </ul>
                    @isset($coupon)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('taxido::static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route('admin.coupon.edit', ['coupon' => $coupon->id, 'locale' => $lang->locale]) }}"
                                            class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                            target="_blank"><img
                                            src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                            alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                            class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route('admin.coupon.edit', ['coupon' => $coupon->id, 'locale' => Session::get('locale', 'en')]) }}"
                                            class="language-switcher active" target="blank"><img
                                            src="{{ asset('admin/images/flags/LR.png') }}" alt="">English<i
                                            class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @endforelse
                                </ul>
                            </div>
                        </div>
                    @endisset
                    <input type="hidden" name="locale" value="{{ request('locale') }}">
                    <div class="tab-content" id="couponTabContent">
                        <div class="tab-pane fade {{ session('active_tab') != null ? '' : 'show active' }}"
                            id="general" role="tabpanel" aria-labelledby="general-tab">

                            <div class="form-group row">
                                <label class="col-md-2" for="title">{{ __('taxido::static.coupons.title') }}<span>
                                        *</span></label>
                                <div class="col-md-10">
                                    <div class="position-relative">
                                        <input class="form-control" type="text" name="title" id="title" required
                                            value="{{ isset($coupon->title) ? $coupon->getTranslation('title', request('locale', app()->getLocale())) : old('title') }}"
                                            placeholder="{{ __('taxido::static.coupons.enter_title') }} ({{ request('locale', app()->getLocale()) }})"><i
                                            class="ri-file-copy-line copy-icon" data-target="#title"></i>
                                    </div>
                                    @error('title')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="description">{{ __('taxido::static.coupons.description') }}</label>
                                <div class="col-md-10">
                                    <div class="position-relative">
                                        <textarea class="form-control" rows="2" id="description" name="description"
                                            placeholder="{{ __('taxido::static.coupons.enter_description') }} ({{ request('locale', app()->getLocale()) }})"
                                            cols="80">{{ isset($coupon->description) ? $coupon->getTranslation('description', request('locale', app()->getLocale())) : old('description') }}</textarea><i class="ri-file-copy-line copy-icon"
                                            data-target="#description"></i>
                                    </div>
                                    @error('description')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2" for="code">{{ __('taxido::static.coupons.code') }}<span>
                                        *</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text" name="code" required
                                        value="{{ isset($coupon->code) ? $coupon->code : old('code') }}"
                                        placeholder="{{ __('taxido::static.coupons.enter_code') }}">
                                    @error('code')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2" for="type">{{ __('taxido::static.coupons.type') }}<span>
                                        *</span></label>
                                <div class="col-md-10 select-label-error">
                                    <select class="select-2 form-control" id="type" name="type" required
                                        data-placeholder="{{ __('taxido::static.coupons.select_type') }}">
                                        <option class="select-placeholder" value=""></option>
                                        @foreach (['fixed' => 'Fixed', 'percentage' => 'Percentage'] as $key => $option)
                                            <option class="option" value="{{ $key }}"
                                                @if (old('type', $coupon->type ?? '') == $key) selected @endif>{{ $option }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('type')
                                        <div class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </div>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row amount-input" id="amountField"
                                style="{{ ($coupon->type ?? 'percentage') == 'percentage' ? '' : 'display:none;' }}">
                                <label class="col-md-2"
                                    for="amount">{{ __('taxido::static.coupons.amount') }}<span> *</span></label>
                                <div class="col-md-10 select-label-error amount">
                                    <div class="input-group">
                                        <span class="input-group-text currency" id="currencyIcon"
                                            style="display: none">{{ getDefaultCurrency()?->symbol }}</span>
                                        <input class="form-control" type="number" name="amount"
                                            value="{{ isset($coupon->amount) ? $coupon->amount : old('amount') }}"
                                            placeholder="{{ __('taxido::static.coupons.enter_amount') }}" required>
                                        <span class="input-group-text percent" id="percentageIcon" style="display: none;"><i
                                                class="ri-percent-line"></i></span>
                                    </div>
                                    @error('amount')
                                        <div class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </div>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2" for="is_expired">{{ __('taxido::static.coupons.is_expired') }}</label>
                                <div class="col-md-10">
                                    <div class="editor-space">
                                        <label class="switch">
                                            @if (isset($coupon))
                                                <input class="form-control" type="hidden" name="is_expired" value="0">
                                                <input class="form-check-input" id="is_expired" type="checkbox" name="is_expired" value="1"
                                                    {{ $coupon->is_expired ? 'checked' : '' }}>
                                            @else
                                                <input class="form-control" type="hidden" name="is_expired" value="0">
                                                <input class="form-check-input" id="is_expired" type="checkbox" name="is_expired" value="1">
                                            @endif
                                            <span class="switch-state"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group row flatpicker-calender select-date" style="display: none">
                                <label class="col-md-2" for="start_end_date">{{ __('Select Date') }} <span class="required-span">*</span></label>
                                <div class="col-md-10">
                                    @if (isset($coupon) && $coupon->start_date && $coupon->end_date)
                                        <input class="form-control" id="date-range" 
                                            value="{{ \Carbon\Carbon::parse($coupon->start_date)->format('m/d/Y') }} to {{ \Carbon\Carbon::parse($coupon->end_date)->format('m/d/Y') }}"
                                            name="start_end_date" placeholder="Select Date.." required>
                                    @else
                                        <input class="form-control" id="date-range" name="start_end_date" placeholder="Select Date.." required>
                                    @endif
                                    @error('start_end_date')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="status">{{ __('taxido::static.coupons.status') }}</label>
                                <div class="col-md-10 error-div">

                                    <div class="editor-space">
                                        <label class="switch">
                                            <input class="form-control" type="hidden" name="status"
                                                value="0">
                                            <input class="form-check-input" type="checkbox" name="status"
                                                id="" value="1" @checked(@$coupon?->status ?? true)>
                                            <span class="switch-state"></span>
                                        </label>
                                    </div>
                                </div>
                                @error('status')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                            <div class="footer">
                                <button type="button"
                                    class="nextBtn btn btn-primary">{{ __('static.next') }}</button>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="restriction" role="tabpanel"
                            aria-labelledby="restriction-tab">
                            <div class="form-group row amount-input">
                                <label class="col-md-2"
                                    for="min_ride_fare">{{ __('taxido::static.coupons.minimum_ride_fare') }}<span>
                                        *</span></label>
                                <div class="col-md-10 error-div">
                                    <div class="input-group mb-3 flex-nowrap">
                                        <span class="input-group-text">{{ getDefaultCurrency()?->symbol }}</span>
                                        <div class="w-100">
                                            <input class="form-control" type="number" name="min_ride_fare"
                                                value="{{ isset($coupon->min_ride_fare) ? $coupon->min_ride_fare : old('min_ride_fare') }}"
                                                placeholder="{{ __('taxido::static.coupons.enter_minimum_ride_fare') }}"
                                                required>
                                            @error('min_ride_fare')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2" for="role">{{ __('taxido::static.coupons.is_apply_all') }}</label>
                                <div class="col-md-10">
                                    <div class="editor-space">
                                        <label class="switch">
                                            @if (isset($coupon))
                                                <input class="form-control" type="hidden" name="is_apply_all" value="0">
                                                <input class="form-check-input" id="is_apply_all" type="checkbox" name="is_apply_all" value="1" {{ $coupon->is_apply_all ? 'checked' : '' }}>
                                            @else
                                                <input class="form-control" type="hidden" name="is_apply_all" value="0">
                                                <input class="form-check-input" id="is_apply_all" type="checkbox" name="is_apply_all" value="1">
                                            @endif
                                            <span class="switch-state"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-group row" id="service-selection">
                                <label class="col-md-2" for="services">{{ __('taxido::static.coupons.services') }}<span> *</span></label>
                                <div class="col-md-10 select-label-error">
                                    <select class="form-control select-2" id="service_id" name="services[]" data-placeholder="{{ __('taxido::static.coupons.select_services') }}" multiple>
                                        @foreach ($services as $index => $service)
                                            <option value="{{ $service->id }}"
                                                @if (isset($coupon) && !$coupon->is_apply_all && $coupon->services->contains($service->id)) selected
                                                @elseif (old('services.' . $index) == $service->id) selected @endif>
                                                {{ $service->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('services')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                            
                            <div class="form-group row" id="vehicle-type-selection">
                                <label class="col-md-2" for="vehicle_type">{{ __('taxido::static.coupons.select_vehicle_type') }}</label>
                                <div class="col-md-10 select-label-error">
                                    <select class="form-control select-2" name="vehicle_types[]" data-placeholder="{{ __('taxido::static.coupons.select_vehicle_type') }}" multiple>
                                        @foreach ($vehicleTypes as $index => $vehicleType)
                                            <option value="{{ $vehicleType->id }}"
                                                @if (isset($coupon) && !$coupon->is_apply_all && $coupon->vehicle_types->contains($vehicleType->id)) selected
                                                @elseif (old('vehicle_types.' . $index) == $vehicleType->id) selected @endif>
                                                {{ $vehicleType->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('vehicle_types')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                            <div class="footer">
                                <button type="button"
                                            class="previousBtn bg-light-primary btn cancel">{{ __('static.previous') }}</button>
                                <button type="button"
                                    class="nextBtn btn btn-primary">{{ __('static.next') }}</button>
                            </div>
                        </div>

                        <div class="tab-pane fade {{ session('active_tab') == 'usage-tab' ? 'show active' : '' }}"
                            id="usage" role="tabpanel" aria-labelledby="usage-tab">

                            <div class="form-group row">
                                <label class="col-md-2" for="role">{{ __('taxido::static.coupons.is_unlimited') }}</label>
                                <div class="col-md-10">
                                    <div class="editor-space">
                                        <label class="switch">
                                            @if (isset($coupon))
                                                <input class="form-control" type="hidden" name="is_unlimited" value="0">
                                                <input class="form-check-input" id="is_unlimited" type="checkbox" name="is_unlimited" value="1" {{ $coupon->is_unlimited ? 'checked' : '' }}>
                                            @else
                                                <input class="form-control" type="hidden" name="is_unlimited" value="0">
                                                <input class="form-check-input" id="is_unlimited" type="checkbox" name="is_unlimited" value="1">
                                            @endif
                                            <span class="switch-state"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group row" id="usage_per_coupon">
                                <label class="col-md-2" for="usage_per_coupon">{{ __('taxido::static.coupons.usage_per_coupon') }}<span> *</span></label>
                                <div class="col-md-10">
                                    <input class='form-control' type="number" name="usage_per_coupon" value="{{ isset($coupon->usage_per_coupon) ? $coupon->usage_per_coupon : old('usage_per_coupon') }}" placeholder="{{ __('taxido::static.coupons.enter_value') }}" id="usage_per_coupon_input" @if (!isset($coupon) || !$coupon->is_unlimited) required @endif>
                                    @error('usage_per_coupon')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                            
                            <div class="form-group row" id="usage_per_rider">
                                <label class="col-md-2" for="usage_per_rider">{{ __('taxido::static.coupons.usage_per_rider') }}<span> *</span></label>
                                <div class="col-md-10">
                                    <input class='form-control' type="number" name="usage_per_rider" value="{{ isset($coupon->usage_per_rider) ? $coupon->usage_per_rider : old('usage_per_rider') }}" placeholder="{{ __('taxido::static.coupons.enter_value') }}" id="usage_per_rider_input" @if (!isset($coupon) || !$coupon->is_unlimited) required @endif>
                                    @error('usage_per_rider')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                            
                            <div class="form-group row">
                                <div class="col-12">
                                    <div class="submit-btn">
                                        <button type="button"
                                            class="previousBtn bg-light-primary btn cancel">{{ __('static.previous') }}</button>
                                        <button type="submit" name="save"
                                            class="btn btn-solid spinner-btn submitBtn">
                                            <i class="ri-save-line text-white lh-1"></i>{{ __('taxido::static.save') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@push('css')
    <link rel="stylesheet" href="{{ asset('css/vendors/flatpickr.min.css')}}">
@endpush

@push('scripts')
    <script src="{{ asset('js/flatpickr/flatpickr.js')}}"></script>
    <script src="{{ asset('js/flatpickr/rangePlugin.js')}}"></script>

    <script>
        (function($) {
            "use strict";

            $(document).ready(function() {
                function toggleDateFields() {
                    if ($("#is_expired").is(":checked")) {
                        $(".select-date").show();
                    } else {
                        $(".select-date").hide();
                    }
                }

                $("#is_expired").change(toggleDateFields);
                toggleDateFields();

                flatpickr("#date-range", {
                    mode: "range",
                    dateFormat: "m/d/Y",
                    allowInput: true,
                    placeholder: "Select Date Range",
                    onReady: function(selectedDates, dateStr, instance) {
                        instance._input.setAttribute('data-input', '');
                    },
                    onChange: function(selectedDates, dateStr, instance) {
                        if (selectedDates.length === 2) {
                            const formattedDates = [
                                instance.formatDate(selectedDates[0], "m/d/Y"),
                                instance.formatDate(selectedDates[1], "m/d/Y")
                            ];
                            $("#date-range").val(formattedDates.join(' to '));
                        }
                    }
                });

                @if (isset($coupon) && $coupon->start_date && $coupon->end_date)
                    var startDate = moment("{{ $coupon->start_date }}").format('MM/DD/YYYY');
                    var endDate = moment("{{ $coupon->end_date }}").format('MM/DD/YYYY');
                    $("#date-range").val(startDate + ' to ' + endDate);
                @endif

                $("#couponForm").on('submit', function(e) {
                    if ($("#is_expired").is(":checked")) {
                        const dateRange = $("#date-range").val();
                        if (!dateRange || !dateRange.includes(' to ')) {
                            e.preventDefault();
                            alert('Please select a valid date range');
                            return false;
                        }

                        const dates = dateRange.split(' to ');
                        if (dates.length !== 2 || !dates[0].trim() || !dates[1].trim()) {
                            e.preventDefault();
                            alert('Please select a valid date range');
                            return false;
                        }
                    }
                    return true;
                });

                function toggleApplyFields() {
                    const isApplyAll = $('#is_apply_all').is(":checked");
                    if (isApplyAll) {
                        $('#vehicle-type-selection, #service-selection').hide();
                        $('select[name="services[]"]').val(null).trigger('change');
                        $('select[name="vehicle_types[]"]').val(null).trigger('change');
                    } else {
                        $('#vehicle-type-selection, #service-selection').show();
                    }
                }

                $('#is_apply_all').change(toggleApplyFields);
                toggleApplyFields();

                function toggleInputFields(type) {
                    if (type === 'fixed') {
                        $('#currencyIcon').show();
                        $('#percentageIcon').hide();
                        $('#amountField').show();
                    } else if (type === 'percentage') { 
                        $('#currencyIcon').hide();
                        $('#percentageIcon').show();
                        $('#amountField').show();
                    } else {
                        $('#amountField').hide();
                    }
                }

                toggleInputFields($('#type').val());
                $('#type').on('change', function() {
                    toggleInputFields($(this).val());
                });

                function toggleUsageFields() {
                    if ($("#is_unlimited").is(":checked")) {
                        $('#usage_per_coupon, #usage_per_rider').hide();
                        $('#usage_per_coupon_input, #usage_per_rider_input').removeAttr('required');
                    } else {
                        $('#usage_per_coupon, #usage_per_rider').show();
                        $('#usage_per_coupon_input, #usage_per_rider_input').attr('required', true);
                    }
                }

                toggleUsageFields();
                $('#is_unlimited').change(toggleUsageFields);
            });
        })(jQuery);
    </script>
@endpush
