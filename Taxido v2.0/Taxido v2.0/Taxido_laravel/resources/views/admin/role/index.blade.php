@extends('admin.layouts.master')
@section('title', __('static.roles.roles'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('static.roles.roles') }}</h3>
                    <div class="subtitle-button-group">
                        <button class="add-spinner btn btn-outline" data-url="{{ route('admin.role.create') }}">
                            <i class="ri-add-line"></i> {{ __('static.roles.add_new') }}
                        </button>
                    </div>
                </div>
            </div>
            <div class="role-table">
                <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                    :bulkactions="$tableConfig['bulkactions']" :search="true">
                </x-table>
            </div>
        </div>
    </div>
@endsection

<script>
        $(document).ready(function() {
            'use strict';
            $(document).on('click', '.select-all-permission', function() {
                let value = $(this).prop('value');
                $('.module_' + value).prop('checked', $(this).prop('checked'));
                updateGlobalSelectAll();
            });
            $('.checkbox_animated').not('.select-all-permission').on('change', function() {
                let $this = $(this);
                let $label = $this.closest('label');
                let module = $label.data('module');
                let action = $label.data('action');
                let total_permissions = $('.module_' + module).length;
                let $selectAllCheckBox = $this.closest('.' + module + '-permission-list').find(
                    '.select-all-permission');
                let total_checked = $('.module_' + module).filter(':checked').length;
                let isAllChecked = total_checked === total_permissions;
                if ($this.prop('checked')) {
                    $('.module_' + module + '_index').prop('checked', true);

                } else {
                    let moduleCheckboxes = $(`input[type="checkbox"][data-module="${module}"]:checked`);
                    if (moduleCheckboxes.length === 0) {
                        if (action === 'index') {
                            $('.module_' + module).prop('checked', false);
                        }
                        $(`.module_${module}_${action}`).prop('checked', false);
                        $('.select-all-for-' + module).prop('checked', false);
                    }
                }

                $('.select-all-for-' + module).prop('checked', isAllChecked);
                updateGlobalSelectAll();
            });

            $('#roleForm').validate({});
        });

        $('#all_permissions').on('change', function() {
            $('.checkbox_animated').prop('checked', $(this).prop('checked'));
        });

        function updateGlobalSelectAll() {
            let allChecked = true;
            $('.select-all-permission').each(function() {
                if (!$(this).prop('checked')) {
                    allChecked = false;
                }
            });
            $('#all_permissions').prop('checked', allChecked);
        }

        $("#role-form").validate({
            ignore: [],
            rules: {
                "name": {
                    required: true
                },
            }
        });

        $('#submitBtn').on('click', function(e) {
            $("#role-form").valid();
        });

        $('[data-bs-toggle="tooltip"]').tooltip();
    </script>
