    @use('Modules\Taxido\Models\FleetManager')
@php
    $fleetManagers = FleetManager::whereNull('deleted_at')->where('status', true)->get();
@endphp

<div class="contentbox h-100">
    <div class="inside">
        <div class="contentbox-title">
            <h3> {{ __('taxido::static.wallets.select_fleet_manager') }}</h3>
        </div>
        <div class="form-group row">
            <div class="col-12 select-item">
                <select id="select-fleet-manager" class="form-select form-select-transparent" name="fleet_manager_id"
                    data-placeholder="{{ __('taxido::static.wallets.select_fleet_manager') }}">
                    <option></option>
                    @foreach ($fleetManagers as $manager)
                        <option value="{{ $manager->id }}"
                            sub-title="{{ $manager->email }}"
                            image="{{ $manager?->profile_image ? $manager?->profile_image?->original_url : asset('images/user.png') }}"
                            {{ $manager->id == request()->query('fleet_manager_id') ? 'selected' : '' }}>
                            {{ $manager->name }}
                        </option>
                    @endforeach
                </select>
                <span class="text-gray">
                    {{ __('taxido::static.wallets.add_fleet_manager_message') }}
                    <a href="{{ route('admin.fleet-manager.index') }}" class="text-primary">
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

           const selectFleetManager = () => {
                let queryString = window.location.search;
                let params = new URLSearchParams(queryString);
                params.set('fleet_manager_id', document.getElementById("select-fleet-manager").value);
                document.location.href = "?" + params.toString();
            }
            $('#select-fleet-manager').on('change', selectFleetManager);

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

            $('#select-fleet-manager').select2({
                placeholder: "Select an option",
                templateSelection: optionFormat,
                templateResult: optionFormat
            });

        })(jQuery);
    </script>
@endpush
