@use('Modules\Ticket\Models\Executive')
@php
    $dateRange = tx_getDate(request('sort'), request('start_date'), request('end_date'));
    $start_date = $dateRange['start'] ?? null;
    $end_date = $dateRange['end'] ?? null;
    $executiveRatings = getTopExecutives($start_date, $end_date);
@endphp
@extends('admin.layouts.master')
@push('css')
    <link rel="stylesheet" href="{{ asset('css/vendors/flatpickr.min.css')}}">
@endpush
@section('title', __('ticket::static.ticket.dashboard'))
@section('content')
    <div class="row support-dashboard">
        <div class="col-12">
            <div class="default-sorting mt-0">
                <div class="support-title sorting mt-0">
                    <h4> {{ __('ticket::static.dashboard.support_ticket') }}</h4>
                    <div>

                        <form action="{{ route('admin.ticket.dashboard') }}" method="GET" id="sort-form">
                            <div class="support-title sorting m-0">
                                <div class="select-sorting">
                                    <label for="">{{ __('ticket::static.dashboard.sort_by') }}</label>
                                    <div class="select-form">
                                        <select class="select-2 form-control sort" id="sort" name="sort">
                                            <option class="select-placeholder" value="today"
                                                {{ request('sort') == 'today' ? 'selected' : '' }}>
                                                {{ __('static.today') }}
                                            </option>
                                            <option class="select-placeholder" value="this_week"
                                                {{ request('sort') == 'this_week' ? 'selected' : '' }}>
                                                {{ __('static.this_week') }}
                                            </option>
                                            <option class="select-placeholder" value="this_month"
                                                {{ request('sort') == 'this_month' ? 'selected' : '' }}>
                                                {{ __('static.this_month') }}
                                            </option>
                                            <option class="select-placeholder" value="this_year"
                                                {{ request('sort') == 'this_year' || !request('sort') ? 'selected' : '' }}>
                                                {{ __('static.this_year') }}
                                            </option>
                                            <option class="select-placeholder" value="custom"
                                                {{ request('sort') == 'custom' ? 'selected' : '' }}>
                                                {{ __('static.custom_range') }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            @php
                                $startDate = request('start');
                                $endDate = request('end');
                                $selectedRange = $startDate && $endDate ? "$startDate to $endDate" : '';
                            @endphp

                            <div class="form-group {{ request('sort') == 'custom' ? '' : 'd-none' }}" id="custom-date-range">
                                <input type="text" class="form-control filter-dropdown" id="start_end_date"
                                    name="start_end_date" placeholder="{{ __('ticket::static.report.select_date') }}"
                                    value="{{ $selectedRange }}">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        @can('user.index')
            <div class="col-xxl-3 col-sm-6">
                <a class="widget-card" href="{{ route('admin.user.index') }}">
                    <div class="card">
                        <div class="card-body support-bg-img">
                            <div class="widget-content">
                                <div class="support-details">
                                    <span>{{ __('ticket::static.dashboard.total_users') }}</span>
                                    <h4>{{ tx_getUsersCount() }}</h4>
                                </div>
                                <div class="widget-round b-primary">
                                    <div class="bg-round">
                                        <svg>
                                            <use xlink:href="{{ asset('images/dashboard/support/user.svg#user') }}">
                                            </use>
                                        </svg>
                                        <svg class="half-circle">
                                            <use xlink:href="{{ asset('images/dashboard/support/1.svg#support') }}">
                                            </use>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        @endcan
        @can('ticket.department.index')
            <div class="col-xxl-3 col-sm-6">
                <a class="widget-card" href="{{ route('admin.department.index') }}">
                    <div class="card">
                        <div class="card-body support-bg-img">
                            <div class="widget-content">
                                <div class="support-details">
                                    <span>{{ __('ticket::static.dashboard.total_departments') }}</span>
                                    <h4>{{ tx_getDepartmentsCount() }}</h4>
                                </div>
                                <div class="widget-round b-warning">
                                    <div class="bg-round">
                                        <img src="{{ asset('images/dashboard/support/layout.svg') }}" alt="">
                                        <img src="{{ asset('images/dashboard/support/2.svg') }}" class="half-circle"
                                            alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        @endcan
        @can('ticket.ticket.index')
            <div class="col-xxl-3 col-sm-6">
                <a class="widget-card" href="{{ route('admin.ticket.index') }}">
                    <div class="card">
                        <div class="card-body support-bg-img">
                            <div class="widget-content">
                                <div class="support-details">
                                    <span>{{ __('ticket::static.dashboard.total_tickets') }}</span>
                                    <h4>{{ tx_getTicketsCount() }}</h4>
                                </div>
                                <div class="widget-round b-tertiary">
                                    <div class="bg-round">
                                        <img src="{{ asset('images/dashboard/support/total.svg') }}" alt="">
                                        <img src="{{ asset('images/dashboard/support/3.svg') }}" class="half-circle"
                                            alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>

            <div class="col-xxl-3 col-sm-6">
                <a class="widget-card" href="{{ route('admin.ticket.index', ['filter' => 'open']) }}">
                    <div class="card">
                        <div class="card-body support-bg-img">
                            <div class="widget-content">
                                <div class="support-details">
                                    <span>{{ __('ticket::static.dashboard.total_open_tickets') }}</span>
                                    <h4>{{ tx_getOpenTicketsCount() }}</h4>
                                </div>
                                <div class="widget-round b-light">
                                    <div class="bg-round">
                                        <img src="{{ asset('images/dashboard/support/open.svg') }}" alt="">
                                        <img src="{{ asset('images/dashboard/support/4.svg') }}" class="half-circle"
                                            alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>

            <div class="col-xxl-3 col-sm-6">
                <a class="widget-card" href="{{ route('admin.ticket.index', ['filter' => 'closed']) }}">
                    <div class="card">
                        <div class="card-body support-bg-img">
                            <div class="widget-content">
                                <div class="support-details">
                                    <span>{{ __('ticket::static.dashboard.total_closed_tickets') }}</span>
                                    <h4>{{ tx_getClosedTicketsCount() }}</h4>
                                </div>
                                <div class="widget-round b-light">
                                    <div class="bg-round">
                                        <img src="{{ asset('images/dashboard/support/cancel.svg') }}" alt="">
                                        <img src="{{ asset('images/dashboard/support/4.svg') }}" class="half-circle"
                                            alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>

            <div class="col-xxl-3 col-sm-6">
                <a class="widget-card" href="{{ route('admin.ticket.index', ['filter' => 'solved']) }}">
                    <div class="card">
                        <div class="card-body support-bg-img">
                            <div class="widget-content">
                                <div class="support-details">
                                    <span>{{ __('ticket::static.dashboard.total_solved_tickets') }}</span>
                                    <h4>{{ tx_getSolvedTicketsCount() }}</h4>
                                </div>
                                <div class="widget-round b-tertiary">
                                    <div class="bg-round">
                                        <img src="{{ asset('images/dashboard/support/done.svg') }}" alt="">
                                        <img src="{{ asset('images/dashboard/support/3.svg') }}" class="half-circle"
                                            alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>

            <div class="col-xxl-3 col-sm-6">
                <a class="widget-card" href="{{ route('admin.ticket.index', ['filter' => 'pending']) }}">
                    <div class="card">
                        <div class="card-body support-bg-img">
                            <div class="widget-content">
                                <div class="support-details">
                                    <span>{{ __('ticket::static.dashboard.total_pending_tickets') }}</span>
                                    <h4>{{ tx_getPendingTicketsCount() }}</h4>
                                </div>
                                <div class="widget-round b-warning">
                                    <div class="bg-round">
                                        <img src="{{ asset('images/dashboard/support/pending.svg') }}" alt="">
                                        <img src="{{ asset('images/dashboard/support/2.svg') }}" class="half-circle"
                                            alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>

            <div class="col-xxl-3 col-sm-6">
                <a class="widget-card" href="{{ route('admin.ticket.index', ['filter' => 'hold']) }}">
                    <div class="card">
                        <div class="card-body support-bg-img">
                            <div class="widget-content">
                                <div class="support-details">
                                    <span>{{ __('ticket::static.dashboard.total_hold_tickets') }}</span>
                                    <h4>{{ tx_getHoldTicketsCount() }}</h4>
                                </div>
                                <div class="widget-round b-primary">
                                    <div class="bg-round">
                                        <img src="{{ asset('images/dashboard/support/hand.svg') }}" alt="">
                                        <svg class="half-circle">
                                            <use xlink:href="{{ asset('images/dashboard/support/1.svg#support') }}">
                                            </use>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        @endcan

        <div class="col-xxl-7">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('ticket::static.dashboard.tickets') }}</h5>
                        </div>
                        <div class="card-header-right-icon">
                        </div>
                    </div>
                </div>
                <div class="card-body pt-0">
                    <div class="tickets-chart">
                        <div id="tickets-chart"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-5">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('ticket::static.dashboard.ratings') }}</h5>
                        </div>
                        <a href="{{ route('admin.executive.index') }}">
                            <span>{{ __('ticket::static.dashboard.view_all') }}</span>
                        </a>
                    </div>
                </div>
                <div class="card-body rating-executive p-0">
                    <div class="table-responsive h-custom-scrollbar">
                        <table class="table display">
                            <thead>
                                <tr>
                                    <th>{{ __('ticket::static.dashboard.agent_name') }}</th>
                                    <th>{{ __('ticket::static.dashboard.rating') }}</th>
                                    <th>{{ __('ticket::static.dashboard.replied') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($executiveRatings as $executive)
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                @if ($executive['profile_image_url'])
                                                    <img src="{{ asset($executive['profile_image_url']) }}"
                                                        alt="" class="img">
                                                @else
                                                    <div class="initial-letter">
                                                        <span>{{ strtoupper($executive['name'][0]) }}</span>
                                                    </div>
                                                @endif
                                                <div class="flex-grow-1">
                                                    <h5>{{ $executive['name'] }}</h5>
                                                    <span>{{ $executive['email'] }}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="rating">
                                                <img src="{{ asset('images/dashboard/star.svg') }}" alt="">
                                                <span>({{ number_format($executive['ratings'], 1) }})</span>
                                            </div>
                                        </td>
                                        <td>{{ $executive['tickets_handled'] }}</td>
                                    </tr>
                                @empty
                                    <tr class="table-not-found">
                                        <div class="table-no-data">
                                            <img src="{{ asset('images/dashboard/data-not-found.svg') }}"
                                                alt="data not found" />
                                            <h6 class="text-center">
                                                {{ __('ticket::static.widget.no_data_available') }}
                                            </h6>
                                        </div>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-6">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('ticket::static.dashboard.latest_tickets') }}</h5>
                        </div>
                        <a href="{{ route('admin.ticket.index') }}">
                            <span>{{ __('ticket::static.dashboard.view_all') }}</span>
                        </a>
                    </div>
                </div>
                <div class="card-body top-drivers rating-executive latest-tickets p-0">
                    <div class="table-responsive h-custom-scrollbar">
                        <table class="table display">
                            <thead>
                                <tr>
                                    <th>{{ __('ticket::static.dashboard.ticket_id') }}</th>
                                    <th>{{ __('ticket::static.dashboard.ticket_name') }}</th>
                                    <th>{{ __('ticket::static.dashboard.ticket_status') }}</th>
                                    <th>{{ __('ticket::static.dashboard.ticket_subject') }}</th>
                                    <th>{{ __('ticket::static.dashboard.ticket_created') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse (tx_getLatestTickets() as $item)
                                    <tr>
                                        <td>
                                            <span class="bg-light-primary">#{{ $item->ticket_number }}</span>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2 user-name">
                                                @if ($item->user)
                                                    @if ($item->user->profile_image?->original_url)
                                                        <img src="{{ $item->user->profile_image->original_url }}"
                                                            alt="" class="img-fluid" />
                                                    @else
                                                        <div class="initial-letter">
                                                            {{ strtoupper(substr($item->user->name, 0, 1)) }}
                                                        </div>
                                                    @endif
                                                    <div class="user-details">
                                                        <a>{{ $item->user->name }}</a>
                                                        <h6>{{ $item->user->email }}</h6>
                                                    </div>
                                                @else
                                                    <div class="initial-letter">
                                                        {{ strtoupper(substr($item->name, 0, 1)) }}
                                                    </div>
                                                    <div class="user-details">
                                                        <a>{{ $item->name }}</a>
                                                        <h6>{{ $item->email }}</h6>
                                                    </div>
                                                @endif
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                class="badge badge-{{ $item->ticketStatus->color }}">{{ $item->ticketStatus->name }}</span>
                                        </td>
                                        <td><span>{{ $item->subject }}</span></td>
                                        <td><span>{{ $item->created_at->diffForHumans() }}</span></td>
                                    </tr>
                                @empty
                                    {{-- <tr class="table-not-found">
                                        <div class="table-data">
                                            <img src="{{ asset('images/dashboard/data-not-found.svg') }}"
                                                alt="data not found" />
                                            <td colspan="5" class="text-center">
                                                {{ __('ticket::static.widget.no_data_available') }}
                                            </td>
                                        </div>
                                    </tr> --}}

                                    <div class="table-no-data">
                                        <img src="{{ asset('images/dashboard/data-not-found.svg') }}" class="img-fluid"
                                            alt="data not found" />
                                        {{-- <td colspan="5" class="text-center">
                                                {{ __('ticket::static.widget.no_data_available') }}
                                            </td> --}}
                                        <h6 class="text-center">{{ __('ticket::static.widget.no_data_available') }}
                                        </h6>
                                    </div>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-6">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('ticket::static.dashboard.department_tickets') }}</h5>
                        </div>
                        <div class="card-header-right-icon">
                        </div>
                    </div>
                </div>
                <div class="card-body pt-0 departments">
                    <div class="departments-chart">
                        <div id="departments-chart"></div>
                    </div>
                </div>
                <div id="departments-not-found-image" class="no-data-found" style="display:none;">
                    <img src="{{ asset('images/result-failure-icon.svg') }}" alt="No Data" class="img-fluid">
                    <span>{{ __('ticket::static.widget.no_data_available') }}</span>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('scripts')
    <script src="{{ asset('js/apex-chart.js') }}"></script>
    <script src="{{ asset('js/flatpickr/flatpickr.js')}}"></script>
    <script src="{{ asset('js/flatpickr/rangePlugin.js')}}"></script>
    <script>
        (function($) {
            "use strict";

            $(document).ready(function() {

                const filterVal = $('#sort').val();
                const $customDateRange = $("#custom-date-range");
                const $startEndDate = $("#start_end_date");

                if ($startEndDate.length) {
                    flatpickr("#start_end_date", {
                        mode: "range",
                        dateFormat: "m-d-Y",
                        defaultDate: "{{ $selectedRange }}",
                        onClose: function (selectedDates, dateStr, instance) {
                            if (selectedDates.length === 2) {
                                const startDate = flatpickr.formatDate(selectedDates[0], "m-d-Y");
                                const endDate = flatpickr.formatDate(selectedDates[1], "m-d-Y");
                                const urlParams = new URLSearchParams(window.location.search);
                                urlParams.set("sort", "custom");
                                urlParams.set("start", startDate);
                                urlParams.set("end", endDate);
                                history.pushState(null, null, `${window.location.pathname}?${urlParams.toString()}`);
                                location.reload();
                            }
                        }
                    });
                }

                $('#sort').on('change', function() {

                    const selectedSort = $(this).val();

                    if (selectedSort === 'custom') {
                        $('#custom-date-range').removeClass('d-none');
                    } else {
                        window.history.replaceState(null, null, location.pathname);
                        $('#custom-date-range').addClass('d-none');
                        const urlParams = new URLSearchParams(window.location.search);
                        urlParams.set('sort', selectedSort);
                        window.location.href = `${window.location.pathname}?${urlParams.toString()}`;
                    }
                });

                const statusData = @json($statusChart) ?? [];

                if (statusData && statusData.labels && statusData.values) {
                    var statusChartOptions = {
                        series: [{
                            name: "Ticket",
                            data: statusData.values,
                        }],
                        chart: {
                            type: "bar",
                            toolbar: {
                                show: false,
                            },
                            height: 410,
                        },
                        grid: {
                            show: true,
                            strokeDashArray: 3,
                            borderColor: "#6A71854D",
                        },
                        plotOptions: {
                            bar: {
                                columnWidth: "25%",
                                borderRadius: 13,
                                borderRadiusApplication: "end",
                                distributed: true,
                                barHeight: "100%",
                            },
                        },
                        xaxis: {
                            show: true,
                            categories: statusData.labels,
                            labels: {
                                show: true,
                                style: {
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    fontFamily: "Rubik, sans-serif",
                                    colors: "#8D8D8D",
                                },
                            },
                            axisBorder: {
                                show: false,
                            },
                            axisTicks: {
                                show: false,
                            },
                            tooltip: {
                                enabled: false,
                            },
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        legend: {
                            show: false,
                        },
                        yaxis: {
                            show: true,
                            tickAmount: 5,
                            showForNullSeries: true,
                            axisBorder: {
                                show: false,
                            },
                            axisTicks: {
                                show: false,
                            },
                            labels: {
                                style: {
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    fontFamily: "Rubik, sans-serif",
                                    colors: "#3D434A",
                                },
                            },
                        },
                        colors: ["#199675", "#F39159", "#ECB238", "#47A1E5", "#86909C", "#D94238"],
                        fill: {
                            opacity: 1,
                        },
                    };

                    var statusChart = new ApexCharts(document.querySelector("#tickets-chart"),
                        statusChartOptions);
                    statusChart.render();
                } else {
                    console.log("Error: Invalid status data.");
                }

                const departmentData = @json($departmentChart) ?? [];

                function areAllValuesZero(values) {
                    return values.every(value => value === 0);
                }

                if (departmentData.values && departmentData.values.length > 0 && !areAllValuesZero(
                        departmentData.values)) {
                    var departmentChartOptions = {
                        chart: {
                            type: 'polarArea',
                            height: 380,
                        },
                        stroke: {
                            colors: ['#fff']
                        },
                        fill: {
                            opacity: 0.8
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        legend: {
                            show: true,
                            position: 'bottom',
                            labels: {
                                colors: '#333',
                            },
                        },
                        series: departmentData.values,
                        labels: departmentData.labels,
                        colors: ['#199675', '#ff5443', '#ffb900', '#ECB238', '#47A1E5', '#86909C'],
                        responsive: [{
                            breakpoint: 991,
                        }],
                    };

                    var departmentChart = new ApexCharts(document.querySelector("#departments-chart"),
                        departmentChartOptions);
                    departmentChart.render();

                    $('#departments-not-found-image').hide();
                } else {
                    $('#departments-chart').hide();
                    $('#departments-not-found-image').show();
                }
            });
        })(jQuery);
    </script>
@endpush


