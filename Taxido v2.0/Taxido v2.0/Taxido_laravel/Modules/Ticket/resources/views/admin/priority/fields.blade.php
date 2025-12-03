<div class="row">
    <div class="row g-xl-4 g-3">
        <div class="col-xl-10 col-xxl-8 mx-auto">
            <div class="left-part">
                <div class="contentbox">
                    <div class="inside">
                        <div class="contentbox-title">
                            <h3>{{ isset($priority) ? __('ticket::static.priority.edit') : __('ticket::static.priority.add') }}
                            </h3>
                        </div>
                        @isset($priority)
                            <div class="form-group row">
                                <label class="col-md-2" for="name">{{ __('ticket::static.language.languages') }}</label>
                                <div class="col-md-10">
                                    <ul class="language-list">
                                        @forelse (getLanguages() as $lang)
                                            <li>
                                                <a href="{{ route('admin.priority.edit', ['priority' => $priority->id, 'locale' => $lang->locale]) }}"
                                                    class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                    target="_blank"><img
                                                        src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                        alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                                        class="ri-arrow-right-up-line"></i></a>
                                            </li>
                                        @empty
                                            <li>
                                                <a href="{{ route('admin.priority.edit', ['priority' => $priority->id, 'locale' => Session::get('locale', 'en')]) }}"
                                                    class="language-switcher active" target="blank"><img
                                                        src="{{ asset('admin/images/flags/LR.png') }}"
                                                        alt="">English<i class="ri-arrow-right-up-line"></i></a>
                                            </li>
                                        @endforelse
                                    </ul>
                                </div>
                            </div>
                        @endisset
                        <input type="hidden" name="locale" value="{{ request('locale') }}">
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('ticket::static.priority.name') }}<span>
                                    *</span></label>
                            <div class="col-md-10">
                                <div class="position-relative">
                                    <input class="form-control" type="text" name="name" id="name"
                                        value="{{ isset($priority->name) ? $priority->getTranslation('name', request('locale', app()->getLocale())) : old('name') }}"
                                        placeholder="{{ __('ticket::static.priority.enter_name') }}({{ request('locale', app()->getLocale()) }})"
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
                            <label class="col-md-2" for="name">{{ __('ticket::static.priority.color') }}<span>
                                    *</span></label>
                            <div class="col-md-10 select-label-error">
                                <select class="select-2 form-control" name="color"
                                    data-placeholder="{{ __('ticket::static.priority.select_color') }}">
                                    <option class="select-placeholder" value=""></option>
                                    @forelse (['primary' => 'Primary', 'secondary' => 'Secondary', 'success' => 'Success', 'danger' => 'Danger', 'info' => 'Info', 'light' => 'Light', 'dark' => 'Dark', 'warning' => 'Warning'] as $key => $option)
                                        <option class="option" value={{ $key }}
                                            @if (old('color', $priority->color ?? '') == $key) selected @endif>{{ $option }}
                                        </option>
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
                            <label class="col-md-2"
                                for="response_in">{{ __('ticket::static.priority.response_in') }}<span>
                                    *</span></label>
                            <div class="col-md-10">
                                <div class="input-group mb-3 flex-nowrap custom-input-group">
                                    <div class="col-sm-9">
                                        <input class="form-control" type="number" min="1" name="response_in"
                                            value="{{ isset($priority->response_in) ? $priority->response_in : old('response_in ') }}">
                                    </div>

                                    <div class="col-sm-3 select-label-error">
                                        <select class="select-2 form-control"
                                            placeholder="{{ __('ticket::static.priority.select_type') }}"
                                            name="response_value_in">
                                            @forelse (['minute' => 'Minute', 'hour' => 'Hour', 'day' => 'Day', 'week' => 'Week'] as $key => $option)
                                                <option class="option" value={{ $key }}
                                                    @if (old('response_value_in', $priority->response_value_in ?? '') == $key) selected @endif>
                                                    {{ $option }}</option>
                                            @empty
                                                <option value="" disabled></option>
                                            @endforelse
                                        </select>
                                        @error('response_in')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-2"
                                for="resolve_in">{{ __('ticket::static.priority.resolve_in') }}<span>
                                    *</span></label>
                            <div class="col-md-10">
                                <div class="input-group mb-3 flex-nowrap custom-input-group">
                                    <div class="col-sm-9">
                                        <input class="form-control" type="number" min="1" name="resolve_in"
                                            value="{{ isset($priority->resolve_in) ? $priority->resolve_in : old('resolve_in ') }}">
                                    </div>
                                    <div class="col-sm-3 select-label-error">
                                        <select class="select-2 form-control"
                                            placeholder="{{ __('ticket::static.priority.select_type') }}"
                                            name="resolve_value_in">
                                            @forelse (['minute' => 'Minute', 'hour' => 'Hour', 'day' => 'Day', 'week' => 'Week'] as $key => $option)
                                                <option class="option" value={{ $key }}
                                                    @if (old('resolve_value_in', $priority->resolve_value_in ?? '') == $key) selected @endif>
                                                    {{ $option }}</option>
                                            @empty
                                                <option value="" disabled></option>
                                            @endforelse
                                        </select>
                                        @error('resolve_in')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2" for="role">{{ __('ticket::static.priority.status') }}</label>
                            <div class="col-md-10">
                                <div class="editor-space">
                                    <label class="switch">
                                        <input class="form-control" type="hidden" name="status" value="0">
                                        <input class="form-check-input" type="checkbox" name="status"
                                            id="" value="1" @checked(@$priority?->status ?? true)>
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
</div>
@push('scripts')
    <script>
        (function($) {
            "use strict";
            $('#priorityForm').validate({
                rules: {
                    response_in: {
                        required: true,
                        min: 1,
                    },
                    resolve_in: {
                        required: true,
                        min: 1,
                    },
                    color: {
                        required: true
                    }
                }
            });
        })(jQuery);
    </script>
@endpush
