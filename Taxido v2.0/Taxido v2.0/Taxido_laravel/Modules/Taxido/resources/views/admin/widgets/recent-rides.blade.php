@use('Illuminate\Support\Arr')
@php
    $ridestatuscolorClasses = getRideStatusColorClasses();
    $dateRange = getStartAndEndDate(request('sort'), request('start'), request('end'));
    $start_date = $dateRange['start'] ?? null;
    $end_date = $dateRange['end'] ?? null;
    $serviceCategories = getAllServices();
@endphp

@can('ride.index')
    <div class="col-xxl-5 col-xl-6">
        <div class="card">
            <div class="card-header card-no-border">
                <div class="header-top">
                    <div>
                        <h5 class="m-0">{{ __('taxido::static.widget.recent_rides') }}</h5>
                    </div>
                    <a href="{{ route('admin.ride.index') }}">
                        <span>{{ __('taxido::static.widget.view_all') }}</span>
                    </a>
                </div>
                <div class="rides-tab analytics-section">
                    <ul class="nav nav-tabs horizontal-tab custom-scroll" id="ride-tabs" role="tablist">
                        @forelse ($serviceCategories as $key => $serviceCategory)
                            <li class="nav-item" role="presentation">
                                <a class="nav-link @if ($key === 0) active @endif"
                                    id="tab-{{ $serviceCategory->id }}-tab" data-bs-toggle="tab"
                                    href="#tab-{{ $serviceCategory->id }}" role="tab"
                                    aria-controls="tab-{{ $serviceCategory->id }}"
                                    aria-selected="{{ $key === 0 ? 'true' : 'false' }}">
                                    {{ $serviceCategory->name }}
                                </a>
                            </li>
                        @empty
                            <li class="nav-item" role="presentation">
                                <a class="nav-link disabled" href="#" role="tab" aria-disabled="true">
                                    {{ __('taxido::static.widget.no_categories_available') }}
                                </a>
                            </li>
                        @endforelse
                    </ul>
                </div>
            </div>
            <div class="card-body top-drivers recent-rides p-0">
                <div class="tab-content">
                    @forelse ($serviceCategories as $key => $serviceCategory)
                        <div class="tab-pane fade @if ($key === 0) show active @endif"
                            id="tab-{{ $serviceCategory->id }}" role="tabpanel"
                            aria-labelledby="tab-{{ $serviceCategory->id }}-tab">

                            <div class="table-responsive h-custom-scrollbar">
                                <table class="table display" style="width:100%">
                                    <thead>
                                        <tr>
                                            <th>{{ __('taxido::static.widget.ride_id') }}</th>
                                            <th>{{ __('taxido::static.widget.driver_name') }}</th>
                                            <th>{{ __('taxido::static.widget.distance') }}</th>
                                            <th>{{ __('taxido::static.widget.status') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @forelse (getRecentRides($start_date, $end_date, $serviceCategory->id) as $ride)
                                            @if ($ride?->driver)
                                                <tr>
                                                    <td>
                                                        <a href="{{ route('admin.ride.details', $ride->id) }}"><span
                                                                class="bg-light-primary">
                                                                #{{ $ride->ride_number }}</span></a>
                                                    </td>
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                            <div class="customer-image">
                                                                @if ($ride?->driver?->profile_image?->original_url)
                                                                    <img src="{{ $ride?->driver->profile_image?->original_url }}"
                                                                        alt="" class="img">
                                                                @else
                                                                    <div class="initial-letter">
                                                                        <span>{{ strtoupper($ride?->driver?->name[0]) }}</span>
                                                                    </div>
                                                                @endif
                                                            </div>
                                                            <div class="flex-grow-1">

                                                                <a
                                                                    href="{{ route('admin.driver.show', ['driver' => $ride?->driver?->id]) }}">
                                                                    {{ $ride?->driver?->name }}
                                                                </a>
                                                                <span>@if(isDemoModeEnabled())
                                                                    {{ __('taxido::static.demo_mode') }}
                                                                @else
                                                                    {{ $ride?->driver?->email }}
                                                                @endif
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{{ $ride?->distance }} {{ ucfirst($ride?->distance_unit) }}</td>
                                                    @if($ride?->ride_status)
                                                    <td>
                                                        <span
                                                            class="badge badge-{{ $ridestatuscolorClasses[ucfirst($ride?->ride_status?->name)] }}">
                                                            {{ $ride?->ride_status?->name }}
                                                        </span>
                                                    </td>
                                                    @endif
                                                </tr>
                                            @endif
                                        @empty
                                            <tr class="table-not-found">
                                                <div class="table-no-data">
                                                    <img src="{{ asset('images/dashboard/data-not-found.svg') }}"
                                                        alt="data not found" />
                                                    <h6 class="text-center">
                                                        {{ __('taxido::static.widget.no_data_available') }}</h6>
                                                </div>
                                            </tr>
                                        @endforelse
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    @empty
                        <tr class="table-not-found">
                            <div class="table-data">
                                <img src = "{{ asset('images/dashboard/data-not-found.svg') }}" alt="data not found">
                            </div>
                            <td colspan="5" class="text-center">
                                {{ __('taxido::static.widget.no_data_available') }}</td>
                        </tr>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
@endcan
