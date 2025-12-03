@php
    $languages = getLanguages();
    $defaultLocale = app()?->getLocale();
@endphp
@extends('admin.layouts.master')
@section('title', $eventAndShortcodes['name'])

@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ @$eventAndShortcodes['name'] }}</h3>
                </div>
            </div>

            <div class="button-container">
                @forelse ($eventAndShortcodes['shortcodes'] as $key => $shortcode)
                    <button class="btn btn-primary shortcode-button"
                        data-text="{{ $shortcode['action'] }}">{{ $shortcode['text'] }}</button>
                @empty
                @endforelse
            </div>

            <div>
                <ul class="nav nav-tabs horizontal-tab custom-scroll" id="account" role="tablist">
                    @forelse ($languages as $language)
                        <li class="nav-item" role="presentation">
                            <a class="nav-link @if ($loop->first) active @endif"
                                id="tab-{{ $language['locale'] }}-tab" data-bs-toggle="tab"
                                href="#tab-{{ $language['locale'] }}" role="tab"
                                aria-controls="tab-{{ $language['locale'] }}"
                                aria-selected="{{ $loop->first ? 'true' : 'false' }}">
                                <img src="{{ asset($language['flag']) }}"></i>
                                {{ $language['name'] }}
                                <i class="ri-error-warning-line danger errorIcon"></i>
                            </a>
                        </li>
                    @empty
                    @endforelse
                </ul>

                <form method="POST" id="pushNotificationTemplatesForm"
                    action="{{ route('admin.push-notification-template.update', @$slug) }}" enctype="multipart/form-data">
                    @csrf
                    <div class="tab-content" id="accountContent">
                        @foreach ($languages as $key => $language)
                            <div class="tab-pane fade {{ session('active_tab') == $key ? 'show active' : '' }}"
                                id="tab-{{ $language['locale'] }}" role="tabpanel"
                                aria-labelledby="tab-{{ $language['locale'] }}-tab">
                                <div class="row g-4 align-items-start">
                                    <div class="col-12 col-md-7">
                                        <div class="push-notification">
                                            <div class="row g-4 align-items-center">
                                                <div class="col-12">
                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="title">{{ __('static.notify_templates.title') }}<span>*</span></label>
                                                        <div class="col-md-10">
                                                            <input class="form-control" type="text"
                                                                id="title_{{ $language['locale'] }}"
                                                                name="title[{{ $language['locale'] }}]"
                                                                value="{{ @$content['title'][$language['locale']] }}"
                                                                placeholder="{{ __('static.notify_templates.enter_title') }}">
                                                            @error("title.{$language['locale']}")
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                            @enderror
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="content">{{ __('static.notify_templates.content') }}</label>
                                                        <div class="col-md-10">
                                                            <textarea class="form-control" placeholder="{{ __('static.notify_templates.enter_content') }}" rows="4"
                                                                id="content_{{ $language['locale'] }}" name="content[{{ $language['locale'] }}]" cols="50">{{ @$content['content'][$language['locale']] }}</textarea>
                                                            @error("content.{$language['locale']}")
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                            @enderror
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label class="col-md-2"
                                                            for="url">{{ __('static.notify_templates.url') }}</label>
                                                        <div class="col-md-10">
                                                            <input class="form-control" id="url_{{ $language['locale'] }}"
                                                                type="url"
                                                                placeholder="{{ __('static.notify_templates.enter_url') }}"
                                                                name="url[{{ $language['locale'] }}]"
                                                                value="{{ @$content['url'][$language['locale']] }}">
                                                            @error("url.{$language['locale']}")
                                                                <span class="invalid-feedback d-block" role="alert">
                                                                    <strong>{{ $message }}</strong>
                                                                </span>
                                                            @enderror
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <div class="col-12">
                                                            <div class="submit-btn">
                                                                <button type="submit" name="save"
                                                                    class="btn btn-solid spinner-btn">
                                                                    {{ __('static.notify_templates.save') }}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="col-xxl-5 col-xl-4 text-center">
                                        <div class="notification-mobile-box">
                                            <div class="notify-main">
                                                <img src="{{ asset('/images/notify.png') }}" class="notify-img">
                                                <div class="notify-content">
                                                    <h2 class="current-time" id="current-time"></h2>
                                                    <div class="notify-data">
                                                        <div class="message mt-0">
                                                            <img id="notify-image" src="{{ asset('images/favicon.svg') }}"
                                                                alt="user">
                                                            <div class="notifi-head">
                                                                <h5 id="notify-title">
                                                                    {{ @$content['title'][$language['locale']] }}</h5>
                                                                <span>{{ __('static.notify_templates.3_min_ago') }}</span>
                                                            </div>
                                                        </div>
                                                        <div class="notify-footer">
                                                            <p id="notify-message">
                                                                {{ @$content['content'][$language['locale']] }}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection


@push('scripts')
    <script type="text/javascript" src="{{ asset('js/flatpickr/time.js') }}"></script>
    <script>
        (function($) {
            "use strict";

            const defaultLocale = `<?php echo $defaultLocale; ?>`;

            $('#pushNotificationTemplatesForm').validate({
                ignore: [],
                rules: {
                    [`title[${defaultLocale}]`]: "required",
                    [`content[${defaultLocale}]`]: "required",
                },
                invalidHandler: function(event, validator) {
                    const $tabLink = $(`#tab-${defaultLocale}-tab`);
                    $tabLink.find(".errorIcon").show();
                    $(".nav-link.active").removeClass("active");
                    $(".tab-pane.show").removeClass("show active");
                    $(`#tab-${defaultLocale}`).addClass("show active");
                    $tabLink.addClass("active");
                },
                success: function(label, element) {
                    const $tabLink = $(`#tab-${defaultLocale}-tab`);
                    const $invalidFields = $(`#tab-${defaultLocale}`).find(".error:visible");
                    if ($invalidFields.length === 0) {
                        $tabLink.find(".errorIcon").hide();
                    }
                }
            });

            $('.shortcode-button').on('click', function() {
                var text = $(this).data('text');

                var activeTab = $('.tab-pane.show.active');
                var languageLocale = activeTab.attr('id').split('-')[1];
                var textarea = $('#content_' + languageLocale);

                var start = textarea[0].selectionStart;
                var end = textarea[0].selectionEnd;

                textarea.val(textarea.val().substring(0, start) + text + textarea.val().substring(end));

                textarea[0].selectionStart = textarea[0].selectionEnd = start + text.length;

                textarea.focus();
            });
        })(jQuery)
    </script>
@endpush
