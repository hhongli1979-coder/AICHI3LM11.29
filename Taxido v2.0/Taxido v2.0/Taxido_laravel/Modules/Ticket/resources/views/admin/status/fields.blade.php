<div class="row">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($status) ? __('ticket::static.status.edit') : __('ticket::static.status.add') }}
                        </h3>
                    </div>
                    @isset($status)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('ticket::static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route('admin.status.edit', ['status' => $status->id, 'locale' => $lang->locale]) }}"
                                                class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                target="_blank"><img
                                                    src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                    alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                                    class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route('admin.status.edit', ['status' => $status->id, 'locale' => Session::get('locale', 'en')]) }}"
                                                class="language-switcher active" target="blank"><img
                                                    src="{{ asset('admin/images/flags/LR.png') }}" alt="">English<i
                                                    class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @endforelse
                                </ul>
                            </div>
                        </div>
                    @endisset
                    <input type="hidden" name="locale" value="{{ request('locale') }}">
                    <div class="form-group row">
                        <label class="col-md-2" for="name">{{ __('ticket::static.status.name') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <input class="form-control" type="text" name="name" id="name"
                                    value="{{ isset($status->name) ? $status->getTranslation('name', request('locale', app()->getLocale())) : old('name') }}"
                                    placeholder="{{ __('ticket::static.status.enter_name') }}({{ request('locale', app()->getLocale()) }})"
                                    required><i class="ri-file-copy-line copy-icon" data-target="#name"></i>
                            </div>
                            @error('name')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="color">{{ __('ticket::static.status.color') }}<span>
                                *</span></label>
                        <div class="col-md-10 select-label-error">
                            <select class="select-2 form-control" name="color"
                                data-placeholder="{{ __('ticket::static.status.select_color') }}">
                                <option class="select-placeholder" value=""></option>
                                @forelse (['primary' => 'Primary', 'secondary' => 'Secondary', 'success' => 'Success', 'danger' => 'Danger', 'info' => 'Info', 'light' => 'Light', 'dark' => 'Dark', 'warning' => 'Warning'] as $key => $option)
                                    <option class="option" value={{ $key }}
                                        @if (old('color', $status->color ?? '') == $key) selected @endif>{{ $option }}</option>
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
                        <label class="col-md-2" for="role">{{ __('ticket::static.status.status') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="status" value="0">
                                    <input class="form-check-input" type="checkbox" name="status" id=""
                                        value="1" @checked(@$status?->status ?? true)>
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
                                    <i class="ri-save-line text-white lh-1"></i> {{ __('ticket::static.save') }}
                                </button>
                                <button type="submit" name="save_and_exit" class="btn btn-primary spinner-btn">
                                    <i class="ri-expand-left-line text-white lh-1"></i>{{ __('ticket::static.save_and_exit') }}
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
            $('#statusForm').validate({
                rules: {
                    "color": "required"
                },
            });
        })(jQuery);
    </script>
@endpush
