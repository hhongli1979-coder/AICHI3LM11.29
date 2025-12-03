@use('App\Enums\RoleEnum')
@use('Modules\Taxido\Models\Document')
@use('Modules\Taxido\Models\VehicleInfo')
@use('Modules\Taxido\Enums\RoleEnum as BaseRoleEnum')
@php
    $vehicleInfo = VehicleInfo::whereNotNull('fleet_manager_id')?->get(['id', 'name']);
    $documents = Document::where('status', true)->where('type', 'vehicle')?->get();
@endphp
<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($vehicleInfoDoc) ? __('taxido::static.fleet_vehicle_documents.edit') : __('taxido::static.fleet_vehicle_documents.add') }}
                        </h3>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2"
                            for="document_image_id">{{ __('taxido::static.fleet_vehicle_documents.document_image') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <div class="form-group">
                                <x-image :name="'document_image_id'" :data="isset($vehicleInfoDoc->document_image)
                                    ? $vehicleInfoDoc?->document_image
                                    : old('document_image_id')" :text="''"
                                    :multiple="false"></x-image>
                                @error('document_image_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="fleet_manager_id">{{ __('taxido::static.fleet_vehicle_documents.fleet_vehicle') }}
                            <span> *</span></label>
                        <div class="col-md-10 select-label-error">
                            <span class="text-gray mt-1">
                                {{ __('taxido::static.fleet_vehicle_documents.add_fleet_message') }}
                                <a href="{{ route('admin.vehicle-info.index') }}" class="text-primary">
                                    <b>{{ __('taxido::static.here') }}</b>
                                </a>
                            </span>
                            <select id="select-fleet" class="form-control select-2 fleet" name="vehicle_info_id"
                                data-placeholder="{{ __('taxido::static.fleet_vehicle_documents.select_fleet') }}">
                                <option></option>
                                @foreach ($vehicleInfo as $vehicle)
                                    <option value="{{ $vehicle->id }}"
                                        @selected(old('vehicle_info_id', @$vehicleInfoDoc->vehicle_info_id) == $vehicle->id)>
                                        {{ $vehicle->name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('vehicle_info_id')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2"
                            for="document_id">{{ __('taxido::static.fleet_vehicle_documents.document') }}<span>
                                *</span></label>
                        <div class="col-md-10 select-label-error">

                            @if (getCurrentRoleName() == RoleEnum::ADMIN)
                                <span class="text-gray mt-1">
                                    {{ __('taxido::static.fleet_vehicle_documents.no_documents_message') }}
                                    <a href="{{ @route('admin.document.index') }}" class="text-primary">
                                        <b>{{ __('taxido::static.here') }}</b>
                                    </a>
                                </span>
                            @endif
                            <select class="form-control select-2 document" name="document_id"
                                data-placeholder="{{ __('taxido::static.fleet_vehicle_documents.select_document') }}">
                                <option class="option" value=""></option>
                                @foreach ($documents as $document)
                                    <option value="{{ $document->id }}"
                                        data-need_expired_date="{{ $document->need_expired_date }}"
                                        @if (@$vehicleInfoDoc) @selected(old('document_id', @$vehicleInfoDoc?->document_id) == $document->id) @endif>
                                        {{ $document?->name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('document_id')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row flatpicker-calender select-date">
                        <label class="col-md-2" for="expired_at">{{ __('Expired At') }}</label>
                        <div class="col-md-10">
                            @if (isset($vehicleInfoDoc) && $vehicleInfoDoc->expired_at)
                                <input class="form-control" id="expired_at"
                                    value="{{ \Carbon\Carbon::parse($vehicleInfoDoc->expired_at)->format('m/d/Y') }}"
                                    name="expired_at" placeholder="Select Date.." required>
                            @else
                                <input class="form-control" id="expired_at" name="expired_at" placeholder="Select Date.." required>
                            @endif
                            @error('expired_at')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    @if (getCurrentRoleName() == RoleEnum::ADMIN)
                        <div class="form-group row">
                            <label for="status" class="col-md-2">
                                {{ __('taxido::static.fleet_vehicle_documents.status') }}<span>*</span>
                            </label>
                            <div class="col-md-10 select-label-error">
                                <select class="select-2 form-control" id="status" name="status"
                                    data-placeholder="{{ __('taxido::static.fleet_vehicle_documents.select_status') }}">
                                    <option class="option" value="" selected></option>
                                    <option value="pending" @selected(old('status', @$vehicleInfoDoc?->status) == 'pending')>
                                        {{ __('taxido::static.fleet_vehicle_documents.pending') }}
                                    </option>
                                    <option value="approved" @selected(old('status', @$vehicleInfoDoc?->status) == 'approved')>
                                        {{ __('taxido::static.fleet_vehicle_documents.approved') }}
                                    </option>
                                    <option value="rejected" @selected(old('status', @$vehicleInfoDoc?->status) == 'rejected')>
                                        {{ __('taxido::static.fleet_vehicle_documents.rejected') }}
                                    </option>
                                </select>
                                @error('status')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    @elseif (getCurrentRoleName() == BaseRoleEnum::FLEET_MANAGER)
                        <input type="hidden" name="status" value="pending">
                    @endif

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
@push('css')
    <link rel="stylesheet" href="{{ asset('css/vendors/flatpickr.min.css')}}">
@endpush
@push('scripts')
    <script src="{{ asset('js/flatpickr/flatpickr.js')}}"></script>
    <script src="{{ asset('js/flatpickr/rangePlugin.js')}}"></script>
    <script>
        (function($) {
            "use strict";
            $('#vehicleInfoDocForm').validate({
                ignore: [],
                rules: {
                    "vehicle_info_id": "required",
                    "document_id": "required",
                    "status": "required",
                    expired_at: {
                        required: function (element) {
                            let selectedOption = $('select[name="document_id"]').find(':selected');
                            let needExpiredDate = selectedOption.data('need_expired_date');
                            return needExpiredDate == 1;
                        }
                    }
                },
                messages: {
                    expired_at: {
                        required: "This document requires an expiration date."
                    }
                }
            });
            const optionFormat = (item) => {
                console.log(item)
                if (!item.id) {
                    return item.text;
                }

                var span = document.createElement('span');
                var html = '';

                html += '<div class="selected-item">';
                html += '<img src="' + item.element.getAttribute('image') +
                    '" class="rounded-circle h-30 w-30" alt="' + item.text + '"/>';
                html += '<div class="detail">'
                html += '<h6>' + item.text + '</h6>';
                html += '<p>' + item.element.getAttribute('sub-title') + '</p>';
                html += '</div>';
                html += '</div>';

                span.innerHTML = html;
                return $(span);
            }

            $('#select-fleet').select2({
                placeholder: "Select an option",
                templateSelection: optionFormat,
                templateResult: optionFormat
            });

            flatpickr("#expired_at", {
                dateFormat: "m/d/Y",
                minDate: "today"
            });

        $('select[name="document_id"]').on('change', function () {
            $('#expired_at').valid();
        });

        })(jQuery);
    </script>
@endpush
