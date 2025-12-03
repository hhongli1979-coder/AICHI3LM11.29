@php
    $settings = getTaxidoSettings();
@endphp
<div class="col-12">
    <div class="row g-xl-4 g-3">
        <div class="col-xl-12">
            <div class="left-part">
                <div class="contentbox">
                    <div class="inside">
                        <div class="contentbox-title">
                            <h3>
                                {{ isset($airport) ? __('taxido::static.airports.edit') : __('taxido::static.airports.add') }}
                                ({{ request('locale', app()->getLocale()) }})
                            </h3>
                        </div>
                        @isset($airport)
                            <div class="form-group row">
                                <label class="col-md-2" for="name">{{ __('taxido::static.language.languages') }}</label>
                                <div class="col-md-10">
                                    <ul class="language-list">
                                        @forelse (getLanguages() as $lang)
                                            <li>
                                                <a href="{{ route('admin.airport.edit', ['airport' => $airport->id, 'locale' => $lang->locale]) }}"
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
                                                <a href="{{ route('admin.airport.edit', ['airport' => $airport->id, 'locale' => Session::get('locale', 'en')]) }}"
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
                            <label class="col-md-2" for="name">{{ __('taxido::static.airports.name') }}<span>*</span></label>
                            <div class="col-md-10">
                                    <input class="form-control" type="text" id="name" name="name"
                                        placeholder="{{ __('taxido::static.airports.enter_name') }} ({{ request('locale', app()->getLocale()) }})"
                                        value="{{ isset($airport->name) ? $airport->getTranslation('name', request('locale', app()->getLocale())) : old('name') }}">
                                    <i class="ri-file-copy-line copy-icon" data-target="#name"></i>
                                @error('name')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-2"
                                for="place_points">{{ __('taxido::static.airports.place_points') }}<span>
                                    *</span></label>
                            <div class="col-md-10">
                                <input class="form-control" type="text" id="place_points" name="place_points"
                                    placeholder="{{ __('taxido::static.airports.select_place_points') }}"
                                    value="{{ isset($airport->locations) ? json_encode($airport->locations, true) : old('place_points') }}"
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
                                for="search-box">{{ __('taxido::static.airports.search_location') }}</label>
                            <div class="col-md-10">
                                <input id="search-box" class="form-control" type="text"
                                    placeholder="{{ __('taxido::static.airports.search_locations') }}">
                                <ul id="suggestions-list" class="map-location-list custom-scrollbar"></ul>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-2" for="map">{{ __('taxido::static.airports.map') }}</label>
                            <div class="col-md-10">
                                <div class="map-warper dark-support rounded overflow-hidden">
                                    <div class="map-container" id="map-container"></div>
                                </div>
                                <div id="coords"></div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-2" for="status">{{ __('taxido::static.status') }}</label>
                            <div class="col-md-10">
                                <div class="editor-space">
                                    <label class="switch">
                                        @if (isset($airport))
                                            <input class="form-control" type="hidden" name="status"
                                                value="0">
                                            <input class="form-check-input" type="checkbox" name="status"
                                                id="" value="1" {{ $airport->status ? 'checked' : '' }}>
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
    @includeIf('taxido::admin.airport.google')
@elseIf($settings['location']['map_provider'] == 'osm')
    @includeIf('taxido::admin.airport.osm')
@endif

@push('scripts')
    <script>
        (function($) {
            "use strict";
            $('#airportForm').validate({
                rules: {
                    "name": "required",
                    "currency_id": "required",
                    "amount": "required",
                    "distance_type": "required",
                    "place_points": "required",
                }
            });
        })(jQuery);

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
    </script>
@endpush
