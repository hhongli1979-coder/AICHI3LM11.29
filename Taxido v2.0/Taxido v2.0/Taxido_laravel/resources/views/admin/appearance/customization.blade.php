@extends('admin.layouts.master')
@section('title', __('static.appearance.customizations'))

@push('css')
    <link rel="stylesheet" type="text/css" href="{{ asset('css/vendors/codemirror/codemirror.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/vendors/codemirror/monokai.css') }}">
@endpush

@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('static.appearance.customizations') }}</h3>
                </div>
            </div>

            <form method="POST" id="appearanceCustomizationsForm" action="{{ route('admin.customization.store') }}">
                @csrf
                <div>
                    <ul class="nav nav-tabs horizontal-tab custom-scroll" id="account" role="tablist">
                        <li class="nav-item" role="presentation">
                            <a class="nav-link active" id="tab-html-tab" data-bs-toggle="tab" href="#tab-html"
                                role="tab" aria-controls="tab-html" aria-selected="false">
                                {{ __('static.appearance.custom_html') }}
                            </a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="tab-css-tab" data-bs-toggle="tab" href="#tab-css" role="tab"
                                aria-controls="tab-css" aria-selected="false">
                                {{ __('static.appearance.custom_css') }}
                            </a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="tab-js-tab" data-bs-toggle="tab" href="#tab-js" role="tab"
                                aria-controls="tab-js" aria-selected="true">
                                {{ __('static.appearance.custom_js') }}
                            </a>
                        </li>
                    </ul>

                    <div class="tab-content" id="accountContent">
                        <div class="tab-pane fade show active" id="tab-html">
                            <div class="form-group row">
                                <label class="col-12" for="custom-html-header">{{ __('static.appearance.header') }}</label>
                                <div class="col-12">
                                    <textarea class="form-control code-editor" id="custom-html-header" name="custom_html[header]" rows="10"
                                        value = "{{ @$customization['html']['header'] }}}}" placeholder="{{ __('Enter your custom HTML here...') }}">{{ old('custom_html.header', $customization['html']['header'] ?? '') }}</textarea>
                                    @error('custom_html.header')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-12" for="custom-html-body">{{ __('static.appearance.body') }}</label>
                                <div class="col-12">
                                    <textarea class="form-control code-editor" id="custom-html-body" name="custom_html[body]" rows="10"
                                        value = "{{ @$customization['html']['body'] }}" placeholder="{{ __('Enter your custom HTML here...') }}">{{ old('custom_html.body', $customization['html']['body'] ?? '') }}</textarea>
                                    @error('custom_html.body')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-12" for="custom-html-footer">{{ __('static.appearance.footer') }}</label>
                                <div class="col-12">
                                    <textarea class="form-control code-editor" id="custom-html-footer" name="custom_html[footer]" rows="10"
                                        value = "{{ @$customization['html']['footer'] }}" placeholder="{{ __('Enter your custom HTML here...') }}">{{ old('custom_html.footer', $customization['html']['footer'] ?? '') }}</textarea>
                                    @error('custom_html.footer')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade custom-css-tab" id="tab-css">
                            <div class="form-group row">
                                <label class="col-12" for="custom-css">{{ __('static.appearance.css') }}</label>
                                <div class="col-12">
                                    <textarea class="form-control code-editor" id="custom-css" name="custom_css" rows="20"
                                        placeholder="{{ __('Enter your custom CSS here...') }}">{{ old('custom_css', $customization['css'] ?? '') }}</textarea>
                                    @error('custom_css')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="tab-js">
                            <div class="form-group row">
                                <label class="col-12" for="custom-js-header">{{ __('static.appearance.header') }}</label>
                                <div class="col-12">
                                    <textarea class="form-control code-editor" id="custom-js-header" name="custom_js[header]" rows="10"
                                        placeholder="{{ __('Enter your custom JavaScript here...') }}">{{ old('custom_js.header', $customization['js']['header'] ?? '') }}</textarea>
                                    @error('custom_js.header')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-12" for="custom-js-body">{{ __('static.appearance.body') }}</label>
                                <div class="col-12">
                                    <textarea class="form-control code-editor" id="custom-js-body" name="custom_js[body]" rows="10"
                                        placeholder="{{ __('Enter your custom JavaScript here...') }}">{{ old('custom_js.body', $customization['js']['body'] ?? '') }}</textarea>
                                    @error('custom_js.body')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-12" for="custom-js-footer">{{ __('static.appearance.footer') }}</label>
                                <div class="col-12">
                                    <textarea class="form-control code-editor" id="custom-js-footer" name="custom_js[footer]" rows="10"
                                        placeholder="{{ __('Enter your custom JavaScript here...') }}">{{ old('custom_js.footer', $customization['js']['footer'] ?? '') }}</textarea>
                                    @error('custom_js.footer')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group mt-3">
                        <button type="submit" class="btn btn-solid spinner-btn ms-auto"><i class="ri-save-line text-white lh-1"></i>{{ __('Save') }}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('js/codemirror/codemirror.js') }}"></script>
    <script src="{{ asset('js/codemirror/javascript.js') }}"></script>
    <script src="{{ asset('js/codemirror/css.js') }}"></script>
    <script src="{{ asset('js/codemirror/xml.js') }}"></script>

    <script>
        var editors = {};

        function initializeEditors() {
            ['custom-html-header', 'custom-html-body', 'custom-html-footer', 'custom-css', 'custom-js-header',
                'custom-js-body', 'custom-js-footer'
            ].forEach(function(field) {
                if (!editors[field]) {
                    var element = document.getElementById(field);
                    if (element) {
                        editors[field] = CodeMirror.fromTextArea(element, {
                            mode: field.includes('css') ? 'css' : (field.includes('js') ? 'javascript' :
                                'htmlmixed'),
                            lineNumbers: true,
                            theme: "monokai",
                            lineWrapping: true
                        });
                    }
                }
            });
        }

        function resizeEditor() {
            for (var editor in editors) {
                if (editors.hasOwnProperty(editor)) {
                    editors[editor].refresh();
                }
            }
        }

        $(".nav-link").on("click", function() {
            setTimeout(resizeEditor, 200);
        });

        $(document).ready(function() {
            initializeEditors();
        });
    </script>
@endpush
