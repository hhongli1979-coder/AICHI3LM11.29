@use('Modules\Taxido\Models\Driver')
@php
    $drivers = Driver::whereNull('deleted_at')->where('status', true)->where('is_verified', true)->get();
@endphp
<div class="contentbox h-100">
    <div class="inside">
        <div class="contentbox-title">
            <h3> {{ __('taxido::static.wallets.select_driver') }}</h3>
        </div>
        <div class="form-group row">
            <div class="col-12 select-item">
                <select id="select-driver" class="form-select form-select-transparent" name="driver_id"
                    data-placeholder="{{ __('taxido::static.wallets.select_driver') }}">
                    <option></option>
                    @foreach ($drivers as $driver)
                        <option value="{{ $driver->id }}" sub-title="@if(isDemoModeEnabled()) 
                                            {{ __('taxido::static.demo_mode') }}
                                        @else 
                                            {{ $driver->email }}
                                        @endif"
                                image="{{ $driver?->profile_image ? $driver?->profile_image?->original_url : asset('images/user.png') }}"
                                {{ $driver->id == request()->query('driver_id') ? 'selected' : '' }}>
                                {{ $driver->name }}
                        </option>
                    @endforeach
                </select>
                <span class="text-gray mt-1">
                    {{ __('taxido::static.wallets.add_driver_message') }}
                    <a href="{{ @route('admin.driver.index') }}" class="text-primary">
                        <b>{{ __('taxido::static.here') }}</b>
                    </a>
                </span>
            </div>
        </div>
    </div>
</div>

@push('scripts')
    <script>
        (function($) {
            "use strict";

            const selectUser = () => {
                let queryString = window.location.search;
                let params = new URLSearchParams(queryString);
                params.set('driver_id', document.getElementById("select-driver").value);
                document.location.href = "?" + params.toString();
            }

            $('#select-driver').on('change', selectUser);
            const optionFormat = (item) => {
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

        })(jQuery);
    </script>
@endpush
