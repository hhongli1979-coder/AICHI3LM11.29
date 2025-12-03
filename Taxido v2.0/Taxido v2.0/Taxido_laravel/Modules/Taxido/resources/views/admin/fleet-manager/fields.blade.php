<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($fleetManager) ? __('taxido::static.fleet_managers.edit') : __('taxido::static.fleet_managers.add') }}
                        </h3>
                    </div>
                    <ul class="nav nav-tabs horizontal-tab custom-scroll" id="account" role="tablist">
                        <li class="nav-item" role="presentation">
                            <a class="nav-link active" id="profile-tab" data-bs-toggle="tab" href="#profile"
                                type="button" role="tab" aria-controls="profile" aria-selected="true">
                                <i class="ri-shield-user-line"></i>
                                {{ __('taxido::static.fleet_managers.general') }}
                                <i class="ri-error-warning-line danger errorIcon"></i>
                            </a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="address-tab" data-bs-toggle="tab" href="#address" type="button"
                                role="tab" aria-controls="address" aria-selected="true">
                                <i class="ri-rotate-lock-line"></i>
                                {{ __('taxido::static.fleet_managers.address_details') }}
                                <i class="ri-error-warning-line danger errorIcon"></i>
                            </a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="payout-tab" data-bs-toggle="tab" href="#payout" type="button"
                                role="tab" aria-controls="payout" aria-selected="true">
                                <i class="ri-rotate-lock-line"></i>
                                {{ __('taxido::static.fleet_managers.payout_details') }}
                                <i class="ri-error-warning-line danger errorIcon"></i>
                            </a>
                        </li>
                    </ul>
                    <div class="tab-content" id="accountContent">
                        <div class="tab-pane fade  {{ session('active_tab') != null ? '' : 'show active' }}"
                            id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="profile_image_id">{{ __('taxido::static.fleet_managers.profile_image') }}<span>
                                        *</span></label>
                                <div class="col-md-10">
                                    <div class="form-group">
                                        <x-image :name="'profile_image_id'" :data="isset($fleetManager->profile_image)
                                            ? $fleetManager?->profile_image
                                            : old('profile_image_id')" :text="' '"
                                            :multiple="false"></x-image>
                                        @error('profile_image_id')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="name">{{ __('taxido::static.fleet_managers.full_name') }}<span>
                                        *</span></label>
                                <div class="col-md-10">
                                    <input class="form-control"
                                        value="{{ isset($fleetManager->name) ? $fleetManager->name : old('name') }}"
                                        type="text" name="name"
                                        placeholder="{{ __('taxido::static.fleet_managers.enter_full_name') }}">
                                    @error('name')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-2" for="email">{{ __('taxido::static.fleet_managers.email') }}<span> *</span></label>
                                <div class="col-md-10">
                                    @if (isset($fleetManager) && isDemoModeEnabled())
                                        <input class="form-control" value="{{ __('static.demo_mode') }}" type="text" readonly>
                                    @else
                                        <input class="form-control"
                                            value="{{ isset($fleetManager->email) ? $fleetManager->email : old('email') }}"
                                            type="email" name="email"
                                            placeholder="{{ __('taxido::static.fleet_managers.enter_email') }}" required>
                                    @endif
                                    @error('email')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2" for="phone">{{ __('taxido::static.fleet_managers.phone') }}<span> *</span></label>
                                <div class="col-md-10">
                                    @if (isset($fleetManager) && isDemoModeEnabled())
                                        <input class="form-control" value="{{ __('static.demo_mode') }}" type="text" readonly>
                                    @else
                                        <div class="input-group mb-3 phone-detail">
                                            <div class="col-sm-1">
                                                <select class="select-2 form-control" id="select-country-code" name="country_code">
                                                    @foreach (getCountryCodes() as $option)
                                                        <option class="option" value="{{ $option->calling_code }}"
                                                            data-image="{{ asset('images/flags/' . $option->flag) }}"
                                                            @selected($option->calling_code == old('country_code', $fleetManager->country_code ?? '1'))>
                                                            {{ $option->calling_code }}
                                                        </option>
                                                    @endforeach
                                                </select>
                                            </div>
                                            <div class="col-sm-11">
                                                <input class="form-control" type="number" name="phone"
                                                    value="{{ old('phone', $fleetManager->phone ?? '') }}"
                                                    placeholder="{{ __('taxido::static.fleet_managers.enter_phone') }}" required>
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
                            
                            @if (request()->routeIs('admin.fleet-manager.create'))
                                <div class="form-group row">
                                    <label class="col-md-2"
                                        for="password">{{ __('taxido::static.fleet_managers.new_password') }}<span>
                                            *</span></label>
                                    <div class="col-md-10">
                                        <div class="position-relative">
                                            <input class="form-control" type="password" id="password" name="password"
                                                placeholder="{{ __('taxido::static.fleet_managers.enter_password') }}">
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
                                        for="confirm_password">{{ __('taxido::static.fleet_managers.confirm_password') }}<span>
                                            *</span></label>
                                    <div class="col-md-10">
                                        <div class="position-relative">
                                            <input class="form-control" type="password" name="confirm_password"
                                                placeholder="{{ __('taxido::static.fleet_managers.enter_confirm_password') }}"
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
                                        for="notify">{{ __('taxido::static.fleet_managers.notification') }}</label>
                                    <div class="col-md-10">
                                        <div class="form-check p-0 w-auto">
                                            <input type="checkbox" name="notify" id="notify" value="1"
                                                class="form-check-input me-2">
                                            <label
                                                for="notify">{{ __('taxido::static.fleet_managers.sentence') }}</label>
                                        </div>
                                    </div>
                                </div>
                            @endif
                            <div class="form-group row">
                                <label class="col-md-2" for="role">{{ __('taxido::static.status') }}</label>
                                <div class="col-md-10">
                                    <div class="editor-space">
                                        <label class="switch">
                                            <input class="form-control" type="hidden" name="status"
                                                value="0">
                                            <input class="form-check-input" type="checkbox" name="status"
                                                id="" value="1" @checked(@$fleetManager?->status ?? true)>
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
                            <div class="footer">
                                <button type="button"
                                    class="nextBtn btn btn-primary">{{ __('static.next') }}</button>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="address" role="tabpanel" aria-labelledby="address-tab">

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="company_name">{{ __('taxido::static.fleet_managers.company_name') }}<span>*</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text" name="address[company_name]"
                                        placeholder="{{ __('taxido::static.fleet_managers.enter_company_name') }}"
                                        value="{{ old('address.company_name', $fleetManager->address->company_name ?? '') }}">
                                    @error('address.company_name')
                                        <span class="invalid-feedback d-block"><strong>{{ $message }}</strong></span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="company_email">{{ __('taxido::static.fleet_managers.company_email') }}<span>*</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text" name="address[company_email]"
                                        placeholder="{{ __('taxido::static.fleet_managers.enter_company_email') }}"
                                        value="{{ old('address.company_email', $fleetManager->address->company_email ?? '') }}">
                                    @error('address.company_email')
                                        <span class="invalid-feedback d-block"><strong>{{ $message }}</strong></span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="company_address">{{ __('taxido::static.fleet_managers.company_address') }}<span>*</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text" name="address[company_address]"
                                        placeholder="{{ __('taxido::static.fleet_managers.enter_company_address') }}"
                                        value="{{ old('address.company_address', $fleetManager->address->company_address ?? '') }}">
                                    @error('address.company_address')
                                        <span class="invalid-feedback d-block"><strong>{{ $message }}</strong></span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="city">{{ __('taxido::static.fleet_managers.city') }}<span>*</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text" name="address[city]"
                                        placeholder="{{ __('taxido::static.fleet_managers.enter_city') }}"
                                        value="{{ old('address.city', $fleetManager->address->city ?? '') }}">
                                    @error('address.city')
                                        <span class="invalid-feedback d-block"><strong>{{ $message }}</strong></span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="postal_code">{{ __('taxido::static.fleet_managers.postal_code') }}<span>*</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text" name="address[postal_code]"
                                        placeholder="{{ __('taxido::static.fleet_managers.enter_postal_code') }}"
                                        value="{{ old('address.postal_code', $fleetManager->address->postal_code ?? '') }}">
                                    @error('address.postal_code')
                                        <span class="invalid-feedback d-block"><strong>{{ $message }}</strong></span>
                                    @enderror
                                </div>
                            </div>

                            <div class="footer">
                                <button type="button"
                                            class="previousBtn bg-light-primary btn cancel">{{ __('static.previous') }}</button>
                                <button type="button"
                                    class="nextBtn btn btn-primary">{{ __('static.next') }}</button>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="payout" role="tabpanel" aria-labelledby="payout-tab">
                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="bank_account_no">{{ __('taxido::static.fleet_managers.bank_account_no') }}<span>*</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text"
                                        name="payment_account[bank_account_no]"
                                        placeholder="{{ __('taxido::static.fleet_managers.enter_bank_account') }}"
                                        value="{{ old('payment_account.bank_account_no', $fleetManager->payment_account->bank_account_no ?? '') }}">
                                    @error('payment_account.bank_account_no')
                                        <span class="invalid-feedback d-block"><strong>{{ $message }}</strong></span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="bank_name">{{ __('taxido::static.fleet_managers.bank_name') }}<span>*</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text" name="payment_account[bank_name]"
                                        placeholder="{{ __('taxido::static.fleet_managers.enter_bank_name') }}"
                                        value="{{ old('payment_account.bank_name', $fleetManager->payment_account->bank_name ?? '') }}">
                                    @error('payment_account.bank_name')
                                        <span class="invalid-feedback d-block"><strong>{{ $message }}</strong></span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="bank_holder_name">{{ __('taxido::static.fleet_managers.holder_name') }}<span>*</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text"
                                        name="payment_account[bank_holder_name]"
                                        placeholder="{{ __('taxido::static.fleet_managers.enter_holder_name') }}"
                                        value="{{ old('payment_account.bank_holder_name', $fleetManager->payment_account->bank_holder_name ?? '') }}">
                                    @error('payment_account.bank_holder_name')
                                        <span class="invalid-feedback d-block"><strong>{{ $message }}</strong></span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="swift">{{ __('taxido::static.fleet_managers.swift') }}<span>*</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text" name="payment_account[swift]"
                                        placeholder="{{ __('taxido::static.fleet_managers.enter_swift_code') }}"
                                        value="{{ old('payment_account.swift', $fleetManager->payment_account->swift ?? '') }}">
                                    @error('payment_account.swift')
                                        <span class="invalid-feedback d-block"><strong>{{ $message }}</strong></span>
                                    @enderror
                                </div>
                            </div> 

                            <div class="form-group row">
                                <label class="col-md-2" for="routing_number">
                                    {{ __('taxido::static.fleet_managers.routing_number') }}<span>*</span>
                                </label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text" name="payment_account[routing_number]"
                                        placeholder="{{ __('taxido::static.fleet_managers.enter_routing_number') }}"
                                        value="{{ old('payment_account.routing_number', $fleetManager->payment_account->routing_number ?? '') }}">
                                    @error('payment_account.routing_number')
                                        <span class="invalid-feedback d-block"><strong>{{ $message }}</strong></span>
                                    @enderror
                                </div>
                            </div>
                            
                            <div class="form-group row">
                                <div class="col-12">
                                    <div class="submit-btn">
                                        <button type="submit" name="save" class="btn btn-primary spinner-btn">
                                            <i class="ri-save-line text-white lh-1"></i> {{ __('static.save') }}
                                        </button>
                                        <button type="submit" name="save_and_exit" class="btn btn-primary spinner-btn">
                                            <i class="ri-expand-left-line text-white lh-1"></i>{{ __('static.save_and_exit') }}
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
</div>
@push('scripts')
    <script>
        (function($) {
            "use strict";
            $('#fleetManagerForm').validate({
                ignore: [] ,
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
                    },
                    "address[company_name]": "required",
                    "address[company_email]" : "required",
                    "address[company_address]" : "required",
                    "address[city]" : "required",
                    "address[postal_code]" : "required",
                    "address[city]" : "required",
                    "payment_account[routing_number]" : "required",
                    "payment_account[swift]" : "required",
                    "payment_account[bank_holder_name]" : "required",
                    "payment_account[bank_name]" : "required",
                    "payment_account[bank_account_no]" : "required",
                },
            });
        })(jQuery);
    </script>
@endpush
