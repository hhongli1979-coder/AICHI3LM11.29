<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($hourlyPackage) ? __('taxido::static.hourly_package.edit') : __('taxido::static.hourly_package.add') }}
                        </h3>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="hour">{{ __('taxido::static.hourly_package.hour') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <input class="form-control" type="number" name="hour"
                                value="{{ isset($hourlyPackage->hour) ? $hourlyPackage->hour : old('hour') }}"
                                placeholder="{{ __('taxido::static.hourly_package.enter_hour') }}">
                            @error('hour')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                            <span class="text-gray mt-1">
                                {{ __('taxido::static.hourly_package.hour_span') }}
                            </span>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="distance">{{ __('taxido::static.hourly_package.distance') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <input class="form-control" type="number" name="distance"
                                value="{{ isset($hourlyPackage->distance) ? $hourlyPackage->distance : old('distance') }}"
                                placeholder="{{ __('taxido::static.hourly_package.enter_distance') }}">
                            @error('distance')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                            <span class="text-gray mt-1">
                                {{ __('taxido::static.hourly_package.distance_span') }}
                            </span>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2"
                            for="distance_type">{{ __('taxido::static.hourly_package.distance_type') }}<span>
                                *</span></label>
                        <div class="col-md-10 select-label-error">
                            <span class="text-gray mt-1">
                                {{ __('taxido::static.hourly_package.distance_type_span') }}
                            </span>
                            <select class="select-2 form-control" id="distance_type" name="distance_type"
                                data-placeholder="{{ __('taxido::static.hourly_package.select_distance_type') }}">
                                <option class="select-placeholder" value=""></option>
                                @foreach (['km' => 'KM', 'mile' => 'Mile'] as $key => $option)
                                    <option class="option" value="{{ $key }}"
                                        @if (old('distance_type', $hourlyPackage->distance_type ?? '') == $key) selected @endif>{{ $option }}
                                    </option>
                                @endforeach
                            </select>
                            @error('distance_type')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row" id="vehicle-type-selection">
                        <label class="col-md-2"
                            for="vehicle_type">{{ __('taxido::static.hourly_package.select_vehicle_type') }}</label>
                        <div class="col-md-10 select-label-error">

                            <span class="text-gray mt-1">
                                {{ __('taxido::static.hourly_package.vehicle_type_span') }}
                            </span>
                            <select class="form-control select-2" name="vehicle_types[]"
                                data-placeholder="{{ __('taxido::static.hourly_package.select_vehicle_type') }}"
                                multiple>
                                @foreach ($vehicleTypes as $index => $vehicleType)
                                    <option value="{{ $vehicleType->id }}"
                                        @if (@$hourlyPackage?->vehicle_types) @if (in_array($vehicleType->id, $hourlyPackage->vehicle_types->pluck('id')->toArray()))
                                                        selected @endif
                                    @elseif (old('vehicle_types.' . $index) == $vehicleType->id) selected @endif>
                                        {{ $vehicleType->name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('vehicle_types')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="role">{{ __('taxido::static.hourly_package.status') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="status" value="0">
                                    <input class="form-check-input" type="checkbox" name="status" id=""
                                        value="1" @checked(@$hourlyPackage?->status ?? true)>
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
            $('#hourlyPackageForm').validate({
                rules: {
                    "distance": "required",
                    "hour": "required",
                    "distance_type": "required",
                }
            });
        })(jQuery);
    </script>
@endpush
