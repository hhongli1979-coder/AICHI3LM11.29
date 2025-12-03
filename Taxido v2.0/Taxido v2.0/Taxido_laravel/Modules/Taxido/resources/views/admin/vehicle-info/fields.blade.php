@use('Modules\Taxido\Models\VehicleType')
@use('Modules\Taxido\Models\FleetManager')
@use('Modules\Taxido\Enums\RoleEnum')
@php
    $vehicleTypes = VehicleType::where('status', true)?->get(['id', 'name']);
    $fleetManagers = FleetManager::where('status', true)?->get(['id', 'name', 'email']);
    $defaultFleetId = null;
    if (getCurrentRoleName() == RoleEnum::FLEET_MANAGER) {
        $defaultFleetId = getCurrentUserId();
    }
@endphp
<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($vehicleInfo) ? __('taxido::static.fleet_vehicles.edit') : __('taxido::static.fleet_vehicles.add') }}
                            ({{ request('locale', app()->getLocale()) }})
                        </h3>
                    </div>
                    <input type="hidden" name="locale" value="{{ request('locale') }}">

                    <div class="form-group row">
                        <label class="col-md-2" for="name">{{ __('taxido::static.fleet_vehicles.name') }}<span>*</span></label>
                        <div class="col-md-10">
                            <input class="form-control" type="text" name="name" id="name"
                                   value="{{ isset($vehicleInfo->name) ? $vehicleInfo->name : old('name') }}"
                                   placeholder="{{ __('taxido::static.fleet_vehicles.enter_name') }}">
                            @error('name')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="fleet_manager_id">{{ __('taxido::static.fleet_vehicles.fleet_manager') }}<span>*</span></label>
                        <div class="col-md-10 select-label-error">
                            <select class="form-control select-2" name="fleet_manager_id"
                                    data-placeholder="{{ __('taxido::static.fleet_vehicles.select_fleet_manager') }}">
                                <option value="">{{ __('taxido::static.fleet_vehicles.select_fleet_manager') }}</option>
                                @foreach ($fleetManagers as $fm)
                                    <option value="{{ $fm->id }}"
                                        @if ((isset($vehicleInfo) && (int)$vehicleInfo->fleet_manager_id === (int)$fm->id)
                                            || (old('fleet_manager_id') && (int)old('fleet_manager_id') === (int)$fm->id)
                                            || (!isset($vehicleInfo) && !$errors->has('fleet_manager_id') && $defaultFleetId && (int)$defaultFleetId === (int)$fm->id))
                                            selected @endif>
                                        {{ $fm->name }} {{ $fm->email ? '(' . (isDemoModeEnabled() ? __('taxido::static.demo_mode') : $fm->email) . ')' : '' }}
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
                        <label class="col-md-2" for="vehicle_type_id">{{ __('taxido::static.fleet_vehicles.vehicle_type') }}<span>*</span></label>
                        <div class="col-md-10 select-label-error">
                            <select class="form-control select-2" name="vehicle_type_id"
                                    data-placeholder="{{ __('taxido::static.fleet_vehicles.select_vehicle_type') }}">
                                <option value="">{{ __('taxido::static.fleet_vehicles.select_vehicle_type') }}</option>
                                @foreach ($vehicleTypes as $type)
                                    <option value="{{ $type->id }}"
                                        @if ((isset($vehicleInfo) && $vehicleInfo->vehicle_type_id == $type->id) || old('vehicle_type_id') == $type->id) selected @endif>
                                        {{ $type->name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('vehicle_type_id')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="plate_number">{{ __('taxido::static.fleet_vehicles.plate_number') }}<span>*</span></label>
                        <div class="col-md-10">
                            <input class="form-control" type="text" name="plate_number" id="plate_number"
                                   value="{{ isset($vehicleInfo->plate_number) ? $vehicleInfo->plate_number : old('plate_number') }}"
                                   placeholder="{{ __('taxido::static.fleet_vehicles.enter_plate_number') }}">
                            @error('plate_number')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="color">{{ __('taxido::static.fleet_vehicles.color') }}</label>
                        <div class="col-md-10">
                            <input class="form-control" type="text" name="color" id="color"
                                   value="{{ isset($vehicleInfo->color) ? $vehicleInfo->color : old('color') }}"
                                   placeholder="{{ __('taxido::static.fleet_vehicles.enter_color') }}">
                            @error('color')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="model">{{ __('taxido::static.fleet_vehicles.model') }}</label>
                        <div class="col-md-10">
                            <input class="form-control" type="text" name="model" id="model"
                                   value="{{ isset($vehicleInfo->model) ? $vehicleInfo->model : old('model') }}"
                                   placeholder="{{ __('taxido::static.fleet_vehicles.enter_model') }}">
                            @error('model')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="model_year">{{ __('taxido::static.fleet_vehicles.model_year') }}</label>
                        <div class="col-md-10">
                            <input class="form-control" type="text" name="model_year" id="model_year"
                                   value="{{ isset($vehicleInfo->model_year) ? $vehicleInfo->model_year : old('model_year') }}"
                                   placeholder="{{ __('taxido::static.fleet_vehicles.enter_model_year') }}">
                            @error('model_year')
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
                                    <i class="ri-expand-left-line text-white lh-1"></i>{{ __('taxido::static.save_and_exit') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


