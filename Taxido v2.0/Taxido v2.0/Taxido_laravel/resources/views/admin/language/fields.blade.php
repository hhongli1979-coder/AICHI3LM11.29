@use('App\Enums\Locale')
@use('App\Enums\AppLocale')
<div class="row">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="contentbox">
            <div class="inside">
                <div class="contentbox-title">
                    <h3>{{ isset($language) ? __('static.languages.edit') : __('static.languages.add') }}</h3>
                </div>
                
                <div class="form-group row">
                    <label class="col-md-2" for="name">{{ __('static.languages.name') }}<span> *</span></label>
                    <div class="col-md-10">
                        <div class="input-group mb-3 phone-detail language-input align-items-unset">
                            <div class="col-sm-3 select-label-error flex-direction-unset">
                                <select id="select-country-flag"
                                    class="form-control form-select form-select-transparent" name="flag"
                                    data-placeholder="{{ __('static.languages.select_flag') }}" required>
                                    <option></option>
                                    @foreach (getCountryFlags() as $key => $option)
                                        <option value="{{ $option->flag }}"
                                            image="{{ asset('images/flags/' . $option->flag) }}"
                                            @selected(@$language?->flag == asset('images/flags/' . $option->flag))>
                                            {{ $option->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-sm-9">
                                <input class="form-control" type="text" name="name"
                                    value="{{ isset($language->name) ? $language->name : old('name') }}"
                                    placeholder="{{ __('static.languages.enter_name') }}" required>
                            </div>
                            @error('name')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-md-2" for="locale">{{ __('static.languages.locale') }}<span> *</span></label>
                    <div class="col-md-10 select-label-error select-dropdown">
                        <select class="select-2 form-control" name="locale"
                            data-placeholder="{{ __('static.languages.select_locale') }}" required>
                            <option></option>
                            @foreach (Locale::cases() as $locale)
                                <option class="option" value="{{ $locale->value }}" @selected(old('locale', @$language->locale) == $locale->value)>
                                    {{ $locale->label() }}
                                </option>
                            @endforeach
                        </select>
                        @error('locale')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-md-2" for="app_locale">{{ __('static.languages.app_locale') }}<span>
                            *</span></label>
                    <div class="col-md-10 select-label-error select-dropdown">
                        <select class="select-2 form-control" name="app_locale"
                            data-placeholder="{{ __('static.languages.select_app_locale') }}" required>
                            <option></option>
                            @foreach (AppLocale::cases() as $appLocale)
                                <option class="option" value="{{ $appLocale->value }}" @selected(old('app_locale', @$language->app_locale) == $appLocale->value)>
                                    {{ $appLocale->label() }}
                                </option>
                            @endforeach
                        </select>
                        @error('app_locale')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-md-2" for="role">{{ __('static.languages.is_rtl') }}</label>
                    <div class="col-md-10">
                        <div class="editor-space">
                            <label class="switch">
                                <input class="form-control" type="hidden" name="is_rtl" value="0">
                                <input class="form-check-input" type="checkbox" name="is_rtl" id=""
                                    value="1" @checked(@$language?->is_rtl)>
                                <span class="switch-state"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-md-2" for="role">{{ __('static.status') }}</label>
                    <div class="col-md-10">
                        <div class="editor-space">
                            <label class="switch">
                                <input class="form-control" type="hidden" name="status" value="0">
                                <input class="form-check-input" type="checkbox" name="status" id=""
                                    value="1" @checked(@$language?->status)>
                                <span class="switch-state"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-12">
                        <div class="submit-btn">
                            <button type="submit" name="save" class="btn btn-primary spinner-btn">
                                <i class="ri-save-line text-white lh-1"></i> {{ __('static.save') }}
                            </button>
                            <button type="submit" name="save_and_exit" class="btn btn-primary spinner-btn">
                                <i
                                    class="ri-expand-left-line text-white lh-1"></i>{{ __('static.save_and_exit') }}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

@push('scripts')
    <script>
        (function($) {
            "use strict";

            $.validator.addMethod("notOnlyNumeric", function(value, element) {
                return this.optional(element) || !/^\d+$/.test(value);
            }, "This field cannot contain only numbers.");
            
            $(document).ready(function() {
                $("#languageForm").validate({
                    ignore: [],
                    rules: {
                        "name": { required: true, notOnlyNumeric: true },
                        "locale": "required",
                        "app_locale": "required",
                    }
                });
            });

            const optionFormat = (item) => {
                if (!item.id) {
                    return item.text;
                }

                var span = document.createElement('span');
                var html = '';

                html += '<div class="selected-item">';
                html += '<img src="' + item.element.getAttribute('image') + '" class="h-24 w-24" alt="' + item
                    .text + '"/>';
                html += '<span>' + "  " + item.text + '</span>';
                html += '</div>';
                span.innerHTML = html;
                return $(span);
            }

            $('#select-country-flag').select2({
                placeholder: "Select an option",
                templateSelection: optionFormat,
                templateResult: optionFormat
            });

        })(jQuery);
    </script>
@endpush
