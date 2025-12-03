@extends('front.layouts.master')
@section('title', __('taxido::front.login'))
@section('content')
@php
$cabSettings = getSettings();
@endphp
<section class="authentication-section section-b-space">
    <div class="container">
        <div class="auth-form-box">
            <div class="row align-items-center">
                <div class="col-xl-7 col-lg-6 d-lg-block d-none">
                    <img src="{{ asset('images/authentication-img.png') }}" class="img-fluid auth-image">
                </div>
                <div class="col-xl-5 col-lg-6">
                    <div class="auth-right-box">
                        <h3>{{ __('taxido::front.welcome_to', ['app_name' => env('APP_NAME')]) }}</h3>
                        <h6>{{ __('taxido::front.account_information') }}</h6>
                        <form method="POST" id="loginForm">
                            @csrf
                            <div class="form-box">
                                <div class="number-mail-box">
                                    <div class="country-code-section" style="display: block;">
                                        <select class="select-2 form-control select-country-code" id="select-country-code" name="country_code" required>
                                            @foreach (getCountryCodes() as $option)
                                            <option class="option" value="{{ $option->calling_code }}"
                                                data-image="{{ asset('images/flags/' . $option->flag) }}"
                                                @selected($option->calling_code == old('country_code', rideCountryCode() ?? 1))>
                                                {{ $option->calling_code }}
                                            </option>
                                            @endforeach
                                        </select>
                                    </div>
                                    @error('country_code')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                    <div class="col-sm-12-full">
                                        <input type="number" class="form-control" name="email_or_phone" id="email_or_phone"
                                            placeholder="{{ __('taxido::front.enter_phone_number') }}" value="{{ old('email_or_phone') }}">
                                    </div>
                                    @error('email_or_phone')
                                    <span class="text-danger">{{ $message }}</span>
                                    @enderror
                                </div>
                                <div class="mt-sm-4 mt-3" id="otp-code" style="display: none;">
                                    <div class="otp-inputs">
                                        {{-- <input class="form-control" type="number" name="otp" id="verification-code"
                                            placeholder="0" maxlength="1">
                                        <input class="form-control" type="number" name="otp" id="verification-code"
                                            placeholder="0" maxlength="2">
                                        <input class="form-control" type="number" name="otp" id="verification-code"
                                            placeholder="0" maxlength="3">
                                        <input class="form-control" type="number" name="otp" id="verification-code"
                                            placeholder="0" maxlength="4">
                                        <input class="form-control" type="number" name="otp" id="verification-code"
                                            placeholder="0" maxlength="6">
                                        <input class="form-control" type="number" name="otp" id="verification-code"
                                            placeholder="0" maxlength="6">     --}}
                                        <input type="text" class="form-control otp-field otp__field__1" maxlength="1" name="otp[]" pattern="[0-9]{1}" oninput="handleInput(1, event)" onkeydown="handleBackspace(1, event)" autofocus>
                                        <input type="text" class="form-control otp-field otp__field__2" maxlength="1" name="otp[]" pattern="[0-9]{1}" oninput="handleInput(2, event)" onkeydown="handleBackspace(2, event)" disabled>
                                        <input type="text" class="form-control otp-field otp__field__3" maxlength="1" name="otp[]" pattern="[0-9]{1}" oninput="handleInput(3, event)" onkeydown="handleBackspace(3, event)" disabled>
                                        <input type="text" class="form-control otp-field otp__field__4" maxlength="1" name="otp[]" pattern="[0-9]{1}" oninput="handleInput(4, event)" onkeydown="handleBackspace(4, event)" disabled>
                                        <input type="text" class="form-control otp-field otp__field__5" maxlength="1" name="otp[]" pattern="[0-9]{1}" oninput="handleInput(5, event)" onkeydown="handleBackspace(5, event)" disabled>
                                        <input type="text" class="form-control otp-field otp__field__6" maxlength="1" name="otp[]" pattern="[0-9]{1}" oninput="handleInput(6, event)" onkeydown="handleBackspace(6, event)" disabled>
                                    </div>
                                    {{-- <input class="form-control" type="number" name="otp" id="verification-code"
                                        placeholder="{{ __('taxido::front.enter_otp') }}" maxlength="6"> --}}
                                    @error('otp')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                </div>
                            </div>

                            <button type="button" class="btn gradient-bg-color otp-btn" id="generate_otp">
                                {{ __('taxido::front.send_otp') }}
                            </button>

                            <button type="button" class="btn gradient-bg-color otp-btn verifyBtn" id="verify_otp" style="display: none;">
                                {{ __('taxido::front.verify') }}
                            </button>

                            <div class="or-box">
                                <span>{{ __('taxido::front.login_with') }}</span>
                            </div>

                            @isset($settings['activation']['default_credentials'])
                                @if ((int) $settings['activation']['default_credentials'])
                                <div class="demo-credential">
                                <button type="button" class="btn btn-outline default-credentials guest-btn" data-email="0123456789">
                                    <span><i class="ri-user-3-fill"></i></span>
                                    {{ __('taxido::front.demo_user') }}
                                </button>
                                </div>
                                @endif
                            @endisset

                            <h6 class="new-account">{{ __('taxido::front.don’t_have_account') }}
                                <a href="{{ route('front.cab.register.index') }}">{{ __('taxido::front.sign_up') }}</a>
                            </h6>

                            <div id="recaptcha-container"></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.20.0/dist/jquery.validate.min.js"></script>
<script>
    $(document).ready(function() {
        $('#select-country-code').select2({
            templateResult: function (data) {
                if (!data.id) return data.text;

                const imageUrl = $(data.element).data('image');
                const $result = $(`
                    <span>
                        <img src="${imageUrl}" class="flag-img" onerror="this.onerror=null;this.src='{{ asset('front/images/placeholder/49x37.png') }}';" />
                        + ${data.text.trim()}
                    </span>
                `);
                return $result;
            },
            templateSelection: function (data) {
                if (!data.id) return data.text;

                const imageUrl = $(data.element).data('image');
                const $result = $(`
                    <span>
                        <img src="${imageUrl}" class="flag-img" onerror="this.onerror=null;this.src='{{ asset('front/images/placeholder/49x37.png') }}';" />
                        + ${data.text.trim()}
                    </span>
                `);
                return $result;
            },
            escapeMarkup: function (m) { return m; }
        });

        let isNumber = false;
        $('#email_or_phone').on('input', function() {
            const value = $(this).val();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9]{7,15}$/;

            if (emailRegex.test(value)) {
                // $('.country-code-section').hide();
                // $('.col-sm-9').addClass('col-sm-12-full');
                isNumber = false;
            } else if (phoneRegex.test(value)) {
                // $('.country-code-section').show();
                // $('.col-sm-9').removeClass('col-sm-12-full');
                isNumber = true;
            } else {
                // $('.country-code-section').hide();
                // $('.col-sm-9').addClass('col-sm-12-full');
                isNumber = false;
            }
        });

        $("#loginForm").validate({
            ignore: [],
            rules: {
                country_code: {
                    required: function() {
                        return isNumber;
                    }
                },
                email_or_phone: {
                    required: true,
                    minlength: 6,
                    maxlength: 15
                },
                otp: {
                    required: function () {
                        return $('#otp-code').is(':visible');
                    },
                    minlength: 6,
                    maxlength: 6
                }
            },
            messages: {
                email_or_phone: {
                    required: "Please enter email or phone number"
                },
                otp: {
                    required: "Please enter OTP",
                    minlength: "OTP must be 6 digits",
                    maxlength: "OTP must be 6 digits"
                }
            }
        });

        $(".default-credentials").click(function() {
            $("#email_or_phone").val("");
            var email = $(this).data("email");
            $("#email_or_phone").val(email);
            $('.country-code-section').show();
            $('.col-sm-9').addClass('col-sm-12-full');
        });
    });
</script>
<script type="module">
    import {
        initializeApp
    } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
    import {
        getAuth,
        signInWithEmailAndPassword,
        sendSignInLinkToEmail,
        signInWithPhoneNumber,
        RecaptchaVerifier
    } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

    const firebaseConfig = {
        apiKey: "{{ env('FIREBASE_API_KEY') }}",
        authDomain: "{{ env('FIREBASE_AUTH_DOMAIN') }}",
        projectId: "{{ env('FIREBASE_PROJECT_ID') }}",
        storageBucket: "{{ env('FIREBASE_STORAGE_BUCKET') }}",
        messagingSenderId: "{{ env('FIREBASE_SENDER_ID') }}",
        appId: "{{ env('FIREBASE_APP_ID') }}",
        measurementId: "{{ env('FIREBASE_MEASUREMENT_ID') }}"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    let confirmationResult;

    $(document).ready(function() {
        try {
            if (!$('#recaptcha-container').length) {
                $('body').append('<div id="recaptcha-container"></div>');
            }

            const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': function(response) {
                    console.log('reCAPTCHA solved:', response);
                }
            });

            $('#generate_otp').click(function() {
                const input = $('#email_or_phone').val();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const isEmail = emailRegex.test(input);
                if (!$("#loginForm").valid()) return;

                $(this).prop('disabled', true).append('<span class="spinner-border spinner-border-sm ms-2 spinner_loader"></span>');

                if (isEmail) {
                    const actionCodeSettings = {
                        url: window.location.origin + '/auth/firebase/callback',
                        handleCodeInApp: true
                    };

                    sendSignInLinkToEmail(auth, input, actionCodeSettings)
                        .then(() => {
                            toastr.success('Login link sent to your email!');
                            $('#generate_otp').hide();
                            $('#select-country-code').prop('disabled', true);
                            $('#email_or_phone').attr('readonly', true);
                            $('#otp-code').show();
                            $('#verify_otp').show();
                        })
                        .catch((error) => {
                            console.error('Email link error:', error);
                            toastr.error('Error: ' + error.message);
                        })
                        .finally(() => {
                            $('#generate_otp').prop('disabled', false).find('.spinner_loader').remove();
                        });
                } else {
                    const phoneNumber = '+' + $('#select-country-code').val() + input;
                    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
                        .then((result) => {
                            confirmationResult = result;
                            toastr.success("{{ __('taxido::front.otp_sent_in_phone') }}");
                            $('#otp-code').val('');
                            $('#select-country-code').prop('disabled', true);
                            $('#email_or_phone').attr('readonly', true);
                            $('#generate_otp').hide();
                            $('#otp-code').show();
                            $('#verify_otp').show();
                        })
                        .catch((error) => {
                            console.error('Phone OTP error:', error);
                            toastr.error('Error: ' + error.message);
                        })
                        .finally(() => {
                            $('#generate_otp').prop('disabled', false).find('.spinner_loader').remove();
                        });
                }
            });

            $('#verify_otp').click(function() {
                if (!$("#loginForm").valid()) return;

                const code = Array.from(document.querySelectorAll('.otp-field'))
                .map(input => input.value)
                .join('');

                const input = $('#email_or_phone').val();
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

                $(this).prop('disabled', true).append('<span class="spinner-border spinner-border-sm ms-2 spinner_loader"></span>');

                if (isEmail) {
                    toastr.info('Please check your email for the login link');
                } else {
                    if (!confirmationResult) {
                        toastr.error("{{ __('taxido::front.request_otp') }}");
                        return;
                    }

                    confirmationResult.confirm(code)
                        .then((result) => {
                            const user = result.user;
                            const credentials = {
                                _token: $('meta[name="csrf-token"]').attr('content'),
                                email_or_phone: input,
                                country_code: $('#select-country-code').val(),
                                firebase_uid: user.uid
                            };

                            $.ajax({
                                url: "{{ route('front.cab.firebase.verify-otp') }}",
                                method: 'POST',
                                data: credentials,
                                success: function(response) {
                                    if (response.success) {
                                        toastr.success(response.message);
                                        window.location.href = response.redirect;
                                    } else {
                                        toastr.error(response.message);
                                    }
                                },
                                error: function(xhr) {
                                    toastr.error(xhr.responseJSON?.message || 'Login failed');
                                    $('#select-country-code').prop('disabled', false);
                                    $('#email_or_phone').removeAttr('readonly');
                                    $('#generate_otp').show();
                                    $('#otp-code').hide();
                                    $('#verify_otp').hide();
                                },
                                complete: function() {
                                    $('#verify_otp').prop('disabled', false).find('.spinner_loader').remove();
                                }
                            });
                        })
                        .catch((error) => {
                            console.error('Verification error:', error);
                            toastr.error("{{ __('taxido::front.invalid_otp') }}");
                            document.querySelectorAll('.otp-field').forEach(input => input.value = '');
                        })
                        .finally(() => {
                            $('#verify_otp').prop('disabled', false).find('.spinner_loader').remove();
                        });
                }
            });

        } catch (error) {
            console.error('Initialization error:', error);
            toastr.error('Initialization failed');
        }
    });
</script>
<script>
    const handleInput = (n, event) => {
        const curInput = document.querySelector(`.otp__field__${n}`);
        const nextInput = document.querySelector(`.otp__field__${n + 1}`);

        if (curInput.value.length > 1) {
            curInput.value = curInput.value.slice(0, 1);
        }

        if (curInput.value.length === 1 && nextInput) {
            nextInput.disabled = false;
            nextInput.focus();
        }

        const allInputs = document.querySelectorAll('.otp-field');
        const allInputsFilled = Array.from(allInputs).every(input => input.value.length === 1);
        const verifyButton = document.querySelector('.verifyBtn');
        verifyButton.disabled = !allInputsFilled;

        if (allInputsFilled) {
            allInputs[allInputs.length - 1].blur();
        }
    }

    const handleBackspace = (n, event) => {
        if (event.key === 'Backspace') {
            const curInput = document.querySelector(`.otp__field__${n}`);
            const prevInput = document.querySelector(`.otp__field__${n - 1}`);

            if (curInput.value.length === 0 && prevInput) {
                prevInput.focus();
            }

            const allInputs = document.querySelectorAll('.otp-field');
            const allInputsFilled = Array.from(allInputs).every(input => input.value.length === 1);
            const verifyButton = document.querySelector('.verifyBtn');
            verifyButton.disabled = !allInputsFilled;
        }
    }
</script>
@endpush
