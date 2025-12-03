@extends('admin.layouts.master')
@section('title', __('taxido::static.reports.ride_reports'))
@push('css')
    <link rel="stylesheet" href="{{ asset('css/vendors/flatpickr.min.css')}}">
@endpush
@use('App\Enums\PaymentStatus')
@php
    $drivers = getAllVerifiedDrivers();
    $riders = getAllRiders();
    $rideStatus = getRideStatus();
    $PaymentMethodList = getPaymentMethodList();
    $paymentStatus = PaymentStatus::ALL;
    $zones = getAllZones();
    $services = getAllServices();
    $serviceCategories = getAllServices();
    $vehicleTypes = getAllVehicleTypes();
    $paymentMethodColorClasses = getPaymentStatusColorClasses();
@endphp
@section('content')
<div class="category-main">
    <form id="filterForm" method="POST" action="{{ route('admin.ride-report.export') }}" enctype="multipart/form-data">
        @method('POST')
        @csrf
        <div class="row g-4">
            <div class="col-xl-3">
                <div class="p-sticky">
                    <div class="contentbox">
                        <div class="inside">
                            <div class="contentbox-title">
                                <h3>{{ __('taxido::static.reports.filter') }}</h3>
                            </div>
                            <div class="rider-height custom-scrollbar">
                                <div class="form-group">
                                    <label for="driver">{{ __('taxido::static.reports.driver') }}</label>
                                    <select class="select-2 form-control filter-dropdown disable-all" id="driver"
                                        name="driver[]" multiple
                                        data-placeholder="{{ __('taxido::static.reports.select_driver') }}">
                                        <option value="all">{{ __('taxido::static.reports.all') }}</option>
                                        @foreach ($drivers as $driver)
                                            <option value="{{ $driver->id }}" sub-title="{{ $driver->email }}"
                                                image="{{ $driver?->profile_image?->original_url }}">
                                                {{ $driver->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="user">{{ __('taxido::static.reports.user') }}</label>
                                    <select class="select-2 form-control filter-dropdown disable-all" id="user"
                                        name="user[]" multiple
                                        data-placeholder="{{ __('taxido::static.reports.select_user') }}">
                                        <option value="all">{{ __('taxido::static.reports.all') }}</option>
                                        @foreach ($riders as $rider)
                                            <option value="{{ $rider->id }}" sub-title="{{ $rider->email }}"
                                                image="{{ $rider?->profile_image?->original_url }}">
                                                {{ $rider->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="ride_status">{{ __('taxido::static.reports.ride_status') }}</label>
                                    <select class="select-2 form-control filter-dropdown disable-all" id="ride_status"
                                        name="ride_status[]" multiple
                                        data-placeholder="{{ __('taxido::static.reports.select_ride_status') }}">
                                        <option value="all">{{ __('taxido::static.reports.all') }}</option>
                                        @foreach ($rideStatus as $status)
                                            <option value="{{ $status->id }}">{{ $status->name }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label
                                        for="payment_status">{{ __('taxido::static.reports.payment_status') }}</label>
                                    <select class="select-2 form-control filter-dropdown disable-all"
                                        id="payment_status" name="payment_status[]" multiple
                                        data-placeholder="{{ __('taxido::static.reports.select_payment_status') }}">
                                        <option value="all">{{ __('taxido::static.reports.all') }}</option>
                                        @foreach ($paymentStatus as $status)
                                            <option value="{{ $status }}">{{ $status }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="start_end_date">{{ __('taxido::static.reports.select_date') }}</label>
                                    <input type="text" class="form-control" id="start_end_date" name="start_end_date"
                                        placeholder="{{ __('taxido::static.reports.select_date') }}">
                                </div>

                                <div class="form-group">
                                    <label for="zone">{{ __('taxido::static.reports.zone') }}</label>
                                    <select class="select-2 form-control filter-dropdown disable-all" id="zone"
                                        name="zone[]" multiple
                                        data-placeholder="{{ __('taxido::static.reports.select_zone') }}">
                                        <option value="all">{{ __('taxido::static.reports.all') }}</option>
                                        @foreach ($zones as $key => $zone)
                                            <option value="{{ $zone->id }}">
                                                {{ $zone->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="service">{{ __('taxido::static.reports.service') }}</label>
                                    <select class="select-2 form-control filter-dropdown disable-all" id="service"
                                        name="service[]" multiple
                                        data-placeholder="{{ __('taxido::static.reports.select_service') }}">
                                        <option value="all">{{ __('taxido::static.reports.all') }}</option>
                                        @foreach ($services as $service)
                                            <option value="{{ $service->id }}"
                                                image="{{ $service?->service_image?->original_url }}">
                                                {{ $service->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label
                                        for="service_category">{{ __('taxido::static.reports.service_category') }}</label>
                                    <select class="select-2 form-control filter-dropdown disable-all"
                                        id="service_category[]" name="service_category[]" multiple
                                        data-placeholder="{{ __('taxido::static.reports.select_service_category') }}">
                                        <option value="all">{{ __('taxido::static.reports.all') }}</option>
                                        @forelse ($serviceCategories as $serviceCategory)
                                            <option value="{{ $serviceCategory->id }}"
                                                image="{{ $serviceCategory?->service_category_image?->original_url }}">
                                                {{ $serviceCategory->name }}
                                            </option>
                                        @empty
                                        @endforelse
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="vehicle_type">{{ __('taxido::static.reports.vehicle_type') }}</label>
                                    <select class="select-2 form-control filter-dropdown disable-all"
                                        id="vehicle_type[]" name="vehicle_type[]" multiple
                                        data-placeholder="{{ __('taxido::static.reports.select_vehicle_type') }}">
                                        <option value="all">{{ __('taxido::static.reports.all') }}</option>
                                        @forelse ($vehicleTypes as $vehicleType)
                                            <option value="{{ $vehicleType->id }}"
                                                image="{{ $vehicleType?->vehicle_image?->original_url }}">
                                                {{ $vehicleType->name }}
                                            </option>
                                        @empty
                                        @endforelse
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-9">
                <div class="contentbox">
                    <div class="inside">
                        <div class="contentbox-title">
                            <h3>{{ __('taxido::static.reports.ride_reports') }}</h3>
                            <button type="button" class="btn btn-outline" data-bs-toggle="modal"
                                data-bs-target="#reportExportModal">
                                {{ __('taxido::static.reports.export') }}
                            </button>
                        </div>

                        <div class="ride-report-table">
                            <div class="col">
                                <div class="table-main template-table m-0 loader-table">

                                    <div class="table-responsive custom-scrollbar m-0">
                                        <table class="table" id="rideTable">
                                            <thead>
                                                <tr>
                                                    <th>{{ __('taxido::static.reports.ride_number') }}</th>
                                                    <th>{{ __('taxido::static.reports.driver') }}</th>
                                                    <th>{{ __('taxido::static.reports.user') }}</th>
                                                    <th>{{ __('taxido::static.reports.ride_status') }}</th>
                                                    <th>{{ __('taxido::static.reports.payment_method') }}</th>
                                                    <th>{{ __('taxido::static.reports.payment_status') }}</th>
                                                    <th>{{ __('taxido::static.reports.service') }}</th>
                                                    <th>{{ __('taxido::static.reports.service_category') }}</th>
                                                    <th>{{ __('taxido::static.reports.vehicle_type') }}</th>
                                                    <th>{{ __('taxido::static.reports.amount') }}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <div class="report-loader-wrapper" style="display:none;">
                                                    <div class="loader"></div>
                                                </div>
                                            </tbody>
                                        </table>
                                        <nav>
                                            <ul class="pagination justify-content-center mt-0 mb-3"
                                                id="report-pagination">
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="reportExportModal" tabindex="-1" aria-labelledby="reportExportModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exportModalLabel">{{ __('taxido::static.modal.export_data') }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body export-data">
                        <div class="main-img">
                            <img src="{{ asset('images/export.svg') }}" />
                        </div>
                        <div class="form-group">
                            <label for="exportFormat">{{ __('taxido::static.modal.select_export_format') }}</label>
                            <select id="exportFormat" name="format" class="form-select">
                                <option value="csv">{{ __('taxido::static.modal.csv') }}</option>

                                <option value="excel">{{ __('taxido::static.modal.excel') }}</option>
                            </select>
                        </div>
                        <div class="d-flex justify-content-end modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">
                                {{ __('taxido::static.modal.close') }}
                            </button>
                            <button type="submit" class="btn btn-primary">
                                {{ __('taxido::static.modal.export') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>


@endsection


@push('scripts')

    <script src="{{ asset('js/flatpickr/flatpickr.js')}}"></script>
    <script src="{{ asset('js/flatpickr/rangePlugin.js')}}"></script>
    
    <script>
        $(document).ready(function () {

            fetchRideReportTable(page = 1);

            $('.filter-dropdown').change(function () {
                fetchRideReportTable();
            })

            $('#filterForm').on('submit', function () {
                setTimeout(function () {
                    $('.spinner-btn').prop('disabled', false);
                    $('.spinner-btn .spinner').remove();

                    var modal = bootstrap.Modal.getInstance($('#reportExportModal')[0]);
                    modal.hide();

                }, 3000);
            });

            function fetchRideReportTable(page = 1) {
                $('.report-loader-wrapper').show()
                let formData = $('#filterForm').serialize();
                formData += '&page=' + page;
                var $csrfToken = $('meta[name="csrf-token"]').attr('content');
                $.ajax({
                    url: '{{ route('admin.ride-report.filter') }}',
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    headers: {
                        'X-CSRF-TOKEN': $csrfToken
                    },
                    success: function (response) {
                        $('#rideTable tbody').html(response.rideReportTable);

                        $('.pagination').html(response.pagination);
                    },
                    complete: function () {
                        $('.report-loader-wrapper').hide();
                    },
                    error: function (xhr) {
                        console.error(xhr.responseText);
                    }
                });
            }

            $(document).on('click', '#report-pagination a', function (e) {
                e.preventDefault();
                const url = $(this).attr('href');
                const page = new URLSearchParams(url.split('?')[1]).get('page');

                fetchRideReportTable(page);
            });

            $('.disable-all').on('change', function () {
                const $currentSelect = $(this);
                const selectedValues = $currentSelect.val();
                const allOption = "all";

                if (selectedValues && selectedValues.includes(allOption)) {

                    $currentSelect.val([allOption]);
                    $currentSelect.find('option').not(`[value="${allOption}"]`).prop('disabled', true);
                } else {

                    $currentSelect.find('option').prop('disabled', false);
                }
                $currentSelect.select2('destroy').select2({
                    placeholder: $currentSelect.data('placeholder'),
                    width: '100%'
                });
            });

            $('.disable-all').select2({
                placeholder: function () {
                    return $(this).data('placeholder');
                },
                width: '100%'
            });

            flatpickr("#start_end_date", {
                mode: "range",
                dateFormat: "m/d/Y",
                allowInput: true,
                placeholder: "{{ __('taxido::static.reports.select_date') }}"
            });
        })
    </script>
@endpush
