@extends('admin.layouts.master')
@section('title', __('Setting'))
@section('content')
<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <div class="contentbox-subtitle">
                <h3>{{ __('static.settings.settings') }}</h3>
            </div>
        </div>
        <div class="card-body">
            <div class="vertical-tabs">
                <div class="row g-xl-5 g-4">
                    <div class="col-xl-4 col-12">
                        <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                            aria-orientation="vertical">
                            <a class="nav-link active" id="v-pills-tabContent" data-bs-toggle="pill"
                                data-bs-target="#general_settings" type="button" role="tab" aria-controls="App_Settings"
                                aria-selected="true">
                                <i class="ri-settings-5-line"></i>{{ __('ticket::static.setting.general') }}
                            </a>
                            <a class="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill"
                                data-bs-target="#Activation_Setting" type="button" role="tab"
                                aria-controls="v-pills-profile" aria-selected="false">
                                <i
                                    class="ri-toggle-line"></i>{{ __('ticket::static.setting.activation_configuration') }}
                            </a>
                            <a class="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill"
                                data-bs-target="#Storage_Setting" type="button" role="tab"
                                aria-controls="v-pills-profile" aria-selected="false">
                                <i
                                    class="ri-database-2-line"></i>{{ __('ticket::static.setting.storage_configuration') }}
                            </a>
                            <a class="nav-link" id="v-pills-messages-tab" data-bs-toggle="pill"
                                data-bs-target="#Email_Setting" type="button" role="tab"
                                aria-controls="v-pills-messages" aria-selected="false">
                                <i class="ri-mail-open-line"></i>{{ __('ticket::static.setting.email_configuration') }}
                            </a>
                            <a class="nav-link" id="v-pills-messages-tab" data-bs-toggle="pill"
                                data-bs-target="#Email_Piping_Setting" type="button" role="tab"
                                aria-controls="v-pills-messages" aria-selected="false">
                                <i
                                    class="ri-mail-open-line"></i>{{ __('ticket::static.setting.email_piping_configuration') }}
                            </a>
                        </div>
                    </div>
                    <div class="col-xxl-7 col-xl-8 col-12 tab-b-left">
                        <form method="POST" class="needs-validation user-add" id="settingsForm"
                            action="{{ route('admin.ticket.setting.update', @$settingId) }}"
                            enctype="multipart/form-data">
                            @csrf @method('PUT')
                            <div class="tab-content w-100" id="v-pills-tabContent">
                                <div class="tab-pane fade show active" id="general_settings" role="tabpanel"
                                    aria-labelledby="app_settings" tabindex="0">
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="ticket_prefix">{{ __('ticket::static.setting.ticket_prefix') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('ticket::static.setting.ticket_prefix_help_text') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="general[ticket_prefix]"
                                                value="{{ $settings['general']['ticket_prefix'] ?? old('ticket_prefix') }}"
                                                placeholder="{{ __('ticket::static.setting.enter_ticket_prefix') }}">
                                            @error('general[ticket_prefix]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="ticket_suffix">{{ __('ticket::static.setting.ticket_suffix') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('ticket::static.setting.ticket_suffix_help_text') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <select class="select-2 form-control select-country"
                                                id="general[ticket_suffix]" name="general[ticket_suffix]">
                                                <option class="select-placeholder" value=""></option>
                                                @forelse (['random' => 'Random Number (e.g., "65734")', 'incremental' => 'Incremental (e.g., "1, 2, 3, 4")'] as $key => $option)
                                                    <option class="option" value={{ $key }} @if ($settings['general']['ticket_suffix'] ?? old('ticket_suffix')) @if ($key == $settings['general']['ticket_suffix']) selected @endif
                                                    @endif>{{ $option }}</option>
                                                @empty
                                                    <option value="" disabled></option>
                                                @endforelse
                                            </select>
                                            @error('general[ticket_suffix]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="ticket_suffix">{{ __('ticket::static.setting.ticket_priority') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('ticket::static.setting.ticket_priority_help_text') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <select class="select-2 form-control" name="general[ticket_priority]">
                                                @foreach ($priorities as $priority)
                                                    <option class="option" value="{{ $priority->id }}" @if ($settings['general']['ticket_priority'] ?? old('ticket_priority'))
                                                        @if ($priority->id == $settings['general']['ticket_priority'])
                                                        selected @endif @endif>{{ $priority->name }}</option>
                                                @endforeach
                                            </select>
                                            @error('general[ticket_suffix]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="Activation_Setting" role="tabpanel"
                                    aria-labelledby="v-pills-profile-tab" tabindex="0">
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="activation[assign_notification_enable]">{{ __('ticket::static.setting.ticket_assign_notification') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('ticket::static.setting.ticket_assign_span') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <div class="editor-space">
                                                <label class="switch">
                                                    @if (isset($settings['activation']['assign_notification_enable']))
                                                        <input class="form-control" type="hidden"
                                                            name="activation[assign_notification_enable]" value="0"> <input
                                                            class="form-check-input" type="checkbox"
                                                            name="activation[assign_notification_enable]" value="1" {{ $settings['activation']['assign_notification_enable'] ? 'checked' : '' }}>
                                                    @else
                                                        <input class="form-control" type="hidden"
                                                            name="activation[assign_notification_enable]" value="0">
                                                        <input class="form-check-input" type="checkbox"
                                                            name="activation[assign_notification_enable]" value="1">
                                                    @endif
                                                    <span class="switch-state"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="activation[assign_notification_enable]">{{ __('ticket::static.setting.ticket_create_notification') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('ticket::static.setting.ticket_create_span') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <div class="editor-space">
                                                <label class="switch">
                                                    @if (isset($settings['activation']['create_notification_enable']))
                                                        <input class="form-control" type="hidden"
                                                            name="activation[create_notification_enable]" value="0">
                                                        <input class="form-check-input" type="checkbox"
                                                            name="activation[create_notification_enable]" value="1" {{ $settings['activation']['create_notification_enable'] ? 'checked' : '' }}>
                                                    @else
                                                        <input class="form-control" type="hidden"
                                                            name="activation[create_notification_enable]" value="0">
                                                        <input class="form-check-input" type="checkbox"
                                                            name="activation[create_notification_enable]" value="1">
                                                    @endif
                                                    <span class="switch-state"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="activation[replied_notification_enable]">{{ __('ticket::static.setting.ticket_replied_notification') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('ticket::static.setting.ticket_replied_span') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <div class="editor-space">
                                                <label class="switch">
                                                    @if (isset($settings['activation']['replied_notification_enable']))
                                                        <input class="form-control" type="hidden"
                                                            name="activation[replied_notification_enable]" value="0">
                                                        <input class="form-check-input" type="checkbox"
                                                            name="activation[replied_notification_enable]" value="1" {{ $settings['activation']['replied_notification_enable'] ? 'checked' : '' }}>
                                                    @else
                                                        <input class="form-control" type="hidden"
                                                            name="activation[replied_notification_enable]" value="0">
                                                        <input class="form-check-input" type="checkbox"
                                                            name="activation[replied_notification_enable]" value="1">
                                                    @endif
                                                    <span class="switch-state"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="activation[status_notification_enable]">{{ __('ticket::static.setting.ticket_statuses_notification') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('ticket::static.setting.ticket_statuses_span') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <div class="editor-space">
                                                <label class="switch">
                                                    @if (isset($settings['activation']['status_notification_enable']))
                                                        <input class="form-control" type="hidden"
                                                            name="activation[status_notification_enable]" value="0">
                                                        <input class="form-check-input" type="checkbox"
                                                            name="activation[status_notification_enable]" value="1" {{ $settings['activation']['status_notification_enable'] ? 'checked' : '' }}>
                                                    @else
                                                        <input class="form-control" type="hidden"
                                                            name="activation[status_notification_enable]" value="0">
                                                        <input class="form-check-input" type="checkbox"
                                                            name="activation[status_notification_enable]" value="1">
                                                    @endif
                                                    <span class="switch-state"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="activation[ticket_recaptcha_enable]">{{ __('ticket::static.setting.ticket_recaptcha_activation') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('ticket::static.setting.ticket_recaptcha_span') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <div class="editor-space">
                                                <label class="switch">
                                                    @if (isset($settings['activation']['ticket_recaptcha_enable']))
                                                        <input class="form-control" type="hidden"
                                                            name="activation[ticket_recaptcha_enable]" value="0">
                                                        <input class="form-check-input" type="checkbox"
                                                            name="activation[ticket_recaptcha_enable]" value="1" {{ $settings['activation']['ticket_recaptcha_enable'] ? 'checked' : '' }}>
                                                    @else
                                                        <input class="form-control" type="hidden"
                                                            name="activation[ticket_recaptcha_enable]" value="0">
                                                        <input class="form-check-input" type="checkbox"
                                                            name="activation[ticket_recaptcha_enable]" value="1">
                                                    @endif
                                                    <span class="switch-state"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="Storage_Setting" role="tabpanel"
                                    aria-labelledby="v-pills-profile-tab" tabindex="0">
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="supported_file_types">{{ __('ticket::static.setting.supported_file_types') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('ticket::static.setting.file_upload_type_help_text') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <select class="form-control select-file-type" id=""
                                                name="storage_configuration[supported_file_types][]"
                                                multiple="multiple">
                                                <option class="select-placeholder" value=""></option>
                                                @forelse (['pdf' => 'pdf', 'csv' => 'csv', 'doc' => 'doc', 'docx' => 'docx', 'jpg' => 'jpg', 'jpeg' => 'jpeg', 'png' => 'png', 'zip' => 'zip'] as $key => $option)
                                                    <option class="option" value={{ $key }} @if (in_array($key, $settings['storage_configuration']['supported_file_types'] ?? []))
                                                    selected @endif>
                                                        {{ $option }}
                                                    </option>
                                                @empty
                                                    <option value="" disabled></option>
                                                @endforelse
                                            </select>
                                            @error('storage_configuration[ticket_suffix]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="max_file_upload">{{ __('ticket::static.setting.max_file_upload') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('ticket::static.setting.max_file_upload_help_text') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="number" min="1"
                                                name="storage_configuration[max_file_upload]"
                                                value="{{ $settings['storage_configuration']['max_file_upload'] ?? old('max_file_upload') }}"
                                                placeholder="{{ __('ticket::static.setting.enter_max_file_upload') }}">
                                            @error('storage_configuration[max_file_upload]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="max_file_upload_size">{{ __('ticket::static.setting.max_file_upload_size') }}
                                            <i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                data-bs-title="{{ __('ticket::static.setting.max_file_upload_size_help_text') }}"></i>
                                        </label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="number" min="100"
                                                name="storage_configuration[max_file_upload_size]"
                                                value="{{ $settings['storage_configuration']['max_file_upload_size'] ?? old('max_file_upload_size') }}"
                                                placeholder="{{ __('ticket::static.setting.enter_max_file_upload_size') }}">
                                            @error('storage_configuration[max_file_upload_size]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="Email_Setting" role="tabpanel"
                                    aria-labelledby="v-pills-settings-tab" tabindex="0">
                                    <div class="form-group row">
                                        <label for="country" class="col-md-2">{{ __('static.settings.mailer') }}</label>
                                        <div class="col-md-10 error-div select-dropdown">
                                            <select class="select-2 form-control select-country" id="email[mail_mailer]"
                                                name="email[mail_mailer]"
                                                data-placeholder="{{ __('static.settings.select_mail_mailer') }}">
                                                <option class="select-placeholder" value=""></option>
                                                @forelse (['smtp' => 'SMTP', 'sendmail' => 'Sendmail'] as $key => $option)
                                                    <option class="option" value={{ $key }} @if ($settings['email']['mail_mailer'] ?? old('mail_mailer')) @if ($key == $settings['email']['mail_mailer']) selected @endif @endif>
                                                        {{ $option }}</option>
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
                                        <label class="col-md-2" for="mail_host">{{ __('static.settings.host') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="email[mail_host]"
                                                id="email[mail_host]"
                                                value="{{ isset($settings['email']['mail_host']) ? $settings['email']['mail_host'] : old('mail_host') }}"
                                                placeholder="{{ __('static.settings.enter_host') }}">
                                            @error('email[mail_host]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2" for="mail_port">{{ __('static.settings.port') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="number" min="1" name="email[mail_port]"
                                                id="email[mail_port]"
                                                value="{{ isset($settings['email']['mail_port']) ? $settings['email']['mail_port'] : old('mail_host') }}"
                                                placeholder="{{ __('static.settings.enter_port') }}">
                                            @error('mail_port')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="country"
                                            class="col-md-2">{{ __('static.settings.mail_encryption') }}</label>
                                        <div class="col-md-10 error-div select-dropdown">
                                            <select class="select-2 form-control select-country"
                                                id="email[mail_encryption]" name="email[mail_encryption]"
                                                data-placeholder="{{ __('static.settings.select_mail_encryption') }}">
                                                <option class="select-placeholder" value=""></option>
                                                @forelse (['tls' => 'TLS', 'ssl' => 'SSL'] as $key => $option)
                                                    <option class="option" value={{ $key }} @if ($settings['email']['mail_encryption'] ?? old('mail_encryption'))
                                                        @if ($key == $settings['email']['mail_encryption']) selected @endif
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
                                            for="mail_username">{{ __('static.settings.mail_username') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="email[mail_username]"
                                                id="email[mail_username]"
                                                value="{{ isset($settings['email']['mail_username']) ? $settings['email']['mail_username'] : old('mail_username') }}"
                                                placeholder="{{ __('static.settings.enter_username') }}">
                                            @error('mail_username')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="password">{{ __('static.settings.mail_password') }}<span>
                                                *</span></label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password" data-type="password"
                                                name="email[mail_password]" id="email[mail_password]"
                                                value="{{ encryptKey(isset($settings['email']['mail_password']) ? $settings['email']['mail_password'] : old('mail_password')) }}"
                                                placeholder="{{ __('static.settings.enter_password') }}">
                                            @error('mail_password')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="mail_from_name">{{ __('static.settings.mail_from_name') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="email[mail_from_name]"
                                                id="email[mail_from_name]"
                                                value="{{ isset($settings['email']['mail_from_name']) ? $settings['email']['mail_from_name'] : old('mail_from_name') }}"
                                                placeholder="{{ __('static.settings.enter_email_from_name') }}">
                                            @error('mail_from_name')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="mail_from_address">{{ __('static.settings.mail_from_address') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="email[mail_from_address]"
                                                id="email[mail_from_address]"
                                                value="{{ isset($settings['email']['mail_from_address']) ? $settings['email']['mail_from_address'] : old('mail_from_address') }}"
                                                placeholder="{{ __('static.settings.enter_email_from_address') }}">
                                            @error('mail_from_address')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <hr>
                                    <h4 class="fw-semibold mb-3 text-primary w-100">
                                        {{ __('static.settings.test_mail') }}
                                    </h4>
                                    <div class="form-group row">
                                        <label class="col-md-2" for="mail">{{ __('static.settings.to_mail') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="mail" id="mail"
                                                placeholder="{{ __('static.enter_email') }}">
                                            @error('mail')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>

                                    <button id="send-test-mail" name="test_mail" class="btn btn-primary">
                                        {{ __('static.settings.send_test_mail') }}
                                    </button>

                                    <div class="instruction-box">
                                        <div class="instruction-title">
                                            <h4>{{ __('static.settings.instruction') }}</h4>
                                            <p>
                                                {{ __('static.settings.test_mail_note') }}
                                            </p>
                                        </div>
                                        <div class="list-box">
                                            <h5>{{ __('static.settings.test_mail_not_using_ssl') }}</h5>
                                            <ul>
                                                <li>{{ __('static.settings.test_mail_not_ssl_msg_1') }}</li>
                                                <li>{{ __('static.settings.test_mail_not_ssl_msg_2') }}</li>
                                                <li>{{ __('static.settings.test_mail_not_ssl_msg_3') }}</li>
                                                <li>{{ __('static.settings.test_mail_not_ssl_msg_4') }}</li>
                                            </ul>
                                        </div>
                                        <div class="list-box">

                                            <h5>{{ __('static.settings.test_mail_using_ssl') }}</h5>
                                            <ul>
                                                <li>{{ __('static.settings.test_mail_ssl_msg_1') }}</li>
                                                <li>{{ __('static.settings.test_mail_ssl_msg_2') }}</li>
                                                <li>{{ __('static.settings.test_mail_ssl_msg_3') }}</li>
                                                <li>{{ __('static.settings.test_mail_ssl_msg_4') }}</li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                                <div class="tab-pane fade" id="Email_Piping_Setting" role="tabpanel"
                                    aria-labelledby="v-pills-settings-tab" tabindex="0">
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="mail_host">{{ __('ticket::static.setting.imap_host') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="email_piping[mail_host]"
                                                id="email_piping[mail_host]"
                                                value="{{ isset($settings['email_piping']['mail_host']) ? $settings['email_piping']['mail_host'] : old('mail_host') }}"
                                                placeholder="{{ __('static.settings.enter_host') }}">
                                            @error('email_piping[mail_host]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="mail_port">{{ __('ticket::static.setting.imap_port') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="number" min="1"
                                                name="email_piping[mail_port]" id="email_piping[mail_port]"
                                                value="{{ isset($settings['email_piping']['mail_port']) ? $settings['email_piping']['mail_port'] : old('mail_host') }}"
                                                placeholder="{{ __('static.settings.enter_port') }}">
                                            @error('email_piping[mail_port]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="country"
                                            class="col-md-2">{{ __('ticket::static.setting.imap_mail_encryption') }}</label>
                                        <div class="col-md-10 error-div select-dropdown">
                                            <select class="select-2 form-control select-country"
                                                id="email_piping[mail_encryption]" name="email_piping[mail_encryption]"
                                                data-placeholder="{{ __('static.settings.select_mail_encryption') }}">
                                                <option class="select-placeholder" value=""></option>
                                                @forelse (['tls' => 'TLS', 'ssl' => 'SSL'] as $key => $option)
                                                    <option class="option" value={{ $key }} @if ($settings['email_piping']['mail_encryption'] ?? old('mail_encryption')) @if ($key == $settings['email_piping']['mail_encryption']) selected @endif
                                                    @endif>{{ $option }}</option>
                                                @empty
                                                    <option value="" disabled></option>
                                                @endforelse
                                            </select>
                                            @error('email_piping[mail_encryption]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="mail_username">{{ __('ticket::static.setting.imap_mail_username') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="email_piping[mail_username]"
                                                id="email_piping[mail_username]"
                                                value="{{ isset($settings['email_piping']['mail_username']) ? $settings['email_piping']['mail_username'] : old('mail_username') }}"
                                                placeholder="{{ __('static.settings.enter_username') }}">
                                            @error('email_piping[mail_username]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="password">{{ __('ticket::static.setting.imap_mail_password') }}<span>
                                                *</span></label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="password" data-type="password"
                                                name="email_piping[mail_password]" id="email_piping[mail_password]"
                                                value="{{ encryptKey(isset($settings['email_piping']['mail_password']) ? $settings['email_piping']['mail_password'] : old('mail_password')) }}"
                                                placeholder="{{ __('static.settings.enter_password') }}">
                                            @error('email_piping[mail_password]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2"
                                            for="mail_protocol">{{ __('ticket::static.setting.imap_protocol') }}</label>
                                        <div class="col-md-10">
                                            <input class="form-control" type="text" name="email_piping[mail_protocol]"
                                                id="email_piping[mail_protocol]"
                                                value="{{ isset($settings['email_piping']['mail_protocol']) ? $settings['email_piping']['mail_protocol'] : old('mail_protocol') }}"
                                                placeholder="{{ __('ticket::static.setting.enter_imap_protocol') }}">
                                            @error('email_piping[mail_protocol]')
                                                <span class="invalid-feedback d-block" role="alert">
                                                    <strong>{{ $message }}</strong>
                                                </span>
                                            @enderror
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="instruction-box">
                                        <div class="instruction-title">
                                            <h4>{{ __('static.settings.instruction') }}</h4>
                                            <p>
                                                {{ __('static.settings.test_mail_note') }}
                                            </p>
                                        </div>
                                        <div class="list-box">
                                            <h5>{{ __('static.settings.test_mail_not_using_ssl') }}</h5>
                                            <ul>
                                                <li>{{ __('static.settings.test_mail_not_ssl_msg_1') }}</li>
                                                <li>{{ __('static.settings.test_mail_not_ssl_msg_2') }}</li>
                                                <li>{{ __('static.settings.test_mail_not_ssl_msg_3') }}</li>
                                                <li>{{ __('static.settings.test_mail_not_ssl_msg_4') }}</li>
                                            </ul>
                                        </div>
                                        <div class="list-box">

                                            <h5>{{ __('static.settings.test_mail_using_ssl') }}</h5>
                                            <ul>
                                                <li>{{ __('static.settings.test_mail_ssl_msg_1') }}</li>
                                                <li>{{ __('static.settings.test_mail_ssl_msg_2') }}</li>
                                                <li>{{ __('static.settings.test_mail_ssl_msg_3') }}</li>
                                                <li>{{ __('static.settings.test_mail_ssl_msg_4') }}</li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                                <button type="submit"
                                    class="btn btn-primary spinner-btn"><i class="ri-save-line text-white lh-1"></i>{{ __('static.save') }}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
    <script>
        (function ($) {
            "use strict";
            $(document).ready(function () {

                $('#send-test-mail').click(function (e) {
                    e.preventDefault();

                    var form = $('#settingsForm');
                    var url = form.attr('action');
                    var formData = form.serializeArray();
                    var additionalData = {
                        test_mail: 'true',
                    };

                    $.each(additionalData, function (key, value) {
                        formData.push({
                            name: key,
                            value: value
                        });
                    });

                    $.ajax({
                        type: "POST",
                        url: url,
                        data: formData,
                        success: function (response) {
                            let obj = JSON.parse(response);
                            console.log(obj);
                            if (obj.success == true) {
                                toastr.success(obj.message);
                            } else {
                                toastr.error(obj.message);
                            }
                        },
                        error: function (response) {
                            obj = JSON.parse(response);
                            console.log(obj);
                            toastr.error(obj.message, 'Error');
                        }
                    });
                });

            });
        })(jQuery);
    </script>
@endpush

@push('scripts')
    <script>
        (function ($) {
            "use strict";
            $(document).ready(function () {
                $('.select-file-type').select2({

                });
            });
        })(jQuery);
    </script>
@endpush