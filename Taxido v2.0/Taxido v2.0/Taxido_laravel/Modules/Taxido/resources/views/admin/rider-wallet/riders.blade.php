@use('Modules\Taxido\Models\Rider')
@php
    $riders = Rider::whereNull('deleted_at')->where('status', true)->get();
@endphp

<div class="contentbox h-100">
    <div class="inside">
        <div class="contentbox-title">
            <h3> {{ __('taxido::static.wallets.select_rider') }}</h3>
        </div>
        <div class="form-group row">
            <div class="col-12 select-item">
                <select id="select-rider" class="form-select form-select-transparent" name="rider_id"
                    data-placeholder="{{ __('taxido::static.wallets.select_rider') }}">
                    <option></option>
                    @foreach ($riders as $rider)
                        <option value="{{ $rider->id }}" sub-title="@if(isDemoModeEnabled()) 
                                            {{ __('taxido::static.demo_mode') }}
                                        @else 
                                            {{ $rider->email }}
                                        @endif"
                            image="{{ $rider?->profile_image ? $rider?->profile_image?->original_url : asset('images/user.png') }}"
                            {{ $rider->id == request()->query('rider_id') ? 'selected' : '' }}>
                            {{ $rider->name }}
                        </option>
                    @endforeach
                </select>
                <span class="text-gray">
                    {{ __('taxido::static.wallets.add_rider_message') }}
                    <a href="{{ route('admin.rider.index') }}" class="text-primary">
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
                console.log(queryString)
                let params = new URLSearchParams(queryString);
                params.set('rider_id', document.getElementById("select-rider").value);
                document.location.href = "?" + params.toString();
            }

            $('#select-rider').on('change', selectUser);
            const optionFormat = (item) => {
                if (!item.id) {
                    return item.text;
                }

                var span = document.createElement('span');
                var html = '';

                html += '<div class="selected-item">';
                html += '<img src="' + item.element.getAttribute('image') +
                    '" class="rounded-circle" alt="' + item.text + '"/>';
                html += '<div class="detail">'
                html += '<h6>' + item.text + '</h6>';
                html += '<p>' + item.element.getAttribute('sub-title') + '</p>';
                html += '</div>';
                html += '</div>';

                span.innerHTML = html;
                return $(span);
            }

            $('#select-rider').select2({
                placeholder: "Select an option",
                templateSelection: optionFormat,
                templateResult: optionFormat
            });

        })(jQuery);
    </script>
@endpush
