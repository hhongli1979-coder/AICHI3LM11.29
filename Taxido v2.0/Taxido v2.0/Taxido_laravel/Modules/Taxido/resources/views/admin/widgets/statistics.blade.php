@use('Modules\Taxido\Models\WithdrawRequest')
@use('Modules\Taxido\Models\DriverWallet')
@use('Modules\Taxido\Models\Driver')
@use('App\Enums\RoleEnum')
@use('Modules\Taxido\Enums\RoleEnum as TaxidoRoleEnum')
@php

    $roleName = getCurrentRoleName();
    if ($roleName == TaxidoRoleEnum::DRIVER) {
        $driver = Driver::where('id', getCurrentUserId())->first();
    }
    $dateRange = getStartAndEndDate(request('sort'), request('start'), request('end'));
    $start_date = $dateRange['start'] ?? null;
    $end_date = $dateRange['end'] ?? null;
@endphp

@can('rider.index')
        <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-sm-6 total-rides">
            <a href="{{ route('admin.rider.index') }}">
                <div class="card">
                    <span class="bg-primary"></span>
                    <span class="bg-primary"></span>
                    <div class="card-body">
                        <div class="d-flex">
                            <div class="flex-grow-1">
                                <h4>{{ getTotalRiders($start_date, $end_date) }}</h4>
                                <h6>{{ __('taxido::static.widget.total_riders') }}</h6>
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

@endcan
@if($roleName != TaxidoRoleEnum::DRIVER)
@can('driver.index')

        <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-sm-6 total-rides">
            <a href="{{ route('admin.driver.index') }}">

                <div class="card">
                    <span class="bg-warning"></span>
                    <span class="bg-warning"></span>
                    <div class="card-body">
                        <div class="d-flex">
                            <div class="flex-grow-1">
                                <h4>{{ getTotalDrivers($start_date, $end_date, true) }}</h4>
                                <h6>{{ __('taxido::static.widget.total_verified_drivers') }}</h6>
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
        <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-sm-6 total-rides">
            <a href="{{ route('admin.driver.unverified-drivers') }}">

                <div class="card">
                    <span class="bg-tertiary"></span>
                    <span class="bg-tertiary"></span>
                    <div class="card-body">
                        <div class="d-flex">
                            <div class="flex-grow-1">
                                <h4>{{ getTotalDrivers($start_date, $end_date, false) }}</h4>
                                <h6>{{ __('taxido::static.widget.total_unverified_drivers') }}</h6>
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

@endcan
@endif

@can('ride.index')
    <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-sm-6 total-rides">
        <a href="{{ route('admin.ride.index') }}">

            <div class="card">
                <span class="bg-light"></span>
                <span class="bg-light"></span>
                <div class="card-body">
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <h4>{{ getTotalRides($start_date, $end_date) }}</h4>
                            <h6>{{ __('taxido::static.widget.total_rides') }}</h6>
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
                                {{ getTotalRidesPercentage($start_date, $end_date)['percentage'] }}%</p>

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
    <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-sm-6 total-rides">
        <div class="card">
            <span class="bg-light"></span>
            <span class="bg-light"></span>
            <div class="card-body">
                <div class="d-flex">
                    <div class="flex-grow-1">
                        <h4>
                            {{ formatCurrency(getTotalRidesEarnings($start_date, $end_date)) }}
                        </h4>

                        <h6>{{ __('taxido::static.widget.revenue') }}</h6>
                        <div class="d-flex">
                            @if (getTotalRidesEarningsPercentage($start_date, $end_date)['status'] == 'decrease')
                                <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-down.svg') }}"
                                    alt="">
                                <p class="text-danger me-2">
                                @else
                                    <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-up.svg') }}"
                                        alt="">
                                <p class="text-primary me-2">
                            @endif
                            {{ getTotalRidesEarningsPercentage($start_date, $end_date)['percentage'] }}%</p>

                        </div>
                    </div>
                    <div class="flex-shrink-0">
                        <div class="ride-icon bg-light">
                            <img src="{{ asset('images/dashboard/riders/revenue.svg') }}" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-sm-6 total-rides">
        <div class="card">
            <span class="bg-tertiary"></span>
            <span class="bg-tertiary"></span>
            <div class="card-body">
                <div class="d-flex">
                    <div class="flex-grow-1">
                        <h4>
                            {{ formatCurrency(getTotalRidesEarnings($start_date, $end_date, 'cash')) }}
                        </h4>

                        <h6>{{ __('taxido::static.widget.offline_payment') }}</h6>
                        <div class="d-flex">
                            @if (getTotalRidesEarningsPercentage($start_date, $end_date, 'cash')['status'] == 'decrease')
                                <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-down.svg') }}"
                                    alt="">
                                <p class="text-danger me-2">
                                @else
                                    <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-up.svg') }}"
                                        alt="">
                                <p class="text-primary me-2">
                            @endif
                            {{ getTotalRidesEarningsPercentage($start_date, $end_date, 'cash')['percentage'] }}%</p>

                        </div>
                    </div>
                    <div class="flex-shrink-0">
                        <div class="ride-icon bg-tertiary">
                            <img src="{{ asset('images/dashboard/riders/offline-payment.svg') }}" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-sm-6 total-rides">

        <div class="card">
            <span class="bg-warning"></span>
            <span class="bg-warning"></span>
            <div class="card-body">
                <div class="d-flex">
                    <div class="flex-grow-1">
                        <h4>
                        {{ formatCurrency(getTotalRidesEarnings($start_date, $end_date, 'online')) }}

                        </h4>

                        <h6>{{ __('taxido::static.widget.online_payment') }}</h6>
                        <div class="d-flex">
                            @if (getTotalRidesEarningsPercentage($start_date, $end_date, 'online')['status'] == 'decrease')
                                <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-down.svg') }}"
                                    alt="">
                                <p class="text-danger me-2">
                                @else
                                    <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-up.svg') }}"
                                        alt="">
                                <p class="text-primary me-2">
                            @endif
                            {{ getTotalRidesEarningsPercentage($start_date, $end_date, 'online')['percentage'] }}%</p>

                        </div>
                    </div>
                    <div class="flex-shrink-0">
                        <div class="ride-icon bg-warning">
                            <img src="{{ asset('images/dashboard/riders/online.svg') }}" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endcan

@if($roleName != TaxidoRoleEnum::DRIVER)

@can('withdraw_request.index')
    <div class="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-sm-6 total-rides">
        <a href="{{ route('admin.withdraw-request.index') }}">

            <div class="card">
                <span class="bg-primary"></span>
                <span class="bg-primary"></span>
                <div class="card-body">
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <h4>
                                {{ formatCurrency(getTotalWithdrawals($start_date, $end_date)) }}
                            </h4>
                            <h6>{{ __('taxido::static.widget.withdraw_request') }}</h6>
                            <div class="d-flex">
                                @if (getTotalWithdrawRequestsPercentage($start_date, $end_date)['status'] == 'decrease')
                                    <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-down.svg') }}"
                                        alt="">
                                    <p class="text-danger me-2">
                                    @else
                                        <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-up.svg') }}"
                                            alt="">
                                    <p class="text-primary me-2">
                                @endif
                                {{ getTotalWithdrawRequestsPercentage($start_date, $end_date)['percentage'] }}%</p>

                            </div>
                        </div>
                        <div class="flex-shrink-0">
                            <div class="ride-icon bg-primary">
                                <img src="{{ asset('images/dashboard/riders/money.svg') }}" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
@endcan
@endif

@if (getCurrentRoleName() == TaxidoRoleEnum::FLEET_MANAGER)
    @can('fleet_wallet.index')
        <div class="col-xxl-3 col-sm-6 total-rides">
            <a href="{{ route('admin.fleet-wallet.index') }}">
                <div class="card">
                    <span class="bg-tertiary"></span>
                    <span class="bg-tertiary"></span>
                    <div class="card-body">
                        <div class="d-flex">
                            <div class="flex-grow-1">
                                <h4>
                                    {{ getDefaultCurrency()?->symbol }}{{ number_format(getFleetWalletBalance(getCurrentUserId(), $start_date, $end_date), 2) }}
                                </h4>

                                <h6>{{ __('taxido::static.widget.Wallet_balance') }}</h6>
                                <div class="d-flex">
                                    @if (getTotalWalletsPercentage($start_date, $end_date)['status'] == 'decrease')
                                        <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-down.svg') }}"
                                            alt="">
                                        <p class="text-danger me-2">
                                        @else
                                            <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-up.svg') }}"
                                                alt="">
                                        <p class="text-primary me-2">
                                    @endif
                                    {{ getTotalWalletsPercentage($start_date, $end_date)['percentage'] }}%</p>

                                </div>
                            </div>
                            <div class="flex-shrink-0">
                                <div class="ride-icon bg-tertiary">
                                    <img src="{{ asset('images/dashboard/riders/wallet.svg') }}" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    @endcan
@endif
@if (getCurrentRoleName() == TaxidoRoleEnum::DRIVER)
    @can('driver_wallet.index')
        <div class="col-xxl-3 col-sm-6 total-rides">
            <a href="{{ route('admin.driver-wallet.index') }}">
                <div class="card">
                    <span class="bg-tertiary"></span>
                    <span class="bg-tertiary"></span>
                    <div class="card-body">
                        <div class="d-flex">
                            <div class="flex-grow-1">
                                <h4>
                                    {{ getDefaultCurrency()?->symbol }}{{ number_format(getDriverWalletBalance(getCurrentUserId(), $start_date, $end_date), 2) }}
                                </h4>

                                <h6>{{ __('taxido::static.widget.Wallet_balance') }}</h6>
                                <div class="d-flex">
                                    @if (getTotalWalletsPercentage($start_date, $end_date)['status'] == 'decrease')
                                        <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-down.svg') }}"
                                            alt="">
                                        <p class="text-danger me-2">
                                        @else
                                            <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-up.svg') }}"
                                                alt="">
                                        <p class="text-primary me-2">
                                    @endif
                                    {{ getTotalWalletsPercentage($start_date, $end_date)['percentage'] }}%</p>

                                </div>
                            </div>
                            <div class="flex-shrink-0">
                                <div class="ride-icon bg-tertiary">
                                    <img src="{{ asset('images/dashboard/riders/wallet.svg') }}" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    @endcan

    @can('driver_review.index')
        <div class="col-xxl-3 col-sm-6 total-rides">
            <a href="{{ route('admin.driver-review.index') }}">
                <div class="card">
                    <span class="bg-primary"></span>
                    <span class="bg-primary"></span>
                    <div class="card-body">
                        <div class="d-flex">
                            <div class="flex-grow-1">
                                <h4>
                                    {{ getDriverReviewsCount(getCurrentUserId(), $start_date, $end_date) }}
                                </h4>

                                <h6>{{ __('taxido::static.widget.reviews') }}</h6>
                                <div class="d-flex">
                                    @if (getTotalReviewsPercentage($start_date, $end_date)['status'] == 'decrease')
                                        <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-down.svg') }}"
                                            alt="">
                                        <p class="text-danger me-2">
                                        @else
                                            <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-up.svg') }}"
                                                alt="">
                                        <p class="text-primary me-2">
                                    @endif
                                    {{ getTotalReviewsPercentage($start_date, $end_date)['percentage'] }}%</p>

                                </div>
                            </div>
                            <div class="flex-shrink-0">
                                <div class="ride-icon bg-primary">
                                    <img src="{{ asset('images/dashboard/riders/review.svg') }}" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    @endcan

    @can('driver_document.index')
        <div class="col-xxl-3 col-sm-6 total-rides">
            <a href="{{ route('admin.driver-document.index') }}">
                <div class="card">
                    <span class="bg-warning"></span>
                    <span class="bg-warning"></span>
                    <div class="card-body">
                        <div class="d-flex">
                            <div class="flex-grow-1">
                                <h4>
                                    {{ getDriverDocumentsCount(getCurrentUserId(), $start_date, $end_date) }}
                                </h4>

                                <h6>{{ __('taxido::static.widget.documents') }}</h6>
                                <div class="d-flex">
                                    @if (getTotalDocumentsPercentage($start_date, $end_date)['status'] == 'decrease')
                                        <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-down.svg') }}"
                                            alt="">
                                        <p class="text-danger me-2">
                                        @else
                                            <img class="me-1" src="{{ asset('images/dashboard/riders/arrow-up.svg') }}"
                                                alt="">
                                        <p class="text-primary me-2">
                                    @endif
                                    {{ getTotalDocumentsPercentage($start_date, $end_date)['percentage'] }}%</p>

                                </div>
                            </div>
                            <div class="flex-shrink-0">
                                <div class="ride-icon bg-warning">
                                    <img src="{{ asset('images/dashboard/riders/document.svg') }}" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    @endcan
@endif
