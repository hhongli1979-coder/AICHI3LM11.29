@use('Modules\Taxido\Models\Zone')
@use('Modules\Taxido\Models\FleetManager')
@use('Modules\Taxido\Models\Service')
@use('Modules\Taxido\Models\VehicleType')
@use('Modules\Taxido\Models\ServiceCategory')
@php
    $vehicleTypes = VehicleType::where('status', true)?->get(['id', 'name']);
    $services =  Service::whereNull('deleted_at')?->where('status', true)->pluck('name','id');
    $serviceCategories =  ServiceCategory::whereNull('deleted_at')?->where('status', true)->get();
    $fleetManagers = FleetManager::whereNull('deleted_at')->where('status', true)
        ->get(['id', 'name', 'email', 'profile_image_id']);
@endphp
<div class="row">
    <div class="col-12">
        <div class="row g-xl-4 g-3">
            <div class="col-xl-10 col-xxl-8 mx-auto">
                <div class="contentbox">
                    <div class="inside">
                        <div class="contentbox-title">
                            <h3>{{ isset($driver) ? __('taxido::static.drivers.edit') : __('taxido::static.drivers.add') }}
                            </h3>
                        </div>
                        <ul class="nav nav-tabs horizontal-tab custom-scroll" id="account" role="tablist">
                            <li class="nav-item" role="presentation">
                                <a class="nav-link active" id="profile-tab" data-bs-toggle="tab" href="#profile"
                                    type="button" role="tab" aria-controls="profile" aria-selected="true">
                                    <i class="ri-shield-user-line"></i>
                                    {{ __('taxido::static.drivers.general') }}
                                    <i class="ri-error-warning-line danger errorIcon"></i>
                                </a>
                            </li>
                            <li class="nav-item" role="presentation">
                                <a class="nav-link" id="address-tab" data-bs-toggle="tab" href="#address" type="button"
                                    role="tab" aria-controls="address" aria-selected="true">
                                    <i class="ri-rotate-lock-line"></i>
                                    {{ __('taxido::static.drivers.address') }}
                                    <i class="ri-error-warning-line danger errorIcon"></i>
                                </a>
                            </li>
                            <li class="nav-item" role="presentation">
                                <a class="nav-link" id="vehicle-tab" data-bs-toggle="tab" href="#vehicle" type="button"
                                    role="tab" aria-controls="vehicle" aria-selected="true">
                                    <i class="ri-shield-user-line"></i>
                                    {{ __('taxido::static.drivers.vehicle') }}
                                    <i class="ri-error-warning-line danger errorIcon"></i>
                                </a>
                            </li>
                            <li class="nav-item" role="presentation">
                                <a class="nav-link" id="payout-tab" data-bs-toggle="tab" href="#payout" type="button"
                                    role="tab" aria-controls="payout" aria-selected="true">
                                    <i class="ri-rotate-lock-line"></i>
                                    {{ __('taxido::static.drivers.payout_details') }}
                                    <i class="ri-error-warning-line danger errorIcon"></i>
                                </a>
                            </li>
                            <li class="nav-item" role="presentation">
                                <a class="nav-link" id="additionalInfo-tab" data-bs-toggle="tab" href="#additionalInfo"
                                    type="button" role="tab" aria-controls="additionalInfo" aria-selected="true">
                                    <i class="ri-rotate-lock-line"></i>
                                    {{ __('taxido::static.drivers.additional_info') }}
                                    <i class="ri-error-warning-line danger errorIcon"></i>
                                </a>
                            </li>
                        </ul>
                        <div class="tab-content" id="accountContent">
                            <div class="tab-pane fade  {{ session('active_tab') != null ? '' : 'show active' }}"
                                id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                <div class="form-group row">
                                    <label class="col-md-2" for="profile_image_id">{{ __('taxido::static.drivers.profile_image') }}<span>*</span></label>
                                    <div class="col-md-10">
                                        <div class="form-group">
                                            <x-image :name="'profile_image_id'" :data="isset($driver->profile_image)
                                                ? $driver?->profile_image : old('profile_image_id')" :text="' '" :multiple="false"></x-image>
                                            @error('profile_image_id')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-2" for="name">{{ __('taxido::static.drivers.full_name') }}
                                        <span> *</span> </label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="text" id="name" name="name"
                                            placeholder="{{ __('taxido::static.drivers.enter_full_name') }}"
                                            value="{{ isset($driver->name) ? $driver->name : old('name') }}">
                                        @error('name')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-2" for="email">{{ __('taxido::static.drivers.email') }}
                                        <span>*</span>
                                    </label>
                                    <div class="col-md-10">
                                        @if (isset($driver) && isDemoModeEnabled())
                                            <input class="form-control" value="{{ __('static.demo_mode') }}" type="text" readonly>
                                        @else
                                            <input class="form-control" type="email" name="email"
                                                placeholder="{{ __('taxido::static.drivers.enter_email') }}"
                                                value="{{ isset($driver->email) ? $driver->email : old('email') }}">
                                        @endif
                                        @error('email')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-2" for="phone">{{ __('taxido::static.drivers.phone') }}<span>*</span></label>
                                    <div class="col-md-10">
                                        @if (isset($driver) && isDemoModeEnabled())
                                            <input class="form-control" value="{{ __('static.demo_mode') }}" type="text" readonly>
                                        @else
                                            <div class="input-group mb-3 phone-detail">
                                                <div class="col-sm-1">
                                                    <select class="select-2 form-control" id="select-country-code" name="country_code">
                                                        @foreach (getCountryCodes() as $option)
                                                            <option class="option" value="{{ $option->calling_code }}"
                                                                data-image="{{ asset('images/flags/' . $option->flag) }}"
                                                                @selected($option->calling_code == old('country_code', $driver->country_code ?? '1'))>
                                                                {{ $option->calling_code }}
                                                            </option>
                                                        @endforeach
                                                    </select>
                                                </div>
                                                <div class="col-sm-11">
                                                    <input class="form-control" type="number" name="phone"
                                                        value="{{ old('phone', $driver->phone ?? '') }}"
                                                        placeholder="{{ __('taxido::static.drivers.enter_phone') }}"
                                                        required>
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

                                @if (request()->routeIs('admin.driver.create'))
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="password">{{ __('taxido::static.drivers.new_password') }}<span>
                                                *</span></label>
                                        <div class="col-md-10">
                                            <div class="position-relative">
                                                <input class="form-control" type="password" id="password"
                                                    name="password"
                                                    placeholder="{{ __('taxido::static.drivers.enter_password') }}">
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
                                            for="confirm_password">{{ __('taxido::static.drivers.confirm_password') }}<span>
                                                *</span></label>
                                        <div class="col-md-10">
                                            <div class="position-relative">
                                                <input class="form-control" type="password" name="confirm_password"
                                                    placeholder="{{ __('taxido::static.drivers.enter_confirm_password') }}"
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
                                            for="notify">{{ __('taxido::static.drivers.notification') }}</label>
                                        <div class="col-md-10">
                                            <div class="form-check p-0 w-auto">
                                                <input type="checkbox" name="notify" id="notify" value="1"
                                                    class="form-check-input me-2">
                                                <label
                                                    for="notify">{{ __('taxido::static.drivers.sentence') }}</label>
                                            </div>
                                        </div>
                                    </div>
                                @endif
                                <div class="footer">
                                    <button type="button"
                                        class="nextBtn btn btn-primary">{{ __('static.next') }}</button>
                                    </div>
                                </div>
                            <div class="tab-pane fade" id="address" role="tabpanel" aria-labelledby="address-tab">
                                <div class="form-group row">
                                    <label for="address[address]"
                                        class="col-md-2">{{ __('taxido::static.drivers.address') }}<span>
                                            *</span></label>
                                    <div class="col-md-10">
                                        <input type="text" class="form-control ui-widget autocomplete-google" id="address-input"
                                            name="address[address]" placeholder="{{ __('taxido::static.drivers.enter_address') }}"
                                            value="{{ old('address.address', @$driver->address->address) }}">
                                        @error('address.address')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label for="address[street_address]"
                                        class="col-md-2">{{ __('taxido::static.drivers.street_address') }}</label>
                                    <div class="col-md-10">
                                        <input type="text" class="form-control ui-widget" id="street_address_1"
                                            name="address[street_address]"
                                            placeholder="{{ __('taxido::static.drivers.enter_street_address') }}"
                                            value="{{ @$driver->address ? $driver->address?->street_address : old('address.street_address') }}">
                                    </div>
                                    @error('address.street_address')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-2"
                                        for="address[area_locality]">{{ __('taxido::static.drivers.area_locality') }}
                                    </label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="text" name="address[area_locality]"
                                            placeholder="{{ __('taxido::static.drivers.enter_area_locality') }}"
                                            value="{{ @$driver?->address ? $driver?->address?->area_locality : old('address.area_locality') }}"
                                            id="area_locality">
                                        @error('address.area_locality')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                 <div class="form-group row">
                                    <label for="address[country_id]"
                                        class="col-md-2">{{ __('taxido::static.drivers.country') }}<span>
                                            *</span></label>
                                    <div class="col-md-10 select-label-error">
                                        <select class="select-2 form-control select-country" id="country_id"
                                            name="address[country_id]"
                                            data-placeholder="{{ __('taxido::static.drivers.select_country') }}">
                                            <option class="option" value="" selected></option>
                                            @foreach (getCountries() as $key => $option)
                                                <option value="{{ $key }}" @selected(old('address.country_id', @$driver?->address?->country_id) == $key)>
                                                    {{ $option }}</option>
                                            @endforeach
                                        </select>
                                        @error('address.country_id')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-2" for="address[state]">{{ __('taxido::static.drivers.state') }} <span>*</span></label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="text" name="address[state]" placeholder="{{ __('taxido::static.drivers.enter_state') }}"
                                               value="{{ @$driver?->address ? $driver?->address?->state : old('address.state') }}">
                                        @error('address.state')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>


                                <div class="form-group row">
                                    <label class="col-md-2"
                                        for="address[city]">{{ __('taxido::static.drivers.city') }}
                                        <span> *</span></label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="text" name="address[city]"
                                            placeholder="{{ __('taxido::static.drivers.enter_city') }}"
                                            value="{{ @$driver?->address ? $driver?->address?->city : old('address.city') }}"
                                            id="city">
                                        @error('address.city')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-2"
                                        for="address[postal_code]">{{ __('taxido::static.drivers.postal_code') }}
                                        <span>
                                            *</span></label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="text" name="address[postal_code]"
                                            placeholder="{{ __('taxido::static.drivers.enter_postal_code') }}"
                                            value="{{ @$driver?->address ? $driver?->address?->postal_code : old('address.postal_code') }}"
                                            id="postal_code">
                                        @error('address.postal_code')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
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
                            <div class="tab-pane fade" id="vehicle" role="tabpanel" aria-labelledby="vehicle-tab">
                                <div class="form-group row">
                                    <label class="col-md-2" for="fleet_manager_id">{{ __('taxido::static.drivers.fleet_manager') }}</label>
                                    <div class="col-md-10 select-label-error">
                                        <select class="form-select select-2" id="fleet_manager_id" name="fleet_manager_id" data-placeholder="{{ __('taxido::static.drivers.select_fleet_manager') }}">
                                            <option class="option" value=""></option>
                                            @foreach ($fleetManagers as $manager)
                                                <option value="{{ $manager->id }}"
                                                    data-name="{{ $manager->name }}"
                                                    data-email="{{ $manager->email }}"
                                                    @if (isset($driver)) @selected(old('fleet_manager_id', $driver->fleet_manager_id) == $manager->id)
                                                    @else @selected(old('fleet_manager_id') == $manager->id)
                                                    @endif>
                                                    {{ $manager->name }}
                                                </option>
                                            @endforeach
                                        </select>
                                        @error('fleet_manager_id')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-2" for="service">{{ __('taxido::static.service_categories.service') }} <span>*</span></label>
                                    <div class="col-md-10 select-label-error">
                                        <select class="form-select select-2" id="service_id" name="service_id" data-placeholder="{{ __('taxido::static.service_categories.select_service') }}" required>
                                            <option class="option" value="" selected></option>
                                            @foreach ($services as $index => $service)
                                            <option value="{{ $index }}"
                                                @if (isset($driver)) @selected(old('service_id', $driver->service_id) == $index) @else @selected(old('service_id') == $index) @endif>
                                                {{ $service }}
                                            </option>
                                            @endforeach
                                        </select>
                                        @error('service_id')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row" id="service_category_container">
                                    <label class="col-md-2" for="serviceCategories">{{ __('taxido::static.vehicle_types.service_categories') }}<span> *</span></label>
                                    <div class="col-md-10 select-label-error">
                                        <select class="form-control select-2" id="service_category_id" name="service_category_id"
                                            data-placeholder="{{ __('taxido::static.vehicle_types.select_service_categories') }}">
                                            <option value=""></option>
                                            @if(isset($driver) && $driver->service_category_id)
                                                @foreach ($serviceCategories as $serviceCategory)
                                                    <option value="{{ $serviceCategory->id }}"
                                                        @if ($driver->service_category_id == $serviceCategory->id || old('service_category_id') == $serviceCategory->id) selected @endif>
                                                        {{ $serviceCategory->name }}
                                                    </option>
                                                @endforeach
                                            @endif
                                        </select>
                                        @error('service_category_id')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                        @enderror
                                    </div>
                                </div>

                                <div id="vehicle_fields_container">
                                    <div class="form-group row">
                                        <label class="col-md-2" for="vehicle_info[vehicle_type_id]">{{ __('taxido::static.drivers.vehicle') }}<span>*</span></label>
                                        <div class="col-md-10 select-label-error">
                                            <select class="form-control select-2 vehicle" id="vehicle_type_id"
                                                name="vehicle_info[vehicle_type_id]"
                                                data-placeholder="{{ __('taxido::static.drivers.select_vehicle') }}">
                                                <option value=""></option>
                                                @foreach ($vehicleTypes as $vehicle)
                                                    <option value="{{ $vehicle->id }}"
                                                        @if (old('vehicle_info.vehicle_type_id', @$driver?->vehicle_info?->vehicle_type_id) == $vehicle->id) selected @endif>
                                                        {{ $vehicle->name }}</option>
                                                @endforeach
                                            </select>
                                            @error('vehicle_info.vehicle_type_id')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="vehicle_info[model]">{{ __('taxido::static.drivers.model') }}
                                            <span> *</span></label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="vehicle_info[model]"
                                                placeholder="{{ __('taxido::static.drivers.enter_model') }}"
                                                value="{{ @$driver?->vehicle_info ? $driver?->vehicle_info?->model : old('vehicle_info.model') }}">
                                            @error('vehicle_info.model')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="vehicle_info[plate_number]">{{ __('taxido::static.drivers.plate_number') }}
                                            <span>*</span></label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="vehicle_info[plate_number]"
                                                placeholder="{{ __('taxido::static.drivers.enter_plate_number') }}"
                                                value="{{ @$driver?->vehicle_info ? $driver?->vehicle_info?->plate_number : old('vehicle_info.plate_number') }}">
                                            @error('vehicle_info.plate_number')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="vehicle_info[seat]">{{ __('taxido::static.drivers.seat') }}
                                            <span> *</span></label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="number" min="1" max="{{ maximumSeat() }}"
                                                name="vehicle_info[seat]"
                                                placeholder="{{ __('taxido::static.drivers.enter_seat') }}"
                                                value="{{ @$driver?->vehicle_info ? $driver?->vehicle_info?->seat : old('vehicle_info.seat') }}">
                                            @error('vehicle_info.seat')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label for="vehicle_info[color]" class="col-md-2">
                                            {{ __('taxido::static.drivers.color') }}<span>*</span>
                                        </label>
                                        <div class="col-md-10 select-label-error">
                                            <select class="select-2 form-control" id="vehicle_info[color]" name="vehicle_info[color]"
                                                data-placeholder="{{ __('taxido::static.drivers.enter_color') }}">
                                                @foreach ([ "White", "Black","Red", "Silver","Blue","Brown","Green","Yellow"] as $option)
                                                    <option class="option" value="{{ $option }}"
                                                        @selected($option == old('vehicle_info.color', $driver?->vehicle_info?->color ?? ''))>
                                                        {{ $option }}
                                                    </option>
                                                @endforeach
                                            </select>
                                           @error('vehicle_info.color')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>

                                <div id="ambulance_fields_container" style="display:none">
                                    <div class="form-group row">
                                            <label class="col-md-2"
                                                for="vehicle_info[name]">{{ __('taxido::static.drivers.ambulance_name') }}
                                                <span> *</span></label>
                                            <div class="col-md-10">
                                                <input class="form-control" type="text" name="ambulance[name]"
                                                    placeholder="{{ __('taxido::static.drivers.enter_ambulance_name') }}"
                                                    value="{{ @$driver?->ambulance ? $driver?->ambulance?->name : old('vehicle_info.name') }}">
                                                @error('vehicle_info.name')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong>{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                        </div>

                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="vehicle_info[description]">{{ __('taxido::static.drivers.ambulance_description') }}
                                            <span> *</span></label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="ambulance[description]"
                                                placeholder="{{ __('taxido::static.drivers.enter_ambulance_description') }}"
                                                value="{{ @$driver?->ambulance ? $driver?->ambulance?->description : old('vehicle_info.description') }}">
                                            @error('vehicle_info.description')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
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
                                        for="bank_account_no">{{ __('taxido::static.drivers.bank_account_no') }}
                                        <span>
                                            *</span></label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="text"
                                            name="payment_account[bank_account_no]"
                                            placeholder="{{ __('taxido::static.drivers.enter_bank_account') }}"
                                            value="{{ @$driver?->payment_account ? $driver?->payment_account?->bank_account_no : old('payment_account.bank_account_no') }}">
                                        @error('payment_account.bank_account_no')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-2"
                                        for="bank_name">{{ __('taxido::static.drivers.bank_name') }}
                                        <span> *</span></label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="text" name="payment_account[bank_name]"
                                            placeholder="{{ __('taxido::static.drivers.enter_bank_name') }}"
                                            value="{{ @$driver?->payment_account ? $driver?->payment_account?->bank_name : old('payment_account.bank_name') }}">
                                        @error('payment_account.bank_name')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-2"
                                        for="bank_holder_name">{{ __('taxido::static.drivers.holder_name') }} <span>
                                            *</span></label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="text"
                                            name="payment_account[bank_holder_name]"
                                            placeholder="{{ __('taxido::static.drivers.enter_holder_name') }}"
                                            value="{{ @$driver?->payment_account ? $driver?->payment_account?->bank_holder_name : old('payment_account.bank_holder_name') }}">
                                        @error('payment_account.bank_holder_name')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-2" for="swift">{{ __('taxido::static.drivers.swift') }}
                                        <span>
                                            *</span></label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="text" name="payment_account[swift]"
                                            placeholder="{{ __('taxido::static.drivers.enter_swift_code') }}"
                                            value="{{ @$driver?->payment_account ? $driver?->payment_account?->swift : old('payment_account.swift') }}">
                                        @error('payment_account.swift')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-2" for="routing_number">
                                        {{ __('taxido::static.drivers.routing_number') }}
                                        <span>*</span>
                                    </label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="text" name="payment_account[routing_number]"
                                            placeholder="{{ __('taxido::static.drivers.enter_routing_number') }}"
                                            value="{{ @$driver?->payment_account?->routing_number ?? old('payment_account.routing_number') }}">
                                        @error('payment_account.routing_number')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-2" for="paypal_email">{{ __('taxido::static.drivers.paypal_email') }}
                                        <span> *</span></label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="text"
                                            name="payment_account[paypal_email]"
                                            placeholder="{{ __('taxido::static.drivers.enter_paypal_email') }}"
                                            value="{{  $driver?->payment_account?->paypal_email ?? old('payment_account.enter_paypal_email') }}">
                                        @error('payment_account.paypal_email')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>


                                <div class="form-group row">
                                    <label for="default" class="col-md-2">
                                        {{ __('taxido::static.drivers.default') }}<span>*</span>
                                    </label>
                                    <div class="col-md-10 select-label-error">
                                        <select class="select-2 form-control" id="default" name="default"
                                            data-placeholder="{{ __('taxido::static.drivers.select_default') }}">
                                            <option class="option" value="" selected></option>
                                            <option value="bank" @selected(old('default', @$driver?->payment_account?->default) == 'bank')>
                                                {{ __('taxido::static.drivers.bank') }}
                                            </option>
                                            <option value="paypal" @selected(old('default', @$driver?->payment_account?->default) == 'paypal')>
                                                {{ __('taxido::static.drivers.paypal') }}
                                            </option>
                                        </select>
                                        @error('status')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="footer">
                                    <button type="button"
                                        class="previousBtn bg-light-primary btn cancel">{{ __('static.previous') }}</button>
                                    <button class="nextBtn btn btn-primary"
                                        type="button">{{ __('static.next') }}</button>
                                </div>
                            </div>
                            <div class="tab-pane fade {{ session('active_tab') == 'additionalInfo-tab' ? 'show active' : '' }}"
                                id="additionalInfo" role="tabpanel" aria-labelledby="additionalInfo-tab">

                                <div class="form-group row">
                                    <label class="col-md-2"
                                        for="location">{{ __('taxido::static.drivers.location') }}</label>
                                    <div class="col-md-10 position-relative">
                                        <input type="hidden" name="location" id="location"
                                            value='@json(isset($driver->location) ? $driver->location : [])'>
                                        <input id="map-search" type="text" placeholder="{{ __('taxido::static.drivers.search_location') }}"
                                            class="form-control map-search-box">

                                        <div id="map" class="google-map-container"></div>
                                        <p id="location-error" class="invalid-feedback d-block" role="alert"></p>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-2"
                                        for="is_online">{{ __('taxido::static.drivers.is_online') }}</label>
                                    <div class="col-md-10">
                                        <div class="switch-field form-control">
                                            <input value="1" type="radio" name="is_online"
                                                id="is_online_active" @checked(@$driver?->is_online === 1) />
                                            <label for="is_online_active">{{ __('taxido::static.active') }}</label>
                                            <input value="0" type="radio" name="is_online"
                                                id="is_online_inactive" @checked(@$driver?->is_online === 0 || @$driver?->is_online === null) />
                                            <label
                                                for="is_online_inactive">{{ __('taxido::static.deactive') }}</label>
                                        </div>
                                        @error('is_online')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-2"
                                        for="is_verified">{{ __('taxido::static.drivers.is_verified') }}</label>
                                    <div class="col-md-10">
                                        <div class="switch-field form-control">
                                            <input value="1" type="radio" name="is_verified"
                                                id="is_verified_active" @checked(@$driver?->is_verified === 1) />
                                            <label for="is_verified_active">{{ __('taxido::static.active') }}</label>
                                            <input value="0" type="radio" name="is_verified"
                                                id="is_verified_inactive" @checked(@$driver?->is_verified === 0 || @$driver?->is_verified === null) />
                                            <label
                                                for="is_verified_inactive">{{ __('taxido::static.deactive') }}</label>
                                        </div>
                                        @error('is_verified')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-2" for="is_on_ride">{{ __('taxido::static.drivers.is_on_ride') }}</label>
                                    <div class="col-md-10">
                                        <div class="switch-field form-control">
                                            <input value="1" type="radio" name="is_on_ride" id="is_on_ride_active" @checked(@$driver?->is_on_ride === 1) />
                                            <label for="is_on_ride_active">{{ __('taxido::static.active') }}</label>
                                            <input value="0" type="radio" name="is_on_ride" id="is_on_ride_inactive" @checked(@$driver?->is_on_ride === 0 || @$driver?->is_on_ride === null) />
                                            <label for="is_on_ride_inactive">{{ __('taxido::static.deactive') }}</label>
                                        </div>
                                        @error('is_on_ride')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-md-2" for="status">{{ __('taxido::static.status') }}
                                    </label>
                                    <div class="col-md-10">
                                        <div class="switch-field form-control">
                                            <input value="1" type="radio" name="status" id="status_active"
                                                @checked(@$driver?->status === 1) />
                                            <label for="status_active">{{ __('taxido::static.active') }}</label>
                                            <input value="0" type="radio" name="status" id="status_deactive"
                                                @checked(@$driver?->status === 0 || @$driver?->status === null) />
                                            <label for="status_deactive">{{ __('taxido::static.deactive') }}</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="col-12">
                                        <div class="submit-btn">
                                            <button type="button"
                                                class="previousBtn bg-light-primary btn cancel">{{ __('static.previous') }}</button>
                                            <button type="submit" name="save"
                                                class="btn btn-solid spinner-btn submitBtn">
                                                <i class="ri-save-line text-white lh-1"></i>{{ __('taxido::static.save') }}
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
</div>

@push('scripts')
<script src="{{ asset('js/firebase/firebase-app-compat.js')}}"></script>
<script src="{{ asset('js/firebase/firebase-firestore-compat.js')}}"></script>
<script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAP_API_KEY') }}&libraries=places"></script>
<script>
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "{{ env('FIREBASE_API_KEY') }}",
        authDomain: "{{ env('FIREBASE_AUTH_DOMAIN') }}",
        projectId: "{{ env('FIREBASE_PROJECT_ID') }}",
        storageBucket: "{{ env('FIREBASE_STORAGE_BUCKET') }}",
        messagingSenderId: "{{ env('FIREBASE_MESSAGING_SENDER_ID') }}",
        appId: "{{ env('FIREBASE_APP_ID') }}",
        measurementId: "{{ env('FIREBASE_MEASUREMENT_ID') }}"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    (function($) {
        "use strict";

        let map, marker;
        const defaultLocation = { lat: -1.3119705387570564, lng: 36.90288910995129 };
        const ambulanceServiceId = {{ \Modules\Taxido\Models\Service::where('slug', 'ambulance')->first()->id ?? 0 }};
        const selectedVehicleId = "{{ old('vehicle_info.vehicle_type_id', @$driver?->vehicle_info?->vehicle_type_id) }}";
        let isAmbulanceSelected = false;
        const driverId = "{{ @$driver?->id ?? '0' }}";

        function initGoogleFeatures() {
            if (typeof google !== 'undefined' && typeof google.maps !== 'undefined' && typeof google.maps.places !== 'undefined') {
                initializeMap();
                initializeAutocomplete();
                listenToDriverLocation();
                loadInitialOnlineStatus();
            } else {
                setTimeout(initGoogleFeatures, 100);
            }
        }

        function loadInitialOnlineStatus() {
            if (driverId && driverId !== '0') {
                db.collection("driverTrack").doc(driverId).get()
                    .then((doc) => {
                        if (doc.exists && doc.data().is_online !== undefined) {
                            const isOnline = doc.data().is_online === "1";
                            $(`#is_online_${isOnline ? 'active' : 'inactive'}`).prop('checked', true);
                        }
                    })
                    .catch(error => console.error("Error getting initial status:", error));
            }
        }

        function updateDriverOnlineStatus(isOnline) {
            if (driverId && driverId !== '0') {
                db.collection("driverTrack").doc(driverId).set({
                    is_online: isOnline,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true })
                .then(() => console.log("Driver online status updated to:", isOnline))
                .catch(error => {
                    console.error("Error updating online status:", error);
                    alert("Failed to update online status. Please try again.");
                });
            }
        }

        function initializeMap() {
            let locationInput = $('#location').val();
            let location = defaultLocation;

            if (locationInput) {
                try {
                    let parsed = JSON.parse(locationInput);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        location = parsed[0];
                    } else if (parsed.lat && parsed.lng) {
                        location = parsed;
                    }
                } catch (e) {
                    console.warn("Invalid location JSON:", e);
                }
            }

            map = new google.maps.Map(document.getElementById("map"), {
                zoom: 12,
                center: location
            });

            const input = document.getElementById("map-search");
            const searchBox = new google.maps.places.SearchBox(input);

            map.addListener("bounds_changed", () => searchBox.setBounds(map.getBounds()));

            searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces();
                if (places.length === 0) return;

                const place = places[0];
                if (!place.geometry?.location) return;

                updateMarker(place.geometry.location);
                saveLocation(place.geometry.location);
                updateFirebaseLocation(place.geometry.location);
                map.setCenter(place.geometry.location);
                map.setZoom(15);
            });

            if (location.lat && location.lng) {
                updateMarker(location);
            }

            map.addListener('click', (event) => {
                updateMarker(event.latLng);
                saveLocation(event.latLng);
                updateFirebaseLocation(event.latLng);
            });
        }

        function updateMarker(position) {
            if (marker) {
                marker.setPosition(position);
            } else {
                marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    draggable: true
                });
                marker.addListener('dragend', () => {
                    saveLocation(marker.getPosition());
                    updateFirebaseLocation(marker.getPosition());
                });
            }
        }

        function saveLocation(latLng) {
            $('#location').val(JSON.stringify([{ lat: latLng.lat(), lng: latLng.lng() }]));
        }

        function updateFirebaseLocation(latLng) {
            if (driverId && driverId !== '0') {
                const isOnline = $('input[name="is_online"]:checked').val() || "1";
                db.collection("driverTrack").doc(driverId).set({
                    lat: latLng.lat(),
                    lng: latLng.lng(),
                    is_online: isOnline,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true })
                .catch(error => console.error("Error updating Firebase location:", error));
            }
        }

        function listenToDriverLocation() {
            if (driverId && driverId !== '0') {
                db.collection("driverTrack").doc(driverId)
                    .onSnapshot((doc) => {
                        if (doc.exists) {
                            const data = doc.data();
                            if (data.lat && data.lng) {
                                const position = new google.maps.LatLng(data.lat, data.lng);
                                updateMarker(position);
                                saveLocation(position);
                                map.setCenter(position);
                            }
                            if (data.is_online !== undefined) {
                                const isOnline = data.is_online === "1";
                                $(`#is_online_${isOnline ? 'active' : 'inactive'}`).prop('checked', true);
                            }
                        }
                    }, (error) => {
                        console.error("Error listening to Firestore:", error);
                    });
            }
        }

        function initializeAutocomplete() {
            const input = document.getElementById('address-input');
            if (!input) {
                console.error('Address input element not found');
                return;
            }

            const autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (!place.address_components) return;

                let country = '';

                $('#street_address_1, #area_locality, #city, #postal_code, #state').val('');
                $('#country_id').val('').trigger('change.select2');

                place.address_components.forEach(component => {
                    const type = component.types[0];
                    const value = component.long_name;
                    switch (type) {
                        case 'street_number':
                        case 'sublocality_level_3':
                        case 'sublocality_level_2':
                        case 'route':
                            $('#street_address_1').val((i, val) => (val ? val + ', ' : '') + value);
                            break;
                        case 'locality':
                            $('#city').val(value);
                            break;
                        case 'country':
                            country = value;
                            break;
                        case 'postal_code':
                            $('#postal_code').val(value);
                            break;
                        case 'sublocality':
                        case 'sublocality_level_1':
                            $('#area_locality').val(value);
                            break;
                    }
                });

                if (country) {
                    $.ajax({
                        url: "{{ url('/api/get-country-id') }}",
                        type: 'GET',
                        data: { name: country },
                        success: (response) => {
                            if (response?.id) {
                                $('#country_id').val(response.id).trigger('change.select2');
                            }
                        },
                        error: (xhr) => console.error("Error fetching country:", xhr.responseText)
                    });
                }

                if (place.geometry?.location) {
                    updateMarker(place.geometry.location);
                    saveLocation(place.geometry.location);
                    updateFirebaseLocation(place.geometry.location);
                    map.setCenter(place.geometry.location);
                    map.setZoom(15);
                }
            });
        }

        function toggleAmbulanceFields(hide) {
            isAmbulanceSelected = hide;
            if (hide) {
                $('#service_category_container, #vehicle_fields_container').hide();
                $('#ambulance_fields_container').show();
            } else {
                $('#service_category_container, #vehicle_fields_container').show();
                $('#ambulance_fields_container').hide();
            }
        }

        function loadServiceCategories(serviceId) {
            $.ajax({
                url: "{{ route('serviceCategory.index') }}?service_id=" + serviceId,
                type: "GET",
                success: (data) => {
                    const $categorySelect = $('#service_category_id');
                    $categorySelect.empty().append('<option value=""></option>');
                    data.data.forEach(item => {
                        const option = new Option(item.name, item.id);
                        @if(isset($driver) && $driver?->service_categories)
                            if ({{ json_encode($driver?->service_categories->pluck('id')->toArray()) }}.includes(item.id)) {
                                $(option).prop("selected", true);
                            }
                        @endif
                        $categorySelect.append(option);
                    });
                    $categorySelect.trigger('change');
                },
                error: (xhr) => console.error("Error loading categories:", xhr.responseText)
            });
        }

        function loadVehicles(serviceId, serviceCategoryId) {
            $.ajax({
                url: "{{ route('vehicleType.index') }}?service_id=" + serviceId + "&service_category_id=" + serviceCategoryId,
                type: "GET",
                success: (data) => {
                    const $vehicleSelect = $('#vehicle_type_id');
                    $vehicleSelect.empty().append('<option value=""></option>');
                    data.data.forEach(item => {
                        const option = new Option(item.name, item.id);
                        if (String(item.id) === String(selectedVehicleId)) {
                            $(option).prop("selected", true);
                        }
                        $vehicleSelect.append(option);
                    });
                },
                error: (xhr) => console.error("Error loading vehicles:", xhr.responseText)
            });
        }

        function isPasswordRequired() {
            return !{{ isset($driver) ? 'true' : 'false' }};
        }

        $(document).ready(function() {
            initGoogleFeatures();
            $('.select-2').select2({
                placeholder: function() {
                    return $(this).data('placeholder');
                },
                allowClear: true
            }).on('select2:select select2:unselect', function () {
                $(this).valid(); // ✅ Important to remove validation error on select
            });

            $('input[name="is_online"]').change(function() {
                const isOnline = $(this).val() === "1" ? "1" : "0";
                updateDriverOnlineStatus(isOnline);
            });

            $('#service_id').on('change', function() {
                const serviceId = $(this).val();
                if (Number(serviceId) === Number(ambulanceServiceId)) {
                    toggleAmbulanceFields(true);
                } else {
                    toggleAmbulanceFields(false);
                    $('#service_category_id, #vehicle_type_id').empty().append('<option value=""></option>');
                    if (serviceId) {
                        loadServiceCategories(serviceId);
                    }
                }
            });

            $('#service_category_id').on('change', function() {
                if (!isAmbulanceSelected) {
                    loadVehicles($('#service_id').val(), $(this).val());
                }
            });

            if (Number($('#service_id').val()) === Number(ambulanceServiceId)) {
                toggleAmbulanceFields(true);
            }

            $.validator.addMethod("notOnlyNumeric", function(value, element) {
                return this.optional(element) || !/^\d+$/.test(value);
            }, "This field cannot contain only numbers.");

            $('#driverForm').validate({
                ignore: [],
                rules: {
                    "name": "required",
                    "email": { required: true, email: true },
                    "phone": { required: true, minlength: 6, maxlength: 15 },
                    "password": { required: isPasswordRequired },
                    "confirm_password": { required: isPasswordRequired, equalTo: "#password" },
                    "address[country_id]": "required",
                    "address[state]": { required: true, notOnlyNumeric: true },
                    "address[city]": { required: true, notOnlyNumeric: true },
                    "address[area]": "required",
                    "address[postal_code]": { required: true, maxlength: 12 },
                    "address[address]": "required",
                    "vehicle_info[vehicle_type_id]": { required: () => !isAmbulanceSelected },
                    "vehicle_info[model]": { required: () => !isAmbulanceSelected },
                    "vehicle_info[plate_number]": { required: () => !isAmbulanceSelected },
                    "vehicle_info[seat]": { required: () => !isAmbulanceSelected },
                    "vehicle_info[color]": {
                        required: () => !isAmbulanceSelected,
                        notOnlyNumeric: true
                    },
                    "payment_account[bank_account_no]": "required",
                    "payment_account[bank_name]": "required",
                    "payment_account[bank_holder_name]": {
                        required: true,
                        notOnlyNumeric: true
                    },
                    "payment_account[swift]": "required",
                    "payment_account[routing_number]": "required",
                    "ambulance[name]": { required: () => isAmbulanceSelected },
                    "ambulance[description]": { required: () => isAmbulanceSelected }
                },
                messages: {
                    "confirm_password": {
                        equalTo: "Passwords must match"
                    },
                    "address[state]": {
                        notOnlyNumeric: "State name cannot contain only numbers."
                    },
                    "address[city]": {
                        notOnlyNumeric: "City name cannot contain only numbers."
                    },
                    "vehicle_info[color]": {
                        notOnlyNumeric: "Color cannot contain only numbers."
                    },
                    "payment_account[bank_holder_name]": {
                        notOnlyNumeric: "Account holder name cannot contain only numbers."
                    }
                }
            });
        });
    })(jQuery);
</script>
@endpush
