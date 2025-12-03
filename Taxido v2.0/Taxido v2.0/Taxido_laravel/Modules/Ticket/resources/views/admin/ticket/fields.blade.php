@use('Modules\Ticket\Models\Department')
@use('Modules\Ticket\Models\Priority')
@php
    $departments = Department::where('status', true)->get();
    $priorities = Priority::where('status', true)->get();
@endphp
<div class="row">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($ticket) ? __('ticket::static.ticket.edit') : __('ticket::static.ticket.add') }}
                        </h3>
                    </div>

                    @if (!isset($ticket))
                        <div class="form-group row">
                            <label class="col-md-2" for="user_ids">{{ __('ticket::static.ticket.user') }}<span>*</span></label>
                            <div class="col-md-10 select-label-error">
                                <select class="select-2 form-control" name="user_ids[]" data-placeholder="{{ __('ticket::static.ticket.select_user') }}" multiple>
                                    <option class="select-placeholder" value=""></option>
                                    @foreach ($users as $user)
                                        @if ($user->email !== getCurrentUser()->email)
                                            <option value="{{ $user->id }}" class="option">{{ $user->email }}</option>
                                        @endif
                                    @endforeach
                                </select>
                                @error('user_ids')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2" for="subject">{{ __('ticket::static.ticket.subject') }}<span>
                                    *</span></label>
                            <div class="col-md-10">
                                <input class="form-control" type="text" name="subject"
                                    placeholder="{{ __('ticket::static.ticket.enter_subject') }}" required>
                                @error('subject')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2" for="description">{{ __('ticket::static.ticket.description') }}<span>
                                    *</span></label>
                            <div class="col-md-10 select-label-error">
                                <textarea class="form-control content" name="description"
                                    placeholder="{{ __('ticket::static.ticket.enter_description') }}" required></textarea>
                                @error('description')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        @foreach ($formFeilds as $formFeild)
                            @if ($formFeild->type == 'text')
                                <div class="form-group row">
                                    <label class="col-md-2" for="{{ 'other_' . $formFeild->name }}">{{ $formFeild->label }} @if ($formFeild->is_required)
                                            <span> *</span>
                                        @endif
                                    </label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="text"
                                            name="{{ 'other_' . $formFeild->name }}"
                                            placeholder="{{ $formFeild->placeholder }}"
                                            @if ($formFeild->is_required) required @endif>
                                    </div>
                                </div>
                            @endif
                            @if ($formFeild->type == 'email')
                                <div class="form-group row">
                                    <label class="col-md-2" for="{{ 'other_' . $formFeild->name }}">{{ $formFeild->label }}@if ($formFeild->is_required)
                                            <span> *</span>
                                        @endif
                                    </label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="email"
                                            name="{{ 'other_' . $formFeild->name }}"
                                            placeholder="{{ $formFeild->placeholder }}"
                                            @if ($formFeild->is_required) required @endif>
                                    </div>
                                </div>
                            @endif
                            @if ($formFeild->type == 'date')
                                <div class="form-group row">
                                    <label class="col-md-2" for="{{ 'other_' . $formFeild->name }}">{{ $formFeild->label }}@if ($formFeild->is_required)
                                            <span> *</span>
                                        @endif
                                    </label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="date"
                                            name="{{ 'other_' . $formFeild->name }}"
                                            placeholder="{{ $formFeild->placeholder }}"
                                            @if ($formFeild->is_required) required @endif>
                                    </div>
                                </div>
                            @endif
                            @if ($formFeild->type == 'number')
                                <div class="form-group row">
                                    <label class="col-md-2" for="{{ 'other_' . $formFeild->name }}">{{ $formFeild->label }}@if ($formFeild->is_required)
                                            <span> *</span>
                                        @endif
                                    </label>
                                    <div class="col-md-10">
                                        <input class="form-control" type="number" min="1"
                                            name="{{ 'other_' . $formFeild->name }}"
                                            placeholder="{{ $formFeild->placeholder }}"
                                            @if ($formFeild->is_required) required @endif>
                                    </div>
                                </div>
                            @endif
                            @if ($formFeild->type == 'textarea')
                                <div class="form-group row">
                                    <label class="col-md-2" for="{{ 'other_' . $formFeild->name }}">{{ $formFeild->label }}@if ($formFeild->is_required)
                                            <span> *</span>
                                        @endif
                                    </label>
                                    <div class="col-md-10">
                                        <textarea class="form-control" name="{{ 'other_' . $formFeild->name }}"
                                            placeholder="{{ $formFeild->placeholder }}" @if ($formFeild->is_required) required @endif></textarea>
                                    </div>
                                </div>
                            @endif
                            @if ($formFeild->type == 'select')
                                <div class="form-group row">
                                    <label class="col-md-2" for="select">{{ $formFeild->label }}@if ($formFeild->is_required)
                                            <span> *</span>
                                        @endif
                                    </label>
                                    <div class="col-md-10 select-label-error">
                                        <select class="select-2 form-control"
                                            name="@if ($formFeild->select_type == 'multiple_select') {{ 'other_' . $formFeild->name . '[]' }} @else {{ 'other_' . $formFeild->name }} @endif"
                                            data-placeholder="{{ $formFeild->placeholder }}"
                                            @if ($formFeild->select_type == 'multiple_select') multiple @endif
                                            @if ($formFeild->is_required) required @endif>
                                            @foreach ($formFeild->options as $option)
                                                <option value="{{ $option['option_value'] }}" class="option">
                                                    {{ $option['option_name'] }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                            @endif
                            @if ($formFeild->type == 'checkbox')
                                <div class="form-group row">
                                    <label class="col-md-2" for="checkbox">{{ $formFeild->label }}@if ($formFeild->is_required)
                                            <span> *</span>
                                        @endif
                                    </label>
                                    <div class="col-md-10">
                                        @foreach ($formFeild->options as $option)
                                            <div class="form-group m-checkbox-inline mb-0 d-flex">
                                                <input type="checkbox" name="{{ 'other_' . $option['option_value'] }}">
                                                {{ $option['option_name'] }}
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            @endif
                            @if ($formFeild->type == 'radio')
                                <div class="form-group row">
                                    <label class="col-md-2" for="radio">{{ $formFeild->label }}@if ($formFeild->is_required)
                                            <span> *</span>
                                        @endif
                                    </label>
                                    <div class="col-md-10">
                                        @foreach ($formFeild->options as $option)
                                            <div class="form-group m-checkbox-inline mb-0 d-flex">
                                                <input type="radio" name="{{ 'other_' . $formFeild->name }}"
                                                    value="{{ $option['option_value'] }}">{{ $option['option_name'] }}
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            @endif
                        @endforeach

                    @endif
                    @isset($departments)
                        <div class="form-group row">
                            <label class="col-md-2" for="department_id">{{ __('ticket::static.ticket.department') }}<span>
                                    *</span></label>
                            <div class="col-md-10 select-label-error">
                                 <span class="text-gray mt-1">
                                        {{ __('ticket::static.ticket.no_department_message') }}
                                        <a href="{{ @route('admin.department.index') }}" class="text-primary">
                                            <b>{{ __('ticket::static.here') }}</b>
                                        </a>
                                    </span>
                                <select class="form-control" id="department-list-id" name="department_id"
                                    data-placeholder="{{ __('ticket::static.ticket.select_department') }}">
                                    <option class="select-placeholder" value=""></option>
                                    @foreach ($departments as $department)
                                    @php
                                        $imageUrl = getMedia($department->department_image_id)->original_url ?? '/images/no-data.png';
                                    @endphp
                                        <option value="{{$department->id}}" 
                                            @if ($imageUrl) data-image="{{ $imageUrl }}" @endif 
                                            class="option" @if (old('department_id', $ticket?->department_id ?? '') == $department->id) selected @endif>
                                            {{ $department->name }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('department_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    @endisset
                    @isset($priorities)
                        <div class="form-group row">
                            <label class="col-md-2" for="priority_id">{{ __('ticket::static.ticket.priority') }}<span>
                                    *</span></label>
                            <div class="col-md-10 select-label-error">
                                <span class="text-gray mt-1">
                                        {{ __('ticket::static.ticket.no_priority_message') }}
                                        <a href="{{ @route('admin.priority.index') }}" class="text-primary">
                                            <b>{{ __('ticket::static.here') }}</b>
                                        </a>
                                    </span>
                                <select class="select-2 form-control" name="priority_id"
                                    data-placeholder="{{ __('ticket::static.ticket.select_priority') }}">
                                    <option class="select-placeholder" value=""></option>
                                    @foreach ($priorities as $priority)
                                        <option value="{{ $priority->id }}" class="option"
                                            @if (old('priority_id', $ticket?->priority_id ?? '') == $priority->id) selected @endif>{{ $priority->name }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('priority_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    @endisset
                    @if (!isset($ticket))
                        <div class="form-group row">
                            <label class="col-md-2"
                                for="image">{{ __('ticket::static.ticket.attachment') }}</label>
                            <div class="col-md-10">
                                <input type="file" class="form-control" name="image[]" id="image-upload"
                                    data-max="{{ $settings['storage_configuration']['max_file_upload'] }}"
                                    data-types="{{ implode(',', $settings['storage_configuration']['supported_file_types']) }}"
                                    data-size="{{ $settings['storage_configuration']['max_file_upload_size'] }}"
                                    multiple>
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong class="image-upload-error"></strong>
                                </span>
                                @error('image')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    @endif
                    <div class="form-group row">
                        <div class="col-12">
                            <div class="submit-btn">
                                <button type="submit" name="save" class="btn btn-solid spinner-btn">
                                    <i class="ri-save-line text-white lh-1"></i>{{ __('ticket::static.save') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@push('scripts')
    <script>
        (function($) {
            "use strict";

            $('#ticketForm').validate({
                ignore: [],
                rules: {
                    description: {
                        required: function(element) {
                            var editorContent = tinymce.get(element.id).getContent({
                                format: 'text'
                            });
                            if (editorContent.trim().length <= 0) {
                                return true;
                            }
                        }
                    },
                },
            });

            $('#image-upload').on('change', function() {

                var files = $(this)[0];
                var maxSize = $(this).data('size');
                var maxFiles = $(this).data('max');
                var allowedTypes = $(this).data('types').split(',').map(function(type) {
                    return type.trim().toLowerCase();
                }); // Allowed file extensions
                var fileCount = files.files.length;

                if (files.files.length > maxFiles) {

                    $('.invalid-feedback').show();
                    $('.image-upload-error').text('You can only upload up to ' + maxFiles + ' files.');
                    $(this).val('');

                } else {
                    for (var i = 0; i < fileCount; i++) {
                        var file = files.files[i];
                        var fileExtension = file.name.split('.').pop().toLowerCase();
                        var fileSize = file.size;

                        if (!allowedTypes.includes(fileExtension)) {
                            $('.invalid-feedback').show();
                            $('.image-upload-error').text('File "' + file.name +
                                '" has an invalid extension. Allowed extensions are: ' + allowedTypes.join(
                                    ', ') + '.');

                        }

                        if (fileSize > maxSize) {
                            $('.invalid-feedback').show();
                            $('.image-upload-error').text('File "' + file.name +
                                '" exceeds the maximum size of ' + (maxSize / 1024 / 1024).toFixed(2) +
                                ' MB.');

                        }
                    }
                }


            });


            $('#department-list-id').select2({
                templateResult: function(data) {
                    var $result = $('<span><img src="' + $(data.element).data('image') +
                        '" class="rounded-circle h-30 w-30" />  ' + data.text.trim() + '</span>');
                    return $result;
                }
            });

            function addValidationRules() {
                var rules = {};
                var messages = {};

                $('#ticketForm').find(':input').each(function() {
                    var $input = $(this);
                    var name = $input.attr('name');
                    var type = $input.attr('type');
                    var isRequired = $input.prop('required');

                    if (type === 'email') {
                        rules[name] = {
                            required: function (e) {
                                if (isRequired) {
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                            email: true
                        };
                        messages[name] = {
                            required: "Email is required",
                            email: "Please enter a valid email address"
                        };
                    }

                    if (type === 'text') {
                        rules[name] = {
                            required: function (e) {
                                if (isRequired) {
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                        };
                        messages[name] = {
                            required: "This field is required",
                        };
                    }

                    if (type === 'number') {
                        rules[name] = {
                            required: function (e) {
                                if (isRequired) {
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                            number: true
                        };
                        messages[name] = {
                            required: "This field is required",
                        };
                    }

                    if ($input.is('textarea')) {
                        rules[name] = {
                            required: function (e) {
                                if (isRequired) {
                                    return true;
                                }
                            }
                        };
                        messages[name] = {
                            required: "This field is required"
                        };
                    }

                    if ($input.is('select')) {
                        if ($input.prop('multiple')) {
                            rules[name] = {
                                required: true,
                                minlength: 1
                            };
                            messages[name] = "Please select at least one option";
                        } else {
                            rules[name] = "required";
                            messages[name] = "This field is required";
                        }
                    }

                    if ($input.is(':checkbox')) {
                        rules[name] = "required";
                        messages[name] = "This field is required";
                    }

                    if ($input.is(':radio')) {
                        rules[name] = {
                            required: function (e) {
                                if (isRequired) {
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                        };
                        messages[name] = "This field is required";
                    }
                });

                $('#ticketForm').validate().settings.rules = rules;
                $('#ticketForm').validate().settings.messages = messages;
            }

            addValidationRules();

        })(jQuery);
    </script>
@endpush