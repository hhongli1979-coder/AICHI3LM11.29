@use('Modules\Taxido\Models\WithdrawRequest')
@use('Modules\Taxido\Models\DriverWallet')
@use('Modules\Taxido\Models\Driver')
@use('App\Enums\RoleEnum')
@use('Modules\Taxido\Enums\RoleEnum as TaxidoRoleEnum')
@php
$roleName = getCurrentRoleName();
if (getCurrentRoleName() == TaxidoRoleEnum::DRIVER) {
$driver = Driver::where('id', getCurrentUserId())->first();
}
$dateRange = getStartAndEndDate(request('sort'), request('start'), request('end'));
$start_date = $dateRange['start'] ?? null;
$end_date = $dateRange['end'] ?? null;
@endphp


@can('fleet_manager.index')
@if($roleName  != TaxidoRoleEnum::FLEET_MANAGER && $roleName  != TaxidoRoleEnum::DRIVER)
    <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-sm-6 total-rides">
            <a href="{{ route('admin.fleet-manager.index') }}">
                <div class="card">
                    <span class="bg-primary"></span>
                    <span class="bg-primary"></span>
                    <div class="card-body">
                        <div class="d-flex">
                            <div class="flex-grow-1">
                                <h4>{{ getTotalFleetManagers($start_date, $end_date) }}</h4>
                                <h6>{{ __('taxido::static.widget.fleet_managers_info') }}</h6>
                                <div class="d-flex">
                                    @if (getTotalRidersPercentage($start_date, $end_date)['status'] == 'decrease')
                                        <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-down.svg') }}"
                                            alt="">
                                        <p class="text-danger me-2">
                                        @else
                                            <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-up.svg') }}"
                                                alt="">
                                        <p class="text-primary me-2">
                                    @endif
                                    {{ getTotalRidersPercentage($start_date, $end_date)['percentage'] }}%</p>

                                </div>
                            </div>
                            <div class="flex-shrink-0">
                                <div class="ride-icon bg-primary">
                                    <img src="{{ asset('images/dashboard/riders/car.svg') }}" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
    </div>
@endif
@endcan

@if($roleName  != TaxidoRoleEnum::DRIVER)
@can('vehicle_info.index')
    <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-sm-6 total-rides">
            <a href="{{ route('admin.vehicle-info.verified') }}">
                <div class="card">
                    <span class="bg-warning"></span>
                    <span class="bg-warning"></span>
                    <div class="card-body">
                        <div class="d-flex">
                            <div class="flex-grow-1">
                                <h4>{{ getFleetVehicles($start_date, $end_date, true) }}</h4>
                                <h6>{{ __('taxido::static.widget.fleet_vehicle_type') }}</h6>
                                <div class="d-flex">
                                    @if (getTotalDriversPercentage($start_date, $end_date, true)['status'] == 'decrease')
                                        <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-down.svg') }}"
                                            alt="">
                                        <p class="text-danger me-2">
                                        @else
                                            <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-up.svg') }}"
                                                alt="">
                                        <p class="text-primary me-2">
                                    @endif
                                    {{ getTotalDriversPercentage($start_date, $end_date, true)['percentage'] }}%</p>

                                </div>
                            </div>
                            <div class="flex-shrink-0">
                                <div class="ride-icon bg-warning">
                                    <img src="{{ asset('images/dashboard/riders/user.svg') }}" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
    </div>
@endcan
@endif


@can('dispatcher.index')
    @if ($roleName != TaxidoRoleEnum::DISPATCHER)
    <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-sm-6 total-rides">
        <a href="{{ route('admin.dispatcher.index') }}">
            <div class="card">
                <span class="bg-tertiary"></span>
                <span class="bg-tertiary"></span>
                <div class="card-body">
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <h4>{{ getTotalDispatchers($start_date, $end_date, false) }}</h4>
                            <h6>{{ __('taxido::static.widget.dispatcher') }}</h6>
                            <div class="d-flex">
                                @if (getTotalDriversPercentage($start_date, $end_date, false)['status'] == 'decrease')
                                    <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-down.svg') }}"
                                        alt="">
                                    <p class="text-danger me-2">
                                    @else
                                        <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-up.svg') }}"
                                            alt="">
                                    <p class="text-primary me-2">
                                @endif
                                {{ getTotalDriversPercentage($start_date, $end_date, false)['percentage'] }}%</p>

                            </div>
                        </div>
                        <div class="flex-shrink-0">
                            <div class="ride-icon bg-tertiary">
                                <img src="{{ asset('images/dashboard/riders/user.svg') }}" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
    @endif
@endcan

@can('peak_zone.index')
<!-- Peak Zone -->
<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-sm-6 total-rides">
    <a href="{{ route('admin.peakZone.index') }}">
        <div class="card">
            <span class="bg-light"></span>
            <span class="bg-light"></span>
            <div class="card-body">
                <div class="d-flex">
                    <div class="flex-grow-1">
                        <h4>{{ getPeakZones($start_date, $end_date) }}</h4>
                        <h6>{{ __('taxido::static.widget.peak_zone') }}</h6>
                        <div class="d-flex">
                            @if (getTotalRidesPercentage($start_date, $end_date)['status'] == 'decrease')
                            <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-down.svg') }}"
                                alt="">
                            <p class="text-danger me-2">
                                @else
                                <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-up.svg') }}"
                                    alt="">
                            <p class="text-primary me-2">
                                @endif
                                {{ getTotalRidesPercentage($start_date, $end_date)['percentage'] }}%
                            </p>

                        </div>
                    </div>
                    <div class="flex-shrink-0">
                        <div class="ride-icon bg-light">
                            <img src="{{ asset('images/dashboard/riders/ride.svg') }}" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a>
</div>
@endcan
