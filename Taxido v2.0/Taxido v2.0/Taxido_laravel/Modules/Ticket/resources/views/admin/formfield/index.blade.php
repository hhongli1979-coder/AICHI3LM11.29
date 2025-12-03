@extends('admin.layouts.master')
@section('title', __('ticket::static.formfield.formfield'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('ticket::static.formfield.formfield') }}</h3>
                    <div class="subtitle-button-group">
                        @can('ticket.formfield.create')
                            <a href="" data-bs-toggle="modal" data-bs-target="#confirmation"
                                class="btn btn-outline"><i class="ri-add-line"></i>{{ __('ticket::static.formfield.add_new') }}</a>
                        @endcan
                        @can('ticket.formfield.create')
                            <a href="{{ route('ticket.form') }}"
                                class="btn btn-outline">{{ __('ticket::static.formfield.ticket') }}</a>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="alert alert-info ms-0 w-100" role="alert">
                {{ __('ticket::static.formfield.description') }}
            </div>
            @includeIf('ticket::admin.formfield.inputfield', ['formfields' => $formfields])
        </div>
    </div>

@endsection
@include('ticket::admin.formfield.modal')
@push('scripts')
    <script>
        (function($) {
            "use strict";
            $(document).ready(function() {

                $('#FormField').validate();
                $('.type-options').hide();
                $('.select_type').hide();
                $('.delete-row').hide();
                $('.loader-formfield').hide();

                $(document).on('change', '#type', function(e) {
                    e.preventDefault();

                    const type = $(this).val();
                    const validTypes = ['select', 'checkbox', 'radio'];

                    const $typeOptions = $('.type-options');
                    const $selectType = $('.select_type');
                    const $placeholderInput = $('.placeholder-input');

                    if (validTypes.includes(type)) {
                        $typeOptions.show();
                        $selectType.toggle(type === 'select');
                        $placeholderInput.toggle(type !== 'radio' && type !== 'checkbox');
                    } else {
                        $typeOptions.hide();
                        $selectType.hide();
                        $placeholderInput.show();
                    }
                });

                $(document).on('click', '#add_value', function(e) {
                    e.preventDefault();

                    var isValid = true;
                    $('.option_value:first, .option_name:first').find('input').each(function() {
                        if ($(this).val().trim() === '') {
                            $(this).addClass('is-invalid');
                            isValid = false;
                        } else {
                            $(this).removeClass('is-invalid');
                        }
                    });

                    if (!isValid) {
                        return;
                    }

                    var clonedOption = $('.options:first').clone().addClass('cloned');

                    clonedOption.find('input').val('');

                    $('.option-clone').append(clonedOption);
                    $('.delete-row').show();

                    $(document).on('click', '#delete-row', function(e) {
                        e.preventDefault();

                        if ($('.options').length > 1) {
                            $(this).closest('.options').remove();
                        } else {
                            $('.delete-row').hide();
                        }
                    });
                });
            });
        })(jQuery);
    </script>
@endpush
