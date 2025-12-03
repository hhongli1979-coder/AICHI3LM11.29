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

            <div>
                <ul class="language-list accept-bid custom-scroll" id="account" role="tablist">
                    @forelse ($languages as $language)
                        <li class="nav-item" role="presentation">
                            <a class="nav-link @if ($loop->first) active @endif"
                                id="tab-{{ $language['locale'] }}-tab" data-bs-toggle="tab"
                                href="#tab-{{ $language['locale'] }}" role="tab"
                                aria-controls="tab-{{ $language['locale'] }}"
                                aria-selected="{{ $loop->first ? 'true' : 'false' }}">
                                <img src="{{ asset($language['flag']) }}">
                                {{ $language['name'] }}
                                <i class="ri-error-warning-line errorIcon"></i>
                            </a>
                        </li>
                    @empty
                    @endforelse
                </ul>

                <form method="POST" id="emailTemplatesForm" action="{{ route('admin.email-template.update', @$slug) }}"
                    enctype="multipart/form-data">
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
                                                            <textarea class="form-control email-content" placeholder="{{ __('static.notify_templates.enter_content') }}"
                                                                rows="4" id="content_{{ $language['locale'] }}" name="content[{{ $language['locale'] }}]" cols="50">{{ @$content['content'][$language['locale']] }}</textarea>
                                                            @error("content.{$language['locale']}")
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


                                    <div class="col-12 col-md-5">
                                        <div class="card email-template-box email-send">
                                            <div class="card-body">
                                                <h5 class="card-title" id="email-notify-title">
                                                    {{ @$content['title'][$language['locale']] }}
                                                </h5>
                                                <div class="email-template-contain" id="email-notify-content">
                                                    @if (!empty($content['content'][$language['locale']]))
                                                        {!! $content['content'][$language['locale']] !!}
                                                    @else
                                                        <h6>{{ __('static.notify_templates.enter_content') }} </h6>
                                                    @endif
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
    <script>
        (function($) {
            "use strict";
            const defaultLocale = `<?php echo $defaultLocale; ?>`;
            $('#emailTemplatesForm').validate({
                ignore: [],
                rules: {
                    [`title[${defaultLocale}]`]: "required",

                },
                messages: {
                    [`title[${defaultLocale}]`]: "This field is required.",

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

            if ($.fn.tinymce) {
                tinymce.init({
                    selector: '.email-content',
                    setup: function(editor) {
                        editor.on('change input', function() {
                            const contentId = editor.id;
                            const language = contentId.split('_').pop();
                            const content = editor.getContent();

                            // document.querySelector(`#email-notify-content`).innerHTML = content;
                            // var text = document.querySelector(`#email-notify-content`).innerHTML;
                            // console.log(text);

                            const plainText = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '')
                                .trim();

                            const container = document.querySelector(`#email-notify-content`);

                            if (plainText === '') {
                                // Show fallback message
                                container.innerHTML = '<h6>{{ __('static.notify_templates.enter_content') }} </h6>';
                            } else {
                                // Show content as-is
                                container.innerHTML = content;
                            }

                        });
                    },
                    plugins: [
                        'shortcodes',
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste"
                    ],
                    toolbar: [
                        "insertfile undo redo | styleselect | bold italic underline strikethrough | formatselect | shortcodes | forecolor backcolor code table | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                    ],
                    image_title: true,
                    file_picker_types: 'image',
                    relative_urls: false,
                    remove_script_host: false,
                    images_upload_handler: function(blobInfo, success, failure) {
                        var formData = new FormData();
                        formData.append('file', blobInfo.blob(), blobInfo.filename());
                        var $csrfToken = $('meta[name="csrf-token"]').attr('content');

                        $.ajax({
                            url: "{{ url('admin/media/upload') }}",
                            type: 'POST',
                            data: formData,
                            headers: {
                                'X-CSRF-TOKEN': $csrfToken
                            },
                            contentType: false,
                            processData: false,
                            success: function(response) {
                                if (response.location) {
                                    success(response.location);
                                } else {
                                    failure('Invalid JSON response');
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                failure('Image upload failed: ' + textStatus + ' - ' +
                                    errorThrown);
                            }
                        });
                    },
                    menubar: false,
                    branding: false,
                    placeholder: 'Enter your text here...',
                });
            }

            var shortcodes = @json($eventAndShortcodes['shortcodes']);
            tinymce.PluginManager.add('shortcodes', function(editor, url) {
                var toggleState = false;
                editor.ui.registry.addMenuButton('shortcodes', {
                    icon: 'sourcecode',
                    text: 'Shortcodes',
                    fetch: function(callback) {
                        var items = shortcodes.map(function(shortcode) {
                            return {
                                type: 'menuitem',
                                text: shortcode.text,
                                onAction: function() {
                                    editor.insertContent('&nbsp;<p>' + shortcode
                                        .action + '</p>');
                                }
                            };
                        });
                        callback(items);
                    }
                });
            });

        })(jQuery)
    </script>
@endpush
