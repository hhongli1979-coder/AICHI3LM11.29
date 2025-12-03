@use('Modules\Taxido\Enums\RideStatusEnum')
@use('Modules\Taxido\Enums\ServiceCategoryEnum')
@use('Modules\Taxido\Enums\ServicesEnum')
@php
    $dateRange = getStartAndEndDate(request('sort'), request('start'), request('end'));

    $start_date = $dateRange['start'] ?? null;
    $end_date = $dateRange['end'] ?? null;

    $intercityRides = getTotalRidesByServiceCategory(ServiceCategoryEnum::INTERCITY, $start_date, $end_date);
    $rideRides = getTotalRidesByServiceCategory(ServiceCategoryEnum::RIDE, $start_date, $end_date);
    $rentalRides = getTotalRidesByServiceCategory(ServiceCategoryEnum::RENTAL, $start_date, $end_date);
    $scheduledRides = getTotalRidesByServiceCategory(ServiceCategoryEnum::SCHEDULE, $start_date, $end_date);
    $packageRides = getTotalRidesByServiceCategory(ServiceCategoryEnum::PACKAGE, $start_date, $end_date);
    $totalRides = getTotalRides($start_date, $end_date);

    $services = [
        ServicesEnum::CAB => ['name' => 'Cab', 'categories' => [ServiceCategoryEnum::RIDE, ServiceCategoryEnum::INTERCITY, ServiceCategoryEnum::PACKAGE, ServiceCategoryEnum::SCHEDULE, ServiceCategoryEnum::RENTAL]],
        ServicesEnum::FREIGHT => ['name' => 'Freight', 'categories' => [ServiceCategoryEnum::RIDE, ServiceCategoryEnum::INTERCITY, ServiceCategoryEnum::SCHEDULE]],
        ServicesEnum::PARCEL => ['name' => 'Parcel', 'categories' => [ServiceCategoryEnum::RIDE, ServiceCategoryEnum::INTERCITY, ServiceCategoryEnum::SCHEDULE]],
        ServicesEnum::AMBULANCE => ['name' => 'Ambulance', 'categories' => []],
    ];
    @endphp
@isset($rideStatusOverview)
    @can('ride.index')
        <div class="col-xxl-9">
            <div class="row">
                <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                    <div class="card">
                        <div class="card-body bg-image">
                            <div class="d-flex">
                                <div class="flex-shrink-0">
                                    <svg>
                                        <use xlink:href="{{ asset('images/dashboard/details/accept.svg#accept') }}"></use>
                                    </svg>
                                </div>
                                <div class="flex-grow-1">
                                    <span>{{ __('taxido::static.rides.accepted') }}</span>
                                    <h4>{{ getTotalRidesByStatus(RideStatusEnum::ACCEPTED, $start_date, $end_date) ?? 0 }}</h4>
                                </div>
                            </div>
                            <a href="{{ route('admin.ride.status.filter', ['status' => RideStatusEnum::ACCEPTED]) }}"
                                class="btn">{{ __('taxido::static.see_details') }}
                                <svg>
                                    <use xlink:href="{{ asset('images/dashboard/details/arrow-right.svg#arrow-right') }}">
                                    </use>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                    <div class="card">
                        <div class="card-body bg-image">
                            <div class="d-flex">
                                <div class="flex-shrink-0">
                                    <svg>
                                        <use xlink:href="{{ asset('images/dashboard/details/car-travel.svg#car-travel') }}">
                                        </use>
                                    </svg>
                                </div>
                                <div class="flex-grow-1">
                                    <span>{{ __('taxido::static.rides.started') }}</span>
                                    <h4>{{ getTotalRidesByStatus(RideStatusEnum::STARTED, $start_date, $end_date) ?? 0 }}</h4>
                                </div>
                            </div>
                            <a href="{{ route('admin.ride.status.filter', ['status' => RideStatusEnum::STARTED]) }}"
                                class="btn">{{ __('taxido::static.see_details') }}
                                <svg>
                                    <use xlink:href="{{ asset('images/dashboard/details/arrow-right.svg#arrow-right') }}">
                                    </use>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                    <div class="card">
                        <div class="card-body bg-image">
                            <div class="d-flex">
                                <div class="flex-shrink-0">
                                    <svg>
                                        <use xlink:href="{{ asset('images/dashboard/details/request.svg#request') }}"></use>
                                    </svg>
                                </div>
                                <div class="flex-grow-1">
                                    <span>{{ __('taxido::static.rides.arrived') }}</span>
                                    <h4>{{ getTotalRidesByStatus(RideStatusEnum::ARRIVED, $start_date, $end_date) ?? 0 }}</h4>
                                </div>
                            </div>
                            <a href="{{ route('admin.ride.status.filter', ['status' => RideStatusEnum::ARRIVED]) }}"
                                class="btn">{{ __('taxido::static.see_details') }}
                                <svg>
                                    <use xlink:href="{{ asset('images/dashboard/details/arrow-right.svg#arrow-right') }}"></use>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                    <div class="card">
                        <div class="card-body bg-image">
                            <div class="d-flex">
                                <div class="flex-shrink-0">
                                    <svg>
                                        <use xlink:href="{{ asset('images/dashboard/details/event.svg#event') }}">
                                        </use>
                                    </svg>
                                </div>
                                <div class="flex-grow-1">
                                    <span>{{ __('taxido::static.rides.scheduled') }}</span>
                                    <h4>{{ getTotalRidesByStatus(RideStatusEnum::SCHEDULED, $start_date, $end_date) ?? 0 }}
                                    </h4>
                                </div>
                            </div>
                            <a href="{{ route('admin.ride.status.filter', ['status' => RideStatusEnum::SCHEDULED]) }}"
                                class="btn">{{ __('taxido::static.see_details') }}
                                <svg>
                                    <use xlink:href="{{ asset('images/dashboard/details/arrow-right.svg#arrow-right') }}">
                                    </use>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                    <div class="card">
                        <div class="card-body bg-image">
                            <div class="d-flex">
                                <div class="flex-shrink-0">
                                    <svg>
                                        <use xlink:href="{{ asset('images/dashboard/details/cancel.svg#cancel') }}">
                                        </use>
                                    </svg>
                                </div>
                                <div class="flex-grow-1">
                                    <span>{{ __('taxido::static.rides.cancelled') }}</span>
                                    <h4>{{ getTotalRidesByStatus(RideStatusEnum::CANCELLED, $start_date, $end_date) ?? 0 }}
                                    </h4>
                                </div>
                            </div>
                            <a href="{{ route('admin.ride.status.filter', ['status' => RideStatusEnum::CANCELLED]) }}"
                                class="btn">{{ __('taxido::static.see_details') }}
                                <svg>
                                    <use xlink:href="{{ asset('images/dashboard/details/arrow-right.svg#arrow-right') }}">
                                    </use>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                    <div class="card">
                        <div class="card-body bg-image">
                            <div class="d-flex">
                                <div class="flex-shrink-0">
                                    <svg>
                                        <use xlink:href="{{ asset('images/dashboard/details/check.svg#check') }}">
                                        </use>
                                    </svg>
                                </div>
                                <div class="flex-grow-1">
                                    <span>{{ __('taxido::static.rides.completed') }}</span>
                                    <h4>{{ getTotalRidesByStatus(RideStatusEnum::COMPLETED, $start_date, $end_date) ?? 0 }}
                                    </h4>
                                </div>
                            </div>
                            <a href="{{ route('admin.ride.status.filter', ['status' => RideStatusEnum::COMPLETED]) }}"
                                class="btn">{{ __('taxido::static.see_details') }}
                                <svg>
                                    <use xlink:href="{{ asset('images/dashboard/details/arrow-right.svg#arrow-right') }}">
                                    </use>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-3 col-xl-4">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <h5 class="m-0">{{ __('taxido::static.widget.service_categories') }}</h5>
                        <select id="serviceSelector" class="form-select form-select-sm w-auto">
                            @foreach ($services as $key => $service)
                                <option value="{{ $key }}">{{ $service['name'] }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="card-body categories-chart">
                    <div id="not-found-image" class="no-data-found d-none">
                        <img src="{{ asset('images/dashboard/chart-not-found.svg') }}" class="img-fluid" alt="No Data Available">
                        <span class="text-center">{{ __('taxido::static.widget.no_data_available') }}</span>
                    </div>
                    <div id="Categories-chart"></div>
                </div>
            </div>
        </div>
    @endcan
@endisset
@push('scripts')
<script src="{{ asset('js/apex-chart.js') }}"></script>
<script>
    const chartData = {
        cab: {
            labels: ['Ride', 'Intercity', 'Package', 'Schedule', 'Rental'],
            values: [
                {{ getTotalRidesByServiceAndCategory('cab', 'ride', $start_date, $end_date) }},
                {{ getTotalRidesByServiceAndCategory('cab', 'intercity', $start_date, $end_date) }},
                {{ getTotalRidesByServiceAndCategory('cab', 'package', $start_date, $end_date) }},
                {{ getTotalRidesByServiceAndCategory('cab', 'schedule', $start_date, $end_date) }},
                {{ getTotalRidesByServiceAndCategory('cab', 'rental', $start_date, $end_date) }},
            ],
        },
        freight: {
            labels: ['Ride', 'Intercity', 'Schedule'],
            values: [
                {{ getTotalRidesByServiceAndCategory('freight', 'ride-freight', $start_date, $end_date) }},
                {{ getTotalRidesByServiceAndCategory('freight', 'intercity-freight', $start_date, $end_date) }},
                {{ getTotalRidesByServiceAndCategory('freight', 'schedule-freight', $start_date, $end_date) }},
            ],
        },
        parcel: {
            labels: ['Ride', 'Intercity', 'Schedule'],
            values: [
                {{ getTotalRidesByServiceAndCategory('parcel', 'ride-parcel', $start_date, $end_date) }},
                {{ getTotalRidesByServiceAndCategory('parcel', 'intercity-parcel', $start_date, $end_date) }},
                {{ getTotalRidesByServiceAndCategory('parcel', 'schedule-parcel', $start_date, $end_date) }},
            ],
        },
        ambulance: {
            labels: ['Total Rides'],
            values: [
                {{ getTotalRidesByService('ambulance', $start_date, $end_date) ?? 0 }}
            ],
        }
    };

    const totalRideSum = values => values.reduce((acc, val) => acc + val, 0);

    let chart;

    function renderChart(serviceKey) {
        const data = chartData[serviceKey];
        const hasData = data.values.some(v => v > 0);

        document.getElementById('not-found-image').classList.toggle('d-none', hasData);
        document.getElementById('Categories-chart').classList.toggle('d-none', !hasData);

        if (!hasData) return;

        const isAmbulance = serviceKey === 'ambulance';
        const options = {
            series: data.values,
            labels: data.labels,
            chart: {
                type: 'donut',
                height: 250,
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: !isAmbulance, 
                position: 'bottom',
                fontSize: "14px",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 500,
            },
            responsive: [
                { breakpoint: 1441, options: { chart: { height: 275 } } },
                { breakpoint: 421, options: { chart: { height: 170 } } }
            ],
            plotOptions: {
                pie: {
                    expandOnClick: false,
                    donut: {
                        size: "68%",
                        labels: {
                            show: true,
                            value: { 
                                offsetY: 5,
                                fontSize: "15px",
                                fontFamily: "Outfit, sans-serif",
                                fontWeight: 500,
                                formatter: function (val) {
                                    return val; 
                                }
                            },
                            total: {
                                show: true,
                                fontSize: "15px",
                                color: "#8D8D8D",
                                fontFamily: "Outfit, sans-serif",
                                fontWeight: 500,
                                label: "Total Rides",
                                formatter: () => totalRideSum(data.values),
                            },
                        },
                    },
                },
            },
            colors: isAmbulance ? ['#47A1E5'] : ['#199675', '#ECB238', '#F39159', '#86909C', '#47A1E5'],
        };

        if (chart) chart.destroy();
        chart = new ApexCharts(document.querySelector("#Categories-chart"), options);
        chart.render();
    }

    document.addEventListener('DOMContentLoaded', function () {
        const selector = document.getElementById('serviceSelector');
        renderChart(selector.value);

        selector.addEventListener('change', function () {
            renderChart(this.value);
        });
    });
</script>
@endpush