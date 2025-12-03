@use('Modules\Taxido\Models\Driver')
@php
    $drivers = Driver::where('status', true)?->get(['id', 'name']);
@endphp
<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($notice) ? __('taxido::static.notices.edit') : __('taxido::static.notices.add_notice') }}
                            ({{ app()->getLocale() }})</h3>
                    </div>
                    @isset($notice)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('taxido::static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route('admin.notice.edit', ['notice' => $notice->id, 'locale' => $lang->locale]) }}"
                                                class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                target="_blank"><img
                                                    src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                    alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                                    class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route('admin.notice.edit', ['notice' => $notice->id, 'locale' => Session::get('locale', 'en')]) }}"
                                                class="language-switcher active" target="blank"><img
                                                    src="{{ asset('admin/images/flags/LR.png') }}" alt="">English<i
                                                    class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @endforelse
                                </ul>
                            </div>
                        </div>
                    @endisset
                    <div class="form-group row">
                        <label class="col-md-2" for="send_to">{{ __('taxido::static.notices.send_to') }}
                            <span>*</span></label>
                        <div class="col-md-10 select-label-error">
                            <select class="select-2 form-control" id="send_to" name="send_to"
                                data-placeholder="{{ __('taxido::static.notices.select_send_to') }}">
                                <option class="select-placeholder" value=""></option>
                                @foreach (['all' => 'All', 'particular' => 'Drivers'] as $key => $option)
                                    <option class="option" value="{{ $key }}"
                                        @if (old('send_to', $notice->send_to ?? '') == $key) selected @endif>{{ $option }}</option>
                                @endforeach
                            </select>
                            @error('send_to')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row" id="driver-selection" style="display: none;">
                        <label class="col-md-2" for="driver">{{ __('taxido::static.notices.select_drivers') }}<span>
                                *</span></label>
                        <div class="col-md-10 select-label-error">
                            <span class="text-gray mt-1">
                                {{ __('taxido::static.notices.no_drivers_message') }}
                                <a href="{{ @route('admin.driver.index') }}" class="text-primary">
                                    <b>{{ __('taxido::static.here') }}</b>
                                </a>
                            </span>
                            <select class="form-control select-2 driver" name="drivers[]"
                                data-placeholder="{{ __('taxido::static.notices.select_drivers') }}" multiple>
                                @foreach ($drivers as $index => $driver)
                                    <option value="{{ $driver->id }}"
                                        @if (@$notice?->drivers) @if (in_array($driver->id, $notice->drivers->pluck('id')->toArray())) selected @endif
                                    @elseif (old('drivers.' . $index) == $driver->id) selected @endif>
                                        {{ $driver->name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('drivers')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2"
                            for="message">{{ __('taxido::static.notices.message') }}<span>*</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <textarea class="form-control"
                                    placeholder="{{ __('taxido::static.notices.enter_message') }} ({{ request('locale', app()->getLocale()) }})"
                                    rows="4" id="message" name="message" cols="50">{{ isset($notice->message) ? $notice->getTranslation('message', request('locale', app()->getLocale())) : old('message') }}</textarea><i class="ri-file-copy-line copy-icon"
                                    data-target="#message"></i>
                            </div>
                            @error('message')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="color">{{ __('taxido::static.notices.color') }}<span>
                                *</span></label>
                        <div class="col-md-10 select-label-error">
                            <select class="select-2 form-control" name="color"
                                data-placeholder="{{ __('taxido::static.notices.select_color') }}">
                                <option class="select-placeholder" value=""></option>
                                @forelse (['primary' => 'Primary', 'secondary' => 'Secondary', 'success' => 'Success', 'danger' => 'Danger', 'info' => 'Info', 'light' => 'Light', 'dark' => 'Dark', 'warning' => 'Warning'] as $key => $option)
                                    <option class="option" value={{ $key }}
                                        @if (old('color', $notice->color ?? '') == $key) selected @endif>{{ $option }}</option>
                                @empty
                                    <option value="" disabled></option>
                                @endforelse
                            </select>
                            @error('color')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="notice">{{ __('taxido::static.status') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="status" value="0">
                                    <input class="form-check-input" type="checkbox" name="status" id=""
                                        value="1" @checked(@$notice?->status ?? true)>
                                    <span class="switch-state"></span>
                                </label>
                            </div>
                            @error('status')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <div class="col-12">
                            <div class="submit-btn">
                                <button type="submit" name="save" class="btn btn-primary spinner-btn">
                                    <i class="ri-save-line text-white lh-1"></i> {{ __('taxido::static.save') }}
                                </button>
                                <button type="submit" name="save_and_exit" class="btn btn-primary spinner-btn">
                                    <i
                                        class="ri-expand-left-line text-white lh-1"></i>{{ __('taxido::static.save_and_exit') }}
                                </button>
                            </div>
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

            $('#noticeForm').validate({
                rules: {
                    "send_to": "required",
                    "color": "required",
                    "message": "required",
                    "drivers[]": {
                        required: function() {
                            return $('#send_to').val() === 'particular';
                        }
                    }
                }
            });

            $('#send_to').on('change', function() {
                if ($(this).val() === 'particular') {
                    $('#driver-selection').show();
                } else {
                    $('#driver-selection').hide();
                }
            });

            $('#send_to').trigger('change');

        })(jQuery);
    </script>
@endpush
