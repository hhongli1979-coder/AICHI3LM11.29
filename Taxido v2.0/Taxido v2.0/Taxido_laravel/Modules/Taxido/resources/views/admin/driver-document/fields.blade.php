@use('Modules\Taxido\Models\Driver')
@use('Modules\Taxido\Models\Document')
@use('Modules\Taxido\Enums\RoleEnum as BaseRoleEnum')
@use('App\Enums\RoleEnum')
@php
    $drivers = Driver::where('status', true)?->get(['id', 'name']);
    $documents = Document::where('status', true)?->get();
@endphp
<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($driverDocument) ? __('taxido::static.driver_documents.edit') : __('taxido::static.driver_documents.add') }}
                        </h3>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2"
                            for="document_image_id">{{ __('taxido::static.driver_documents.document_image') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <div class="form-group">
                                <x-image :name="'document_image_id'" :data="isset($driverDocument->document_image)
                                    ? $driverDocument?->document_image
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

                    @if (getCurrentRoleName() == RoleEnum::ADMIN)
                        <div class="form-group row">
                            <label class="col-md-2" for="driver_id">{{ __('taxido::static.driver_documents.driver') }}
                                <span> *</span></label>
                            <div class="col-md-10 select-label-error">
                                <span class="text-gray mt-1">
                                    {{ __('taxido::static.driver_documents.add_driver_message') }}
                                    <a href="{{ route('admin.driver.index') }}" class="text-primary">
                                        <b>{{ __('taxido::static.here') }}</b>
                                    </a>
                                </span>
                                <select id="select-driver" class="form-control select-2 driver" name="driver_id"
                                    data-placeholder="{{ __('taxido::static.driver_documents.select_driver') }}">
                                    <option></option>
                                    @foreach ($drivers as $driver)
                                        <option value="{{ $driver->id }}" sub-title="{{ $driver->email }}"
                                            image="{{ $driver->profile_image ? $driver->profile_image->original_url : asset('images/user.png') }}"
                                            @selected(old('driver_id', @$driverDocument->driver_id) == $driver->id)>
                                            {{ $driver->name }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('driver_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    @elseif (getCurrentRoleName() == BaseRoleEnum::DRIVER)
                        <input type="hidden" name="driver_id" value="{{ getCurrentUserId() }}">
                    @endif

                    <div class="form-group row">
                        <label class="col-md-2"
                            for="document_id">{{ __('taxido::static.driver_documents.document') }}<span>
                                *</span></label>
                        <div class="col-md-10 select-label-error">

                            @if (getCurrentRoleName() == RoleEnum::ADMIN)
                                <span class="text-gray mt-1">
                                    {{ __('taxido::static.driver_documents.no_documents_message') }}
                                    <a href="{{ @route('admin.document.index') }}" class="text-primary">
                                        <b>{{ __('taxido::static.here') }}</b>
                                    </a>
                                </span>
                            @endif
                            <select class="form-control select-2 document" name="document_id"
                                data-placeholder="{{ __('taxido::static.driver_documents.select_document') }}">
                                <option class="option" value=""></option>
                                @foreach ($documents as $document)
                                    <option value="{{ $document->id }}"
                                        data-need_expired_date="{{ $document->need_expired_date }}"
                                        @if (@$driverDocument) @selected(old('document_id', @$driverDocument?->document_id) == $document->id) @endif>
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
                            @if (isset($driverDocument) && $driverDocument->expired_at)
                                <input class="form-control" id="expired_at"
                                    value="{{ \Carbon\Carbon::parse($driverDocument->expired_at)->format('m/d/Y') }}"
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
                                {{ __('taxido::static.driver_documents.status') }}<span>*</span>
                            </label>
                            <div class="col-md-10 select-label-error">
                                <select class="select-2 form-control" id="status" name="status"
                                    data-placeholder="{{ __('taxido::static.driver_documents.select_status') }}">
                                    <option class="option" value="" selected></option>
                                    <option value="pending" @selected(old('status', @$driverDocument?->status) == 'pending')>
                                        {{ __('taxido::static.driver_documents.pending') }}
                                    </option>
                                    <option value="approved" @selected(old('status', @$driverDocument?->status) == 'approved')>
                                        {{ __('taxido::static.driver_documents.approved') }}
                                    </option>
                                    <option value="rejected" @selected(old('status', @$driverDocument?->status) == 'rejected')>
                                        {{ __('taxido::static.driver_documents.rejected') }}
                                    </option>
                                </select>
                                @error('status')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    @elseif (getCurrentRoleName() == BaseRoleEnum::DRIVER)
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
            $('#driverDocumentForm').validate({
                ignore: [],
                rules: {
                    "driver_id": "required",
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

            $('#select-driver').select2({
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
