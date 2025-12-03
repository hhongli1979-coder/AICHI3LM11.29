@use('App\Models\Page')
@php
$pages = Page::where('status', true)?->get(['id', 'title']);
$smsGateways = getSMSGatewayList();
@endphp
@extends('admin.layouts.master')
@section('title', __('static.settings.settings'))
@section('content')
<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <div class="contentbox-subtitle">
                <h3>{{ __('static.settings.settings') }}</h3>
            </div>
        </div>
        <div class="contentbox-body">
            <div class="vertical-tabs">
                <div class="row g-xl-5 g-4">
                    <div class="col-xl-4 col-12">
                        <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                            aria-orientation="vertical">
                            <a class="nav-link active" id="v-pills-tabContent" data-bs-toggle="pill"
                                data-bs-target="#general_settings" type="button" role="tab"
                                aria-controls="v-pills-general" aria-selected="true">
                                <i class="ri-settings-5-line"></i>{{ __('static.settings.general') }}
                            </a>
                            <a class="nav-link" id="v-pills-appearance-tab" data-bs-toggle="pill"
                                data-bs-target="#Appearance" type="button" role="tab"
                                aria-controls="v-pills-appearance" aria-selected="false">
                                <i class="ri-sun-line"></i>{{ __('static.settings.appearance') }}
                            </a>
                            <a class="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill"
                                data-bs-target="#Ads_Setting" type="button" role="tab"
                                aria-controls="v-pills-profile" aria-selected="false">
                                <i class="ri-toggle-line"></i>{{ __('static.settings.activation') }}
                            </a>
                            <a class="nav-link" id="v-pills-messages-tab" data-bs-toggle="pill"
                                data-bs-target="#Email_Setting" type="button" role="tab"
                                aria-controls="v-pills-messages" aria-selected="false">
                                <i class="ri-mail-open-line"></i>{{ __('static.settings.email_configuration') }}
                            </a>
                            <a class="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill"
                                data-bs-target="#Google_Recaptcha" type="button" role="tab"
                                aria-controls="v-pills-settings" aria-selected="false">
                                <i class="ri-google-line"></i>{{ __('static.settings.google_recaptcha') }}
                            </a>
                            <a class="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill"
                                data-bs-target="#firebase" type="button" role="tab"
                                aria-controls="v-pills-settings" aria-selected="false">
                                <i class="ri-fire-line"></i>{{ __('static.settings.firebase') }}
                            </a>
                            @if (@$settings['activation']['social_login_enable'])
                            <a class="nav-link " id="v-pills-social-tab" data-bs-toggle="pill"
                                data-bs-target="#social" type="button" role="tab"
                                aria-controls="v-pills-social" aria-selected="true">
                                <i class="ri-global-line"></i>{{ __('static.settings.social') }}
                            </a>
                            @endif
                            <a class="nav-link" id="v-pills-maintenance-mode-tab" data-bs-toggle="pill"
                                data-bs-target="#maintenance_mode" type="button" role="tab"
                                aria-controls="v-pills-maintenance-mode" aria-selected="true">
                                <i class="ri-alert-line"></i>{{ __('static.settings.maintenance_mode') }}
                            </a>
                        </div>
                    </div>
                    <div class="col-xxl-7 col-xl-8 col-12 tab-b-left">
                        <form method="POST" class="needs-validation user-add" id="settingsForm"
                            action="{{ route('admin.setting.update', @$id) }}" enctype="multipart/form-data">
                            @csrf @method('PUT')
                            <div class="tab-content w-100" id="v-pills-tabContent">
                                <div class="tab-pane fade show active" id="general_settings" role="tabpanel"
                                    aria-labelledby="v-pills-general" tabindex="0">
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="light_logo_image_id">{{ __('static.settings.light_logo') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.light_logo_span') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <div class="form-group">
                                                <x-image :name="'general[light_logo_image_id]'" :data="isset($settings['general']['light_logo_image'])
                                                        ? $settings['general']['light_logo_image']
                                                        : old('general.light_logo_image_id')" :text="false"
                                                    :multiple="false"></x-image>
                                                @error('light_logo_image_id')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="dark_logo_image_id">{{ __('static.settings.dark_logo') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.dark_logo_span') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <div class="form-group">
                                                <x-image :name="'general[dark_logo_image_id]'" :data="isset($settings['general']['dark_logo_image'])
                                                        ? $settings['general']['dark_logo_image']
                                                        : old('general.dark_logo_image_id')" :text="false"
                                                    :multiple="false"></x-image>
                                                @error('dark_logo_image_id')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="favicon_image_id">{{ __('static.settings.favicon') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.favicon_span') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <div class="form-group">
                                                <x-image :name="'general[favicon_image_id]'" :data="isset($settings['general']['favicon_image'])
                                                        ? $settings['general']['favicon_image']
                                                        : old('general.favicon_image_id')" :text="false"
                                                    :multiple="false"></x-image>
                                                @error('favicon_image_id')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="site_name">{{ __('static.settings.site_name') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" id="general[site_name]"
                                                name="general[site_name]"
                                                value="{{ $settings['general']['site_name'] ?? old('site_name') }}"
                                                placeholder="{{ __('static.settings.enter_site_name') }}">
                                            @error('general[site_name]')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="country"
                                            class="col-md-2">{{ __('static.settings.timezone') }}</label>
                                        <div class="col-md-10 error-div select-dropdown">
                                            <select class="select-2 form-control select-country"
                                                id="general[default_timezone]" name="general[default_timezone]"
                                                data-placeholder="{{ __('static.settings.select_timezone') }}">
                                                <option class="select-placeholder" value=""></option>
                                                @forelse ($timeZones as $timeZone)
                                                <option class="option" value={{ $timeZone->value }}
                                                    @if ($settings['general']['default_timezone'] ?? old('default_timezone')) @if ($timeZone->value == $settings['general']['default_timezone']) selected @endif
                                                    @endif>{{ $timeZone->label() }}</option>
                                                @empty
                                                <option value="" disabled></option>
                                                @endforelse
                                            </select>
                                            @error('general[default_timezone]')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label for="time_format" class="col-md-2">{{ __('static.settings.time_format') }}</label>
                                        <div class="col-md-10 error-div select-dropdown">
                                            <select class="select-2 form-control select-time-format" id="time_format"
                                                name="general[time_format]"
                                                data-placeholder="{{ __('static.settings.select_time_format') }}">
                                                <option class="select-placeholder" value=""></option>
                                                @forelse ([12 => '12-Hour (AM/PM)', 24 => '24-Hour'] as $key => $option)
                                                <option class="option" value="{{ $key }}"
                                                    @if (($settings['general']['time_format'] ?? old('time_format'))==$key) selected @endif>
                                                    {{ $option }}
                                                </option>
                                                @empty
                                                <option value="" disabled></option>
                                                @endforelse
                                            </select>
                                            @error('time_format')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label for="country"
                                            class="col-md-2">{{ __('static.settings.sms_gateway') }}<span>*</span></label>
                                        <div class="col-md-10 error-div select-dropdown">
                                            <select class="select-2 form-control select-country"
                                                id="general[default_sms_gateway]" name="general[default_sms_gateway]"
                                                data-placeholder="{{ __('static.settings.select_sms_gateway') }}">
                                                <option class="select-placeholder" value=""></option>
                                                @forelse ($smsGateways as $smsGateway)
                                                <option class="option" value="{{ $smsGateway['slug'] }}"
                                                    @if ($settings['general']['default_sms_gateway'] ?? old('default_sms_gateway')) @if ($smsGateway['slug']==$settings['general']['default_sms_gateway']) selected @endif
                                                    @endif>{{ $smsGateway['name'] }}</option>
                                                @empty
                                                <option value="" disabled></option>
                                                @endforelse
                                            </select>
                                            @error('general[default_sms_gateway]')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="general[default_language_id]"
                                            class="col-md-2">{{ __('static.settings.default_language_id') }}</label>
                                        <div class="col-md-10 error-div select-dropdown">
                                            <select class="select-2 form-control select-country"
                                                id="general[default_language_id]" name="general[default_language_id]"
                                                data-placeholder="{{ __('static.settings.select_language') }}">
                                                <option class="select-placeholder" value=""></option>
                                                @forelse (getLanguage() as $key => $option)
                                                <option class="option" value={{ $key }}
                                                    @if ($settings['general']['default_language_id'] ?? old('default_language_id')) @if ($key==$settings['general']['default_language_id']) selected @endif
                                                    @endif>{{ $option }}</option>
                                                @empty
                                                <option value="" disabled></option>
                                                @endforelse
                                            </select>
                                            <span class="text-gray mt-1">
                                                {{ __('static.settings.no_languages_message') }}
                                                <a href="{{ @route('admin.language.index') }}" class="text-primary">
                                                    <b>{{ __('static.here') }}</b>
                                                </a>
                                            </span>
                                            @error('general[default_language_id]')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label for="general[default_currency_id]"
                                            class="col-md-2">{{ __('static.settings.currency') }}</label>
                                        <div class="col-md-10 error-div select-dropdown">
                                            <select class="select-2 form-control select-currency"
                                                id="general[default_currency_id]" name="general[default_currency_id]"
                                                data-placeholder="{{ __('static.settings.select_currency') }}">
                                                <option class="select-placeholder" value=""></option>
                                                @forelse (getCurrencies() as $key => $option)
                                                <option class="option" value={{ $key }}
                                                    @if ($settings['general']['default_currency_id'] ?? old('default_currency_id')) @if ($key==$settings['general']['default_currency_id']) selected @endif
                                                    @endif>{{ $option }}</option>
                                                @empty
                                                <option value="" disabled></option>
                                                @endforelse
                                            </select>
                                            <span class="text-gray mt-1">
                                                {{ __('static.settings.no_currencies_message') }}
                                                <a href="{{ @route('admin.currency.index') }}" class="text-primary">
                                                    <b>{{ __('static.here') }}</b>
                                                </a>
                                            </span>
                                            @error('general[default_currency_id]')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="platform_fees">{{ __('static.settings.platform_fees') }}</label>
                                        <div class="col-md-10">
                                            <div class="input-group mb-3 flex-nowrap">
                                                <span
                                                    class="input-group-text">{{ getDefaultCurrency()?->symbol }}</span>
                                                <input class="form-control" type="number" min="1"
                                                    id="general[platform_fees]" name="general[platform_fees]"
                                                    value="{{ $settings['general']['platform_fees'] ?? old('platform_fees') }}"
                                                    placeholder="{{ __('static.settings.enter_platform_fees') }}">
                                                @error('general[platform_fees]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label for="mode" class="col-md-2">{{ __('static.settings.mode') }}</label>
                                        <div class="col-md-10 error-div select-dropdown">
                                            <select class="select-2 form-control select-mode" id="mode"
                                                name="general[mode]"
                                                data-placeholder="{{ __('static.settings.select_mode') }}">
                                                <option class="select-placeholder" value=""></option>
                                                @forelse (['dark' => 'Dark', 'light' => 'Light'] as $key => $option)
                                                <option class="option" value={{ $key }}
                                                    @if ($settings['general']['mode'] ?? old('mode')) @if ($key==$settings['general']['mode']) selected @endif
                                                    @endif>{{ $option }}</option>
                                                @empty
                                                <option value="" disabled></option>
                                                @endforelse
                                            </select>
                                            @error('mode')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="copyright_text">{{ __('static.settings.copyright_text') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" id="general[copyright]"
                                                name="general[copyright]"
                                                value="{{ $settings['general']['copyright'] ?? old('copyright') }}"
                                                placeholder="{{ __('static.settings.enter_copyright_text') }}">
                                            @error('general[copyright]')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="Appearance" role="tabpanel"
                                    aria-labelledby="v-pills-appearance-tab" tabindex="0">
                                    <div class="form-group row">
                                        <label class="col-xxl-3 col-md-4" for="appearance[primary_color]">
                                            {{ __('static.settings.primary_color') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.enter_primary_color') }}">
                                            </i>
                                        </label>
                                        <div class="col-xxl-9 col-md-8">
                                            <input type="color" class="form-control color-picker"
                                                name="appearance[primary_color]" id="primary_color"
                                                value="{{ $settings['appearance']['primary_color'] ?? '#199675' }}">
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-xxl-3 col-md-4" for="appearance[secondary_color]">
                                            {{ __('Secondary Color') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('Select secondary color for front.') }}">
                                            </i>
                                        </label>
                                        <div class="col-xxl-9 col-md-8">
                                            <input type="color" class="form-control color-picker"
                                                name="appearance[secondary_color]"
                                                value="{{ $settings['appearance']['secondary_color'] ?? '#115444' }}">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label
                                            class="col-xxl-3 col-md-4">{{ __('static.settings.sidebar_background_type') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.enter_sidebar_color_type') }}">
                                            </i>
                                        </label>
                                        <div class="col-md-9">
                                            <select id="sidebar-bg-type" class="form-control"
                                                name="appearance[sidebar_background_type]">
                                                <option value="solid"
                                                    {{ ($settings['appearance']['sidebar_background_type'] ?? '') == 'solid' ? 'selected' : '' }}>
                                                    Solid
                                                </option>
                                                <option value="gradient"
                                                    {{ ($settings['appearance']['sidebar_background_type'] ?? '') == 'gradient' ? 'selected' : '' }}>
                                                    Gradient
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div id="solid-color-container" class="form-group row" style="display: none;">
                                        <label class="col-md-3">{{ __('static.settings.sidebar_solid_color') }}<i
                                                class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.enter_color') }}">
                                            </i></label>
                                        <div class="col-md-9">
                                            <input type="color" class="form-control color-picker"
                                                name="appearance[sidebar_solid_color]"
                                                value="{{ $settings['appearance']['sidebar_solid_color'] ?? '#199675' }}">
                                        </div>
                                    </div>

                                    <div id="gradient-color-container" class="form-group row" style="display: none;">
                                        <label class="col-md-3">{{ __('static.settings.color1') }}<i
                                                class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.select_first_gradient_color') }}">
                                            </i></label>
                                        <div class="col-md-4">
                                            <input type="color" class="form-control color-picker"
                                                id="gradient-color-1" name="appearance[sidebar_gradient_color_1]"
                                                value="{{ $settings['appearance']['sidebar_gradient_color_1'] ?? '#199675' }}">
                                        </div>
                                    </div>

                                    <div id="gradient-color-container-2" class="form-group row"
                                        style="display: none;">
                                        <label class="col-md-3">{{ __('static.settings.color2') }}<i
                                                class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.select_second_gradient_color') }}">
                                            </i></label>
                                        <div class="col-md-4">
                                            <input type="color" class="form-control color-picker"
                                                id="gradient-color-2" name="appearance[sidebar_gradient_color_2]"
                                                value="{{ $settings['appearance']['sidebar_gradient_color_2'] ?? '#212121' }}">
                                        </div>
                                    </div>


                                    <div class="form-group row">
                                        <label class="col-md-3">{{ __('static.settings.font_family') }}<i
                                                class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.enter_font_family') }}">
                                            </i></label>
                                        <div class="col-md-9">
                                            <select class="form-control" name="appearance[font_family]">
                                                <option value="Inter"
                                                    {{ $settings['appearance']['font_family'] == 'Inter' ? 'selected' : '' }}>
                                                    Inter
                                                </option>
                                                <option value="Inter"
                                                    {{ $settings['appearance']['font_family'] == 'Inter' ? 'selected' : '' }}>
                                                    Inter
                                                </option>
                                                <option value="Arial"
                                                    {{ $settings['appearance']['font_family'] == 'Arial' ? 'selected' : '' }}>
                                                    Arial
                                                </option>
                                                <option value="Times New Roman"
                                                    {{ $settings['appearance']['font_family'] == 'Times New Roman' ? 'selected' : '' }}>
                                                    Times New Roman</option>
                                                <option value="Roboto"
                                                    {{ $settings['appearance']['font_family'] == 'Roboto' ? 'selected' : '' }}>
                                                    Roboto
                                                </option>
                                                <option value="Poppins"
                                                    {{ $settings['appearance']['font_family'] == 'Poppins' ? 'selected' : '' }}>
                                                    Poppins</option>
                                                <option value="Lato"
                                                    {{ $settings['appearance']['font_family'] == 'Lato' ? 'selected' : '' }}>
                                                    Lato
                                                </option>
                                                <option value="Open Sans"
                                                    {{ $settings['appearance']['font_family'] == 'Open Sans' ? 'selected' : '' }}>
                                                    Open Sans</option>
                                                <option value="Montserrat"
                                                    {{ $settings['appearance']['font_family'] == 'Montserrat' ? 'selected' : '' }}>
                                                    Montserrat</option>
                                                <option value="Nunito"
                                                    {{ $settings['appearance']['font_family'] == 'Nunito' ? 'selected' : '' }}>
                                                    Nunito
                                                </option>
                                                <option value="Oswald"
                                                    {{ $settings['appearance']['font_family'] == 'Oswald' ? 'selected' : '' }}>
                                                    Oswald
                                                </option>
                                                <option value="Merriweather"
                                                    {{ $settings['appearance']['font_family'] == 'Merriweather' ? 'selected' : '' }}>
                                                    Merriweather</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-3">{{ __('static.settings.front_font_family') }}<i
                                                class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.enter_front_font_family') }}">
                                            </i></label>
                                        <div class="col-md-9">
                                            <select class="form-control" name="appearance[front_font_family]">
                                                <option value="DM Sans" {{ $settings['appearance']['front_font_family']=='DM Sans' ? 'selected' : '' }}>DM Sans</option>
                                                <option value="Arial" {{ $settings['appearance']['front_font_family']=='Arial' ? 'selected' : '' }}>Arial</option>
                                                <option value="Times New Roman" {{ $settings['appearance']['front_font_family']=='Times New Roman' ? 'selected' : '' }}>Times New Roman</option>
                                                <option value="Roboto" {{ $settings['appearance']['front_font_family']=='Roboto' ? 'selected' : '' }}>Roboto</option>
                                                <option value="Poppins" {{ $settings['appearance']['front_font_family']=='Poppins' ? 'selected' : '' }}>Poppins</option>
                                                <option value="Lato" {{ $settings['appearance']['front_font_family']=='Lato' ? 'selected' : '' }}>Lato</option>
                                                <option value="Open Sans" {{ $settings['appearance']['front_font_family']=='Open Sans' ? 'selected' : '' }}>Open Sans</option>
                                                <option value="Montserrat" {{ $settings['appearance']['front_font_family']=='Montserrat' ? 'selected' : '' }}>Montserrat</option>
                                                <option value="Nunito" {{ $settings['appearance']['front_font_family']=='Nunito' ? 'selected' : '' }}>Nunito</option>
                                                <option value="Oswald" {{ $settings['appearance']['front_font_family']=='Oswald' ? 'selected' : '' }}>Oswald</option>
                                                <option value="Merriweather" {{ $settings['appearance']['front_font_family']=='Merriweather' ? 'selected' : '' }}>Merriweather</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-xxl-3 col-md-4"
                                            for="appearance[preloader_image_id]">{{ __('static.settings.preloader_image') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.preloader_image_span') }}"></i>
                                        </label>
                                        <div class="col-xxl-9 col-md-8">
                                            <div class="form-group">
                                                <x-image :name="'appearance[preloader_image_id]'"
                                                    :data="isset($settings['appearance']['preloader_image']) ? $settings['appearance']['preloader_image'] : null"
                                                    :text="false" :multiple="false"></x-image>
                                                @error('appearance.preloader_image_id')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="tab-pane fade" id="Ads_Setting" role="tabpanel"
                                    aria-labelledby="v-pills-profile-tab" tabindex="0">
                                    <div class="form-group row">
                                        <label class="col-xxl-3 col-md-4"
                                            for="activation[platform_fees]">{{ __('static.settings.platform_fees') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.enter_platform_fees') }}"></i>
                                        </label>
                                        <div class="col-xxl-9 col-md-8">
                                            <div class="editor-space">
                                                <label class="switch">
                                                    @if (isset($settings['activation']['platform_fees']))
                                                    <input class="form-control" type="hidden"
                                                        name="activation[platform_fees]" value="0">
                                                    <input class="form-check-input" type="checkbox" class="primary_color"
                                                        name="activation[platform_fees]" value="1"
                                                        {{ $settings['activation']['platform_fees'] ? 'checked' : '' }}>
                                                    @else
                                                    <input class="form-control" type="hidden"
                                                        name="activation[platform_fees]" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="activation[platform_fees]" value="1">
                                                    @endif
                                                    <span class="switch-state"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-xxl-3 col-md-4"
                                            for="activation[social_login_enable]">{{ __('static.settings.social_login_enable') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.enter_social_login_enable') }}"></i>
                                        </label>
                                        <div class="col-xxl-9 col-md-8">
                                            <div class="editor-space">
                                                <label class="switch">
                                                    @if (isset($settings['activation']['social_login_enable']))
                                                    <input class="form-control" type="hidden"
                                                        name="activation[social_login_enable]" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="activation[social_login_enable]" value="1"
                                                        {{ $settings['activation']['social_login_enable'] ? 'checked' : '' }}>
                                                    @else
                                                    <input class="form-control" type="hidden"
                                                        name="activation[social_login_enable]" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="activation[social_login_enable]" value="1">
                                                    @endif
                                                    <span class="switch-state"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="form-group row">
                                        <label class="col-xxl-3 col-md-4"
                                            for="activation[default_credentials]">{{ __('static.settings.default_credentials') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.default_credentials_span') }}"></i>
                                        </label>
                                        <div class="col-xxl-9 col-md-8">
                                            <div class="editor-space">
                                                <label class="switch">
                                                    @if (isset($settings['activation']['default_credentials']))
                                                    <input class="form-control" type="hidden"
                                                        name="activation[default_credentials]" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="activation[default_credentials]" value="1"
                                                        {{ $settings['activation']['default_credentials'] ? 'checked' : '' }}>
                                                    @else
                                                    <input class="form-control" type="hidden"
                                                        name="activation[default_credentials]" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="activation[default_credentials]" value="1">
                                                    @endif
                                                    <span class="switch-state"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-xxl-3 col-md-4"
                                            for="activation[demo_mode]">{{ __('static.settings.demo_mode') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.enter_demo_mode') }}"></i>
                                        </label>
                                        <div class="col-xxl-9 col-md-8">
                                            <div class="editor-space">
                                                <label class="switch">
                                                    @if (isset($settings['activation']['demo_mode']))
                                                    <input class="form-control" type="hidden"
                                                        name="activation[demo_mode]" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="activation[demo_mode]" value="1"
                                                        {{ $settings['activation']['demo_mode'] ? 'checked' : '' }}>
                                                    @else
                                                    <input class="form-control" type="hidden"
                                                        name="activation[demo_mode]" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="activation[demo_mode]" value="1">
                                                    @endif
                                                    <span class="switch-state"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-xxl-3 col-md-4"
                                            for="activation[preloader_enabled]">{{ __('static.settings.preloader_enabled') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.enter_preloader_enabled') }}"></i>
                                        </label>
                                        <div class="col-xxl-9 col-md-8">
                                            <div class="editor-space">
                                                <label class="switch">
                                                    @if (isset($settings['activation']['preloader_enabled']))
                                                    <input class="form-control" type="hidden"
                                                        name="activation[preloader_enabled]" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="activation[preloader_enabled]" value="1"
                                                        {{ $settings['activation']['preloader_enabled'] ? 'checked' : '' }}>
                                                    @else
                                                    <input class="form-control" type="hidden"
                                                        name="activation[preloader_enabled]" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="activation[preloader_enabled]" value="1">
                                                    @endif
                                                    <span class="switch-state"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="tab-pane fade" id="Email_Setting" role="tabpanel"
                                    aria-labelledby="v-pills-settings-tab" tabindex="0">
                                    <div class="form-group row">
                                        <label for="country"
                                            class="col-md-2">{{ __('static.settings.mailer') }}</label>
                                        <div class="col-md-10 error-div select-dropdown">
                                            <select class="select-2 form-control select-country"
                                                id="email[mail_mailer]" name="email[mail_mailer]"
                                                data-placeholder="{{ __('static.settings.select_mail_mailer') }}">
                                                <option class="select-placeholder" value=""></option>
                                                @forelse (['smtp' => 'SMTP', 'sendmail' => 'Sendmail'] as $key => $option)
                                                <option class="option" value={{ $key }}
                                                    @if ($settings['email']['mail_mailer'] ?? old('mail_mailer')) @if ($key==$settings['email']['mail_mailer']) selected @endif
                                                    @endif>{{ $option }}</option>
                                                @empty
                                                <option value="" disabled></option>
                                                @endforelse
                                            </select>
                                            @error('mode')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="mail_host">{{ __('static.settings.host') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="email[mail_host]"
                                                id="email[mail_host]"
                                                value="{{ isset($settings['email']['mail_host']) ? $settings['email']['mail_host'] : old('mail_host') }}"
                                                placeholder="{{ __('static.settings.enter_host') }}">
                                            @error('email[mail_host]')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="mail_port">{{ __('static.settings.port') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="number" min="1"
                                                name="email[mail_port]" id="email[mail_port]"
                                                value="{{ isset($settings['email']['mail_port']) ? $settings['email']['mail_port'] : old('mail_host') }}"
                                                placeholder="{{ __('static.settings.enter_port') }}">
                                            @error('mail_port')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="country"
                                            class="col-md-2">{{ __('static.settings.mail_encryption') }}</label>
                                        <div class="col-md-10 select-label-error">
                                            <select class="select-2 form-control select-country"
                                                id="email[mail_encryption]" name="email[mail_encryption]"
                                                data-placeholder="{{ __('static.settings.select_mail_encryption') }}">
                                                <option class="select-placeholder" value=""></option>
                                                @forelse (['tls' => 'TLS', 'ssl' => 'SSL'] as $key => $option)
                                                <option class="option" value={{ $key }}
                                                    @if ($settings['email']['mail_encryption'] ?? old('mail_encryption')) @if ($key==$settings['email']['mail_encryption']) selected @endif
                                                    @endif>{{ $option }}</option>
                                                @empty
                                                <option value="" disabled></option>
                                                @endforelse
                                            </select>
                                            @error('mode')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="mail_username">{{ __('static.settings.mail_username') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="email[mail_username]"
                                                id="email[mail_username]"
                                                value="{{ isset($settings['email']['mail_username']) ? $settings['email']['mail_username'] : old('mail_username') }}"
                                                placeholder="{{ __('static.settings.enter_username') }}">
                                            @error('mail_username')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="password">{{ __('static.settings.mail_password') }}<span>
                                                *</span></label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password" name="email[mail_password]"
                                                id="email[mail_password]"
                                                value="{{ encryptKey(isset($settings['email']['mail_password']) ? $settings['email']['mail_password'] : old('mail_password')) }}"
                                                placeholder="{{ __('static.settings.enter_password') }}">
                                            @error('mail_password')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="mail_from_name">{{ __('static.settings.mail_from_name') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="email[mail_from_name]"
                                                id="email[mail_from_name]"
                                                value="{{ isset($settings['email']['mail_from_name']) ? $settings['email']['mail_from_name'] : old('mail_from_name') }}"
                                                placeholder="{{ __('static.settings.enter_email_from_name') }}">
                                            @error('mail_from_name')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="mail_from_address">{{ __('static.settings.mail_from_address') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text"
                                                name="email[mail_from_address]" id="email[mail_from_address]"
                                                value="{{ isset($settings['email']['mail_from_address']) ? $settings['email']['mail_from_address'] : old('mail_from_address') }}"
                                                placeholder="{{ __('static.settings.enter_email_from_address') }}">
                                            @error('mail_from_address')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <hr>
                                    <h4 class="fw-semibold mb-3 text-primary w-100">
                                        {{ __('static.settings.test_mail') }}
                                    </h4>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="mail">{{ __('static.settings.to_mail') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="mail" id="mail"
                                                placeholder="{{ __('static.enter_email') }}">
                                            @error('mail')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <button id="send-test-mail" name="test_mail" class="btn btn-primary">
                                        {{ __('static.settings.send_test_mail') }}
                                    </button>

                                    <div class="instruction-box">
                                        <div class="instruction-title">
                                            <h4>{{ __('static.settings.instruction') }}</h4>
                                            <p>
                                                {{ __('static.settings.test_mail_note') }}
                                            </p>
                                        </div>
                                        <div class="list-box">
                                            <h5>{{ __('static.settings.test_mail_not_using_ssl') }}</h5>
                                            <ul>
                                                <li>{{ __('static.settings.test_mail_not_ssl_msg_1') }}</li>
                                                <li>{{ __('static.settings.test_mail_not_ssl_msg_2') }}</li>
                                                <li>{{ __('static.settings.test_mail_not_ssl_msg_3') }}</li>
                                                <li>{{ __('static.settings.test_mail_not_ssl_msg_4') }}</li>
                                            </ul>
                                        </div>
                                        <div class="list-box">

                                            <h5>{{ __('static.settings.test_mail_using_ssl') }}</h5>
                                            <ul>
                                                <li>{{ __('static.settings.test_mail_ssl_msg_1') }}</li>
                                                <li>{{ __('static.settings.test_mail_ssl_msg_2') }}</li>
                                                <li>{{ __('static.settings.test_mail_ssl_msg_3') }}</li>
                                                <li>{{ __('static.settings.test_mail_ssl_msg_4') }}</li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>

                                <div class="tab-pane" id="Readings" role="tabpanel"
                                    aria-labelledby="v-pills-settings-tab" tabindex="0">
                                    <div class="form-group row">
                                        <label for="display_homepage"
                                            class="col-xl-3 col-md-4">{{ __('static.settings.homepage_displays') }}</label>
                                        <div class="col-xl-8 col-md-7">
                                            <div
                                                class="form-group m-checkbox-inline mb-0 custom-radio-ml d-flex radio-animated gap-4">
                                                <label class="d-block" for="post">
                                                    <input class="radio_animated select_home_page" id="post"
                                                        checked="checked" name="readings[status]" type="radio"
                                                        value="1">
                                                    {{ __('static.settings.latest_posts') }}
                                                </label>
                                                <label class="d-block" for="page">
                                                    <input class="radio_animated select_home_page" id="page"
                                                        name="readings[status]" type="radio" value="0">
                                                    {{ __('static.settings.static_page') }}
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="homepage">{{ __('static.settings.home_page') }}</label>
                                        <div class="col-md-10">
                                            <select class="form-control select-2" id="readings[homepage]"
                                                name="readings[home_page]"
                                                data-placeholder="{{ __('static.settings.select_home_page') }}">
                                                <option class="select-placeholder" value=""></option>
                                                @foreach ($pages as $index => $page)
                                                <option value="{{ $page->id }}">
                                                    {{ $page->title }}
                                                </option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="Google_Recaptcha" role="tabpanel"
                                    aria-labelledby="v-pills-settings-tab" tabindex="0">
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="google_reCaptcha[secret]">{{ __('static.settings.secret') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.google_client') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password" id="google_reCaptcha[secret]"
                                                name="google_reCaptcha[secret]"
                                                value="{{ encryptKey($settings['google_reCaptcha']['secret'] ?? old('secret')) }}"
                                                placeholder="{{ __('static.settings.enter_secret') }}">
                                            @error('google_reCaptcha[secret]')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="google_reCaptcha[site_key]">{{ __('static.settings.site_key') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password"
                                                id="google_reCaptcha[site_key]" name="google_reCaptcha[site_key]"
                                                value="{{ encryptKey($settings['google_reCaptcha']['site_key'] ?? old('site_key')) }}"
                                                placeholder="{{ __('static.settings.enter_site_key') }}">
                                            @error('google_reCaptcha[site_key]')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="google_reCaptcha[status]">{{ __('static.settings.status') }}</label>
                                        <div class="col-md-10">
                                            <div class="editor-space">
                                                <label class="switch">
                                                    @if (isset($settings['google_reCaptcha']['status']))
                                                    <input class="form-control" type="hidden"
                                                        name="google_reCaptcha[status]" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="google_reCaptcha[status]" value="1"
                                                        {{ $settings['google_reCaptcha']['status'] ? 'checked' : '' }}>
                                                    @else
                                                    <input class="form-control" type="hidden"
                                                        name="google_reCaptcha[status]" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="google_reCaptcha[status]" value="1">
                                                    @endif
                                                    <span class="switch-state"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="tab-pane fade" id="firebase" role="tabpanel"
                                    aria-labelledby="v-pills-settings-tab" tabindex="0">
                                    <div class="form-group row">
                                        <label for="image" class="col-md-2">{{ __('static.settings.firebase_service_json') }}</label>
                                        <div class="col-md-10">
                                            @php
                                            $assetsPath = public_path('admin/assets');
                                            $firebaseFilePath = $assetsPath . '/firebase.json';
                                            $firebaseData = null;
                                            $files = [];

                                            if (file_exists($firebaseFilePath)) {
                                            $fileContents = file_get_contents($firebaseFilePath);
                                            $firebaseData = json_decode($fileContents, true);
                                            }
                                            if (is_dir($assetsPath)) {
                                            $allFiles = array_diff(scandir($assetsPath), ['.', '..']);
                                            $files = array_filter($allFiles, function($file) {
                                            return $file === 'firebase.json';
                                            });
                                            }
                                            @endphp

                                            <input class="form-control" type="file" id="firebase[service_json]"
                                                accept="application/JSON" name="firebase[service_json]">

                                            <span class="text-gray mt-1">
                                                {{ __('static.settings.firebase_service_json_span') }} <a href="https://support.google.com/firebase/answer/7015592?hl=en#zippy=%2Cin-this-article"
                                                    target="_blank" class="text-primary">{{ __('static.settings.firebase_service_json_span_link') }}</a>.
                                            </span>

                                            @error('firebase.service_json')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label for="image" class="col-md-2"></label>
                                        <div class="col-md-10">
                                            @if ($firebaseData || !empty($files))
                                            <div class="file-main-box">
                                                @if ($firebaseData)
                                                <input type="hidden" class="form-control mb-2"
                                                    value="{{ $firebaseData['project_id'] ?? 'N/A' }}" readonly>
                                                @endif

                                                @if (!empty($files))
                                                <ul class="list-group">
                                                    @foreach ($files as $file)
                                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                                        <span>{{ $file }}</span>
                                                        <a href="{{ asset('admin/assets/' . $file) }}" download class="btn">
                                                            <i class="ri-download-line"></i>
                                                        </a>
                                                    </li>
                                                    @endforeach
                                                </ul>
                                                @endif
                                            </div>
                                            @endif
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2" for="firebase[firebase_api_key]">{{ __('static.settings.firebase_api_key') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password" id="firebase[firebase_api_key]" name="firebase[firebase_api_key]"
                                                value="{{ $settings['firebase']['firebase_api_key'] ?? old('firebase_api_key') }}"
                                                placeholder="{{ __('static.settings.enter_firebase_api_key') }}">
                                            @error('firebase.firebase_api_key')
                                            <span class="invalid-feedback d-block" role="alert"><strong>{{ $message }}</strong></span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2" for="firebase[firebase_auth_domain]">{{ __('static.settings.firebase_auth_domain') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password" id="firebase[firebase_auth_domain]" name="firebase[firebase_auth_domain]"
                                                value="{{ $settings['firebase']['firebase_auth_domain'] ?? old('firebase_auth_domain') }}"
                                                placeholder="{{ __('static.settings.enter_firebase_auth_domain') }}">
                                            @error('firebase.firebase_auth_domain')
                                            <span class="invalid-feedback d-block" role="alert"><strong>{{ $message }}</strong></span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2" for="firebase[firebase_project_id]">{{ __('static.settings.firebase_project_id') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password" id="firebase[firebase_project_id]" name="firebase[firebase_project_id]"
                                                value="{{ $settings['firebase']['firebase_project_id'] ?? old('firebase_project_id') }}"
                                                placeholder="{{ __('static.settings.enter_firebase_project_id') }}">
                                            @error('firebase.firebase_project_id')
                                            <span class="invalid-feedback d-block" role="alert"><strong>{{ $message }}</strong></span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2" for="firebase[firebase_storage_bucket]">{{ __('static.settings.firebase_storage_bucket') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password" id="firebase[firebase_storage_bucket]" name="firebase[firebase_storage_bucket]"
                                                value="{{ $settings['firebase']['firebase_storage_bucket'] ?? old('firebase_storage_bucket') }}"
                                                placeholder="{{ __('static.settings.enter_firebase_storage_bucket') }}">
                                            @error('firebase.firebase_storage_bucket')
                                            <span class="invalid-feedback d-block" role="alert"><strong>{{ $message }}</strong></span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2" for="firebase[firebase_messaging_sender_id]">{{ __('static.settings.firebase_messaging_sender_id') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password" id="firebase[firebase_messaging_sender_id]" name="firebase[firebase_messaging_sender_id]"
                                                value="{{ $settings['firebase']['firebase_messaging_sender_id'] ?? old('firebase_messaging_sender_id') }}"
                                                placeholder="{{ __('static.settings.enter_firebase_messaging_sender_id') }}">
                                            @error('firebase.firebase_messaging_sender_id')
                                            <span class="invalid-feedback d-block" role="alert"><strong>{{ $message }}</strong></span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2" for="firebase[firebase_app_id]">{{ __('static.settings.firebase_app_id') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password" id="firebase[firebase_app_id]" name="firebase[firebase_app_id]"
                                                value="{{ $settings['firebase']['firebase_app_id'] ?? old('firebase_app_id') }}"
                                                placeholder="{{ __('static.settings.enter_firebase_app_id') }}">
                                            @error('firebase.firebase_app_id')
                                            <span class="invalid-feedback d-block" role="alert"><strong>{{ $message }}</strong></span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2" for="firebase[firebase_measurement_id]">{{ __('static.settings.firebase_measurement_id') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password" id="firebase[firebase_measurement_id]" name="firebase[firebase_measurement_id]"
                                                value="{{ $settings['firebase']['firebase_measurement_id'] ?? old('firebase_measurement_id') }}"
                                                placeholder="{{ __('static.settings.enter_firebase_measurement_id') }}">
                                            @error('firebase.firebase_measurement_id')
                                            <span class="invalid-feedback d-block" role="alert"><strong>{{ $message }}</strong></span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="social" role="tabpanel"
                                    aria-labelledby="v-pills-social" tabindex="0">
                                    <div class="form-group row">

                                        <label class="col-md-2" for="social_login[google][client_id]">
                                            {{ __('static.settings.google_client_id') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.google_client') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password"
                                                id="social_login[google][client_id]"
                                                name="social_login[google][client_id]"
                                                value="{{ encryptKey($settings['social_login']['google']['client_id'] ?? '') ?? old('social_login.google.client_id') }}"
                                                placeholder="{{ __('static.settings.enter_google_client_id') }}">
                                            @error('social_login.google.client_id')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="social_login[google][client_secret]">{{ __('static.settings.google_client_secret') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.google_secret') }}"></i></label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password"
                                                id="social_login[google][client_secret]"
                                                name="social_login[google][client_secret]"
                                                value="{{ encryptKey($settings['social_login']['google']['client_secret'] ?? '') ?? old('social_login.google.client_secret') }}"
                                                placeholder="{{ __('static.settings.enter_google_client_secret') }}">
                                            @error('social_login.google.client_secret')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="social_login[apple][client_id]">{{ __('static.settings.apple_client_id') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.apple_client') }}"></i></label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password"
                                                id="social_login[apple][client_id]"
                                                name="social_login[apple][client_id]"
                                                value="{{ encryptKey($settings['social_login']['apple']['client_id'] ?? '') ?? old('social_login.apple.client_id') }}"
                                                placeholder="{{ __('static.settings.enter_apple_client_id') }}">
                                            @error('social_login.apple.client_id')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="social_login[apple][client_secret]">{{ __('static.settings.apple_client_secret') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.apple_secret') }}"></i></label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password"
                                                id="social_login[apple][client_secret]"
                                                name="social_login[apple][client_secret]"
                                                value="{{ encryptKey($settings['social_login']['apple']['client_secret'] ?? '') ?? old('social_login.apple.client_secret') }}"
                                                placeholder="{{ __('static.settings.enter_apple_client_secret') }}">
                                            @error('social_login.apple.client_secret')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="maintenance_mode" role="tabpanel"
                                    aria-labelledby="v-pills-maintenance-mode" tabindex="0">
                                    <div class="form-group row">
                                        <label class="col-xxl-3 col-md-4"
                                            for="maintenance[maintenance_mode]">{{ __('static.settings.maintenance_mode') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('static.settings.enter_maintenance_mode') }}"></i>
                                        </label>
                                        <div class="col-xxl-9 col-md-8">
                                            <div class="editor-space">
                                                <label class="switch">
                                                    @if (isset($settings['maintenance']['maintenance_mode']))
                                                    <input class="form-control" type="hidden"
                                                        name="maintenance[maintenance_mode]" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="maintenance[maintenance_mode]" value="1"
                                                        {{ $settings['maintenance']['maintenance_mode'] ? 'checked' : '' }}>
                                                    @else
                                                    <input class="form-control" type="hidden"
                                                        name="maintenance[maintenance_mode]" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="maintenance[maintenance_mode]" value="1">
                                                    @endif
                                                    <span class="switch-state"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row ">
                                        <label class="col-md-2"
                                            for="content">{{ __('static.notify_templates.content') }}</label>
                                        <div class="col-md-10">
                                            <textarea class="form-control image-embed-content" placeholder="{{ __('static.notify_templates.enter_content') }}"
                                                rows="4" id="maintenance[content]" name="maintenance[content]" cols="50">{{ $settings['maintenance']['content'] ?? old('content') }}</textarea>
                                            @error('maintenance.content')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>

                                </div>
                                <button type="submit" class="btn  spinner-btn btn-primary" id="savebtn"><i class="ri-save-line text-white lh-1 "></i>{{ __('static.save') }}</button>
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
<script src="{{ asset('js/color-picker.js') }}"></script>
<script>
    $(document).ready(function() {
        "use strict";

        var selectedMode = $('#mode').val();
        var modeFunction = (selectedMode === 'dark') ? darkMode : lightMode;
        modeFunction();

        $('#send-test-mail').click(function(e) {
            e.preventDefault();

            var form = $('#settingsForm');
            var url = form.attr('action');
            var formData = form.serializeArray();
            var additionalData = {
                test_mail: 'true',
            };

            $.each(additionalData, function(key, value) {
                formData.push({
                    name: key,
                    value: value
                });
            });

            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                success: function(response) {
                    let obj = JSON.parse(response);
                    console.log(obj);
                    if (obj.success == true) {
                        toastr.success(obj.message);
                    } else {
                        toastr.error(obj.message);
                    }
                },
                error: function(response) {
                    obj = JSON.parse(response);
                    console.log(obj);
                    toastr.error(obj.message, 'Error');
                }
            });
        });

        function toggleDropdowns() {
            const isPostSelected = $('input:radio[name="readings[status]"]:checked').val() === '1';
            $('#homepage').prop('disabled', isPostSelected);
        }

        toggleDropdowns();

        $('input:radio[name="readings[status]"]').change(function() {
            toggleDropdowns();
        });

        $("#settingsForm").validate({
            ignore: [],
            rules: {
                "email[mail_mailer]": "required",
                "email[mail_host]": "required",
                "email[mail_port]": "required",
                "email[mail_encryption]": "required",
                "email[mail_username]": "required",
                "email[mail_password]": "required",
                "email[mail_from_name]": "required",
                "email[mail_from_address]": "required",
                "general[site_name]": "required",
                "general[default_language_id]": "required",
                "general[default_currency_id]": "required",
                "general[platform_fees]": "required",
                "general[mode]": "required",
                "general[copyright]": "required",
                "general[default_timezone]": "required",
                "app_setting[app_name]": "required",
            },
            invalidHandler: function(event, validator) {
                let invalidTabs = [];
                $.each(validator.errorList, function(index, error) {
                    const tabId = $(error.element).closest('.tab-pane').attr('id');
                    if (tabId) {
                        const tabLink = $(`.nav-link[data-bs-target="#${tabId}"]`);
                        tabLink.find('.errorIcon').show();
                        if (!invalidTabs.includes(tabId)) {
                            invalidTabs.push(tabId);
                        }
                    }
                });
                if (invalidTabs.length) {

                    $(".nav-link.active").removeClass("active");
                    $(".tab-pane.show").removeClass("show active");


                    const firstInvalidTabId = invalidTabs[0];
                    $(`.nav-link[data-bs-target="#${firstInvalidTabId}"]`).addClass("active");
                    $(`#${firstInvalidTabId}`).addClass("show active");
                }
            },
            success: function(label, element) {

            }
        });

    });
</script>
@endpush
