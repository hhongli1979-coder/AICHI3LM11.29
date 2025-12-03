@extends('admin.layouts.master')
@section('title', __('taxido::static.push_notification.send'))
@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('taxido::static.push_notification.send') }}</h3>
                </div>
            </div>
            <div class="push-notification">
                <div class="row g-sm-4 g-3">
                    <div class="col-xxl-7 col-xl-8">
                        <form action="{{ route('admin.send-notification') }}" id="sendNotificationForm" method="POST"
                            enctype="multipart/form-data">
                            @csrf

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="send_to">{{ __('taxido::static.push_notification.send_to') }}<span>
                                        *</span></label>
                                <div class="col-md-10 error-div select-label-error">
                                    <select class="select-2 form-control" id="send_to" name="send_to"
                                        data-placeholder="{{ __('taxido::static.push_notification.select_notification_send_to') }}">
                                        <option class="select-placeholder" value=""></option>
                                        @foreach (['all_riders' => 'All Riders', 'all_drivers' => 'All Drivers'] as $key => $option)
                                            <option class="option" value="{{ $key }}"
                                                @if (old('type', $pushNotification->type ?? '') == $key) selected @endif>{{ $option }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('send_to')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="image_id">{{ __('taxido::static.push_notification.image') }}</label>
                                <div class="col-md-10">
                                    <x-image :name="'image_id'" :data="isset($pushNotification->image)
                                        ? $pushNotification->image
                                        : old('image_id')" :text="__('taxido::static.push_notification.recommended')"
                                        :multiple="false"></x-image>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="title">{{ __('taxido::static.push_notification.title') }}<span> *</span></label>
                                <div class="col-md-10">
                                    <input class="form-control" type="text" id="title" name="title"
                                        value="{{ old('title') }}"
                                        placeholder="{{ __('taxido::static.push_notification.enter_title') }}" required>
                                    @error('title')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="message">{{ __('taxido::static.push_notification.message') }}</label>
                                <div class="col-md-10">
                                    <textarea class="form-control" placeholder="{{ __('taxido::static.push_notification.enter_message') }}" rows="4"
                                        id="message" name="message" cols="50">{{ old('message') }}</textarea>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2" for="url">{{ __('taxido::static.push_notification.url') }}
                                </label>
                                <div class="col-md-10">
                                    <input class="form-control" id="url" type="url"
                                        placeholder="{{ __('taxido::static.push_notification.enter_url') }}" name="url"
                                        value="{{ old('url') }}">
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-2"
                                    for="status">{{ __('taxido::static.push_notification.schedule') }}
                                </label>
                                <div class="col-md-10">
                                    <div class="editor-space">
                                        <label class="switch">
                                            <input class="form-control" type="hidden" name="schedule" value="0">
                                            <input class="form-check-input" type="checkbox" name="schedule"
                                                id="toggleCheckbox" value="1" @checked(@$pushNotification?->schedule ?? true)>
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

                            <div id="contentDiv"class="form-group row" style="display: none;">
                                <label class="col-md-2"
                                    for="status">{{ __('taxido::static.push_notification.scheduleat') }}
                                </label>
                                <div class="col-md-10">
                                    <input type="datetime-local"
                                        class="form-control @error('schedule_time') is-invalid @enderror" name="scheduleat"
                                        id="datetimeInput"
                                        placeholder="{{ __('taxido::static.rides.select_start_date_and_time') }}"
                                        value="{{ old('schedule_time', @$pushNotification?->schedule_time) }}">
                                </div>
                                {{-- @error('schedule_time')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror --}}
                                </div> 
                            </div>

                            <div class="form-group row">
                                <div class="col-12">
                                    <div class="submit-btn">
                                        <button type="submit" name="save" class="btn btn-solid spinner-btn">
                                            {{ __('taxido::static.push_notification.send') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="col-xxl-5 col-xl-4 text-center">
                        <div class="notification-mobile-box">
                            <div class="notify-main">
                                <img src="{{ asset('/images/notify.png') }}" class="notify-img">
                                <div class="notify-content">
                                    <h2 class="current-time" id="current-time"></h2>
                                    <div class="notify-data">
                                        <div class="message mt-0">
                                            <img id="notify-image" src="{{ asset('images/favicon.svg') }}"
                                                alt="user">
                                            <h5>{{ config('app.name') }}</h5>
                                        </div>

                                        <div class="notify-footer">
                                            <h5 id="notify-title">{{ __('taxido::static.push_notification.title') }}</h5>
                                            <p id="notify-message">
                                                {{ __('taxido::static.push_notification.message_body') }}</p>
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
@endsection

@push('scripts')
    <script type="text/javascript" src="{{ asset('js/flatpickr/time.js') }}"></script>
    <!-- Flatpickr CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">

    <!-- Flatpickr JS -->
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>

    <script>
        (function($) {
            "use strict";

            $('#sendNotificationForm').validate({
                ignore: [],
                rules: {
                    "send_to": "required",
                    "title": "required",
                }
            });

            $('#title').on('change', function() {
                $('#notify-title').text($(this).val());
            });

            $('#message').on('change', function() {
                $('#notify-message').text($(this).val());
            });

            $('#image').on('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        $('#notify-image').attr('src', e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });

        })(jQuery)
    </script>
    <script>
        $(document).ready(function() {
            // Initialize flatpickr with full logic
            const fp = flatpickr("#datetimeInput", {
                enableTime: true,
                dateFormat: "Y-m-d h:i:s",
                minDate: "today",
                time_24hr: false,
                enableSeconds: true,

                onChange: function(selectedDates, dateStr, instance) {

                    const selectedDate = selectedDates[0];
                    const now = new Date();

                    // Default: allow all times
                    instance.set('minTime', "00:00");

                    if (!selectedDate) return;

                    // If selected date is today, restrict time to now or later
                    if (selectedDate.toDateString() === now.toDateString()) {
                        const hours = now.getHours();
                        const minutes = now.getMinutes();
                        const minTime =
                            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

                        instance.set('minTime', minTime);
                    } else {
                        // Future date selected — full time range allowed
                        instance.set('minTime', "00:00");
                    }


                }

            });

            // Checkbox toggle logic
            $('#toggleCheckbox').on('change', function() {
                const datetimeInput = document.getElementById('datetimeInput');
                if ($(this).prop('checked')) {
                    $('#contentDiv').show();
                    datetimeInput.disabled = false;
                } else {
                    console.log('checkbox is not checked');
                    $('#contentDiv').hide();
                    datetimeInput.disabled = true;
                }
            });

            // Trigger change event initially
            $('#toggleCheckbox').trigger('change');
        });
    </script>
@endpush
