@extends('admin.layouts.master')
@section('title', __('static.system_tools.database_cleanup'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <form method="POST" action="{{ route('admin.cleanup-db.store') }}">
                <div class="contentbox-title">
                    <div class="contentbox-subtitle">
                        <h3>{{ __('static.system_tools.database_cleanup') }}</h3>
                        {{-- <div class="cleaning-buttons"> --}}
                        <button type="button" class="btn btn-outline deleteConfirmationBtn" data-bs-toggle="modal"
                            data-bs-target="#confirmation">
                            <span id="count-selected-rows">0</span>
                            {{ __('static.system_tools.table_selected') }}
                        </button>
                        {{-- </div> --}}
                    </div>
                </div>

                <div class="contentbox">
                    <div class="accordion" id="smsAccordion">
                        <div class="inside">
                            <div class="table-main database-table template-table mt-0">
                                <div class="table-responsive custom-scrollbar mt-0">
                                    @csrf
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div class="form-check">
                                                        <input type="checkbox" id="selectAllCheckbox" name="checkAll"
                                                            class="form-check-input" />
                                                    </div>
                                                </th>
                                                <th>{{ __('static.system_tools.table_name') }}</th>
                                                <th>{{ __('static.system_tools.records_count') }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @forelse ($tables as $key => $table)
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input type="checkbox" name="table_name[]"
                                                                class="rowClass form-check-input"
                                                                value="{{ $key }}" />
                                                        </div>
                                                    </td>
                                                    <td>{{ $key }}</td>
                                                    <td>{{ $table }}</td>
                                                </tr>
                                            @empty
                                                <tr>
                                                    <td colspan="3">{{ __('No tables found.') }}</td>
                                                </tr>
                                            @endforelse
                                        </tbody>
                                    </table>
                                    <div class="modal fade confirmation-modal" id="confirmation">
                                        <div class="modal-dialog modal-dialog-centered">
                                            <div class="modal-content">
                                                <div class="modal-body text-start confirmation-data">
                                                    <div class="main-img">
                                                        <div class="delete-icon">
                                                            <i class="ri-question-mark"></i>
                                                        </div>
                                                    </div>
                                                    <h4 class="modal-title">{{ __('static.wallets.confirmation') }}</h4>
                                                    <p>
                                                        {{ __('static.wallets.modal') }}
                                                    </p>
                                                    <div class="d-flex">
                                                        <input type="hidden" id="inputType" name="type" value="">
                                                        <button type="button" class="btn cancel btn-light me-2" data-bs-dismiss="modal">{{ __('static.wallets.no') }}</button>
                                                        <button type="submit" class="btn btn-primary delete delete-btn spinner-btn">{{ __('static.wallets.yes') }}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        (function($) {
            "use strict";

            var rowIds = [];
            $(document).on('change', '#selectAllCheckbox', function(e) {
                if ($(this).is(':checked')) {
                    $('.rowClass').prop('checked', true).trigger('change');
                } else {
                    $('.rowClass').prop('checked', false).trigger('change');
                }
            });

            $(document).on('change', '.rowClass', function(e) {
                let id = $(this).val();
                if ($(this).is(':checked')) {
                    if (!rowIds.includes(id)) {
                        rowIds.push(id);
                    }
                } else {
                    rowIds = rowIds.filter(function(value) {
                        return value !== id;
                    });
                }
                updateDeleteConfirmationBtn();
            });

            function updateDeleteConfirmationBtn() {
                if (rowIds.length > 0) {
                    $('.deleteConfirmationBtn').show();
                    $('.resetDatabaseBtn').show();
                    $('#count-selected-rows').html(rowIds.length);
                } else {
                    $('.deleteConfirmationBtn').hide();
                    $('.resetDatabaseBtn').hide();
                }
            }

            $(document).ready(function() {
                $('.deleteConfirmationBtn').hide();
                $('.resetDatabaseBtn').hide();
            });

        })(jQuery);
    </script>
@endpush
