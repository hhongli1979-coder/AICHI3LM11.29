<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($surgePrice) ? __('taxido::static.surge_prices.edit') : __('taxido::static.surge_prices.add') }}
                        </h3>
                    </div>
                    <div class="row g-4">
                        <div class="col-xxl-6">
                            <div class="form-group row">
                                <label class="col-md-5" for="start_time">{{ __('taxido::static.surge_prices.start_time') }}<span>*</span></label>
                                <div class="col-md-7">
                                    <div id="start-time" class="surge-timer">
                                        <input type="text" class="form-control flatpickr-time h-auto" name="start_time"
                                            id="start_time"
                                            value="{{ isset($surgePrice->start_time) ? \Carbon\Carbon::parse($surgePrice->start_time)->format('H:i') : now()->format('H:i') }}"
                                            placeholder="Select Start Time" required>
                                        @error('start_time')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xxl-6">
                            <div class="form-group row">
                                <label class="col-md-5" for="end_time">{{ __('taxido::static.surge_prices.end_time') }}<span>*</span></label>
                                <div class="col-md-7">
                                    <div id="end-time" class="surge-timer">
                                        <input type="text" class="form-control flatpickr-time h-auto" name="end_time"
                                            id="end_time"
                                            value="{{ isset($surgePrice->end_time) ? \Carbon\Carbon::parse($surgePrice->end_time)->format('H:i') : now()->addHour()->format('H:i') }}"
                                            placeholder="Select End Time" required>
                                        @error('end_time')
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
                            <label class="col-md-2"
                                for="day">{{ __('taxido::static.surge_prices.day') }}<span> *</span></label>
                            <div class="col-md-10 select-label-error">
                                <select class="select-2 form-control" id="day" name="day"
                                    data-placeholder="{{ __('taxido::static.surge_prices.select_day') }}">
                                    <option class="select-placeholder" value=""></option>
                                    @foreach (['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as $day)
                                            <option value="{{ $day }}"
                                                {{ old('day', $surgePrice->day ?? '') == $day ? 'selected' : '' }}>
                                                {{ $day }}</option>
                                        @endforeach
                                </select>
                                @error('day')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                        </div>

                        <div class="col-12">
                            <div class="form-group row">
                                <label class="col-md-2" for="status">{{ __('taxido::static.status') }}</label>
                                <div class="col-md-10">
                                    <div class="editor-space">
                                        <label class="switch">
                                            @if (isset($surgePrice))
                                                <input class="form-control" type="hidden" name="status"
                                                    value="0">
                                                <input class="form-check-input" type="checkbox" name="status" id="" value="1" {{ $surgePrice->status ? 'checked' : '' }}>
                                            @else
                                                <input class="form-control" type="hidden" name="status"
                                                    value="0">
                                                <input class="form-check-input" type="checkbox" name="status"
                                                    id="" value="1" checked>
                                            @endif
                                            <span class="switch-state"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="form-group row">
                                <div class="col-12">
                                    <div class="submit-btn">
                                        <button type="button" id="saveBtn" name="save"
                                            class="btn btn-primary spinner-btn">
                                            <i class="ri-save-line text-white lh-1"></i>
                                            {{ __('taxido::static.save') }}
                                        </button>
                                        <button type="button" id="saveExitBtn" name="save_and_exit"
                                            class="btn btn-primary spinner-btn">
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
    </div>
</div>
@push('css')
    <link rel="stylesheet" href="{{ asset('css/vendors/flatpickr.min.css') }}">
@endpush
@push('scripts')
    <script src="{{ asset('js/flatpickr/flatpickr.js') }}"></script>
    <script src="{{ asset('js/flatpickr/rangePlugin.js') }}"></script>
    <script>
        (function($) {
            "use strict";

            $('#surgePriceForm').validate({
                ignore: [],
                rules: {
                    "start_time": "required",
                    "end_time": "required",
                    "price": {
                        required: true,
                        number: true,
                        min: 0
                    },
                    "day": "required"
                }
            });

            flatpickr("#start_time", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                static: true,
                appendTo: document.getElementById("start-time"),
            });

            flatpickr("#end_time", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                static: true,
                appendTo: document.getElementById("end-time"),
            });

        })(jQuery);
    </script>
@endpush
