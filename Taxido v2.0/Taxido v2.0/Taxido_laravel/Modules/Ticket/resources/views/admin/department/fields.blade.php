<div class="row">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($department) ? __('ticket::static.department.edit') : __('ticket::static.department.add') }}
                        </h3>
                    </div>
                    @isset($department)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('ticket::static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route('admin.department.edit', ['department' => $department->id, 'locale' => $lang->locale]) }}"
                                                class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                target="_blank"><img
                                                    src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                    alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                                    class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route('admin.department.edit', ['department' => $department->id, 'locale' => Session::get('locale', 'en')]) }}"
                                                class="language-switcher active" target="blank"><img
                                                    src="{{ asset('admin/images/flags/LR.png') }}" alt="">English<i
                                                    class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @endforelse
                                </ul>
                            </div>
                        </div>
                    @endisset
                    <input type="hidden" name="locale" value="{{ request('locale') }}">
                    <div class="form-group row">
                        <label class="col-md-2"
                            for="department_image_id">{{ __('ticket::static.department.image') }}</label>
                        <div class="col-md-10">
                            <div class="form-group">
                                <x-image :name="'department_image_id'" :data="isset($department->department_image)
                                    ? $department?->department_image
                                    : old('department_image_id')" :text="' '"
                                    :multiple="false"></x-image>
                                @error('department_image_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2"
                            for="name">{{ __('ticket::static.department.name') }}<span>*</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <input class="form-control" type="text" name="name" id="name"
                                    value="{{ isset($department->name) ? $department->getTranslation('name', request('locale', app()->getLocale())) : old('name') }}"
                                    placeholder="{{ __('ticket::static.department.enter_name') }} ({{ request('locale', app()->getLocale()) }})"
                                    required>
                                <i class="ri-file-copy-line copy-icon" data-target="#name"></i>
                            </div>
                            @error('name')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2"
                            for="description">{{ __('ticket::static.department.description') }}</label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <textarea class="form-control content" name="description" id="description"
                                    placeholder="{{ __('ticket::static.department.enter_description') }} ({{ request('locale', app()->getLocale()) }})">
                                    {{ isset($department->description) ? $department->getTranslation('description', request('locale', app()->getLocale())) : old('description') }}
                                </textarea>
                                <i class="ri-file-copy-line copy-icon" data-target="#description"></i>
                            </div>
                            @error('description')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="user_ids">{{ __('ticket::static.department.user') }}<span>
                                *</span></label>
                        <div class="col-md-10 select-label-error">
                            <span class="text-gray mt-1">
                                {{ __('ticket::static.department.no_users_message') }}
                                <a href="{{ @route('admin.executive.index') }}" class="text-primary">
                                    <b>{{ __('ticket::static.here') }}</b>
                                </a>
                            </span>
                            <select class="select-2 form-control" name="user_ids[]" data-placeholder="{{ __('ticket::static.department.select_user') }}"
                                multiple>
                                @foreach ($users as $user)
                                    <option class="option" value="{{ $user->id }}"
                                        @if (@$department?->assigned_executives) @if (in_array($user->id, $department?->assigned_executives->pluck('id')->toArray()))
                                            selected @endif
                                        @endif
                                        >{{ $user->name }}</option>
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
                        <label class="col-md-2"
                            for="imap_default_account">{{ __('ticket::static.department.default_account') }}<span>
                                *</span></label>
                        <div class="col-md-10 select-label-error">
                            <select class="select-2 form-control" name="imap_default_account" id="imap_default_account"
                                data-placeholder="{{ __('ticket::static.department.select_account') }}">
                                <option class="select-placeholder" value=""></option>
                                <option class="option" value="default"
                                    @if (isset($department)) @if ($department->imap_credentials['imap_default_account'] == 'default')
                                    selected @endif
                                    @endif>{{ __('ticket::static.department.default') }}
                                </option>
                                <option class="option" value="custom"
                                    @if (isset($department)) @if ($department->imap_credentials['imap_default_account'] == 'custom')
                                    selected @endif
                                    @endif>{{ __('ticket::static.department.custom') }}
                                </option>
                            </select>
                            @error('imap_default_account')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="imap-credentials">
                        <div class="form-group row">
                            <label class="col-md-2" for="imap_host">{{ __('ticket::static.department.host') }}<span>
                                    *</span></label>
                            <div class="col-md-10">
                                <input class="form-control" type="text" name="imap_host"
                                    value="{{ isset($department->imap_credentials['imap_host']) ? $department->imap_credentials['imap_host'] : old('imap_host') }}"
                                    placeholder="{{ __('ticket::static.department.enter_imap_host') }}" required>
                                @error('imap_host')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                       <div class="form-group row">
                            <label class="col-md-2" for="imap_port">{{ __('ticket::static.department.port') }}<span>
                                    *</span></label>
                            <div class="col-md-10">
                                <input class="form-control" type="number" name="imap_port"
                                    value="{{ isset($department->imap_credentials['imap_port']) ? $department->imap_credentials['imap_port'] : old('imap_port') }}"
                                    placeholder="{{ __('ticket::static.department.enter_imap_port') }}" required>
                                @error('imap_port')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="imap_encryption"
                                class="col-md-2">{{ __('ticket::static.department.encryption') }}<span>
                                    *</span></label>
                            <div class="col-md-10 select-dropdown">
                                <select class="select-2 form-control" name="imap_encryption" id="imap_encryption"
                                    data-placeholder="{{ __('ticket::static.department.select_imap_encryption') }}">
                                    <option class="select-placeholder" value=""></option>
                                    @forelse (['tls' => 'TLS', 'ssl' => 'SSL'] as $key => $option)
                                        <option class="option" value={{ $key }}
                                            @if (isset($department)) @if ($department->imap_credentials['imap_encryption'] == $key)
                                            selected @endif
                                            @endif>{{ $option }}</option>
                                        @empty
                                            <option value="" disabled></option>
                                        @endforelse
                                    </select>
                                    @error('mode')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="imap_username">{{ __('ticket::static.department.username') }}<span>
                                        *</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text" name="imap_username"
                                        value="{{ isset($department->imap_credentials['imap_username']) ? $department->imap_credentials['imap_username'] : old('imap_username') }}"
                                        placeholder="{{ __('ticket::static.department.enter_imap_username') }}" required>
                                    @error('imap_username')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="imap_password">{{ __('ticket::static.department.password') }}<span>
                                        *</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="password" name="imap_password"
                                        value="{{ isset($department->imap_credentials['imap_password']) ? $department->imap_credentials['imap_password'] : old('imap_password') }}"
                                        placeholder="{{ __('ticket::static.department.enter_imap_password') }}" required>
                                    @error('imap_password')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="imap_protocol">{{ __('ticket::static.department.protocol') }}<span>
                                        *</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text" name="imap_protocol"
                                        value="{{ isset($department->imap_credentials['imap_protocol']) ? $department->imap_credentials['imap_protocol'] : old('imap_protocol') }}"
                                        placeholder="{{ __('ticket::static.department.enter_imap_protocol') }}" required>
                                    @error('imap_protocol')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group row mt-4">
                            <label class="col-md-2" for="status">{{ __('ticket::static.department.status') }}</label>
                            <div class="col-md-10">
                                <div class="editor-space">
                                    <label class="switch">
                                        <input class="form-control" type="hidden" name="status" value="0">
                                        <input class="form-check-input" type="checkbox" name="status" id=""
                                            value="1" @checked(@$department?->status ?? true)>
                                        <span class="switch-state"></span>
                                    </label>
                                </div>
                                @error('status')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-12">
                                <div class="submit-btn">
                                    <button type="submit" name="save" class="btn btn-solid spinner-btn">
                                        <i class="ri-save-line text-white lh-1"></i> {{ __('static.save') }}
                                    </button>
                                    <button type="submit" name="save_and_exit" class="btn btn-solid spinner-btn spinner-btn">
                                        <i
                                            class="ri-expand-left-line text-white lh-1"></i>{{ __('static.save_and_exit') }}
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

                $(document).ready(function() {

                    $('.imap-credentials').hide();

                    $(document).on('change', '#imap_default_account', function(e) {
                        e.preventDefault();

                        var account = $(this).val();
                        if (account == 'custom') {
                            $('.imap-credentials').show();
                            $('#departmentForm').validate().valid();
                        } else {
                            $('.imap-credentials').hide();
                        }
                    });

                    $('#departmentForm').validate({
                        ignore: [],
                        rules: {
                            "name": "required",
                            "user_ids[]": {
                                required: function(element) {
                                    return $(element).val().length == 0;
                                }
                            },
                            "imap_default_account": {
                                required: function(element) {
                                    return $(element).val().length == 0;
                                }
                            },
                            "imap_encryption": {
                                required: function(element) {
                                    return $('#imap_default_account').val() === 'custom';
                                }
                            },
                            "imap_host": {
                                required: function(element) {
                                    return $('#imap_default_account').val() === 'custom';
                                }
                            },
                            "imap_port": {
                                required: function(element) {
                                    return $('#imap_default_account').val() === 'custom';
                                }
                            },
                            "imap_username": {
                                required: function(element) {
                                    return $('#imap_default_account').val() === 'custom';
                                }
                            },
                            "imap_password": {
                                required: function(element) {
                                    return $('#imap_default_account').val() === 'custom';
                                }
                            },
                            "imap_protocol": {
                                required: function(element) {
                                    return $('#imap_default_account').val() === 'custom';
                                }
                            }
                        },
                        messages: {
                            imap_encryption: {
                                required: "Select IMAP Encryption"
                            }
                        },
                    });
                });
            })(jQuery);
        </script>
    @endpush
