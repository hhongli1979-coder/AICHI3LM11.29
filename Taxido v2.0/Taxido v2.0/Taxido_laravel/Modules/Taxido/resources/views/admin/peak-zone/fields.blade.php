@use('App\Enums\PaymentMethod')
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
                                {{ isset($peakZone) ? __('taxido::static.peakZones.edit') : __('taxido::static.peakZones.add') }}
                                ({{ request('locale', app()->getLocale()) }})
                            </h3>
                        </div>
                        @isset($peakZone)
                            <div class="form-group row">
                                <label class="col-md-2" for="name">{{ __('taxido::static.language.languages') }}</label>
                                <div class="col-md-10">
                                    <ul class="language-list">
                                        @forelse (getLanguages() as $lang)
                                            <li>
                                                <a href="{{ route('admin.zone.edit', ['zone' => $peakZone->id, 'locale' => $lang->locale]) }}"
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
                                                <a href="{{ route('admin.zone.edit', ['zone' => $peakZone->id, 'locale' => Session::get('locale', 'en')]) }}"
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
                            <label class="col-md-2" for="name">{{ __('taxido::static.peakZones.name') }}<span>*</span></label>
                            <div class="col-md-10">
                                    <input class="form-control" type="text" id="name" name="name"
                                        placeholder="{{ __('taxido::static.peakZones.enter_name') }} ({{ request('locale', app()->getLocale()) }})"
                                        value="{{ isset($peakZone->name) ? $peakZone->name : old('name') }}">
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
                                for="place_points">{{ __('taxido::static.peakZones.place_points') }}<span>
                                    *</span></label>
                            <div class="col-md-10">
                                <input class="form-control" type="text" id="place_points" name="place_points"
                                    placeholder="{{ __('taxido::static.peakZones.select_place_points') }}"
                                    value="{{ isset($peakZone->locations) ? json_encode($peakZone->locations, true) : old('place_points') }}"
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
                                for="search-box">{{ __('taxido::static.peakZones.search_location') }}</label>
                            <div class="col-md-10">
                                <input id="search-box" class="form-control" type="text"
                                    placeholder="{{ __('taxido::static.peakZones.search_locations') }}">
                                <ul id="suggestions-list" class="map-location-list custom-scrollbar"></ul>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-2" for="map">{{ __('taxido::static.peakZones.map') }}</label>
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
                                        @if (isset($peakZone))
                                            <input class="form-control" type="hidden" name="is_active"
                                                value="0">
                                            <input class="form-check-input" type="checkbox" name="is_active"
                                                id="" value="1" {{ $peakZone->is_active ? 'checked' : '' }}>
                                        @else
                                            <input class="form-control" type="hidden" name="is_active"
                                                value="0">
                                            <input class="form-check-input" type="checkbox" name="is_active"
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
    @includeIf('taxido::admin.peak-zone.google')
@elseIf($settings['location']['map_provider'] == 'osm')
    @includeIf('taxido::admin.peak-zone.osm')
@endif

@push('scripts')
    <script>
        (function($) {
            "use strict";
            $('#peakZoneForm').validate({
                rules: {
                    "name": "required",
                    "place_points": "required",
                }
            });
        })(jQuery);
        $('#saveBtn,#saveExitBtn').click(function(e) {
            e.preventDefault();
            if ($("#peakZoneForm").valid()) {
                $("#peakZoneForm").submit();
            }
        });
    </script>
@endpush
