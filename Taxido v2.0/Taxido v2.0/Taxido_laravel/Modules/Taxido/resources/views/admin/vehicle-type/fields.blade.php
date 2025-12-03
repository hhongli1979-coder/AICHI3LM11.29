@use('Modules\Taxido\Models\Zone')
@php
    $zones = Zone::where('status', true)?->get();
@endphp
<div class="row g-xl-4 g-3">
    <div class="col-xl-8">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($vehicleType) ? __('taxido::static.vehicle_types.edit') : __('taxido::static.vehicle_types.add') }}
                            ({{ request('locale', app()->getLocale()) }})
                        </h3>
                    </div>
                    @isset($vehicleType)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('taxido::static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route(getVehicleEditRoute(), ['vehicleType' => $vehicleType->id, 'locale' => $lang->locale]) }}"
                                                class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                target="_blank">
                                                <img src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                    alt="">
                                                {{ @$lang?->name }} ({{ @$lang?->locale }})
                                                <i class="ri-arrow-right-up-line"></i>
                                            </a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route(getVehicleEditRoute(), ['vehicle_type' => $vehicleType->id, 'locale' => Session::get('locale', 'en')]) }}"
                                                class="language-switcher active" target="blank">
                                                <img src="{{ asset('admin/images/flags/LR.png') }}" alt="">
                                                English
                                                <i class="ri-arrow-right-up-line"></i>
                                            </a>
                                        </li>
                                    @endforelse
                                </ul>
                            </div>
                        </div>
                    @endisset
                    <input type="hidden" name="locale" value="{{ request('locale') }}">
                    <div class="form-group row">
                        <label class="col-md-2"
                            for="vehicle_image_id">{{ __('taxido::static.vehicle_types.image') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <div class="form-group">
                                <x-image :name="'vehicle_image_id'" :data="isset($vehicleType->vehicle_image)
                                    ? $vehicleType?->vehicle_image
                                    : old('vehicle_image_id')" :text="''"
                                    :multiple="false"></x-image>
                                @error('vehicle_image_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    </div>
                    <div class="row g-4">
                        <div class="col-12">
                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="vehicle_image_id">{{ __('taxido::static.vehicle_types.map_icon') }}<span>*</span></label>
                                <div class="col-md-10">
                                    <div class="form-group">
                                        <x-image :name="'vehicle_map_icon_id'" :data="isset($vehicleType->vehicle_map_icon)
                                            ? $vehicleType?->vehicle_map_icon
                                            : old('vehicle_map_icon_id')" :text="''"
                                            :multiple="false"></x-image>
                                        @error('vehicle_map_icon_id')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="form-group row">
                                <label class="col-md-2" for="name">{{ __('taxido::static.vehicle_types.name') }}
                                    <span> *</span></label>
                                <div class="col-md-10">
                                    <div class="position-relative">
                                        <input class="form-control" type="text" id="name" name="name"
                                            value="{{ isset($vehicleType->name) ? $vehicleType->getTranslation('name', request('locale', app()->getLocale())) : old('name') }}"
                                            placeholder="{{ __('taxido::static.vehicle_types.enter_name') }} ({{ request('locale', app()->getLocale()) }})"><i
                                            class="ri-file-copy-line copy-icon" data-target="#name"></i>
                                    </div>
                                    @error('name')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                        </div>


                        <div class="col-12">
                            <div class="form-group row amount-input">
                            <label class="col-md-2" for="description">{{ __('taxido::static.vehicle_types.description') }} </label>
                            <div class="col-md-10">
                                <div class="position-relative">
                                    <textarea class="form-control" rows="4" name="description" id="description"
                                        placeholder="{{ __('taxido::static.vehicle_types.enter_vehicle_description') }} ({{ request('locale', app()->getLocale()) }})"
                                        cols="80">{{ isset($vehicleType->description) ? $vehicleType->getTranslation('description', request('locale', app()->getLocale())) : old('description') }}</textarea><i class="ri-file-copy-line copy-icon"
                                        data-target="#description"></i>
                                </div>
                            </div>
                            @error('description')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                        </div>

                        <div class="col-12">
                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="max_seat">{{ __('taxido::static.vehicle_types.max_seat') }}
                                    <span>*</span></label>
                                <div class="col-md-10">
                                   <input class="form-control" type="number" min="1" name="max_seat"
                                    id="max_seat"
                                    placeholder="{{ __('taxido::static.vehicle_types.enter_max_seat') }}"
                                    value="{{ old('max_seat', $vehicleType->max_seat ?? '') }}"
                                    max="{{ maximumSeat() }}">
                                    @error('max_seat')
                                        <span class="invalid-feedback d-block"><strong>{{ $message }}</strong></span>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-xl-4">
        <div class="p-sticky">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ __('taxido::static.vehicle_types.publish') }}</h3>
                    </div>
                    <div class="form-group row">
                        <div class="col-12">
                            <div class="row g-3">
                                <div class="col-12">
                                    <div class="d-flex align-items-center gap-2 icon-position">
                                        <button type="submit" name="save" class="btn btn-primary">
                                            <i class="ri-save-line text-white lh-1"></i> {{ __('static.save') }}
                                        </button>
                                        <button type="submit" name="save_and_exit"
                                            class="btn btn-primary spinner-btn">
                                            <i class="ri-expand-left-line text-white lh-1"></i>{{ __('static.save_and_exit') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ __('static.additional_info') }}</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-xl-12">
                            <div class="form-group row">
                                <label class="col-md-2" for="all_zones">{{ __('taxido::static.vehicle_types.all_zones') }}</label>
                                <div class="col-md-10">
                                    <label class="switch">
                                        <input type="hidden" name="is_all_zones" value="0">
                                        <input class="form-check-input" type="checkbox" id="is_all_zones" name="is_all_zones" value="1"
                                            @checked(old('is_all_zones', $vehicleType->is_all_zones ?? false))>
                                        <span class="switch-state"></span>
                                    </label>
                                    @error('is_all_zones')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row" id="zones-field">
                                <label class="col-md-2" for="zones">{{ __('taxido::static.vehicle_types.zones') }}<span>*</span></label>
                                <div class="col-md-10 select-label-error">
                                    @if($zones->isEmpty())
                                        <span class="text-gray mt-1">
                                            {{ __('taxido::static.vehicle_types.no_zones_message') }}
                                            <a href="{{ route('admin.zone.index') }}" class="text-primary">
                                                <b>{{ __('taxido::static.here') }}</b>
                                            </a>
                                        </span>
                                    @else
                                        <select class="form-control select-2 zone" name="zones[]" data-placeholder="{{ __('taxido::static.vehicle_types.select_zones') }}" multiple>
                                            @foreach ($zones as $zone)
                                                <option value="{{ $zone->id }}"
                                                    @if(isset($vehicleType) && !$vehicleType->is_all_zones && $vehicleType->zones->contains($zone->id))
                                                        selected
                                                    @elseif(is_array(old('zones')) && in_array($zone->id, old('zones')))
                                                        selected
                                                    @endif>
                                                    {{ $zone->name }}
                                                </option>
                                            @endforeach
                                        </select>
                                    @endif
                                    @error('zones')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <input type="hidden" name="service" value="{{ $service }}">

                            <div class="form-group row">
                                <label class="col-md-2" for="serviceCategories">{{ __('taxido::static.vehicle_types.service_categories') }}<span>*</span></label>
                                <div class="col-md-10 select-label-error">
                                    <select class="form-control select-2" id="service_category_id" name="serviceCategories[]"
                                        data-placeholder="{{ __('taxido::static.vehicle_types.select_service_categories') }}" multiple>
                                        @foreach ($serviceCategories as $index => $serviceCategory)
                                        <option value="{{ $serviceCategory->id }}"
                                                @if (@$vehicleType?->service_categories)
                                                @if (in_array($serviceCategory->id, $vehicleType?->service_categories->pluck('id')->toArray())) selected @endif
                                                @elseif (old('serviceCategories.' . $index) == $serviceCategory->id) selected @endif>
                                                {{ $serviceCategory->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('serviceCategories')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                            <div class="col-xl-12 col-md-4 col-sm-6">
                                <div class="form-group row">
                                    <label class="col-12" for="status">{{ __('taxido::static.vehicle_types.status') }}</label>
                                    <div class="col-12">
                                        <div class="switch-field form-control">
                                            <input value="1" type="radio" name="status" id="status_active"
                                                @checked(boolval(@$vehicleType?->status ?? true) == true) />
                                            <label for="status_active">{{ __('static.active') }}</label>
                                            <input value="0" type="radio" name="status" id="status_deactive"
                                                @checked(boolval(@$vehicleType?->status ?? true) == false) />
                                            <label for="status_deactive">{{ __('static.deactive') }}</label>
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
    <script>
        $(document).ready(function() {

            // Define global jQuery function
            window.selectCommissionTypeField = function(type) {
                if (type === 'fixed') {
                    $('#currencyIcon').show();
                    $('#percentageIcon').hide();
                } else if (type === 'percentage') {
                    $('#currencyIcon').hide();
                    $('#percentageIcon').show();
                }
                $('#commission_rate_field').show();
            };

            // Attach event listener for commission type change
            $('#commission_type').on('change', function() {
                const selectedType = $(this).val();
                if (selectedType) {
                    window.selectCommissionTypeField(selectedType);
                } else {
                    $('#commission_rate_field').hide();
                }
            });

            function toggleZonesField() {
                if ($('#is_all_zones').is(':checked')) {
                    $('#zones-field').hide();
                    $('.zone option').prop('selected', true);
                    $('.zone').trigger('change');
                    $('input[name="is_all_zones"][type="hidden"]').val('1'); // Set hidden input to 1 when checked
                } else {
                    $('#zones-field').show();
                    $('input[name="is_all_zones"][type="hidden"]').val('0'); // Set hidden input to 0 when unchecked
                }
            }

            $('#is_all_zones').on('change', toggleZonesField);

            toggleZonesField();

            $('#vehicleTypeForm').validate({
                ignore: [],
                rules: {
                    "name": "required",
                    "serviceCategories[]": "required",
                    "max_seat": {
                        required: true,
                        number: true,
                        min: 1,
                    },
                    "zones[]" : "required",
                    "status": "required",
                }
            });

        })
    </script>
@endpush
