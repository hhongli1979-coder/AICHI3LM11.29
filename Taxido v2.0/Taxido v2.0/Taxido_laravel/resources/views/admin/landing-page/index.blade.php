@extends('admin.layouts.master')
@section('title', __('static.landing_pages.landing_page'))
@use('App\Models\Blog')
@use('App\Models\Page')
@use('App\Models\Faq')
@use('App\Models\Testimonial')
@php
    $blogs = Blog::where('status', true)->get(['id', 'title']);
    $pages = Page::where('status', true)->get(['id', 'title']);
    $faqs = Faq::get(['id', 'title', 'description']);
    $testimonials = Testimonial::get();
@endphp
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('static.landing_pages.landing_page_title') }}</h3>
                </div>
            </div>
            <div class="contentbox-body">
                <div class="vertical-tabs">
                    <div class="row g-xl-5 g-4">
                        <div class="col-xl-3 col-12">
                            <div class="nav flex-column nav-pills" id="v-pills-tab">
                                <a class="nav-link active" id="v-pills-tabContent" data-bs-toggle="pill"
                                    href="#Header_Section">
                                    <i class="ri-layout-top-2-line"></i>{{ __('static.landing_pages.header') }}
                                </a>

                                <a class="nav-link" id="v-pills-home-tab" data-bs-toggle="pill" href="#Home_Section">
                                    <i class="ri-home-line"></i>{{ __('static.landing_pages.home') }}
                                </a>

                                <a class="nav-link" id="v-pills-statistic-tab" data-bs-toggle="pill"
                                    href="#Statistics_Section">
                                    <i class="ri-line-chart-fill"></i>{{ __('static.landing_pages.statistics') }}
                                </a>

                                <a class="nav-link" id="v-pills-feature-tab" data-bs-toggle="pill" href="#Feature_Section">
                                    <i class="ri-file-line"></i>{{ __('static.landing_pages.feature') }}
                                </a>

                                <a class="nav-link" id="v-pills-ride-tab" data-bs-toggle="pill" href="#Ride_Section">
                                    <i class="ri-car-line"></i>{{ __('static.landing_pages.ride') }}
                                </a>

                                <a class="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill" href="#Blog_Section">
                                    <i class="ri-blogger-line"></i>{{ __('static.landing_pages.blog') }}
                                </a>
                                <a class="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill"
                                    href="#Testimonials_Section">
                                    <i class="ri-edit-box-line"></i>{{ __('static.landing_pages.testimonial') }}
                                </a>
                                <a class="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill" href="#FAQ_Section">
                                    <i class="ri-question-answer-line"></i>{{ __('static.landing_pages.faqs') }}
                                </a>
                                <a class="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill" href="#Footer_Section">
                                    <i class="ri-layout-bottom-2-line"></i>{{ __('static.landing_pages.footer') }}
                                </a>
                                <a class="nav-link" id="v-pills-seo-tab" data-bs-toggle="pill" href="#SEO_Section">
                                    <i class="ri-seo-line"></i>{{ __('static.landing_pages.seo') }}
                                </a>

                                <a class="nav-link" id="v-pills-analytics-tab" data-bs-toggle="pill"
                                    href="#Analytics_Section">
                                    <i class="ri-line-chart-line"></i>{{ __('static.landing_pages.analytics') }}
                                </a>
                            </div>
                        </div>
                        <div class="col-xl-9 col-12 tab-b-left">
                            <form method="POST" class="needs-validation user-add" id="landing_pagesForm"
                                action="{{ isset($id) ? route('admin.landing-page.update', $id) : route('admin.landing-page.store') }}"
                                enctype="multipart/form-data">
                                @csrf
                                @if (isset($id))
                                    @method('PUT')
                                @else
                                    @method('POST')
                                @endif
                                <div class="tab-content w-100 choose-img" id="v-pills-tabContent">
                                    <div class="tab-pane active" id="Header_Section">
                                        <div class="form-group row">
                                            <label class="col-md-2" for="logo">
                                                {{ __('static.landing_pages.logo') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('static.landing_pages.logo_span') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="form-group d-flex gap-3 align-items-start media-relative">
                                                    <div class="media-upload-image">
                                                        <input type="file" class="form-control fileInput"
                                                            name="header[logo]" data-preview-id="headerLogoPreview">
                                                        <i class="ri-add-line"></i>
                                                    </div>
                                                    @error('header[logo]')
                                                        <span class="invalid-feedback d-block" role="alert">
                                                            <strong>{{ $message }}</strong>
                                                        </span>
                                                    @enderror


                                                    @if (isset($content['header']['logo']) && !empty($content['header']['logo']))
                                                        <img src="{{ asset(@$content['header']['logo']) }}" id="headerLogoPreview" alt="Current Logo" class="media-img" id="imagePreview">
                                                    @else
                                                        <img src="" alt="Image Preview" class="media-img" id="headerLogoPreview" style="display: none;">
                                                    @endif
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="btn_link">{{ __('static.landing_pages.menus') }}</label>
                                            <div class="col-md-10">
                                                <select class="form-control select-2" id="sections"
                                                    name="header[menus][]"
                                                    data-placeholder="{{ __('static.landing_pages.select_menu') }}" multiple>
                                                    <option class="select-placeholder" value=""></option>
                                                    <option value="Home"
                                                        @if (in_array('Home', @$content['header']['menus'] ?? [])) selected @endif>
                                                        {{ __('static.landing_pages.homes') }}
                                                    </option>
                                                    <option value="Why Taxido?"
                                                        @if (in_array('Why Taxido?', @$content['header']['menus'] ?? [])) selected @endif>
                                                        {{ __('static.landing_pages.why_taxido') }}
                                                    </option>
                                                    <option value="How It Works"
                                                        @if (in_array('How It Works', @$content['header']['menus'] ?? [])) selected @endif>
                                                        {{ __('static.landing_pages.how_it_works') }}
                                                    </option>
                                                    <option value="FAQs"
                                                        @if (in_array('FAQs', @$content['header']['menus'] ?? [])) selected @endif>
                                                        {{ __('static.landing_pages.faq') }}
                                                    </option>
                                                    <option value="Blogs"
                                                        @if (in_array('Blogs', @$content['header']['menus'] ?? [])) selected @endif>
                                                        {{ __('static.landing_pages.blog') }}
                                                    </option>
                                                    <option value="Testimonials"
                                                        @if (in_array('Testimonials', @$content['header']['menus'] ?? [])) selected @endif>
                                                        {{ __('static.landing_pages.testimonial') }}
                                                    </option>
                                                    <option value="Raise Ticket"
                                                        @if (in_array('Raise Ticket', @$content['header']['menus'] ?? [])) selected @endif>
                                                        {{ __('static.landing_pages.raise_ticket') }}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="btn_text">{{ __('static.landing_pages.btn_text') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="header[btn_text]"
                                                    id=""
                                                    value="{{ @$content['header']['btn_text'] ?? old('btn_text') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_btn_text') }}">
                                                @error('header[btn_text]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2" for="menu[status]">{{ __('static.settings.status') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('static.landing_pages.note') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($content['header']['status']))
                                                            <input class="form-control" type="hidden"
                                                                name="header[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="header[status]" value="1"
                                                                {{ @$content['header']['status'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="header[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="header[status]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane" id="Home_Section">

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="btn_image">{{ __('static.landing_pages.left_phone_image') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('static.landing_pages.left_phone_image_span') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="form-group d-flex gap-3 align-items-start media-relative">
                                                    <div class="media-upload-image">
                                                        <input type="file" class="form-control fileInput" name="home[left_phone_image]" data-preview-id="leftPhonePreview">
                                                        <i class="ri-add-line"></i>
                                                    </div>
                                                    @error('home[left_phone_image]')
                                                        <span class="invalid-feedback d-block" role="alert">
                                                            <strong>{{ $message }}</strong>
                                                        </span>
                                                    @enderror
                                                    @if (isset($content['home']['left_phone_image']) && !empty($content['home']['left_phone_image']))
                                                        <img src="{{ asset($content['home']['left_phone_image']) }}" id="leftPhonePreview" alt="image" class="media-img">
                                                    @else
                                                        <img src="" alt="Image Preview" class="media-img" id="leftPhonePreview"  style="display: none;">
                                                    @endif
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="btn_image">{{ __('static.landing_pages.right_phone_image') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('static.landing_pages.right_phone_image_span') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="form-group d-flex gap-3 align-items-start media-relative">
                                                    <div class="media-upload-image">
                                                        <input type="file" class="form-control fileInput" name="home[right_phone_image]"  data-preview-id="rightPhonePreview">
                                                        <i class="ri-add-line"></i>
                                                    </div>
                                                    @error('home[right_phone_image]')
                                                        <span class="invalid-feedback d-block" role="alert">
                                                            <strong>{{ $message }}</strong>
                                                        </span>
                                                    @enderror
                                                    @if (isset($content['home']['right_phone_image']) && !empty($content['home']['right_phone_image']))
                                                        <img src="{{ asset($content['home']['right_phone_image']) }}" alt="image" class="media-img" id="rightPhonePreview">
                                                    @else
                                                        <img src="" alt="Image Preview" class="media-img" id="rightPhonePreview"  style="display: none;">
                                                    @endif
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="title">{{ __('static.landing_pages.title') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="home[title]"
                                                    id=""
                                                    value="{{ @$content['home']['title'] ?? old('title') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_title') }}">
                                                @error('home[title]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="description">{{ __('static.landing_pages.short_description') }}</label>
                                            <div class="col-md-10">
                                                <textarea class="form-control" id="home[description]" name="home[description]"
                                                    placeholder="{{ __('static.landing_pages.enter_description') }}" cols="30" rows="5">{{ old('description', @$content['home']['description'] ?? '') }}</textarea>
                                            </div>
                                            @error('home[description]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2" for="home[status]">{{ __('static.settings.status') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                        data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                        data-bs-title="{{ __('static.landing_pages.home_note') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($content['home']['status']))
                                                            <input class="form-control" type="hidden"
                                                                name="home[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="home[status]" value="1"
                                                                {{ @$content['home']['status'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="home[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="home[status]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="home-btn-container">
                                            @forelse ($content['home']['button'] ?? [] as $index => $button)
                                                <div class="btn-group-row">
                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="btn_text">{{ __('static.landing_pages.btn_text') }}</label>
                                                        <div class="col-md-10">
                                                            <input class="form-control" type="text"
                                                                name="home[button][{{ $index }}][text]"
                                                                value="{{ old("home.button.$index.text", $button['text'] ?? '') }}"
                                                                placeholder="{{ __('static.landing_pages.enter_btn_text') }}">
                                                            @error("home.button.$index.text")
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                            @enderror
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="btn_type">{{ __('static.landing_pages.btn_type') }}</label>
                                                        <div class="col-md-10">
                                                            <select class="form-control select"
                                                                name="home[button][{{ $index }}][type]"
                                                                data-placeholder="{{ __('static.landing_pages.btn_type') }}">
                                                                <option class="select-placeholder" value="" selected disabled>Select type
                                                                </option>
                                                                <option value="outline"
                                                                    {{ old("home.button.$index.type", $button['type'] ?? '') == 'outline' ? 'selected' : '' }}>
                                                                    {{ __('static.landing_pages.outline') }}
                                                                </option>
                                                                <option value="gradient"
                                                                    {{ old("home.button.$index.type", $button['type'] ?? '') == 'gradient' ? 'selected' : '' }}>
                                                                    {{ __('static.landing_pages.gradient') }}
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="btn_text">{{ __('static.landing_pages.btn_url') }}</label>
                                                        <div class="col-md-10">
                                                            <input class="form-control" type="text"
                                                                name="home[button][{{ $index }}][url]"
                                                                value="{{ old("home.button.$index.url", $button['url'] ?? '') }}"
                                                                placeholder="{{ __('static.landing_pages.enter_btn_url') }}">
                                                            @error("home.button.$index.url")
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                            @enderror
                                                        </div>
                                                    </div>

                                                    <div class="col-12">
                                                        <div class="btn-remove">
                                                            <button type="button" class="btn btn-danger">Remove</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            @empty
                                                {{-- Default empty row if no data exists --}}
                                                <div class="btn-group-row">
                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="btn_text">{{ __('static.landing_pages.btn_text') }}</label>
                                                        <div class="col-md-10">
                                                            <input class="form-control" type="text"
                                                                name="home[button][0][text]"
                                                                placeholder="{{ __('static.landing_pages.enter_btn_text') }}">
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="btn_type">{{ __('static.landing_pages.btn_type') }}</label>
                                                        <div class="col-md-10">
                                                            <select class="form-control select"
                                                                name="home[button][0][type]"
                                                                data-placeholder="{{ __('static.landing_pages.btn_type') }}">
                                                                <option class="select-placeholder" value="">
                                                                </option>
                                                                <option value="outline">
                                                                    {{ __('static.landing_pages.outline') }}
                                                                </option>
                                                                <option value="gradient">
                                                                    {{ __('static.landing_pages.gradient') }}</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div class="col-12">
                                                        <div class="btn-remove">
                                                            <button type="button" class="btn btn-danger"
                                                                style="display:none;">Remove</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            @endforelse
                                        </div>
                                        <div class="form-group">
                                            <button type="button" id="home-add-btn"
                                                class="btn btn-primary">{{ __('static.landing_pages.add_new') }}</button>
                                        </div>

                                    </div>

                                    <div class="tab-pane" id="Statistics_Section">
                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="title">{{ __('static.landing_pages.title') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="statistics[title]"
                                                    id=""
                                                    value="{{ @$content['statistics']['title'] ?? old('title') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_title') }}">
                                                @error('statistics[title]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="description">{{ __('static.landing_pages.short_description') }}</label>
                                            <div class="col-md-10">
                                                <textarea class="form-control" id="statistics[description]" name="statistics[description]"
                                                    placeholder="{{ __('static.landing_pages.enter_description') }}" cols="30" rows="5">{{ old('description', @$content['statistics']['description'] ?? '') }}</textarea>
                                            </div>
                                            @error('statistics[description]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="statistics[status]">{{ __('static.settings.status') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                        data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                        data-bs-title="{{ __('static.landing_pages.statistics_note') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($content['statistics']['status']))
                                                            <input class="form-control" type="hidden"
                                                                name="statistics[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="statistics[status]" value="1"
                                                                {{ @$content['statistics']['status'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="statistics[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="statistics[status]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="statistics-btn-container">
                                            @foreach ($content['statistics']['counters'] ?? [] as $index => $counter)
                                                <div class="btn-group-row">
                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="title">{{ __('static.landing_pages.title') }}</label>
                                                        <div class="col-md-10">
                                                            <input class="form-control" type="text"
                                                                name="statistics[counters][{{ $index }}][text]"
                                                                value="{{ old("statistics.counters.$index.text", $counter['text'] ?? '') }}"
                                                                placeholder="{{ __('static.landing_pages.enter_title') }}">
                                                            @error("statistics.counters.$index.text")
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                            @enderror
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="description">{{ __('static.landing_pages.short_description') }}</label>
                                                        <div class="col-md-10">
                                                            <textarea class="form-control" name="statistics[counters][{{ $index }}][description]"
                                                                placeholder="{{ __('static.landing_pages.enter_description') }}" cols="30" rows="5">{{ old("statistics.counters.$index.description", $counter['description'] ?? '') }}</textarea>
                                                            @error("statistics.counters.$index.description")
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                            @enderror
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="count">{{ __('static.landing_pages.count') }}</label>
                                                        <div class="col-md-10">
                                                            <input class="form-control" type="text"
                                                                name="statistics[counters][{{ $index }}][count]"
                                                                value="{{ old("statistics.counters.$index.count", $counter['count'] ?? '') }}"
                                                                placeholder="{{ __('static.landing_pages.enter_count') }}">
                                                            @error("statistics.counters.$index.count")
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                            @enderror
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="btn_image">{{ __('static.landing_pages.icon') }}
                                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                                data-bs-placement="top"
                                                                data-bs-custom-class="custom-tooltip"
                                                                data-bs-title="{{ __('static.landing_pages.icon_note') }}"></i>
                                                        </label>
                                                        <div class="col-md-10">
                                                            <div
                                                                class="form-group d-flex gap-3 align-items-start media-relative">
                                                                <div class="media-upload-image">
                                                                    <input type="file" class="form-control fileInput"
                                                                        name="statistics[counters][{{ $index }}][icon]" data-preview-id="statIconPreview-{{$index}}">
                                                                    <i class="ri-add-line"></i>
                                                                </div>

                                                                @if (!empty($counter['icon']))
                                                                    <img src="{{ asset($counter['icon']) }}" alt="Uploaded Icon" width="50" class="media-img uploaded-icon-preview" id="statIconPreview-{{$index}}">
                                                                @else
                                                                    <img src="" alt="Image Preview" class="media-img" id="statIconPreview-{{$index}}" style="display: none;">
                                                                @endif
                                                                @error("statistics.counters.$index.icon")
                                                                    <span class="invalid-feedback d-block" role="alert">
                                                                        <strong>{{ $message }}</strong>
                                                                    </span>
                                                                @enderror
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12">
                                                        <div class="btn-remove">
                                                            <button type="button"
                                                                class="btn btn-danger">{{ __('static.landing_pages.remove') }}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            @endforeach
                                        </div>
                                        <div class="form-group">
                                            <button type="button" id="statistics-add-btn"
                                                class="btn btn-primary">{{ __('static.landing_pages.add_new') }}</button>
                                        </div>

                                    </div>

                                    <div class="tab-pane" id="Feature_Section">


                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="title">{{ __('static.landing_pages.title') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="feature[title]"
                                                    id=""
                                                    value="{{ @$content['feature']['title'] ?? old('title') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_title') }}">
                                                @error('feature[title]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="description">{{ __('static.landing_pages.short_description') }}</label>
                                            <div class="col-md-10">
                                                <textarea class="form-control" id="feature[description]" name="feature[description]"
                                                    placeholder="{{ __('static.landing_pages.enter_description') }}" cols="30" rows="5">{{ old('description', @$content['feature']['description'] ?? '') }}</textarea>
                                            </div>
                                            @error('feature[description]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="feature[status]">{{ __('static.settings.status') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                        data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                        data-bs-title="{{ __('static.landing_pages.feature_note') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($content['feature']['status']))
                                                            <input class="form-control" type="hidden"
                                                                name="feature[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="feature[status]" value="1"
                                                                {{ @$content['feature']['status'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="feature[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="feature[status]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="feature-btn-container">
                                            @foreach ($content['feature']['images'] ?? [] as $index => $image)
                                                <div class="btn-group-row">
                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="title">{{ __('static.landing_pages.title') }}</label>
                                                        <div class="col-md-10">
                                                            <input class="form-control" type="text"
                                                                name="feature[images][{{ $index }}][title]"
                                                                value="{{ old("feature.images.$index.title", $image['title'] ?? '') }}"
                                                                placeholder="{{ __('static.landing_pages.enter_title') }}">
                                                            @error("feature.images.$index.title")
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                            @enderror
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="description">{{ __('static.landing_pages.short_description') }}</label>
                                                        <div class="col-md-10">
                                                            <textarea class="form-control" name="feature[images][{{ $index }}][description]"
                                                                placeholder="{{ __('static.landing_pages.enter_description') }}" cols="30" rows="5">{{ old("feature.images.$index.description", $image['description'] ?? '') }}</textarea>
                                                            @error("feature.images.$index.description")
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                            @enderror
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="btn_image">{{ __('static.landing_pages.image') }}
                                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                                data-bs-placement="top"
                                                                data-bs-custom-class="custom-tooltip"
                                                                data-bs-title="{{ __('static.landing_pages.feature_image_note') }}"></i>
                                                        </label>
                                                        <div class="col-md-10">
                                                            <div
                                                                class="form-group d-flex gap-3 align-items-start media-relative">
                                                                <div class="media-upload-image">
                                                                    <input type="file" class="form-control fileInput"
                                                                        name="feature[images][{{ $index }}][image]" data-preview-id="featureIconPreview-{{$index}}">
                                                                    <i class="ri-add-line"></i>
                                                                </div>

                                                                @if (!empty($image['image']))
                                                                    <img src="{{ asset($image['image']) }}"
                                                                        alt="Uploaded Image" width="50"
                                                                        class="media-img uploaded-icon-preview" id="featureIconPreview-{{$index}}">
                                                                @else
                                                                    <img src="" alt="Image Preview" class="media-img" id="featureIconPreview-{{$index}}" style="display: none;">
                                                                @endif
                                                                @error("feature.images.$index.image")
                                                                    <span class="invalid-feedback d-block" role="alert">
                                                                        <strong>{{ $message }}</strong>
                                                                    </span>
                                                                @enderror
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12">
                                                        <div class="btn-remove">
                                                            <button type="button"
                                                                class="btn btn-danger">{{ __('static.landing_pages.remove') }}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            @endforeach
                                        </div>
                                        <div class="form-group">
                                            <button type="button" id="feature-add-btn"
                                                class="btn btn-primary">{{ __('static.landing_pages.add_new') }}
                                            </button>
                                        </div>

                                    </div>

                                    <div class="tab-pane" id="Ride_Section">
                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="title">{{ __('static.landing_pages.title') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="ride[title]"
                                                    id=""
                                                    value="{{ @$content['ride']['title'] ?? old('title') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_title') }}">
                                                @error('ride[title]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="description">{{ __('static.landing_pages.short_description') }}</label>
                                            <div class="col-md-10">
                                                <textarea class="form-control" id="ride[description]" name="ride[description]"
                                                    placeholder="{{ __('static.landing_pages.enter_description') }}" cols="30" rows="5">{{ old('description', @$content['ride']['description'] ?? '') }}</textarea>
                                            </div>
                                            @error('ride[description]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="ride[status]">{{ __('static.settings.status') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                        data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                        data-bs-title="{{ __('static.landing_pages.ride_note') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($content['ride']['status']))
                                                            <input class="form-control" type="hidden"
                                                                name="ride[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="ride[status]" value="1"
                                                                {{ @$content['ride']['status'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="ride[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="ride[status]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="ride-btn-container">
                                            @foreach ($content['ride']['step'] ?? [] as $index => $step)
                                                <div class="btn-group-row">
                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="title">{{ __('static.landing_pages.title') }}</label>
                                                        <div class="col-md-10">
                                                            <input class="form-control" type="text"
                                                                name="ride[step][{{ $index }}][title]"
                                                                value="{{ old("ride.step.$index.title", $step['title'] ?? '') }}"
                                                                placeholder="{{ __('static.landing_pages.enter_title') }}">
                                                            @error("ride.step.$index.title")
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                            @enderror
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="description">{{ __('static.landing_pages.short_description') }}</label>
                                                        <div class="col-md-10">
                                                            <textarea class="form-control" name="ride[step][{{ $index }}][description]"
                                                                placeholder="{{ __('static.landing_pages.enter_description') }}" cols="30" rows="5">{{ old("ride.step.$index.description", $step['description'] ?? '') }}</textarea>
                                                            @error("ride.step.$index.description")
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                            @enderror
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="btn_image">{{ __('static.landing_pages.image') }}
                                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                                data-bs-placement="top"
                                                                data-bs-custom-class="custom-tooltip"
                                                                data-bs-title="{{ __('static.landing_pages.ride_image_note') }}"></i>
                                                        </label>
                                                        <div class="col-md-10">
                                                            <div
                                                                class="form-group d-flex gap-3 align-items-start media-relative">
                                                                <div class="media-upload-image">
                                                                    <input type="file" class="form-control fileInput"
                                                                        name="ride[step][{{ $index }}][image]" data-preview-id="rideStep-{{$index}}-Preview">
                                                                    <i class="ri-add-line"></i>
                                                                </div>

                                                                @if (!empty($step['image']))
                                                                    <img src="{{ asset($step['image']) }}"
                                                                        alt="Uploaded Image" width="50"
                                                                        class="media-img uploaded-icon-preview" id="rideStep-{{$index}}-Preview">
                                                                @else
                                                                    <img src="" alt="Image Preview" class="media-img" id="rideStep-{{$index}}-Preview" style="display: none;">
                                                                @endif
                                                                @error("ride.step.$index.image")
                                                                    <span class="invalid-feedback d-block" role="alert">
                                                                        <strong>{{ $message }}</strong>
                                                                    </span>
                                                                @enderror
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12">
                                                        <div class="btn-remove">
                                                            <button type="button"
                                                                class="btn btn-danger">{{ __('static.landing_pages.remove') }}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            @endforeach
                                        </div>
                                        <div class="form-group">
                                            <button type="button" id="ride-add-btn"
                                                class="btn btn-primary">{{ __('static.landing_pages.add_new') }}</button>
                                        </div>
                                    </div>

                                    <div class="tab-pane" id="Blog_Section">
                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="title">{{ __('static.landing_pages.title') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="blog[title]"
                                                    id=""
                                                    value="{{ $content['blog']['title'] ?? old('title') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_title') }}">
                                                @error('blog[title]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="sub_title">{{ __('static.landing_pages.sub_title') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="blog[sub_title]"
                                                    id=""
                                                    value="{{ $content['blog']['sub_title'] ?? old('sub_title') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_sub_title') }}">
                                                @error('blog[sub_title]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2">{{ __('static.landing_pages.blogs') }}</label>
                                            <div class="col-md-10">
                                                <select class="form-control select-2" id="" name="blog[blogs][]"
                                                    data-placeholder="{{ __('static.landing_pages.select_blogs') }}"
                                                    multiple>
                                                    <option class="select-placeholder"></option>
                                                    @forelse ($blogs as $index => $blog)
                                                        <option value="{{ $blog->id }}"
                                                            @if (in_array($blog?->id, @$content['blog']['blogs'] ?? [])) selected @endif>
                                                            {{ $blog->title }}
                                                        </option>
                                                    @empty
                                                        <option class="select-placeholder" value="[]"></option>
                                                    @endforelse
                                                </select>
                                                <span class="text-gray mt-1">
                                                    {{ __('static.landing_pages.no_blogs_message') }}
                                                    <a href="{{ @route('admin.blog.index') }}" class="text-primary">
                                                        <b>{{ __('static.here') }}</b>
                                                    </a>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="blog[status]">{{ __('static.settings.status') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('static.landing_pages.blog_note') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($content['blog']['status']))
                                                            <input class="form-control" type="hidden"
                                                                name="blog[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="blog[status]" value="1"
                                                                {{ $content['blog']['status'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="blog[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="blog[status]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="Testimonials_Section">
                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="title">{{ __('static.landing_pages.title') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="testimonial[title]"
                                                    value="{{ $content['testimonial']['title'] ?? old('title') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_title') }}">
                                                @error('testimonial[title]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="sub_title">{{ __('static.landing_pages.sub_title') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="testimonial[sub_title]"
                                                    id=""
                                                    value="{{ $content['testimonial']['sub_title'] ?? old('sub_title') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_sub_title') }}">
                                                @error('testimonial[sub_title]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-md-2">{{ __('static.landing_pages.testimonials') }}</label>
                                            <div class="col-md-10">
                                                <select class="form-control select-2" name="testimonial[testimonials][]"
                                                    data-placeholder="{{ __('static.landing_pages.select_testimonials') }}"
                                                    multiple>
                                                    <option class="select-placeholder"></option>
                                                    @forelse ($testimonials as $index => $testimonial)
                                                        <option value="{{ $testimonial->id }}"
                                                            @if (in_array($testimonial->id, @$content['testimonial']['testimonials'] ?? [])) selected @endif>
                                                            {{ $testimonial->title }}
                                                        </option>
                                                    @empty
                                                        <option class="select-placeholder" value="[]"></option>
                                                    @endforelse
                                                </select>
                                                <span class="text-gray mt-1">
                                                    {{ __('static.landing_pages.no_testimonials_message') }}
                                                    <a href="{{ @route('admin.testimonial.index') }}"
                                                        class="text-primary"><b>{{ __('static.here') }}</b></a>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="testimonial[status]">{{ __('static.settings.status') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('static.landing_pages.testimonial_note') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($content['testimonial']['status']))
                                                            <input class="form-control" type="hidden"
                                                                name="testimonial[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="testimonial[status]" value="1"
                                                                {{ $content['testimonial']['status'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="testimonial[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="testimonial[status]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tab-pane" id="FAQ_Section">
                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="title">{{ __('static.landing_pages.title') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="faq[title]"
                                                    id=""
                                                    value="{{ $content['faq']['title'] ?? old('title') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_title') }}">
                                                @error('faq[title]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="sub_title">{{ __('static.landing_pages.sub_title') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="faq[sub_title]"
                                                    id=""
                                                    value="{{ $content['faq']['sub_title'] ?? old('sub_title') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_sub_title') }}">
                                                @error('faq[sub_title]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2">{{ __('static.landing_pages.faqs') }}</label>
                                            <div class="col-md-10">
                                                <select class="form-control select-2" id="" name="faq[faqs][]"
                                                    data-placeholder="{{ __('static.landing_pages.select_faqs') }}"
                                                    multiple>
                                                    <option class="select-placeholder"></option>
                                                    @forelse ($faqs as $index => $faq)
                                                        <option value="{{ $faq->id }}"
                                                            @if (in_array($faq?->id, @$content['faq']['faqs'] ?? [])) selected @endif>
                                                            {{ $faq->title }}
                                                        </option>
                                                    @empty
                                                        <option class="select-placeholder" value="[]"></option>
                                                    @endforelse
                                                </select>
                                                <span class="text-gray mt-1">
                                                    {{ __('static.landing_pages.no_faqs_message') }}
                                                    <a href="{{ @route('admin.faq.index') }}" class="text-primary">
                                                        <b>{{ __('static.here') }}</b>
                                                    </a>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2" for="faq[status]">{{ __('static.settings.status') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('static.landing_pages.faq_note') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($content['faq']['status']))
                                                            <input class="form-control" type="hidden" name="faq[status]"
                                                                value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="faq[status]" value="1"
                                                                {{ $content['faq']['status'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden" name="faq[status]"
                                                                value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="faq[status]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tab-pane" id="Footer_Section">
                                        <div class="form-group row">
                                            <label class="col-md-2" for="image">{{ __('static.landing_pages.logo') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('static.landing_pages.footer_logo_note') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="form-group d-flex gap-3 align-items-start media-relative">
                                                    <div class="media-upload-image">
                                                        <input type="file" class="form-control fileInput"
                                                            name="footer[footer_logo]" data-preview-id="footerLogoPreview">
                                                        <i class="ri-add-line"></i>
                                                    </div>
                                                    @error('footer[footer_logo]')
                                                        <span class="invalid-feedback d-block" role="alert">
                                                            <strong>{{ $message }}</strong>
                                                        </span>
                                                    @enderror

                                                    @if (isset($content['footer']['footer_logo']) && !empty($content['footer']['footer_logo']))
                                                        <!-- <div class="col-md-10"> -->
                                                        <img src="{{ asset($content['footer']['footer_logo']) }}"
                                                            alt="image" class="media-img" id="footerLogoPreview">
                                                        <!-- </div> -->
                                                    @else
                                                        <img src="" alt="Image Preview" class="media-img" id="footerLogoPreview" style="display: none;">
                                                    @endif
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="image">{{ __('static.landing_pages.right_image') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('static.landing_pages.right_image_note') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="form-group d-flex gap-3 align-items-start media-relative">
                                                    <div class="media-upload-image">
                                                        <input type="file" class="form-control fileInput"
                                                            name="footer[right_image]" data-preview-id="footerRightLogoPreview">
                                                        <i class="ri-add-line"></i>
                                                    </div>
                                                    @error('footer[right_image]')
                                                        <span class="invalid-feedback d-block" role="alert">
                                                            <strong>{{ $message }}</strong>
                                                        </span>
                                                    @enderror
                                                    @if (isset($content['footer']['right_image']) && !empty($content['footer']['right_image']))
                                                        <!-- <div class="col-md-10"> -->
                                                        <img src="{{ asset($content['footer']['right_image']) }}"
                                                            alt="image" class="media-img" id="footerRightLogoPreview">
                                                        <!-- </div> -->
                                                    @else
                                                        <img src="" alt="Image Preview" class="media-img" id="footerRightLogoPreview" style="display: none;">
                                                    @endif
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="quote">{{ __('static.landing_pages.description') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="footer[description]"
                                                    id=""
                                                    value="{{ $content['footer']['description'] ?? old('description') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_description') }}">

                                                @error('footer[description]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="quote">{{ __('static.landing_pages.label') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text"
                                                    name="footer[newsletter][label]" id=""
                                                    value="{{ $content['footer']['newsletter']['label'] ?? old('label') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_newsletter') }}">

                                                @error('footer[newsletter][label]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="quote">{{ __('static.landing_pages.button_text') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text"
                                                    name="footer[newsletter][button_text]" id=""
                                                    value="{{ $content['footer']['newsletter']['button_text'] ?? old('button_text') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_newsletter_btn_text') }}">

                                                @error('footer[newsletter][button_text]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="quote">{{ __('static.landing_pages.placeholder') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text"
                                                    name="footer[newsletter][placeholder]" id=""
                                                    value="{{ $content['footer']['newsletter']['placeholder'] ?? old('placeholder') }}"
                                                    placeholder="{{ __('static.landing_pages.newsletter_placeholder') }}">

                                                @error('footer[newsletter][placeholder]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2">{{ __('static.landing_pages.pages') }}</label>
                                            <div class="col-md-10">
                                                <select class="form-control select-2" id="" name="footer[pages][]"
                                                    data-placeholder="{{ __('static.landing_pages.select_pages') }}"
                                                    multiple>
                                                    <option class="select-placeholder"></option>
                                                    @forelse ($pages as $index => $page)
                                                        <option value="{{ $page->id }}"
                                                            @if (in_array($page?->id, @$content['footer']['pages'] ?? [])) selected @endif>
                                                            {{ $page->title }}
                                                        </option>
                                                    @empty
                                                        <option class="select-placeholder" value="[]"></option>
                                                    @endforelse
                                                </select>
                                                <span class="text-gray mt-1">
                                                    {{ __('static.landing_pages.no_pages_message') }}
                                                    <a href="{{ @route('admin.page.index') }}" class="text-primary">
                                                        <b>{{ __('static.here') }}</b>
                                                    </a>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="app_store_url">{{ __('static.landing_pages.app_store_url') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="footer[app_store_url]"
                                                    id=""
                                                    value="{{ $content['footer']['app_store_url'] ?? old('app_store_url') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_app_store_url') }}">
                                                @error('footer[app_store_url]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="play_store_url">{{ __('static.landing_pages.play_store_url') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="footer[play_store_url]"
                                                    id=""
                                                    value="{{ $content['footer']['play_store_url'] ?? old('play_store_url') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_play_store_url') }}">
                                                @error('footer[app_store_url]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2" for="quote">{{ __('static.landing_pages.copyright') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="footer[copyright]" id=""
                                                    value="{{ $content['footer']['copyright'] ?? old('copyright') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_copyright') }}">
                                                @error('footer[copyright]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2">{{ __('static.landing_pages.social_media') }}</label>
                                            <div class="col-md-10">
                                                <div class="row">
                                                    <div class="col-md-6 mb-3">
                                                        <label>{{ __('static.landing_pages.facebook_url') }}</label>
                                                        <input class="form-control" type="url" name="footer[social][facebook]"
                                                            value="{{ $content['footer']['social']['facebook'] ?? old('footer.social.facebook') }}"
                                                            placeholder="{{ __('static.landing_pages.enter_facebook') }}">
                                                    </div>
                                                    <div class="col-md-6 mb-3">
                                                        <label>{{ __('static.landing_pages.google_url') }}</label>
                                                        <input class="form-control" type="url" name="footer[social][google]"
                                                            value="{{ $content['footer']['social']['google'] ?? old('footer.social.google') }}"
                                                            placeholder="{{ __('static.landing_pages.enter_google') }}">
                                                    </div>
                                                    <div class="col-md-6 mb-3">
                                                        <label>{{ __('static.landing_pages.instagram_url') }}</label>
                                                        <input class="form-control" type="url" name="footer[social][instagram]"
                                                            value="{{ $content['footer']['social']['instagram'] ?? old('footer.social.instagram') }}"
                                                            placeholder="{{ __('static.landing_pages.enter_instagram') }}">
                                                    </div>
                                                    <div class="col-md-6 mb-3">
                                                        <label>{{ __('static.landing_pages.twitter_url') }}</label>
                                                        <input class="form-control" type="url" name="footer[social][twitter]"
                                                            value="{{ $content['footer']['social']['twitter'] ?? old('footer.social.twitter') }}"
                                                            placeholder="{{ __('static.landing_pages.enter_twitter') }}">
                                                    </div>
                                                    <div class="col-md-6 mb-3">
                                                        <label>{{ __('static.landing_pages.whatsapp_url') }}</label>
                                                        <input class="form-control" type="url" name="footer[social][whatsapp]"
                                                            value="{{ $content['footer']['social']['whatsapp'] ?? old('footer.social.whatsapp') }}"
                                                            placeholder="{{ __('static.landing_pages.enter_whatsapp') }}">
                                                    </div>
                                                    <div class="col-md-6 mb-3">
                                                        <label>{{ __('static.landing_pages.linkedin_url') }}</label>
                                                        <input class="form-control" type="url" name="footer[social][linkedin]"
                                                            value="{{ $content['footer']['social']['linkedin'] ?? old(key: 'footer.social.linkedin') }}"
                                                            placeholder="{{ __('static.landing_pages.enter_linkedin') }}">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="footer[status]">{{ __('static.settings.status') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('static.landing_pages.footer_note') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="editor-space">
                                                    <label class="switch">
                                                        @if (isset($content['footer']['status']))
                                                            <input class="form-control" type="hidden"
                                                                name="footer[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="footer[status]" value="1"
                                                                {{ $content['footer']['status'] ? 'checked' : '' }}>
                                                        @else
                                                            <input class="form-control" type="hidden"
                                                                name="footer[status]" value="0">
                                                            <input class="form-check-input" type="checkbox"
                                                                name="footer[status]" value="1">
                                                        @endif
                                                        <span class="switch-state"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tab-pane" id="SEO_Section">
                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="image">{{ __('static.landing_pages.meta_image') }}
                                                <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="{{ __('static.landing_pages.meta_image_note') }}"></i>
                                            </label>
                                            <div class="col-md-10">
                                                <div class="form-group d-flex gap-3 align-items-start media-relative">
                                                    <div class="media-upload-image">
                                                        <input type="file" class="form-control fileInput"
                                                            name="seo[meta_image]" data-preview-id="seoMetaImagePreview">
                                                        <i class="ri-add-line"></i>
                                                    </div>
                                                    @error('seo[meta_image]')
                                                        <span class="invalid-feedback d-block" role="alert">
                                                            <strong>{{ $message }}</strong>
                                                        </span>
                                                    @enderror
                                                    @if (isset($content['seo']['meta_image']) && !empty($content['seo']['meta_image']))
                                                        <img src="{{ asset($content['seo']['meta_image']) }}"
                                                            alt="image" class="media-img" id="seoMetaImagePreview">
                                                    @else
                                                        <img src="" alt="Image Preview" class="media-img" id="seoMetaImagePreview" style="display: none;">
                                                    @endif
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="quote">{{ __('static.landing_pages.meta_title') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="seo[meta_title]"
                                                    id=""
                                                    value="{{ $content['seo']['meta_title'] ?? old('meta_title') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_meta_title') }}">
                                                @error('seo[meta_title]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="meta_description">{{ __('static.landing_pages.meta_description') }}</label>
                                            <div class="col-md-10">
                                                <textarea class="form-control" type="text" name="seo[meta_description]" id="" cols="30"
                                                    rows="5" placeholder="{{ __('static.landing_pages.enter_meta_description') }}">{{ $content['seo']['meta_description'] ?? old('meta_description') }}</textarea>
                                                @error('seo[meta_description]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="meta_tags">{{ __('static.landing_pages.meta_tags') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="seo[meta_tags]"
                                                    id=""
                                                    value="{{ $content['seo']['meta_tags'] ?? old('meta_tags') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_meta_tags') }}">
                                                @error('seo[meta_tags]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="og_title">{{ __('static.landing_pages.og_title') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="seo[og_title]"
                                                    id=""
                                                    value="{{ $content['seo']['og_title'] ?? old('og_title') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_og_title') }}">
                                                @error('seo[og_title]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="og_description">{{ __('static.landing_pages.og_description') }}</label>
                                            <div class="col-md-10">
                                                <textarea class="form-control" type="text" name="seo[og_description]" id="" value=""
                                                    cols="30" rows="5" placeholder="{{ __('static.landing_pages.enter_og_description') }}">{{ $content['seo']['og_description'] ?? old('og_description') }}</textarea>
                                                @error('seo[og_description]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tab-pane" id="Analytics_Section">
                                        <div class="analytics-section">
                                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                                                <li class="nav-item" role="presentation">
                                                    <a class="nav-link active" href="#facebook-tabs"
                                                        data-bs-toggle="tab">{{ __('static.landing_pages.facebook_pixel') }}</a>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <a class="nav-link" href="#analytics-tabs"
                                                        data-bs-toggle="tab">{{ __('static.landing_pages.google_analytics') }}</a>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <a class="nav-link" href="#google-tabs"
                                                        data-bs-toggle="tab">{{ __('static.landing_pages.google_tag_id') }}</a>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <a class="nav-link" href="#tawk-tabs"
                                                        data-bs-toggle="tab">{{ __('static.landing_pages.chat_bot_id') }}</a>
                                                </li>
                                            </ul>
                                            <div class="tab-content" id="myTabContent">
                                                <div class="tab-pane fade show active" id="facebook-tabs">
                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="pixel_id">{{ __('static.landing_pages.pixel_id') }}</label>
                                                        <div class="col-md-10">
                                                            <input class="form-control" type="text"
                                                                name="analytics[pixel_id]" id=""
                                                                value="{{ $content['analytics']['pixel_id'] ?? old('pixel_id') }}"
                                                                placeholder="{{ __('static.landing_pages.enter_pixel_id') }}">
                                                            @error('analytics[pixel_id]')
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                            @enderror
                                                            <span class="text-gray mt-1">
                                                                {{ __('static.landing_pages.add_pixel_id') }}
                                                                <a href="https://en-gb.facebook.com/business/help/952192354843755?id=1205376682832142"
                                                                    target="_blank" class="text-primary">
                                                                    <b>{{ __('static.here') }}</b>
                                                                </a>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane fade" id="analytics-tabs">
                                                    <div class="form-group row">
                                                        <!-- <label class="col-md-2"  for="analytics">{{ __('static.landing_pages.google_analytics') }}</label> -->
                                                        <div class="form-group row">
                                                            <label class="col-md-2"
                                                                for="measurement_id">{{ __('static.landing_pages.measurement_id') }}</label>
                                                            <div class="col-md-10">
                                                                <input class="form-control" type="text"
                                                                    name="analytics[measurement_id]" id=""
                                                                    value="{{ $content['analytics']['measurement_id'] ?? old('measurement_id') }}"
                                                                    placeholder="{{ __('static.landing_pages.enter_measurement_id') }}">
                                                                @error('analytics[measurement_id]')
                                                                    <span class="invalid-feedback d-block" role="alert">
                                                                        <strong>{{ $message }}</strong>
                                                                    </span>
                                                                @enderror
                                                                <span class="text-gray mt-1">
                                                                    {{ __('static.landing_pages.add_measurement_id') }}
                                                                    <a href="https://support.google.com/analytics/answer/12270356?hl=en"
                                                                        target="_blank" class="text-primary">
                                                                        <b>{{ __('static.here') }}</b>
                                                                    </a>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="form-group row">
                                                            <label class="col-md-2"
                                                                for="analytics[status]">{{ __('static.settings.status') }}
                                                                <i class="ri-error-warning-line"
                                                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                                                    data-bs-custom-class="custom-tooltip"
                                                                    data-bs-title="{{ __('static.landing_pages.note') }}"></i>
                                                            </label>
                                                            <div class="col-md-10">
                                                                <div class="editor-space">
                                                                    <label class="switch">
                                                                        @if (isset($content['analytics']['pixel_status']))
                                                                            <input class="form-control" type="hidden"
                                                                                name="analytics[pixel_status]"
                                                                                value="0">
                                                                            <input class="form-check-input"
                                                                                type="checkbox"
                                                                                name="analytics[pixel_status]"
                                                                                value="1"
                                                                                {{ $content['analytics']['pixel_status'] ? 'checked' : '' }}>
                                                                        @else
                                                                            <input class="form-control" type="hidden"
                                                                                name="analytics[pixel_status]"
                                                                                value="0">
                                                                            <input class="form-check-input"
                                                                                type="checkbox"
                                                                                name="analytics[pixel_status]"
                                                                                value="1">
                                                                        @endif
                                                                        <span class="switch-state"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane fade" id="google-tabs">
                                                    <div class="form-group row">

                                                        <div class="form-group row">
                                                            <label class="col-md-2"
                                                                for="tag_id">{{ __('static.landing_pages.tag_id') }}</label>
                                                            <div class="col-md-10">
                                                                <input class="form-control" type="text"
                                                                    name="analytics[tag_id]" id=""
                                                                    value="{{ $content['analytics']['tag_id'] ?? old('tag_id') }}"
                                                                    placeholder="{{ __('static.landing_pages.enter_tag_id') }}">
                                                                @error('analytics[tag_id]')
                                                                    <span class="invalid-feedback d-block" role="alert">
                                                                        <strong>{{ $message }}</strong>
                                                                    </span>
                                                                @enderror
                                                                <span class="text-gray mt-1">
                                                                    {{ __('static.landing_pages.add_tag_id') }}
                                                                    <a href="https://support.google.com/analytics/answer/9539598?hl=en"
                                                                        target="_blank" class="text-primary">
                                                                        <b>{{ __('static.here') }}</b>
                                                                    </a>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="form-group row">
                                                            <label class="col-md-2"
                                                                for="analytics[status]">{{ __('static.settings.status') }}
                                                                <i class="ri-error-warning-line"
                                                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                                                    data-bs-custom-class="custom-tooltip"
                                                                    data-bs-title="{{ __('static.landing_pages.note') }}"></i>
                                                            </label>
                                                            <div class="col-md-10">
                                                                <div class="editor-space">
                                                                    <label class="switch">
                                                                        @if (isset($content['analytics']['tag_id_status']))
                                                                            <input class="form-control" type="hidden"
                                                                                name="analytics[tag_id_status]"
                                                                                value="0">
                                                                            <input class="form-check-input"
                                                                                type="checkbox"
                                                                                name="analytics[tag_id_status]"
                                                                                value="1"
                                                                                {{ $content['analytics']['tag_id_status'] ? 'checked' : '' }}>
                                                                        @else
                                                                            <input class="form-control" type="hidden"
                                                                                name="analytics[tag_id_status]"
                                                                                value="0">
                                                                            <input class="form-check-input" type="checkbox" name="analytics[tag_id_status]" value="1">
                                                                        @endif
                                                                        <span class="switch-state"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane fade" id="tawk-tabs">
                                                    <div class="form-group row">
                                                        <label class="col-md-2" for="tawk_to_property_id">{{ __('static.landing_pages.property_id') }}</label>
                                                        <div class="col-md-10">
                                                            <input class="form-control" type="password"
                                                                name="analytics[tawk_to_property_id]"
                                                                value="{{ $content['analytics']['tawk_to_property_id'] ?? old('tawk_to_property_id') }}"
                                                                placeholder="{{ __('static.landing_pages.enter_property_id') }}">
                                                                @error('analytics[tawk_to_property_id]')
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                                @enderror
                                                                <span class="text-gray mt-1">
                                                                    {{ __('static.landing_pages.property_id_note1') }}
                                                                    <a href="https://dashboard.tawk.to/login" target="_blank" class="text-primary">{{ __('static.landing_pages.property_id_note_link1') }}</a>.
                                                                    {{ __('static.landing_pages.property_id_note2') }}
                                                                    <a href="https://help.tawk.to/" target="_blank" class="text-primary">{{ __('static.landing_pages.property_id_note_link2') }}</a>.
                                                                </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tab-pane" id="Cookies_Section">
                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="quote">{{ __('static.landing_pages.title') }}</label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="cookie[title]"
                                                    id=""
                                                    value="{{ $content['cookie']['title'] ?? old('title') }}"
                                                    placeholder="{{ __('static.landing_pages.enter_title') }}">
                                                @error('cookie[title]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="description">{{ __('static.landing_pages.description') }}</label>
                                            <div class="col-md-10">
                                                <textarea class="form-control" type="text" name="cookie[description]" id="" cols="30"
                                                    rows="3" placeholder="{{ __('static.landing_pages.enter_description') }}">{{ $content['cookie']['description'] ?? old('description') }}</textarea>
                                                @error('cookie[description]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-md-2"
                                                for="content">{{ __('static.landing_pages.content') }}</label>
                                            <div class="col-md-10">
                                                <textarea class="form-control image-embed-content" type="text" name="cookie[content]" id=""
                                                    cols="30" rows="5" placeholder="{{ __('static.landing_pages.enter_content') }}">{{ $content['cookie']['content'] ?? old('content') }}</textarea>
                                                @error('cookie[content]')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit"
                                        class="btn btn-primary spinner-btn"><i class="ri-save-line text-white lh-1"></i>{{ __('static.save') }}</button>
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
        $(document).ready(function() {
            'use strict';

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

            function addNewRow(containerSelector, inputMappings) {
                const container = $(containerSelector);
                const firstRow = container.find('.btn-group-row').first().clone();
                const currentIndex = container.find('.btn-group-row').length;

                inputMappings.forEach(mapping => {
                    firstRow.find(mapping.selector).each(function() {
                        const name = $(this).attr('name');
                        if (name) {
                            const updatedName = name.replace(/\[\d+\]/, `[${currentIndex}]`);
                            $(this).attr('name', updatedName);
                        }

                        if ($(this).is('input[type="file"]')) {
                            $(this).val('');
                        } else {
                            $(this).val('');
                        }

                        $(this).removeClass('is-invalid');
                        $(this).siblings('.invalid-feedback').remove();
                    });
                });

                firstRow.find('.uploaded-icon-preview').remove();

                firstRow.find('.btn-remove').show();
                container.append(firstRow);

            }


            function isCurrentRowFilled(containerSelector, inputMappings) {
                const lastRow = $(containerSelector).find('.btn-group-row').last();
                let isFilled = true;

                inputMappings.forEach(mapping => {
                    lastRow.find(mapping.selector).each(function() {
                        const value = $(this).val();
                        const hasPreview = $(this).closest('.btn-group-row').find(
                            '.uploaded-icon-preview').length > 0;

                        if (!value && !hasPreview) {
                            isFilled = false;

                            $(this).addClass('is-invalid');
                            if (!$(this).siblings('.invalid-feedback').length) {
                                $(this).after(
                                    '<span class="invalid-feedback d-block" role="alert">This field is required.</span>'
                                );
                            }
                        } else {
                            $(this).removeClass('is-invalid');
                            $(this).siblings('.invalid-feedback').remove();
                        }
                    });
                });

                return isFilled;
            }

            $('#home-add-btn').click(function() {
                const containerSelector = '#home-btn-container';
                const inputMappings = [{
                        selector: 'input[name^="home[button]"]'
                    },
                    {
                        selector: 'select[name^="home[button]"]'
                    }
                ];

                if (isCurrentRowFilled(containerSelector, inputMappings)) {
                    addNewRow(containerSelector, inputMappings);
                }
            });

            $('#statistics-add-btn').click(function() {
                const containerSelector = '#statistics-btn-container';
                const inputMappings = [{
                        selector: 'input[name^="statistics[counters]"]'
                    },
                    {
                        selector: 'textarea[name^="statistics[counters]"]'
                    },
                    {
                        selector: 'input[type="file"][name^="statistics[counters]"]'
                    }
                ];

                if (isCurrentRowFilled(containerSelector, inputMappings)) {
                    addNewRow(containerSelector, inputMappings);
                }
            });

            $('#feature-add-btn').click(function() {
                const containerSelector = '#feature-btn-container';
                const inputMappings = [{
                        selector: 'input[name^="feature[images]"]'
                    },
                    {
                        selector: 'textarea[name^="feature[images]"]'
                    },
                    {
                        selector: 'input[type="file"][name^="feature[images]"]'
                    }
                ];

                if (isCurrentRowFilled(containerSelector, inputMappings)) {
                    addNewRow(containerSelector, inputMappings);
                }
            });

            $('#ride-add-btn').click(function() {
                const containerSelector = '#ride-btn-container';
                const inputMappings = [{
                        selector: 'input[name^="ride[step]"]'
                    },
                    {
                        selector: 'textarea[name^="ride[step]"]'
                    },
                    {
                        selector: 'input[type="file"][name^="ride[step]"]'
                    }
                ];

                if (isCurrentRowFilled(containerSelector, inputMappings)) {
                    addNewRow(containerSelector, inputMappings);
                }
            });

            $(document).on('click', '.btn-remove', function() {
                const row = $(this).closest('.btn-group-row');
                const container = row.parent();
                if (container.find('.btn-group-row').length > 1) {
                    row.remove();
                }
            });
        });
    </script>
@endpush
