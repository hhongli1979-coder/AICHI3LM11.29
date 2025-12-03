@use('App\Models\Currency')
@use('App\Enums\PaymentMethod')
@php
    $settings = getTaxidoSettings();
    $currencies = Currency::where('status', true)?->get(['id', 'code']);
@endphp
<div class="col-12">
    <div class="row g-xl-4 g-3">
        <div class="col-xl-12">
            <div class="left-part">
                <div class="contentbox">
                    <div class="inside">
                        <div class="contentbox-title">
                            <h3>
                                {{ isset($zone) ? __('taxido::static.zones.edit') : __('taxido::static.zones.add') }}
                                ({{ request('locale', app()->getLocale()) }})
                            </h3>
                        </div>
                        @isset($zone)
                            <div class="form-group row">
                                <label class="col-md-2" for="name">{{ __('taxido::static.language.languages') }}</label>
                                <div class="col-md-10">
                                    <ul class="language-list">
                                        @forelse (getLanguages() as $lang)
                                            <li>
                                                <a href="{{ route('admin.zone.edit', ['zone' => $zone->id, 'locale' => $lang->locale]) }}"
                                                    class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                    target="_blank">
                                                    <img src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                        alt="">
                                                    {{ @$lang?->name }} ({{ @$lang?->locale }})
                                                    <i class="ri-arrow-right-up-line"></i>
                                                </a>
                                            </li>
                                        @empty
                                            <li>
                                                <a href="{{ route('admin.zone.edit', ['zone' => $zone->id, 'locale' => Session::get('locale', 'en')]) }}"
                                                    class="language-switcher active" target="blank">
                                                    <img src="{{ asset('admin/images/flags/LR.png') }}" alt="">
                                                    English
                                                    <i class="ri-arrow-right-up-line"></i>
                                                </a>
                                            </li>
                                        @endforelse
                                    </ul>
                                </div>
                            </div>
                        @endisset
                        <input type="hidden" name="locale" value="{{ request('locale') }}">
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('taxido::static.zones.name') }}<span>*</span></label>
                            <div class="col-md-10">
                                    <input class="form-control" type="text" id="name" name="name"
                                        placeholder="{{ __('taxido::static.zones.enter_name') }} ({{ request('locale', app()->getLocale()) }})"
                                        value="{{ isset($zone->name) ? $zone->getTranslation('name', request('locale', app()->getLocale())) : old('name') }}">
                                    <i class="ri-file-copy-line copy-icon" data-target="#name"></i>
                                @error('name')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <!-- Place Point, Search & Map -->
                        <div class="form-group row">
                            <label class="col-md-2"
                                for="place_points">{{ __('taxido::static.zones.place_points') }}<span>
                                    *</span></label>
                            <div class="col-md-10">
                                <input class="form-control" type="text" id="place_points" name="place_points"
                                    placeholder="{{ __('taxido::static.zones.select_place_points') }}"
                                    value="{{ isset($zone->locations) ? json_encode($zone->locations, true) : old('place_points') }}"
                                    readonly>
                                @error('place_points')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>


                        <div class="form-group row">
                            <label class="col-md-2"
                                for="search-box">{{ __('taxido::static.zones.search_location') }}</label>
                            <div class="col-md-10">
                                <input id="search-box" class="form-control" type="text"
                                    placeholder="{{ __('taxido::static.zones.search_locations') }}">
                                <ul id="suggestions-list" class="map-location-list custom-scrollbar"></ul>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-2" for="map">{{ __('taxido::static.zones.map') }}</label>
                            <div class="col-md-10">
                                <div class="map-warper dark-support rounded overflow-hidden">
                                    <div class="map-container" id="map-container"></div>
                                </div>
                                <div id="coords"></div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-2" for="type">{{ __('taxido::static.zones.weight_unit') }}<span>
                                    *</span></label>
                            <div class="col-md-10 select-label-error">
                                <select class="select-2 form-control" id="type" name="weight_unit"
                                    data-placeholder="{{ __('taxido::static.zones.select_weight_unit') }}">
                                    <option class="select-placeholder" value=""></option>
                                    @foreach (['kilogram' => 'Kilogram', 'pound' => 'Pound'] as $key => $option)
                                        <option class="option" value="{{ $key }}"
                                            @if (old('weight_unit', $zone->weight_unit ?? '') == $key) selected @endif>
                                            {{ $option }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('weight_unit')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-2" for="type">{{ __('taxido::static.zones.distance_type') }}<span> *</span></label>
                            <div class="col-md-10 select-label-error">
                                <select class="select-2 form-control" id="type" name="distance_type"
                                    data-placeholder="{{ __('taxido::static.zones.select_distance_type') }}">
                                    <option class="select-placeholder" value=""></option>
                                    @foreach (['mile' => 'Mile', 'km' => 'Km'] as $key => $option)
                                        <option class="option" value="{{ $key }}"
                                            @if (old('distance_type', $zone->distance_type ?? '') == $key) selected @endif>
                                            {{ $option }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('distance_type')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-2" for="type">{{ __('taxido::static.zones.currency') }}<span>
                                    *</span></label>
                            <div class="col-md-10 select-label-error">
                                <span class="text-gray mt-1">{{ __('taxido::static.zones.add_currency_message') }}
                                    <a href="{{ @route('admin.currency.index') }}" class="text-primary">
                                        <b>{{ __('taxido::static.here') }}</b>
                                    </a>
                                </span>
                                <select class="select-2 form-control" id="currency_id" name="currency_id"
                                    data-placeholder="{{ __('taxido::static.zones.select_currency') }}">
                                    <option class="select-placeholder" value=""></option>
                                    @foreach ($currencies as $key => $currency)
                                        <option value="{{ $currency->id }}"
                                            @if (old('currency_id', $zone->currency_id ?? '') == $currency->id) selected @endif>{{ $currency->code }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('currency_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-2" for="payment_method">{{ __('taxido::static.zones.payment_method') }} <span> *</span></label>
                            <div class="col-md-10 select-label-error">
                                <select class="form-control select-2 payment_method" name="payment_method[]"
                                    data-placeholder="{{ __('taxido::static.zones.select_payment_method') }}" multiple>
                                    @foreach (PaymentMethod::ALL_PAYMENT_METHODS as $method)
                                        <option value="{{ $method }}"
                                            @if (isset($zone->payment_method) && in_array($method, $zone->payment_method))
                                                selected
                                            @elseif (old('payment_method') && in_array($method, old('payment_method')))
                                                selected
                                            @endif>
                                            {{ ucfirst(str_replace('_', ' ', $method)) }}
                                        </option>

                                    @endforeach
                                </select>
                                @error('payment_method')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-2" for="status">{{ __('taxido::static.status') }}</label>
                            <div class="col-md-10">
                                <div class="editor-space">
                                    <label class="switch">
                                        @if (isset($zone))
                                            <input class="form-control" type="hidden" name="status"
                                                value="0">
                                            <input class="form-check-input" type="checkbox" name="status"
                                                id="" value="1" {{ $zone->status ? 'checked' : '' }}>
                                        @else
                                            <input class="form-control" type="hidden" name="status"
                                                value="0">
                                            <input class="form-check-input" type="checkbox" name="status"
                                                id="" value="1" checked>
                                        @endif
                                        <span class="switch-state"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- total_rides_in_peak_zone -->
                        <div class="form-group row">
                            <label class="col-md-2" for="total_rides_in_peak_zone">{{ __('taxido::static.zones.total_rides_in_peak_zone') }}<span>*</span></label>
                            <div class="col-md-10">
                                    <input class="form-control" type="number" min="1" id="total_rides_in_peak_zone" name="total_rides_in_peak_zone"
                                        placeholder="{{ __('taxido::static.zones.enter_total_rides_in_peak_zone') }}"
                                        value="{{ isset($zone->total_rides_in_peak_zone) ? $zone->total_rides_in_peak_zone : old('name') }}">
                                    <i class="ri-file-copy-line copy-icon" data-target="#total_rides_in_peak_zone"></i>
                                @error('total_rides_in_peak_zone')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <!-- peak_zone_geographic_radius -->
                        <div class="form-group row">
                            <label class="col-md-2" for="peak_zone_geographic_radius">{{ __('taxido::static.zones.peak_zone_geographic_radius') }}<span>*</span></label>
                            <div class="col-md-10">
                                    <input class="form-control" type="number" min="0.00" id="peak_zone_geographic_radius" name="peak_zone_geographic_radius"
                                        placeholder="{{ __('taxido::static.zones.enter_peak_zone_geographic_radius') }}"
                                        value="{{ isset($zone->peak_zone_geographic_radius) ? $zone->peak_zone_geographic_radius : old('peak_zone_geographic_radius') }}">
                                    <i class="ri-file-copy-line copy-icon" data-target="#peak_zone_geographic_radius"></i>
                                @error('peak_zone_geographic_radius')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <!-- minutes_choosing_peak_zone -->
                        <div class="form-group row">
                            <label class="col-md-2" for="minutes_choosing_peak_zone">{{ __('taxido::static.zones.minutes_choosing_peak_zone') }}<span>*</span></label>
                            <div class="col-md-10">
                                    <input class="form-control" type="number" min="1" id="minutes_choosing_peak_zone" name="minutes_choosing_peak_zone"
                                        placeholder="{{ __('taxido::static.zones.enter_minutes_choosing_peak_zone') }}"
                                        value="{{ isset($zone->minutes_choosing_peak_zone) ? $zone->minutes_choosing_peak_zone : old('minutes_choosing_peak_zone') }}">
                                    <i class="ri-file-copy-line copy-icon" data-target="#minutes_choosing_peak_zone"></i>
                                @error('minutes_choosing_peak_zone')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <!-- minutes_peak_zone_active -->
                        <div class="form-group row">
                            <label class="col-md-2" for="minutes_peak_zone_active">{{ __('taxido::static.zones.minutes_peak_zone_active') }}<span>*</span></label>
                            <div class="col-md-10">
                                    <input class="form-control" type="number" min="1" id="minutes_peak_zone_active" name="minutes_peak_zone_active"
                                        placeholder="{{ __('taxido::static.zones.enter_minutes_peak_zone_active') }} ({{ request('locale', app()->getLocale()) }})"
                                        value="{{ isset($zone->minutes_peak_zone_active) ? $zone->minutes_peak_zone_active : old('minutes_peak_zone_active') }}">
                                    <i class="ri-file-copy-line copy-icon" data-target="#minutes_peak_zone_active"></i>
                                @error('minutes_peak_zone_active')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <!-- peak_price_increase_percentage -->
                        <div class="form-group row">
                            <label class="col-md-2" for="peak_price_increase_percentage">{{ __('taxido::static.zones.peak_price_increase_percentage') }}<span>*</span></label>
                            <div class="col-md-10">
                                    <input class="form-control" type="text" id="peak_price_increase_percentage" name="peak_price_increase_percentage"
                                        placeholder="{{ __('taxido::static.zones.enter_peak_price_increase_percentage') }}"
                                        value="{{ isset($zone->peak_price_increase_percentage) ? $zone->peak_price_increase_percentage : old('peak_price_increase_percentage') }}">
                                    <i class="ri-file-copy-line copy-icon" data-target="#peak_price_increase_percentage"></i>
                                @error('peak_price_increase_percentage')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-12">
                                <div class="submit-btn">
                                    <button type="button" id="saveBtn" name="save" class="btn btn-primary spinner-btn">
                                        <i class="ri-save-line text-white lh-1"></i> {{ __('taxido::static.save') }}
                                    </button>
                                    <button type="button" id="saveExitBtn" name="save_and_exit" class="btn btn-primary spinner-btn">
                                        <i class="ri-expand-left-line text-white lh-1"></i>{{ __('taxido::static.save_and_exit') }}
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

@if ($settings['location']['map_provider'] == 'google_map')
    @includeIf('taxido::admin.zone.google')
@elseIf($settings['location']['map_provider'] == 'osm')
    @includeIf('taxido::admin.zone.osm')
@endif

@push('scripts')
    <script>
        (function($) {
            "use strict";
            $('#zoneForm').validate({
                rules: {
                    "name": "required",
                    "currency_id": "required",
                    "amount": "required",
                    "weight_unit" : "required",
                    "distance_type": "required",
                    "place_points": "required",
                    "total_rides_in_peak_zone": "required",
                    "peak_zone_geographic_radius": "required",
                    "minutes_choosing_peak_zone" : "required",
                    "minutes_peak_zone_active": "required",
                    "peak_price_increase_percentage": "required",
                }
            });
        })(jQuery);
        $('#saveBtn,#saveExitBtn').click(function(e) {
            e.preventDefault();

            if ($("#zoneForm").valid()) {
                $("#zoneForm").submit();
            }
        });
    </script>
@endpush
