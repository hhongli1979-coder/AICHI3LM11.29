<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($currency) ? __('static.currencies.edit_currency') : __('static.currencies.add_currency') }}
                        </h3>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="flag">{{ __('static.currencies.flag') }}<span> *</span></label>
                        <div class="col-md-10 d-flex flex-column-reverse">
                            <select id="select-country-flag"
                                    class="form-control form-select form-select-transparent"
                                    name="flag"
                                    data-placeholder="Select Flag"
                                    required>
                                <option></option>
                                @foreach (getCountryFlags() as $key => $option)
                                    <option value="{{ $option?->flag }}"
                                            image="{{ asset('images/flags/' . $option->flag) }}"
                                            @selected(isset($currency) && $currency->flag === $option?->flag)>
                                        {{ $option?->name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('flag')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="code">{{ __('static.currencies.code') }}<span> *</span></label>
                        <div class="col-md-10 select-label-error">
                            <select class="select-2 form-control" id="code" name="code"
                                data-placeholder="{{ __('static.currencies.select_code') }}">
                                <option class="select-placeholder" value=""></option>
                                @foreach ($code as $key => $option)
                                    <option class="option" value="{{ $key }}"
                                        @if (old('code', isset($currency) ? $currency->code : '') == $key) selected @endif>{{ $option }}</option>
                                @endforeach
                            </select>
                            @error('code')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="symbol">{{ __('static.currencies.symbol') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <input class="form-control" type="text" name="symbol"
                                value="{{ isset($currency->symbol) ? $currency->symbol : old('symbol') }}"
                                placeholder="{{ __('static.currencies.enter_symbol') }}" readonly>
                            @error('symbol')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="no_of_decimal">{{ __('static.currencies.decimal_number') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <input class='form-control' id="no_of_decimal" type="number" name="no_of_decimal"
                                value="{{ isset($currency->no_of_decimal) ? $currency->no_of_decimal : old('no_of_decimal') }}"
                                placeholder="{{ __('static.currencies.enter_number_of_decimal') }}">
                            @error('no_of_decimal')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="exchange_rate">{{ __('static.currencies.exchange_rate') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <input class='form-control' type="number" name="exchange_rate" id="exchange_rate"
                                value="{{ isset($currency->exchange_rate) ? $currency->exchange_rate : old('exchange_rate') }}"
                                placeholder="{{ __('static.currencies.enter_exchange_rate') }}">
                            @error('exchange_rate')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="role">{{ __('static.status') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="status" value="0">
                                    <input class="form-check-input" type="checkbox" name="status" id=""
                                        value="1" @checked(@$currency?->status ?? true)>
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
                                    <i class="ri-save-line text-white lh-1"></i> {{ __('static.save') }}
                                </button>
                                <button type="submit" name="save_and_exit" class="btn btn-primary spinner-btn">
                                    <i
                                        class="ri-expand-left-line text-white lh-1"></i>{{ __('static.save_and_exit') }}
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
                $("#currencyForm").validate({
                    ignore: [],
                    rules: {
                        "code": "required",
                        "symbol": "required",
                        "no_of_decimal": "required",
                        "exchange_rate": "required",
                    },
                });

                var currencySelect = $('select[name="code"]');
                var symbolInput = $('input[name="symbol"]');

                currencySelect.on('change', function() {
                    var selectedCode = currencySelect.val();
                    var url = "{{ route('admin.currency.symbol') }}";
                    if (selectedCode !== null) {
                        $.ajax({
                            url: url,
                            method: 'GET',
                            data: {
                                code: selectedCode
                            },
                            success: function(response) {
                                symbolInput.val(response.symbol);
                            },
                            error: function() {
                                toastr.error('Failed to fetch symbol.', 'Error');
                            }
                        });
                    } else {
                        symbolInput.val('');
                    }
                });

                const optionFormat = (item) => {
                    if (!item.id) {
                        return item.text;
                    }

                    var span = document.createElement('span');
                    var html = '<div class="selected-item">';
                    html += '<img src="' + item.element.getAttribute('image') + '" class="h-24 w-24" alt="' + item.text + '"/>';
                    html += '<span>' + "  " + item.text + '</span>';
                    html += '</div>';
                    span.innerHTML = html;
                    return $(span);
                }

                $('#select-country-flag').select2({
                    placeholder: "Select an option",
                    templateSelection: optionFormat,
                    templateResult: optionFormat
                });

            });
        })(jQuery);
    </script>
@endpush
