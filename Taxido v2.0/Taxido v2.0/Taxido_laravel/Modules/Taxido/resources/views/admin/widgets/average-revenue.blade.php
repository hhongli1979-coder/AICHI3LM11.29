@php
$commissions = getMonthlyCommissions();
$adminCommission = array_values($commissions['admin_commission'] ?? []);
$driverCommission = array_values($commissions['driver_commission'] ?? []);
$fleetCommission = array_values($commissions['fleet_commission'] ?? []);
@endphp
@can('ride.index')
<div class="col-xxl-7">
    <div class="card">
        <div class="card-header card-no-border">
            <div class="header-top">
                <div>
                    <h5 class="m-0">{{ __('taxido::static.widget.average_revenue') }}</h5>
                </div>
            </div>
        </div>
        <div class="card-body pt-0 position-relative">
            <div class="average-revenue">
                <div id="average"></div>
            </div>
        </div>
    </div>
</div>
@endcan

@can('ride.index')
@push('scripts')
<script src="{{ asset('js/apex-chart.js') }}" defer></script>
<script src="{{ asset('js/custom-apexchart.js') }}" defer></script>

<script defer>
    (function () {
        "use strict";

        $(document).ready(function() {
            const adminCommission = @json($adminCommission);
            const driverCommission = @json($driverCommission);
            const fleetCommission = @json($fleetCommission);

            const chartOptions = {
                chart: {
                    type: "area",
                    height: 410,
                    stacked: false,
                    toolbar: { show: false },
                    animations: { enabled: true }
                },
                legend: {
                    show: true,
                    fontSize: "14px",
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 500,
                    labels: { colors: "#3D434A" }
                },
                dataLabels: { enabled: false },
                grid: {
                    strokeDashArray: 3,
                    row: { opacity: 0.5 },
                    column: { opacity: 0.5 }
                },
                series: [
                    { name: "Admin Commission", data: adminCommission },
                    { name: "Driver Commission", data: driverCommission },
                    { name: "Fleet Commission", data: fleetCommission }
                ],
                xaxis: {
                    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    labels: {
                        style: {
                            fontSize: "14px",
                            fontFamily: "Outfit, sans-serif",
                            fontWeight: 500,
                            colors: "#8D8D8D"
                        }
                    },
                    axisBorder: { show: false }
                },
                yaxis: {
                    labels: {
                        style: {
                            fontSize: "14px",
                            fontFamily: "Outfit, sans-serif",
                            fontWeight: 500,
                            colors: "#3D434A"
                        }
                    }
                },
                fill: {
                    type: "gradient",
                    gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 }
                },
                colors: ["#199675", "#ECB238", "#5B93FF"], 
                stroke: { curve: "smooth", width: 2 },
                tooltip: {
                    shared: true,
                    y: { formatter: (val) => val.toFixed(1) }
                },
                responsive: [{
                    breakpoint: 1400,
                    options: { chart: { height: 300 } }
                }]
            };

            new ApexCharts(document.querySelector("#average"), chartOptions).render();
        });

    })();
</script>
@endpush
@endcan
