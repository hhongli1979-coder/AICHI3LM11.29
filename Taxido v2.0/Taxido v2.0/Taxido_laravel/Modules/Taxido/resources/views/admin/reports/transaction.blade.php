@extends('admin.layouts.master')
@section('title', __('taxido::static.reports.transaction_reports'))
@push('css')
    <link rel="stylesheet" href="{{ asset('css/vendors/flatpickr.min.css') }}">
@endpush
@use('App\Enums\PaymentStatus')
@php
    $PaymentMethodList = getPaymentMethodList();
    $paymentStatus = PaymentStatus::ALL;

@endphp
@section('content')
    <div class="row ga- category-main g-md-4 g-3">
        <form id="filterForm" method="POST" action="{{ route('admin.transaction-report.export') }}"
            enctype="multipart/form-data">
            @method('POST')
            @csrf
            <div class="row g-sm-4 g-3">
                <div class="col-xl-3">
                    <div class="p-sticky">
                        <div class="contentbox">
                            <div class="inside">
                                <div class="contentbox-title">
                                    <h3>{{ __('taxido::static.reports.filter') }}</h3>

                                </div>
                                <div class="rider-height custom-scrollbar">
                                    <div class="form-group">
                                        <label
                                            for="transaction_type">{{ __('taxido::static.reports.transaction_type') }}</label>
                                        <select class="select-2 form-control filter-dropdown disable-all"
                                            id="transaction_type" name="transaction_type[]" multiple
                                            data-placeholder="{{ __('taxido::static.reports.select_transaction_type') }}">
                                            <option value="all">{{ __('taxido::static.reports.all') }}</option>

                                            <option value="ride">{{ __('taxido::static.reports.ride') }}</option>

                                            <option value="wallet">{{ __('taxido::static.reports.wallet') }}</option>
                                            <option value="subscription">{{ __('taxido::static.reports.subscription') }}
                                            </option>

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
                                        <label
                                            for="payment_method">{{ __('taxido::static.reports.payment_method') }}</label>
                                        <select class="select-2 form-control filter-dropdown disable-all"
                                            id="payment_method" name="payment_method[]" multiple
                                            data-placeholder="{{ __('taxido::static.reports.select_payment_method') }}">
                                            <option value="all">{{ __('taxido::static.reports.all') }}</option>
                                            @foreach ($PaymentMethodList as $list)
                                                <option value="{{ $list['slug'] }}">{{ $list['name'] }}</option>
                                            @endforeach
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="start_end_date">{{ __('taxido::static.reports.select_date') }}</label>
                                        <input type="text" class="form-control" id="start_end_date" name="start_end_date"
                                            placeholder="{{ __('taxido::static.reports.select_date') }}">
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
                                <h3>{{ __('taxido::static.reports.transaction_reports') }}</h3>
                                <button type="button" class="btn btn-outline" data-bs-toggle="modal"
                                    data-bs-target="#reportExportModal">
                                    {{ __('taxido::static.reports.export') }}
                                </button>
                            </div>

                            <div class="ride-report-table">
                                <div class="col">
                                    <div class="table-main loader-table template-table m-0">
                                        <div class="table-responsive custom-scrollbar m-0">
                                            <table class="table" id="TransactionTable">
                                                <thead>
                                                    <tr>
                                                        <th>{{ __('taxido::static.reports.tansaction_id') }}</th>
                                                        <th>{{ __('taxido::static.reports.payment_method') }}</th>
                                                        <th>{{ __('taxido::static.reports.payment_status') }}</th>
                                                        <th>{{ __('taxido::static.reports.amount') }}</th>
                                                        <th>{{ __('taxido::static.reports.type') }}</th>
                                                        <th>{{ __('taxido::static.reports.Date') }}</th>
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
    <script src="{{ asset('js/flatpickr/flatpickr.js') }}"></script>
    <script src="{{ asset('js/flatpickr/rangePlugin.js') }}"></script>
    <script>
        $(document).ready(function() {

            fetchTransactionReportTable(page = 1);

            $('.filter-dropdown').change(function() {
                fetchTransactionReportTable();
            })

            function fetchTransactionReportTable(page = 1) {
                $('.report-loader-wrapper').show()
                let formData = $('#filterForm').serialize();
                formData += '&page=' + page;
                var $csrfToken = $('meta[name="csrf-token"]').attr('content');
                $.ajax({
                    url: '{{ route('admin.transaction-report.filter') }}',
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    headers: {
                        'X-CSRF-TOKEN': $csrfToken
                    },
                    success: function(response) {
                        console.log(response);
                        $('#TransactionTable tbody').html(response.transactionReportTable);

                        $('.pagination').html(response.pagination);
                    },
                    complete: function() {
                        $('.report-loader-wrapper').hide();
                    },
                    error: function(xhr) {
                        console.error(xhr.responseText);
                    }
                });
            }

            $(document).on('click', '#report-pagination a', function(e) {
                e.preventDefault();
                const url = $(this).attr('href');
                const page = new URLSearchParams(url.split('?')[1]).get('page');

                fetchTransactionReportTable(page);
            });

            $('.disable-all').on('change', function() {
                const $currentSelect = $(this);
                const selectedValues = $currentSelect.val();
                const allOption = "all";

                if (selectedValues && selectedValues.includes(allOption)) {
                    $currentSelect.val([allOption]);
                    $currentSelect.find('option').not(`[value="${allOption}"]`).prop('disabled', true);
                } else {
                    $currentSelect.find('option').prop('disabled', false);
                }

                if ($currentSelect.hasClass('select2-hidden-accessible')) {
                    $currentSelect.select2('destroy');
                }

                setTimeout(() => {
                    $currentSelect.select2({
                        placeholder: $currentSelect.data('placeholder'),
                        width: '100%'
                    });
                }, 10);
            });

            $('.disable-all').select2({
                placeholder: function() {
                    return $(this).data('placeholder');
                },
                width: '100%'
            });

            flatpickr("#start_end_date", {
                mode: "range",
                dateFormat: "m/d/Y",
                allowInput: true,
                placeholder: "{{ __('taxido::static.reports.select_date') }}",
                onChange: function(selectedDates, dateStr, instance) {
                    const urlParams = new URLSearchParams(window.location.search);
                    urlParams.set('start_end_date', dateStr);
                    window.location.href = `${window.location.pathname}?${urlParams.toString()}`;

                    if (selectedDates.length === 2) {
                        const startDate = flatpickr.formatDate(selectedDates[0], "m-d-Y");
                        console.log(startDate);
                        const endDate = flatpickr.formatDate(selectedDates[1], "m-d-Y");
                        console.log(endDate);
                        const urlParams = new URLSearchParams(window.location.search)
                        urlParams.set("start", startDate);
                        urlParams.set("end", endDate);
                        history.pushState(null, null, `${window.location.pathname}?${urlParams.toString()}`);
                        location.reload();
                        fetchTransactionReportTable();

                    }
                }
            });

        })
    </script>
@endpush
