@use('Modules\Taxido\Models\Zone')
@php
    $zones = Zone::where('status', true)?->get(['id', 'name']);
@endphp
<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($dispatcher) ? __('taxido::static.dispatchers.edit') : __('taxido::static.dispatchers.add') }}
                        </h3>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="name">{{ __('taxido::static.dispatchers.full_name') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <input class="form-control" value="{{ isset($dispatcher->name) ? $dispatcher->name : old('name') }}"
                                type="text" name="name"
                                placeholder="{{ __('taxido::static.dispatchers.enter_full_name') }}">
                            @error('name')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="email">{{ __('taxido::static.dispatchers.email') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <input class="form-control"
                                value="{{ isset($dispatcher->email) ? $dispatcher->email : old('email') }}" type="email"
                                name="email" placeholder="{{ __('taxido::static.dispatchers.enter_email') }}">
                            @error('email')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="phone">{{ __('taxido::static.dispatchers.phone') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <div class="input-group mb-3 phone-detail">
                                <div class="col-sm-1">
                                    <select class="select-2 form-control" id="select-country-code" name="country_code">
                                        @foreach (getCountryCodes() as $option)
                                            <option class="option" value="{{ $option->calling_code }}"
                                                data-image="{{ asset('images/flags/' . $option->flag) }}"
                                                @selected($option->calling_code == old('country_code', $dispatcher->country_code ?? '1'))>
                                                {{ $option->calling_code }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="col-sm-11">
                                    <input class="form-control" type="number" name="phone"
                                        value="{{ old('phone', $dispatcher->phone ?? '') }}"
                                        placeholder="{{ __('taxido::static.dispatchers.enter_phone') }}">
                                </div>
                                @error('phone')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    </div>
                    @if (request()->routeIs('admin.dispatcher.create'))
                        <div class="form-group row">
                            <label class="col-md-2" for="password">{{ __('taxido::static.dispatchers.new_password') }}<span>
                                    *</span></label>
                            <div class="col-md-10">
                                <div class="position-relative">
                                    <input class="form-control" type="password" id="password" name="password"
                                        placeholder="{{ __('taxido::static.dispatchers.enter_password') }}">
                                    <i class="ri-eye-line toggle-password"></i>
                                </div>
                                @error('password')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2"
                                for="confirm_password">{{ __('taxido::static.dispatchers.confirm_password') }}<span>
                                    *</span></label>
                            <div class="col-md-10">
                                <div class="position-relative">
                                    <input class="form-control" type="password" name="confirm_password"
                                        placeholder="{{ __('taxido::static.dispatchers.enter_confirm_password') }}"
                                        required>
                                    <i class="ri-eye-line toggle-password"></i>
                                </div>
                                @error('confirm_password')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                        @endif
                        

                    <div class="form-group row">
                        <label class="col-md-2" for="zone">{{ __('taxido::static.dispatchers.zones') }} <span>
                                *</span></label>
                        <div class="col-md-10 select-label-error">
                        <span class="text-gray mt-1">
                                {{ __('taxido::static.dispatchers.no_zones_message') }}
                                <a href="{{ @route('admin.zone.index') }}" class="text-primary">
                                    <b>{{ __('taxido::static.here') }}</b>
                                </a>
                            </span>
                            <select class="form-control select-2 zone" name="zones[]"
                                data-placeholder="{{ __('taxido::static.dispatchers.select_zones') }}" multiple>
                                @foreach ($zones as $index => $zone)
                                    <option value="{{ $zone->id }}"
                                        @if (isset($dispatcher->zones)) @if (in_array($zone->id, $dispatcher->zones->pluck('id')->toArray()))
                                selected @endif
                                    @elseif (old('zones.' . $index) == $zone->id) selected @endif>
                                        {{ $zone->name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('zones')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2 mb-0"
                            for="notify">{{ __('taxido::static.dispatchers.notification') }}</label>
                        <div class="col-md-10">
                            <div class="form-check p-0 w-auto">
                                <input type="checkbox" name="notify" id="notify" value="1"
                                    class="form-check-input me-2">
                                <label for="notify">{{ __('taxido::static.dispatchers.sentence') }}</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="role">{{ __('taxido::static.status') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="status" value="0">
                                    <input class="form-check-input" type="checkbox" name="status" id=""
                                        value="1" @checked(@$dispatcher?->status ?? true)>
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

        $(document).ready(function() {
            $('#dispatcherForm').validate({
                rules: {
                    "name": "required",
                    "email": "required",
                    "role_id": "required",
                    "phone": {
                        "required": true,
                        "minlength": 6,
                        "maxlength": 15
                    },
                    "password": {
                        "required": true,
                        "minlength": 8
                    },
                    "confirm_password": {
                        "required": true,
                        "equalTo": "#password"
                    }
                }
            });

        });

    })(jQuery);
</script>
@endpush
