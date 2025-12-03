<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($rider) ? __('taxido::static.riders.edit') : __('taxido::static.riders.add') }}
                        </h3>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="profile_image_id">{{ __('taxido::static.drivers.profile_image') }}<span>*</span></label>
                        <div class="col-md-10">
                            <div class="form-group">
                                <x-image :name="'profile_image_id'" :data="isset($rider->profile_image)? $rider?->profile_image : old('profile_image_id')" :text="' '" :multiple="false"></x-image>
                                @error('profile_image_id')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="name">{{ __('taxido::static.riders.full_name') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <input class="form-control" value="{{ isset($rider->name) ? $rider->name : old('name') }}"
                                type="text" name="name"
                                placeholder="{{ __('taxido::static.riders.enter_full_name') }}">
                            @error('name')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="email">{{ __('taxido::static.riders.email') }}<span>*</span></label>
                        <div class="col-md-10">
                            @if (isset($rider) && isDemoModeEnabled())
                            <input class="form-control" value="{{ __('static.demo_mode') }}" type="text" readonly>
                            @else
                            <input class="form-control" value="{{ isset($rider->email) ? $rider->email : old('email') }}" type="email" name="email" id="email" placeholder="{{ __('taxido::static.riders.enter_email') }}" required style="text-transform: lowercase;"
                                oninput="this.value = this.value.toLowerCase();">
                            @endif
                            @error('email')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="phone">{{ __('taxido::static.riders.phone') }}<span>*</span></label>
                        <div class="col-md-10">
                            @if (isset($rider) && isDemoModeEnabled())
                            <input class="form-control" value="{{ __('static.demo_mode') }}" type="text" readonly>
                            @else
                            <div class="input-group mb-3 phone-detail">
                                <div class="col-sm-1">
                                    <select class="select-2 form-control" id="select-country-code" name="country_code">
                                        @foreach (getCountryCodes() as $option)
                                        <option class="option" value="{{ $option->calling_code }}"
                                            data-image="{{ asset('images/flags/' . $option->flag) }}"
                                            @selected($option->calling_code == old('country_code', $rider->country_code ?? '1'))>
                                            {{ $option->calling_code }}
                                        </option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="col-sm-11">
                                    <input class="form-control" type="number" name="phone"
                                        value="{{ old('phone', $rider->phone ?? '') }}"
                                        placeholder="{{ __('taxido::static.riders.enter_phone') }}">
                                </div>
                            </div>
                            @endif
                            @error('phone')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                    </div>
                    @if (request()->routeIs('admin.rider.create'))
                    <div class="form-group row">
                        <label class="col-md-2" for="password">{{ __('taxido::static.riders.new_password') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <input class="form-control" type="password" id="password" name="password"
                                    placeholder="{{ __('taxido::static.riders.enter_password') }}">
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
                            for="confirm_password">{{ __('taxido::static.riders.confirm_password') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <input class="form-control" type="password" name="confirm_password"
                                    placeholder="{{ __('taxido::static.riders.enter_confirm_password') }}"
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
                    <div class="form-group row">
                        <label class="col-md-2 mb-0"
                            for="notify">{{ __('taxido::static.riders.notification') }}</label>
                        <div class="col-md-10">
                            <div class="form-check p-0 w-auto">
                                <input type="checkbox" name="notify" id="notify" value="1"
                                    class="form-check-input me-2">
                                <label for="notify">{{ __('taxido::static.riders.sentence') }}</label>
                            </div>
                        </div>
                    </div>
                    @endif
                    <div class="form-group row">
                        <label class="col-md-2" for="role">{{ __('taxido::static.status') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="status" value="0">
                                    <input class="form-check-input" type="checkbox" name="status" id=""
                                        value="1" @checked(@$rider?->status ?? true)>
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
        $('#riderForm').validate({
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
            },
        });

        $('#userForm').on('submit', function() {
            let emailInput = $('#email');
            emailInput.val(emailInput.val().toLowerCase());
        });

    })(jQuery);
</script>
@endpush
