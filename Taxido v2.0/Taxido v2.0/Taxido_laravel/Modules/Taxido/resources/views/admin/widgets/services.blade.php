@use('Modules\Taxido\Enums\ServicesEnum')
@php
    $cabRides = getTotalRidesByServices(ServicesEnum::CAB, request('start_date'), request('end_date'));
    $parcelRides = getTotalRidesByServices(ServicesEnum::PARCEL);
    $freightRides = getTotalRidesByServices(ServicesEnum::FREIGHT);
    $ambulanceRides = getTotalRidesByServices(ServicesEnum::AMBULANCE);
    $totalRides = getTotalRides();
@endphp
@can('ride.index')
    <div class="col-xxl-7 col-xl-8">
        <div class="card">
            <div class="card-header card-no-border">
                <div class="header-top">
                    <div>
                        <h5 class="m-0">{{ __('taxido::static.services.services') }}</h5>
                    </div>
                    <div class="card-header-right-icon">
                        <div class="dropdown icon-dropdown">
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body pt-0 position-relative">
                <div class="group-legend">
                    <ul>
                        <li>
                            <div class="circle bg-primary"></div>
                            <span>{{ ucfirst(ServicesEnum::CAB) }}</span>
                        </li>
                        <li>
                            <div class="circle bg-primary"></div>
                            <span>{{ ucfirst(ServicesEnum::PARCEL) }}</span>
                        </li>
                        <li>
                            <div class="circle bg-primary"></div>
                            <span>{{ ucfirst(ServicesEnum::FREIGHT) }}</span>
                        </li>
                        <li>
                            <div class="circle bg-primary"></div>
                            <span>{{ ucfirst(ServicesEnum::AMBULANCE) }}</span>
                        </li>
                    </ul>
                </div>
                <div class="total-project">
                    <div id="service-rides"></div>
                </div>
            </div>
        </div>
    </div>
@endcan

@push('scripts')
    <script src="{{ asset('js/apex-chart.js') }}"></script>
    <script src="{{ asset('js/custom-apexchart.js') }}"></script>
    <script>
        var cab = <?php echo json_encode(array_values($cabRides)); ?>;
        var parcel = <?php echo json_encode(array_values($parcelRides)); ?>;
        var freight = <?php echo json_encode(array_values($freightRides)); ?>;
        var ambulance = <?php echo json_encode(array_values($ambulanceRides)); ?>;

        var serviceRidesOptions = {
            series: [{
                name: 'cab',
                data: cab
            }, {
                name: 'parcel',
                data: parcel
            }, {
                name: 'freight',
                data: freight
            },
            {
                name: 'ambulance',
                data: ambulance
            }],
            colors: ['var(--primary-color)', '#7CC3B0', '#CEE9E2'],
            chart: {
                type: 'bar',
                height: 412,
                stacked: true,
                toolbar: {
                    show: false,
                    tools: {
                        download: false,
                    }
                },
                zoom: {
                    enabled: true
                }
            },
            grid: {
                strokeDashArray: 3,
                position: "back",
                row: {
                    opacity: 0.5,
                },
                column: {
                    opacity: 0.5,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '20%',
                    borderRadius: 7,
                },
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                labels: {
                    style: {
                        fontSize: '14px',
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 500,
                        colors: '#8D8D8D',
                    },
                },
                axisBorder: {
                    show: false,
                },
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: '14px',
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 500,
                        colors: '#3D434A',
                    },
                    formatter: (value) => {
                        return `${value}`;
                    },
                },
            },
            legend: {
                show: false,
            },
            fill: {
                opacity: 1
            },
            responsive: [{
                breakpoint: 1400,
                options: {
                    chart: {
                        height: 340
                    },
                },
            }],
        };
        var statisticschart = new ApexCharts(document.querySelector("#service-rides"), serviceRidesOptions);
        statisticschart.render();
    </script>
@endpush
