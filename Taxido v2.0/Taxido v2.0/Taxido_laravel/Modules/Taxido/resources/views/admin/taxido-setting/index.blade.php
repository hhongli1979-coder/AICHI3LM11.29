@extends('admin.layouts.master')

@section('title', __('static.settings.app_settings'))

@section('content')
    <div class="contentbox">
        <div class="inside">
            <!-- Content Box Title -->
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('static.settings.app_settings') }}</h3>
                </div>
            </div>

            <!-- Card Body -->
            <div class="card-body">
                <div class="vertical-tabs">
                    <div class="row g-xl-5 g-4">
                        <!-- Navigation Tabs -->
                        <div class="col-xxl-4 col-xl-5 col-12">
                            <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                <a class="nav-link active" id="v-pills-tabContent" data-bs-toggle="pill"
                                    data-bs-target="#general_settings" type="button" role="tab"
                                    aria-controls="App_Settings" aria-selected="true">
                                    <i class="ri-settings-5-line"></i>{{ __('taxido::static.settings.general') }}
                                </a>
                                <a class="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill"
                                    data-bs-target="#Ads_Setting" type="button" role="tab"
                                    aria-controls="v-pills-profile" aria-selected="false">
                                    <i class="ri-toggle-line"></i>{{ __('taxido::static.settings.activation') }}
                                </a>
                                <a class="nav-link" id="v-pills-commission-tab" data-bs-toggle="pill"
                                    data-bs-target="#Commission_Setting" type="button" role="tab"
                                    aria-controls="v-pills-commission" aria-selected="false">
                                    <i class="ri-pie-chart-2-line"></i>{{ __('taxido::static.settings.driver_commission') }}
                                </a>
                                <a class="nav-link" id="v-pills-ride-setting-tab" data-bs-toggle="pill"
                                    data-bs-target="#Ride_Setting" type="button" role="tab"
                                    aria-controls="v-pills-ride-setting" aria-selected="false">
                                        <i class="ri-car-line"></i> {{ __('taxido::static.settings.ride_setting') }}
                                </a>
                                <a class="nav-link" id="v-pills-commission-tab" data-bs-toggle="pill"
                                    data-bs-target="#Wallet_Setting" type="button" role="tab"
                                    aria-controls="v-pills-commission" aria-selected="false">
                                    <i class="ri-wallet-2-line"></i>{{ __('taxido::static.settings.wallet') }}
                                </a>
                                <a class="nav-link" id="v-pills-referral-tab" data-bs-toggle="pill"
                                    data-bs-target="#Referral_Setting" type="button" role="tab"
                                    aria-controls="v-pills-referral" aria-selected="false">
                                    <i class="ri-user-add-line"></i>{{ __('taxido::static.settings.referral_settings') }}
                                </a>
                                <a class="nav-link" id="v-pills-location-tab" data-bs-toggle="pill"
                                    data-bs-target="#Location_Setting" type="button" role="tab"
                                    aria-controls="v-pills-location" aria-selected="false">
                                    <i class="ri-map-pin-2-line"></i>{{ __('taxido::static.settings.location_settings') }}
                                </a>

                                <a class="nav-link" id="v-pills-ads-network-tab" data-bs-toggle="pill"
                                    data-bs-target="#Ads_Network_Setting" type="button" role="tab"
                                    aria-controls="v-pills-ads-network" aria-selected="false">
                                        <i class="ri-advertisement-line"></i>{{ __('taxido::static.settings.ads_network') }}
                                </a>

                                <a class="nav-link" id="v-pills-app-config-tab" data-bs-toggle="pill"
                                    data-bs-target="#App_Configuration_Setting" type="button" role="tab"
                                    aria-controls="v-pills-app-config" aria-selected="false">
                                    <i class="ri-apps-2-line"></i> {{ __('taxido::static.settings.app_configuration') }}
                                </a>
                            </div>
                        </div>

                        <!-- Form Content -->
                        <div class="col-xxl-8 col-xl-7 col-12 tab-b-left">
                            <form method="POST" class="needs-validation user-add" id="taxidosettingsForm"
                                action="{{ route('admin.taxido-setting.update', @$id) }}" enctype="multipart/form-data">
                                @csrf @method('PUT')
                                <div class="tab-content w-100" id="v-pills-tabContent">
                                    {{-- General Settings --}}
                                    <div class="tab-pane fade show active" id="general_settings" role="tabpanel" aria-labelledby="v-pills-tabContent">
                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="footer_branding_hashtag">
                                                {{ __('taxido::static.settings.footer_hashtag') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('taxido::static.settings.footer_hashtag_help') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="text" name="general[footer_branding_hashtag]"
                                                    id="general[footer_branding_hashtag]"
                                                    value="{{ isset($taxidosettings['general']['footer_branding_hashtag']) ? $taxidosettings['general']['footer_branding_hashtag'] : old('footer_branding_hashtag') }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_hashtag') }}">
                                                @error('general[footer_branding_hashtag]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="footer_branding_attribution">
                                                {{ __('taxido::static.settings.footer_attribution') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('taxido::static.settings.footer_attribution_help') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="text" name="general[footer_branding_attribution]"
                                                    id="general[footer_branding_attribution]"
                                                    value="{{ isset($taxidosettings['general']['footer_branding_attribution']) ? $taxidosettings['general']['footer_branding_attribution'] : old('footer_branding_attribution') }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_attribution') }}">
                                                @error('general[footer_branding_attribution]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>


                                        <div class="form-group row">
                                            <label class="col-md-2" for="logo">
                                                {{ __('Ambulance Image') }}
                                            </label>
                                            <div class="col-md-10">
                                                <div class="form-group d-flex gap-3 align-items-start media-relative">
                                                    <div class="media-upload-image">
                                                        <input type="file" class="form-control fileInput"
                                                            name="general[ambulance_image]" data-preview-id="ambulanceImagePreview">
                                                        <i class="ri-add-line"></i>
                                                    </div>
                                                    @error('general[ambulance_image]')
                                                        <span class="invalid-feedback d-block" role="alert">
                                                            <strong>{{ $message }}</strong>
                                                        </span>
                                                    @enderror
                                                    @if (isset($taxidosettings['general']['ambulance_image']) && !empty($taxidosettings['general']['ambulance_image']))
                                                        <img src="{{ asset(@$taxidosettings['general']['ambulance_image']) }}" id="ambulanceImagePreview" alt="Current Logo" class="media-img" id="imagePreview">
                                                    @else
                                                        <img src="" alt="Image Preview" class="media-img" id="ambulanceImagePreview" style="display: none;">
                                                    @endif
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2" for="logo">
                                                {{ __('Ambulance Map Icon') }}
                                            </label>
                                            <div class="col-md-10">
                                                <div class="form-group d-flex gap-3 align-items-start media-relative">
                                                    <div class="media-upload-image">
                                                        <input type="file" class="form-control fileInput"
                                                            name="general[ambulance_map_icon]" data-preview-id="ambulanceMapIconPreview">
                                                        <i class="ri-add-line"></i>
                                                    </div>
                                                    @error('general[ambulance_map_icon]')
                                                        <span class="invalid-feedback d-block" role="alert">
                                                            <strong>{{ $message }}</strong>
                                                        </span>
                                                    @enderror
                                                    @if (isset($taxidosettings['general']['ambulance_map_icon']) && !empty($taxidosettings['general']['ambulance_map_icon']))
                                                        <img src="{{ asset(@$taxidosettings['general']['ambulance_map_icon']) }}" id="ambulanceMapIconPreview" alt="Current Logo" class="media-img" id="imagePreview">
                                                    @else
                                                        <img src="" alt="Image Preview" class="media-img" id="ambulanceMapIconPreview" style="display: none;">
                                                    @endif
                                                </div>
                                            </div>
                                        </div>

                                        <div class="added-button">
                                            <button type="button" id="add-greeting" class="btn btn-primary mt-0">{{ __('taxido::static.settings.add_greeting') }}</button>
                                        </div>
                                    </div>

                                    {{-- Activation Settings--}}
                                    <div class="tab-pane fade" id="Ads_Setting" role="tabpanel" aria-labelledby="v-pills-profile-tab" tabindex="0">

                                        {{-- Coupon Enable --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[coupon_enable]">{{ __('static.settings.coupon_enable') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('static.settings.coupon_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['coupon_enable']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[coupon_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[coupon_enable]" value="1"
                                                                {{ $taxidosettings['activation']['coupon_enable'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[coupon_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[coupon_enable]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Referral Enable --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[referral_enable]">{{ __('taxido::static.settings.referral_enable') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.enable_referral') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['referral_enable']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[referral_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[referral_enable]" value="1"
                                                                {{ $taxidosettings['activation']['referral_enable'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[referral_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[referral_enable]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- rider_wallet_enable --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[rider_wallet]">{{ __('taxido::static.settings.rider_wallet') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.rider_wallets') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['rider_wallet']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[rider_wallet]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[rider_wallet]" value="1"
                                                                {{ $taxidosettings['activation']['rider_wallet'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[rider_wallet]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[rider_wallet]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- sos_enable --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[sos_enable]">{{ __('taxido::static.settings.sos_enable') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.sos_enable') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['sos_enable']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[sos_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[sos_enable]" value="1"
                                                                {{ $taxidosettings['activation']['sos_enable'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[sos_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[sos_enable]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Driver Verification --}}
                                        <div class="form-group row">
                                            <label class="col-md-5" for="activation[driver_verification]">{{ __('taxido::static.settings.driver_verification') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="{{ __('taxido::static.settings.driver_verifications_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['driver_verification']))
                                                            <input class="form-control" type="hidden" name="activation[driver_verification]" value="0">
                                                            <input class="form-check-input" type="checkbox" name="activation[driver_verification]" value="1" {{ $taxidosettings['activation']['driver_verification'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden" name="activation[driver_verification]" value="0">
                                                            <input class="form-check-input" type="checkbox" name="activation[driver_verification]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Fleet Verification --}}
                                        <div class="form-group row">
                                            <label class="col-md-5" for="activation[fleet_verification]">{{ __('taxido::static.settings.fleet_verification') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="{{ __('taxido::static.settings.fleet_verification_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['fleet_verification']))
                                                            <input class="form-control" type="hidden" name="activation[fleet_verification]" value="0">
                                                            <input class="form-check-input" type="checkbox" name="activation[fleet_verification]" value="1" {{ $taxidosettings['activation']['fleet_verification'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden" name="activation[fleet_verification]" value="0">
                                                            <input class="form-check-input" type="checkbox" name="activation[fleet_verification]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Fleet Vehicle Verification --}}
                                        <div class="form-group row">
                                            <label class="col-md-5" for="activation[fleet_vehicle_verification]">{{ __('taxido::static.settings.fleet_vehicle_verification') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="{{ __('taxido::static.settings.fleet_vehicle_verification_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['fleet_vehicle_verification']))
                                                            <input class="form-control" type="hidden" name="activation[fleet_vehicle_verification]" value="0">
                                                            <input class="form-check-input" type="checkbox" name="activation[fleet_vehicle_verification]" value="1" {{ $taxidosettings['activation']['fleet_vehicle_verification'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden" name="activation[fleet_vehicle_verification]" value="0">
                                                            <input class="form-check-input" type="checkbox" name="activation[fleet_vehicle_verification]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Full Address Location --}}
                                        <div class="form-group row">
                                            <label class="col-md-5" for="activation[full_address_location]">{{ __('taxido::static.settings.full_address_location') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="{{ __('taxido::static.settings.full_address_location_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['full_address_location']))
                                                            <input class="form-control" type="hidden" name="activation[full_address_location]" value="0">
                                                            <input class="form-check-input" type="checkbox" name="activation[full_address_location]" value="1" {{ $taxidosettings['activation']['full_address_location'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden" name="activation[full_address_location]" value="0">
                                                            <input class="form-check-input" type="checkbox" name="activation[full_address_location]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Online Payment --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[online_payments]">{{ __('taxido::static.settings.online_payment') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.online_payments') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['online_payments']))
                                                            <input class="form-control" type="hidden" name="activation[online_payments]" value="0">
                                                            <input class="form-check-input" type="checkbox" name="activation[online_payments]" value="1"
                                                                {{ $taxidosettings['activation']['online_payments'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden" name="activation[online_payments]" value="0">
                                                            <input class="form-check-input" type="checkbox" name="activation[online_payments]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Driver Subscription --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[driver_subscription]">{{ __('taxido::static.settings.driver_subscription') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.driver_subscription') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['driver_subscription']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[driver_subscription]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[driver_subscription]" value="1"
                                                                {{ $taxidosettings['activation']['driver_subscription'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[driver_subscription]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[driver_subscription]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Cash Payment --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[cash_payments]">{{ __('taxido::static.settings.cash_payments') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.cash_payments') }}">
                                                </i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if(isset($taxidosettings['activation']['cash_payments']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[cash_payments]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[cash_payments]" value="1"
                                                                {{ $taxidosettings['activation']['cash_payments'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden" name="activation[cash_payments]" value="0">
                                                            <input class="form-check-input" type="checkbox" name="activation[cash_payments]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Driver Tips --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[driver_tips]">{{ __('taxido::static.settings.driver_tips') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.tips') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['driver_tips']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[driver_tips]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[driver_tips]" value="1"
                                                                {{ $taxidosettings['activation']['driver_tips'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[driver_tips]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[driver_tips]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Ride OTP --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[ride_otp]">{{ __('taxido::static.settings.ride_otp') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.otp_ride') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['ride_otp']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[ride_otp]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[ride_otp]" value="1"
                                                                {{ $taxidosettings['activation']['ride_otp'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[ride_otp]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[ride_otp]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Parcel OTP --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[parcel_otp]">{{ __('taxido::static.settings.parcel_otp') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.otp_parcel') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['parcel_otp']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[parcel_otp]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[parcel_otp]" value="1"
                                                                {{ $taxidosettings['activation']['parcel_otp'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[parcel_otp]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[parcel_otp]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Bidding --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[bidding]">{{ __('taxido::static.settings.bidding') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.bid_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['bidding']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[bidding]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[bidding]" value="1"
                                                                {{ $taxidosettings['activation']['bidding'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[bidding]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[bidding]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Force Update --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[force_update]">{{ __('taxido::static.settings.force_update') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.force_update_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['force_update']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[force_update]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[force_update]" value="1"
                                                                {{ $taxidosettings['activation']['force_update'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[force_update]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[force_update]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- airport_price_enable --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[airport_price_enable]">{{ __('taxido::static.settings.airport_price') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.airport_price_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['airport_price_enable']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[airport_price_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[airport_price_enable]" value="1"
                                                                {{ $taxidosettings['activation']['airport_price_enable'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[airport_price_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[airport_price_enable]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- surge_price_enable --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[surge_price_enable]">{{ __('taxido::static.settings.surge_price') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.surge_price_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['surge_price_enable']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[surge_price_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[surge_price_enable]" value="1"
                                                                {{ $taxidosettings['activation']['surge_price_enable'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[surge_price_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[surge_price_enable]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- peak_zone_enable --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[peak_zone_enable]">{{ __('taxido::static.settings.peak_zone') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.surge_price_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['peak_zone_enable']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[peak_zone_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[peak_zone_enable]" value="1"
                                                                {{ $taxidosettings['activation']['peak_zone_enable'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[peak_zone_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[peak_zone_enable]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Driver Incentive enable --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[driver_incentive_enable]">{{ __('taxido::static.settings.driver_incentive_enable') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.driver_incentive_enable_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['driver_incentive_enable']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[driver_incentive_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[driver_incentive_enable]" value="1"
                                                                {{ $taxidosettings['activation']['driver_incentive_enable'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[driver_incentive_enable]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[driver_incentive_enable]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- additional_minute_charge --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[additional_minute_charge]">{{ __('taxido::static.settings.additional_minute_charge') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.additional_minute_charge_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['additional_minute_charge']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[additional_minute_charge]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[additional_minute_charge]" value="1"
                                                                {{ $taxidosettings['activation']['additional_minute_charge'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[additional_minute_charge]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[additional_minute_charge]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- additional_distance_charge --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[additional_distance_charge]">{{ __('taxido::static.settings.additional_distance_charge') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.additional_distance_charge_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['additional_distance_charge']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[additional_distance_charge]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[additional_distance_charge]" value="1"
                                                                {{ $taxidosettings['activation']['additional_distance_charge'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[additional_distance_charge]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[additional_distance_charge]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- additional_weight_charge --}}
                                        <div class="form-group row">
                                            <label class="col-md-5"
                                                for="activation[additional_weight_charge]">{{ __('taxido::static.settings.additional_weight_charge') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.additional_weight_charge_span') }}"></i>
                                            </label>
                                            <div class="col-md-7">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['activation']['additional_weight_charge']))
                                                            <input class="form-control" type="hidden"
                                                                name="activation[additional_weight_charge]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[additional_weight_charge]" value="1"
                                                                {{ $taxidosettings['activation']['additional_weight_charge'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="activation[additional_weight_charge]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="activation[additional_weight_charge]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {{--  Commission Settings--}}
                                    <div class="tab-pane fade" id="Commission_Setting" role="tabpanel"
                                        aria-labelledby="v-pills-commission" tabindex="0">
                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="min_withdraw_amount">{{ __('taxido::static.settings.min_withdraw_amount') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.min_withdraw_text') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="number"
                                                    name="driver_commission[min_withdraw_amount]"
                                                    id="driver_commission[min_withdraw_amount]"
                                                    value="{{ isset($taxidosettings['driver_commission']['min_withdraw_amount']) ? $taxidosettings['driver_commission']['min_withdraw_amount'] : old('min_withdraw_amount') }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_min_withdraw_amount') }}">
                                                @error('driver_commission[min_withdraw_amount]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2" for="fleet_commission_type">
                                                {{ __('taxido::static.settings.fleet_commission_type') }}<span>*</span>
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top"
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.fleet_commission_span') }}"></i>
                                            </label>
                                            <div class="col-md-10 select-label-error">
                                                <select class="select-2 form-control" id="fleet_commission_type"
                                                    name="driver_commission[fleet_commission_type]"
                                                    data-placeholder="{{ __('taxido::static.settings.select_fleet_commission_type') }}">
                                                    <option class="select-placeholder" value=""></option>
                                                    @foreach (['fixed' => 'Fixed', 'percentage' => 'Percentage'] as $key => $option)
                                                        <option class="option" value="{{ $key }}"
                                                            @if (old('fleet_commission_type', $taxidosettings['driver_commission']['fleet_commission_type'] ?? '') == $key) selected @endif>
                                                            {{ $option }}</option>
                                                    @endforeach
                                                </select>
                                                @error('fleet_commission_type')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row amount-input" id="fleet_commission_rate" style="display: none;">
                                            <label class="col-md-2" for="fleet_commission_rate">
                                                {{ __('taxido::static.settings.fleet_commission_rate') }}<span>*</span>
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top"
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.fleet_commission_rate_span') }}"></i>
                                            </label>
                                            <div class="col-md-10 select-label-error amount">
                                                <div class="input-group">
                                                    <span class="input-group-text" id="fleetCurrencyIcon" style="display: none">{{ getDefaultCurrency()?->symbol }}</span>
                                                    <input class="form-control" type="number"
                                                        name="driver_commission[fleet_commission_rate]"
                                                        value="{{ $taxidosettings['driver_commission']['fleet_commission_rate'] ?? old('fleet_commission_rate') }}"
                                                        placeholder="{{ __('taxido::static.settings.enter_fleet_commission_rate') }}"
                                                        required>
                                                    <span class="input-group-text" id="fleetPercentageIcon" style="display: none;"><i class="ri-percent-line"></i></span>
                                                </div>
                                                @error('fleet_commission_rate')
                                                    <div class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </div>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row amount-input">
                                            <label class="col-md-2"
                                                for="ambulance_per_km_charge">{{ __('taxido::static.settings.ambulance_per_km_charge') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.ambulance_per_km_charge_span') }}"></i>
                                            </label>
                                            <div class="col-md-10 select-label-error amount">
                                                <div class="input-group">
                                                    <input class="form-control" type="number"
                                                        name="driver_commission[ambulance_per_km_charge]"
                                                        id="driver_commission[ambulance_per_km_charge]"
                                                        value="{{ isset($taxidosettings['driver_commission']['ambulance_per_km_charge']) ? $taxidosettings['driver_commission']['ambulance_per_km_charge'] : old('ambulance_per_km_charge') }}"
                                                        placeholder="{{ __('taxido::static.settings.enter_ambulance_per_km_charge') }}">
                                                </div>
                                                @error('driver_commission[ambulance_per_km_charge]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row amount-input">
                                            <label class="col-md-2"
                                                for="ambulance_per_minute_charge">{{ __('taxido::static.settings.ambulance_per_minute_charge') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.ambulance_per_minute_charge_span') }}"></i>
                                            </label>
                                            <div class="col-md-10 select-label-error amount">
                                                <div class="input-group">

                                                    <input class="form-control" type="number"
                                                        name="driver_commission[ambulance_per_minute_charge]"
                                                        id="driver_commission[ambulance_per_minute_charge]"
                                                        value="{{ isset($taxidosettings['driver_commission']['ambulance_per_minute_charge']) ? $taxidosettings['driver_commission']['ambulance_per_minute_charge'] : old('ambulance_per_minute_charge') }}"
                                                        placeholder="{{ __('taxido::static.settings.ambulance_per_minute_charge') }}">
                                                </div>
                                                @error('driver_commission[ambulance_per_minute_charge]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2" for="ambulance_commission_type">
                                                {{ __('taxido::static.settings.ambulance_commission_type') }}<span>*</span>
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top"
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.ambulance_commission_span') }}"></i>
                                            </label>
                                            <div class="col-md-10 select-label-error">
                                                <select class="select-2 form-control" id="ambulance_commission_type"
                                                    name="driver_commission[ambulance_commission_type]"
                                                    data-placeholder="{{ __('taxido::static.settings.select_ambulance_commission_type') }}">
                                                    <option class="select-placeholder" value=""></option>
                                                    @foreach (['fixed' => 'Fixed', 'percentage' => 'Percentage'] as $key => $option)
                                                        <option class="option" value="{{ $key }}"
                                                            @if (old('ambulance_commission_type', $taxidosettings['driver_commission']['ambulance_commission_type'] ?? '') == $key) selected @endif>
                                                            {{ $option }}</option>
                                                    @endforeach
                                                </select>
                                                @error('ambulance_commission_type')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row amount-input" id="ambulance_commission_rate" style="display: none;">
                                            <label class="col-md-2" for="ambulance_commission_rate">
                                                {{ __('taxido::static.settings.ambulance_commission_rate') }}<span>*</span>
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top"
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.ambulance_commission_rate_span') }}"></i>
                                            </label>
                                            <div class="col-md-10 select-label-error amount">
                                                <div class="input-group">
                                                    <span class="input-group-text" id="ambulanceCurrencyIcon" style="display: none">{{ getDefaultCurrency()?->symbol }}</span>
                                                    <input class="form-control" type="number"
                                                        name="driver_commission[ambulance_commission_rate]"
                                                        value="{{ $taxidosettings['driver_commission']['ambulance_commission_rate'] ?? old('ambulance_commission_rate') }}"
                                                        placeholder="{{ __('taxido::static.settings.enter_ambulance_commission_rate') }}"
                                                        required>
                                                    <span class="input-group-text" id="ambulancePercentageIcon" style="display: none;"><i class="ri-percent-line"></i></span>
                                                </div>
                                                @error('ambulance_commission_rate')
                                                    <div class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </div>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="driver_commission[status]">{{ __('taxido::static.settings.status') }}</label>
                                            <div class="col-md-10">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($taxidosettings['driver_commission']['status']))
                                                            <input class="form-control" type="hidden"
                                                                name="driver_commission[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="driver_commission[status]" value="1"
                                                                {{ $taxidosettings['driver_commission']['status'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="driver_commission[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="driver_commission[status]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {{-- Ride Settings --}}
                                    <div class="tab-pane fade" id="Ride_Setting" role="tabpanel" aria-labelledby="v-pills-ride-setting-tab" tabindex="0">
                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="ride_request_time_driver">
                                                {{ __('taxido::static.settings.ride_request_time_driver') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                   data-bs-title="{{ __('taxido::static.settings.driver_ride_request_accept_time_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number" name="ride[ride_request_time_driver]" id="ride_request_time_driver"
                                                       value="{{ isset($taxidosettings['ride']['ride_request_time_driver']) ? $taxidosettings['ride']['ride_request_time_driver'] : old('ride_request_time_driver') }}"
                                                       placeholder="{{ __('taxido::static.settings.enter_ride_request_time_driver') }}">
                                                @error('ride[ride_request_time_driver]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="rental_ambulance_request_time">
                                                {{ __('taxido::static.settings.rental_ambulance_request_time') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                   data-bs-title="{{ __('taxido::static.settings.rental_ambulance_request_time_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number" name="ride[rental_ambulance_request_time]" id="rental_ambulance_request_time"
                                                       value="{{ isset($taxidosettings['ride']['rental_ambulance_request_time']) ? $taxidosettings['ride']['rental_ambulance_request_time'] : old('rental_ambulance_request_time') }}"
                                                       placeholder="{{ __('taxido::static.settings.enter_rental_ambulance_request_time') }}">
                                                @error('ride[rental_ambulance_request_time]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="increase_amount_range">
                                                {{ __('taxido::static.settings.increase_amount_range') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                   data-bs-title="{{ __('taxido::static.settings.increase_amount_range_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number" name="ride[increase_amount_range]" id="increase_amount_range"
                                                       value="{{ isset($taxidosettings['ride']['increase_amount_range']) ? $taxidosettings['ride']['increase_amount_range'] : old('increase_amount_range') }}"
                                                       placeholder="{{ __('taxido::static.settings.increase_amount_range') }}">
                                                @error('ride[increase_amount_range]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="find_driver_time_limit">
                                                {{ __('taxido::static.settings.find_driver_time_limit') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                   data-bs-title="{{ __('taxido::static.settings.find_driver_time_limit_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number" name="ride[find_driver_time_limit]" id="find_driver_time_limit"
                                                       value="{{ isset($taxidosettings['ride']['find_driver_time_limit']) ? $taxidosettings['ride']['find_driver_time_limit'] : old('find_driver_time_limit') }}"
                                                       placeholder="{{ __('taxido::static.settings.enter_find_driver_time_limit') }}">
                                                @error('ride[find_driver_time_limit]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="schedule_ride_request_lead_time">
                                                {{ __('taxido::static.settings.schedule_ride_request_lead_time') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                   data-bs-title="{{ __('taxido::static.settings.schedule_ride_request_lead_time_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number" name="ride[schedule_ride_request_lead_time]" id="schedule_ride_request_lead_time"
                                                       value="{{ isset($taxidosettings['ride']['schedule_ride_request_lead_time']) ? $taxidosettings['ride']['schedule_ride_request_lead_time'] : old('find_driver_time_limit') }}"
                                                       placeholder="{{ __('taxido::static.settings.enter_schedule_ride_request_lead_time') }}">
                                                @error('ride[schedule_ride_request_lead_time]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="driver_max_online_hours">
                                                {{ __('taxido::static.settings.driver_max_online_hours') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                   data-bs-title="{{ __('taxido::static.settings.driver_max_online_hours_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number" name="ride[driver_max_online_hours]" id="driver_max_online_hours"
                                                       value="{{ isset($taxidosettings['ride']['driver_max_online_hours']) ? $taxidosettings['ride']['driver_max_online_hours'] : old('driver_max_online_hours') }}"
                                                       placeholder="{{ __('taxido::static.settings.enter_driver_max_online_hours') }}">
                                                @error('ride[driver_max_online_hours]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="min_intracity_radius">
                                                {{ __('taxido::static.settings.min_intracity_radius') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                   data-bs-title="{{ __('taxido::static.settings.min_intracity_radius_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number" name="ride[min_intracity_radius]" id="min_intracity_radius"
                                                       value="{{ isset($taxidosettings['ride']['min_intracity_radius']) ? $taxidosettings['ride']['min_intracity_radius'] : old('min_intracity_radius') }}"
                                                       placeholder="{{ __('taxido::static.settings.enter_min_intracity_radius') }}">
                                                @error('ride[min_intracity_radius]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="max_bidding_fare_driver">
                                                {{ __('taxido::static.settings.max_bidding_fare_driver') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                   data-bs-title="{{ __('taxido::static.settings.max_bidding_fare_driver_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number" name="ride[max_bidding_fare_driver]" id="max_bidding_fare_driver"
                                                       value="{{ isset($taxidosettings['ride']['max_bidding_fare_driver']) ? $taxidosettings['ride']['max_bidding_fare_driver'] : old('max_bidding_fare_driver') }}"
                                                       placeholder="{{ __('taxido::static.settings.enter_max_bidding_fare_driver') }}">
                                                @error('ride[max_bidding_fare_driver]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="parcel_weight_limit">
                                                {{ __('taxido::static.settings.parcel_weight_limit') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                   data-bs-title="{{ __('taxido::static.settings.parcel_weight_limit_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number" name="ride[parcel_weight_limit]" id="parcel_weight_limit"
                                                       value="{{ isset($taxidosettings['ride']['parcel_weight_limit']) ? $taxidosettings['ride']['parcel_weight_limit'] : old('parcel_weight_limit') }}"
                                                       placeholder="{{ __('taxido::static.settings.enter_parcel_weight_limit') }}">
                                                @error('ride[parcel_weight_limit]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="schedule_min_hour_limit">
                                                {{ __('taxido::static.settings.schedule_min_hour_limit') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                   data-bs-title="{{ __('taxido::static.settings.schedule_min_hour_limit_help') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number" name="ride[schedule_min_hour_limit]" id="schedule_min_hour_limit"
                                                       value="{{ isset($taxidosettings['ride']['schedule_min_hour_limit']) ? $taxidosettings['ride']['schedule_min_hour_limit'] : old('parcel_weight_limit') }}"
                                                       placeholder="{{ __('taxido::static.settings.enter_schedule_min_hour_limit') }}">
                                                @error('ride[schedule_min_hour_limit]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="weight_unit">
                                                {{ __('taxido::static.settings.weight_unit') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                   data-bs-title="{{ __('taxido::static.settings.weight_unit_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <select class="form-control form-select" name="ride[weight_unit]" id="weight_unit"
                                                        data-placeholder="{{ __('taxido::static.settings.select_weight_unit') }}">
                                                    <option value="kg" @selected(isset($taxidosettings['ride']['weight_unit']) && $taxidosettings['ride']['weight_unit'] == 'kg')>Kilogram (kg)</option>
                                                    <option value="pound" @selected(isset($taxidosettings['ride']['weight_unit']) && $taxidosettings['ride']['weight_unit'] == 'pound')>Pound (lb)</option>
                                                </select>
                                                @error('ride[weight_unit]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="distance_unit">
                                                {{ __('taxido::static.settings.distance_unit') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                   data-bs-title="{{ __('taxido::static.settings.distance_unit_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <select class="form-control form-select" name="ride[distance_unit]" id="distance_unit"
                                                        data-placeholder="{{ __('taxido::static.settings.select_distance_unit') }}">
                                                    <option value="km" @selected(isset($taxidosettings['ride']['distance_unit']) && $taxidosettings['ride']['distance_unit'] == 'km')>Kilometers (km)</option>
                                                    <option value="mile" @selected(isset($taxidosettings['ride']['distance_unit']) && $taxidosettings['ride']['distance_unit'] == 'mile')>Miles (mile)</option>
                                                </select>
                                                @error('ride[distance_unit]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>


                                        <!-- Country Code Field -->
                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="country_code">
                                                {{ __('taxido::static.settings.country_code') }} <span class="text-danger">*</span>
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top"
                                                   data-bs-custom-class="custom-tooltip"
                                                   data-bs-title="{{ __('taxido::static.settings.select_country_code_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <select class="select-2 form-control select-country-code" name="ride[country_code]" id="country_code"
                                                        data-placeholder="{{ __('taxido::static.settings.select_country_code') }}" required>
                                                    @foreach (getCountryCodes() as $option)
                                                        <option class="option"
                                                                value="{{ $option->calling_code }}"
                                                                data-image="{{ asset('images/flags/' . $option->flag) }}"
                                                                {{ (isset($taxidosettings['ride']['country_code']) && $taxidosettings['ride']['country_code'] == $option->calling_code) ? 'selected' : '' }}>
                                                            {{ $option->calling_code }}
                                                        </option>
                                                    @endforeach
                                                </select>
                                                @error('ride[country_code]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4" for="maximum_seat">
                                                {{ __('taxido::static.settings.maximum_seat') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('taxido::static.settings.maximum_seat_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number" min="1" name="ride[maximum_seat]" id="maximum_seat"
                                                    value="{{ isset($taxidosettings['ride']['maximum_seat']) ? $taxidosettings['ride']['maximum_seat'] : old('maximum_seat') }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_maximum_seat') }}">
                                                @error('ride[maximum_seat]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>

                                    {{-- Wallet Settings --}}
                                    <div class="tab-pane fade" id="Wallet_Setting" role="tabpanel"
                                        aria-labelledby="v-pills-wallet" tabindex="0">
                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4"
                                                for="wallet_denominations">{{ __('taxido::static.settings.wallet_denominations') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.wallet_denominations_help') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="text"
                                                    name="wallet[wallet_denominations]" id="wallet[wallet_denominations]"
                                                    value="{{ isset($taxidosettings['wallet']['wallet_denominations']) ? $taxidosettings['wallet']['wallet_denominations'] : old('wallet_denominations') }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_wallet_denominations') }}">
                                                @error('wallet[wallet_denominations]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4"
                                                for="tip_denominations">{{ __('taxido::static.settings.tip_denominations') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.tip_denominations_help') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="text"
                                                    name="wallet[tip_denominations]" id="wallet[tip_denominations]"
                                                    value="{{ isset($taxidosettings['wallet']['tip_denominations']) ? $taxidosettings['wallet']['tip_denominations'] : old('tip_denominations') }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_tip_denominations') }}">
                                                @error('wallet[tip_denominations]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4"
                                                for="driver_min_wallet_balance">{{ __('taxido::static.settings.driver_min_wallet_balance') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.driver_min_wallet_balance_help') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="text"
                                                    name="wallet[driver_min_wallet_balance]" id="wallet[driver_min_wallet_balance]"
                                                    value="{{ isset($taxidosettings['wallet']['driver_min_wallet_balance']) ? $taxidosettings['wallet']['driver_min_wallet_balance'] : old('driver_min_wallet_balance') }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_driver_min_wallet_balance') }}">
                                                @error('wallet[driver_min_wallet_balance]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>

                                    {{-- Start Referral Settings --}}
                                    <div class="tab-pane fade" id="Referral_Setting" role="tabpanel"
                                        aria-labelledby="v-pills-referral" tabindex="0">

                                        {{-- Minimum Ride Amount --}}
                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4"
                                                for="minimum_ride_amount">{{ __('taxido::static.settings.minimum_ride_amount') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.minimum_ride_amount_help') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number" step="0.01" min="0"
                                                    name="referral[minimum_ride_amount]" id="referral[minimum_ride_amount]"
                                                    value="{{ isset($taxidosettings['referral']['minimum_ride_amount']) ? $taxidosettings['referral']['minimum_ride_amount'] : 250 }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_minimum_ride_amount') }}">
                                                @error('referral[minimum_ride_amount]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        {{-- Referrer Bonus Percentage --}}
                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4"
                                                for="referrer_bonus_percentage">{{ __('taxido::static.settings.referrer_bonus_percentage') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.referrer_bonus_percentage_help') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <div class="input-group">
                                                    <input class="form-control" type="number" step="0.01" min="0" max="100"
                                                        name="referral[referrer_bonus_percentage]" id="referral[referrer_bonus_percentage]"
                                                        value="{{ isset($taxidosettings['referral']['referrer_bonus_percentage']) ? $taxidosettings['referral']['referrer_bonus_percentage'] : 10 }}"
                                                        placeholder="{{ __('taxido::static.settings.enter_referrer_bonus_percentage') }}">
                                                    <span class="input-group-text">%</span>
                                                </div>
                                                @error('referral[referrer_bonus_percentage]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        {{-- Referred Bonus Percentage --}}
                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4"
                                                for="referred_bonus_percentage">{{ __('taxido::static.settings.referred_bonus_percentage') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.referred_bonus_percentage_help') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <div class="input-group">
                                                    <input class="form-control" type="number" step="0.01" min="0" max="100"
                                                        name="referral[referred_bonus_percentage]" id="referral[referred_bonus_percentage]"
                                                        value="{{ isset($taxidosettings['referral']['referred_bonus_percentage']) ? $taxidosettings['referral']['referred_bonus_percentage'] : 5 }}"
                                                        placeholder="{{ __('taxido::static.settings.enter_referred_bonus_percentage') }}">
                                                    <span class="input-group-text">%</span>
                                                </div>
                                                @error('referral[referred_bonus_percentage]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>
                                    {{-- End Referral Settings --}}

                                    <div class="tab-pane fade" id="Location_Setting" role="tabpanel"
                                        aria-labelledby="v-pills-location" tabindex="0">
                                        <div class="form-group row">
                                            <label class="col-md-2" for="google_map_api_key">{{ __('taxido::static.settings.google_map_api_key') }}</label>
                                            <div class="col-md-10">
                                                <div class="input-group test-form-group">
                                                    <input class="form-control" type="password"
                                                        id="google_map_api_key" name="location[google_map_api_key]"
                                                        value="{{ encryptKey($taxidosettings['location']['google_map_api_key'] ?? old('google_map_api_key')) }}"
                                                        placeholder="{{ __('taxido::static.settings.enter_google_map_api_key') }}">
                                                    <div class="input-group-append">
                                                        <button class="btn btn-primary test-map-btn" type="button" data-input-id="google_map_api_key">
                                                            {{ __('taxido::static.settings.test_map') }}
                                                        </button>
                                                    </div>
                                                </div>
                                                <span class="text-gray mt-1 d-block">
                                                    * Need help generating a Google Maps API key? Follow the steps in the
                                                    <a href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                                                    target="_blank" class="text-primary">Google Maps API Documentation</a>.
                                                    After entering your API key above, click "Test Map" to preview it in a modal and verify it's working correctly.
                                                </span>
                                                @error('location[google_map_api_key]')
                                                    <span class="invalid-feedback d-block" role="alert"><strong>{{ $message }}</strong></span>
                                                @enderror
                                            </div>
                                        </div>


                                    <div class="modal fade" id="mapModal" tabindex="-1" role="dialog" aria-labelledby="mapModalLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-lg test-modal" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="mapModalLabel">{{ __('taxido::static.settings.map_preview') }}</h5>
                                                </div>
                                                <div class="modal-body">
                                                    <div id="map-container">
                                                        <div class="d-flex justify-content-center align-items-center h-100">
                                                            <div class="spinner-border text-primary" role="status">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="map-error" class="alert alert-danger d-none">
                                                        Failed to load Google Maps. Please check your API key.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                        <div class="form-group row">
                                            <label for="map_provider"
                                                class="col-xxl-3 col-md-4">{{ __('taxido::static.settings.select_map_type') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="{{ __('taxido::static.settings.map') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8 error-div select-dropdown">
                                                <select class="select-2 form-control select-map"
                                                    id="location[map_provider]" name="location[map_provider]" data-placeholder="{{ __('taxido::static.settings.select_map') }}">
                                                    <option class="select-placeholder" value=""></option>
                                                    @foreach (['google_map' => 'Google Map', 'osm' => 'OpenStreetMap (OSM)'] as $key => $option)
                                                        <option class="option" value="{{ $key }}"
                                                            @if (($taxidosettings['location']['map_provider'] ?? old('location.map_provider')) == $key) selected @endif>
                                                            {{ $option }}
                                                        </option>
                                                    @endforeach
                                                </select>
                                                @error('location.map_provider')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4"
                                                for="amount">{{ __('taxido::static.settings.radius_meter') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.radius') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number" name="location[radius_meter]"
                                                    id="location[radius_meter]" min="1"
                                                    value="{{ isset($taxidosettings['location']['radius_meter']) ? $taxidosettings['location']['radius_meter'] : old('radius_meter') }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_radius_meter') }}">
                                                @error('location[radius_meter]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4"
                                                for="amount">{{ __('taxido::static.settings.radius_per_second') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.radius_second') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="number"
                                                    name="location[radius_per_second]" id="location[radius_per_second]"
                                                    min="1"
                                                    value="{{ isset($taxidosettings['location']['radius_per_second']) ? $taxidosettings['location']['radius_per_second'] : old('radius_per_second') }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_radius_per_second') }}">
                                                @error('location[radius_per_second]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                    </div>



                                    {{-- Ads Network Settings --}}
                        <div class="tab-pane fade" id="Ads_Network_Setting" role="tabpanel"
                        aria-labelledby="v-pills-ads-network-tab" tabindex="0">
                        <div class="form-group row">
                            <label class="col-md-5"
                                for="ads[native_enable]">{{ __('taxido::static.settings.native_ads_enable') }}
                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                data-bs-title="{{ __('taxido::static.settings.native_ads_enable_help') }}"></i>
                            </label>
                            <div class="col-md-7">
                                <div class="editor-space">
                                    <label class="switch">
                                        @if (isset($taxidosettings['ads']['native_enable']))
                                            <input class="form-control" type="hidden"
                                                name="ads[native_enable]" value="0">
                                            <input class="form-check-input" type="checkbox"
                                                name="ads[native_enable]" value="1"
                                                {{ $taxidosettings['ads']['native_enable'] ? 'checked' : '' }}>
                                        @else
                                            <input class="form-control" type="hidden"
                                                name="ads[native_enable]" value="0">
                                            <input class="form-check-input" type="checkbox"
                                                name="ads[native_enable]" value="1">
                                        @endif
                                        <span class="switch-state"></span>
                                    </label>
                                </div>
                            </div>
    </div>
    <div class="form-group row">
        <label class="col-xxl-3 col-md-4"
               for="ads[android_google_ads_id]">{{ __('taxido::static.settings.android_google_ads_id') }}
            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
               data-bs-placement="top" data-bs-custom-class="custom-tooltip"
               data-bs-title="{{ __('taxido::static.settings.android_google_ads_id_help') }}"></i>
        </label>
        <div class="col-xxl-9 col-md-8">
            <input class="form-control" type="text"
                   name="ads[android_google_ads_id]"
                   id="ads[android_google_ads_id]"
                   value="{{ $taxidosettings['ads']['android_google_ads_id'] ?? old('ads.android_google_ads_id') }}"
                   placeholder="{{ __('taxido::static.settings.android_google_ads_id_placeholder') }}">
            @error('ads.android_google_ads_id')
                <span class="invalid-feedback d-block" role="alert"><strong>{{ $message }}</strong></span>
            @enderror
        </div>
    </div>
    <div class="form-group row">
        <label class="col-xxl-3 col-md-4"
               for="ads[ios_google_ads_id]">{{ __('taxido::static.settings.ios_google_ads_id') }}
            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
               data-bs-placement="top" data-bs-custom-class="custom-tooltip"
               data-bs-title="{{ __('taxido::static.settings.ios_google_ads_id_help') }}"></i>
        </label>
        <div class="col-xxl-9 col-md-8">
            <input class="form-control" type="text"
                   name="ads[ios_google_ads_id]"
                   id="ads[ios_google_ads_id]"
                   value="{{ $taxidosettings['ads']['ios_google_ads_id'] ?? old('ads.ios_google_ads_id') }}"
                   placeholder="{{ __('taxido::static.settings.ios_google_ads_id_placeholder') }}">
            @error('ads.ios_google_ads_id')
                <span class="invalid-feedback d-block" role="alert"><strong>{{ $message }}</strong></span>
            @enderror
        </div>
    </div>
    <div class="form-group row">
        <label class="col-xxl-3 col-md-4"
               for="ads[native_android_unit_id]">{{ __('taxido::static.settings.native_ads_android_unit_id') }}
            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
               data-bs-placement="top" data-bs-custom-class="custom-tooltip"
               data-bs-title="{{ __('taxido::static.settings.native_ads_android_unit_id_help') }}"></i>
        </label>
        <div class="col-xxl-9 col-md-8">
            <input class="form-control" type="text"
                   name="ads[native_android_unit_id]"
                   id="ads[native_android_unit_id]"
                   value="{{ $taxidosettings['ads']['native_android_unit_id'] ?? old('ads.native_android_unit_id') }}"
                   placeholder="{{ __('taxido::static.settings.native_ads_android_unit_id_placeholder') }}">
            @error('ads.native_android_unit_id')
                <span class="invalid-feedback d-block" role="alert"><strong>{{ $message }}</strong></span>
            @enderror
        </div>
    </div>
    <div class="form-group row">
        <label class="col-xxl-3 col-md-4"
               for="ads[native_ios_unit_id]">{{ __('taxido::static.settings.native_ads_ios_unit_id') }}
            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
               data-bs-placement="top" data-bs-custom-class="custom-tooltip"
               data-bs-title="{{ __('taxido::static.settings.native_ads_ios_unit_id_help') }}"></i>
        </label>
        <div class="col-xxl-9 col-md-8">
            <input class="form-control" type="text"
                   name="ads[native_ios_unit_id]"
                   id="ads[native_ios_unit_id]"
                   value="{{ $taxidosettings['ads']['native_ios_unit_id'] ?? old('ads.native_ios_unit_id') }}"
                   placeholder="{{ __('taxido::static.settings.native_ads_ios_unit_id_placeholder') }}">
            @error('ads.native_ios_unit_id')
                <span class="invalid-feedback d-block" role="alert"><strong>{{ $message }}</strong></span>
            @enderror
        </div>
    </div>
</div>

                                    {{-- App Settings --}}
                                    <div class="tab-pane fade" id="App_Configuration_Setting" role="tabpanel"
                                        aria-labelledby="v-pills-app-config-tab" tabindex="0">
                                        <div class="form-group row">
                                            <label class="col-md-2" for="splash_screen_id">{{ __('taxido::static.settings.splash_screen') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="*The splash screen is shown only when it is loaded in the app. It may display the default splash screen once or twice."></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="form-group">
                                                    <x-image :name="'setting[splash_screen_id]'" :data="isset($taxidosettings['setting']['splash_screen'])
                                                        ? $taxidosettings['setting']['splash_screen']
                                                        : old('setting.splash_screen_id')" :text="false"
                                                        :multiple="false"></x-image>
                                                    @error('splash_screen_id')
                                                        <span class="invalid-feedback d-block" role="alert">
                                                            <strong>{{ $message }}</strong>
                                                        </span>
                                                    @enderror
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2" for="splash_driver_screen_id">{{ __('taxido::static.settings.splash_driver_screen') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="*The splash screen is shown only when it is loaded in the app. It may display the default splash screen once or twice."></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="form-group">
                                                    <x-image :name="'setting[splash_driver_screen_id]'" :data="isset($taxidosettings['setting']['driver_splash_screen'])
                                                        ? $taxidosettings['setting']['driver_splash_screen']
                                                        : old('setting.splash_driver_screen_id')" :text="false"
                                                        :multiple="false"></x-image>
                                                    @error('splash_driver_screen_id')
                                                        <span class="invalid-feedback d-block" role="alert">
                                                            <strong>{{ $message }}</strong>
                                                        </span>
                                                    @enderror
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4"
                                                for="app_version">{{ __('taxido::static.settings.app_version') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.user_app_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="text" name="setting[app_version]"
                                                    id="setting[app_version]"
                                                    value="{{ isset($taxidosettings['setting']['app_version']) ? $taxidosettings['setting']['app_version'] : old('app_version') }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_version') }}">
                                                @error('setting[app_version]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4"
                                                for="driver_app_version">{{ __('taxido::static.settings.driver_app_version') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.driver_app_span') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="text" name="setting[driver_app_version]"
                                                    id="setting[driver_app_version]"
                                                    value="{{ isset($taxidosettings['setting']['driver_app_version']) ? $taxidosettings['setting']['driver_app_version'] : old('driver_app_version') }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_version') }}">
                                                @error('setting[driver_app_version]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4"
                                                for="rider_privacy_policy">{{ __('taxido::static.settings.rider_privacy_policy') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.enter_privacy_policy_url') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="text" name="setting[rider_privacy_policy]"
                                                    id="setting[rider_privacy_policy]"
                                                    value="{{ isset($taxidosettings['setting']['rider_privacy_policy']) ? $taxidosettings['setting']['rider_privacy_policy'] : old('rider_privacy_policy') }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_privacy_policy_url') }}">
                                                @error('setting[rider_privacy_policy]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-xxl-3 col-md-4"
                                                for="driver_privacy_policy">{{ __('taxido::static.settings.driver_privacy_policy') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('taxido::static.settings.enter_privacy_policy_url') }}"></i>
                                            </label>
                                            <div class="col-xxl-9 col-md-8">
                                                <input class="form-control" type="text" name="setting[driver_privacy_policy]"
                                                    id="setting[driver_privacy_policy]"
                                                    value="{{ isset($taxidosettings['setting']['driver_privacy_policy']) ? $taxidosettings['setting']['driver_privacy_policy'] : old('driver_privacy_policy') }}"
                                                    placeholder="{{ __('taxido::static.settings.enter_privacy_policy_url') }}">
                                                @error('setting[driver_privacy_policy]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Submit Button -->
                                    <button type="submit" class="btn btn-primary spinner-btn"><i class="ri-save-line text-white lh-1"></i>{{ __('static.save') }}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        (function ($) {
            "use strict";
            $(document).ready(function () {

                 $('.fileInput').on('change', function(event) {
                const input = this;
                const previewId = $(this).data('preview-id');
                const $preview = $('#' + previewId);

                if (input.files && input.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        $preview.attr('src', e.target.result).show();
                    };
                    reader.readAsDataURL(input.files[0]);
                } else {
                    $preview.attr('src', '').hide();
                }
            });


                const MAX_Greetings = 5;
                let map = null;
                let googleMapsScript = null;
                $('[data-bs-toggle="tooltip"]').tooltip();
                $('.test-map-btn').on('click', function () {
                    const inputId = $(this).data('input-id');
                    const apiKey = $('#' + inputId).val();
                    const $btn = $(this);

                    if (!apiKey) {
                        toastr.error('Please enter a Google Maps API key first.');
                        return;
                    }

                    $btn.html('<i class="fa fa-spinner fa-spin"></i> Testing..').prop('disabled', true);
                    loadGoogleMap(apiKey, $btn);
                });

                function loadGoogleMap(apiKey, $btn) {
                    if (map) {
                        google.maps.event.clearInstanceListeners(map);
                        map = null;
                    }

                    if (googleMapsScript) {
                        googleMapsScript.remove();
                    }

                    googleMapsScript = document.createElement('script');
                    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
                    googleMapsScript.async = true;
                    googleMapsScript.defer = true;
                    googleMapsScript.onerror = function () {
                        $('#map-container').html('');
                        $('#map-error').removeClass('d-none');
                        $btn.html('{{ __("taxido::static.settings.test_map") }}').prop('disabled', false);
                    };
                    document.head.appendChild(googleMapsScript);

                    $('#mapModal').modal('show');
                }

                window.initMap = function () {
                    try {
                        map = new google.maps.Map(document.getElementById('map-container'), {
                            center: { lat: 20.5937, lng: 78.9629 },
                            zoom: 4
                        });
                        $('.test-map-btn').html('{{ __("taxido::static.settings.test_map") }}').prop('disabled', false);
                    } catch (e) {
                        $('#map-container').html('');
                        $('#map-error').removeClass('d-none');
                        $('.test-map-btn').html('{{ __("taxido::static.settings.test_map") }}').prop('disabled', false);
                        toastr.error('Failed to initialize Google Maps. Please check your API key.');
                    }
                };

                $('#mapModal').on('hidden.bs.modal', function () {
                    if (map) {
                        google.maps.event.clearInstanceListeners(map);
                        map = null;
                    }
                });

                function toggleRemoveButtons() {
                    if ($('#greeting-group .form-group').length === 1) {
                        $('#greeting-group .remove-greeting').hide();
                    } else {
                        $('#greeting-group .remove-greeting').show();
                    }
                }

                $('#add-greeting').on('click', function () {
                    const greetingCount = $('#greeting-group .form-group').length;
                    if (greetingCount >= MAX_Greetings) {
                        toastr.warning('You can add up to 5 greetings only.');
                        return;
                    }
                    var newgreetingField = $('#greeting-group .form-group:first').clone();
                    newgreetingField.find('input').val('');
                    $('#greeting-group').append(newgreetingField);
                    toggleRemoveButtons();
                });

                $(document).on('click', '.remove-greeting', function () {
                    $(this).closest('.form-group').remove();
                    toggleRemoveButtons();
                });

                toggleRemoveButtons();
                function toggleCommissionRate(type, currencyIconId, percentageIconId, rateContainerId) {
                    if (type === 'fixed') {
                        $(`#${currencyIconId}`).show();
                        $(`#${percentageIconId}`).hide();
                    } else if (type === 'percentage') {
                        $(`#${currencyIconId}`).hide();
                        $(`#${percentageIconId}`).show();
                    }
                    $(`#${rateContainerId}`).show();
                }

                function setupCommissionSelector(typeSelectorId, currencyIconId, percentageIconId, rateContainerId) {
                    const initialType = $(`#${typeSelectorId}`).val();
                    if (initialType) {
                        toggleCommissionRate(initialType, currencyIconId, percentageIconId, rateContainerId);
                    }

                    $(`#${typeSelectorId}`).on('change', function () {
                        const selectedType = $(this).val();
                        if (selectedType) {
                            toggleCommissionRate(selectedType, currencyIconId, percentageIconId, rateContainerId);
                        } else {
                            $(`#${rateContainerId}`).hide();
                        }
                    });
                }

                setupCommissionSelector('ambulance_commission_type', 'ambulanceCurrencyIcon', 'ambulancePercentageIcon', 'ambulance_commission_rate');
                setupCommissionSelector('fleet_commission_type', 'fleetCurrencyIcon', 'fleetPercentageIcon', 'fleet_commission_rate');
            });
        })(jQuery);
    </script>
    @endpush
