@use('Modules\Taxido\Enums\RoleEnum')
@php
$dateRange = getStartAndEndDate(request('sort'), request('start'), request('end'));
$start_date = $dateRange['start'] ?? null;
$end_date = $dateRange['end'] ?? null;
$roleName = getCurrentRoleName();
@endphp

@if($roleName != RoleEnum::DRIVER)
@can('driver.index')
<div class="col-xxl-5 col-xl-6">
    <div class="card top-height">
        <div class="card-header card-no-border">
            <div class="header-top">
                <div>
                    <h5 class="m-0">{{ __('taxido::static.widget.top_drivers') }}</h5>
                </div>
                <a href={{ route('admin.driver.index') }}><span>{{ __('taxido::static.widget.view_all') }}</span></a>
            </div>
        </div>
        <div class="card-body top-drivers p-0">
            <div class="table-responsive h-custom-scrollbar">
                <table class="table display" style="width:100%">
                    <thead>
                        <tr>
                            <th>{{ __('taxido::static.widget.driver_name') }}</th>
                            <th>{{ __('taxido::static.widget.total_rides') }}</th>
                            <th>{{ __('taxido::static.widget.ratings') }}</th>
                            <th>{{ __('taxido::static.widget.earnings') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse (getTopDrivers($start_date,$end_date) as $driver)
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="customer-image">
                                        @if ($driver?->profile_image?->original_url)
                                        <img src="{{ $driver->profile_image->original_url }}" alt=""
                                            class="img">
                                        @else
                                        <div class="initial-letter">
                                            <span>{{ strtoupper($driver->name[0]) }}</span>
                                        </div>
                                        @endif
                                    </div>
                                    <div class="flex-grow-1">
                                        <h5><a href="{{ route('admin.driver.show', ['driver' => $driver?->id]) }}">
                                                {{ $driver?->name }}
                                            </a>
                                        </h5>
                                        <span>
                                            @if(isDemoModeEnabled())
                                                {{ __('taxido::static.demo_mode') }}
                                            @else
                                                {{ $driver->email }}
                                            @endif
                                        </span>
                                        <div class="active-status @if($driver->is_online) 'active-online' @else 'active-offline' @endif "></div>
                                    </div>
                                </div>
                            </td>
                            <td>{{ getTotalDriverRides($driver->id) }}</td>
                            <td>
                                <div class="rating">
                                    <img src="{{ asset('images/dashboard/star.svg') }}" alt="">
                                    <span>({{ number_format($driver->rating_count, 1) }})</span>
                                </div>
                            </td>
                            <td>{{ formatCurrency(getDriverWallet($driver->id)) ?? 0 }}</td>
                        </tr>
                        @empty
                        <div class="table-no-data">
                            <img src="{{ asset('images/dashboard/data-not-found.svg') }}" class="img-fluid"
                                alt="data not found">
                            <h6 class="text-center">
                                {{ __('taxido::static.widget.no_data_available') }}
                            </h6>
                        </div>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endcan
@endif
