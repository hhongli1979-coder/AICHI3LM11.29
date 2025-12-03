@extends('front.layouts.master')
@section('title', 'OTP Verification')
@section('content')
    <section class="authentication-section section-b-space">
        <div class="container">
            <div class="auth-form-box">
                <div class="row align-items-center">
                    <div class="col-xl-7 col-lg-6 d-lg-block d-none">
                        <img src="{{ asset('images/authentication-img.png') }}" class="img-fluid auth-image">
                    </div>
                    <div class="col-xl-5 col-lg-6">
                        <div class="auth-right-box">
                            <h3>{{ __('taxido::front.otp_verification') }}</h3>
                            <h6>{{ __('taxido::front.digit_code') }}</h6>

                            <form method="POST" action="{{ route('front.cab.verify_otp.store') }}" id="otpForm">
                                @csrf
                                <input type="hidden" name="email_or_phone" value="{{ old('email_or_phone', session('email_or_phone')) }}">
                                <input type="hidden" name="country_code" value="{{ old('country_code', session('country_code')) }}">
                                <div class="form-box">
                                    <div class="otp-inputs" id="otp-inputs">
                                        <input type="text" class="form-control otp-field otp__field__1" maxlength="1" name="otp[]" pattern="[0-9]{1}" oninput="handleInput(1, event)" onkeydown="handleBackspace(1, event)" autofocus>
                                        <input type="text" class="form-control otp-field otp__field__2" maxlength="1" name="otp[]" pattern="[0-9]{1}" oninput="handleInput(2, event)" onkeydown="handleBackspace(2, event)" disabled>
                                        <input type="text" class="form-control otp-field otp__field__3" maxlength="1" name="otp[]" pattern="[0-9]{1}" oninput="handleInput(3, event)" onkeydown="handleBackspace(3, event)" disabled>
                                        <input type="text" class="form-control otp-field otp__field__4" maxlength="1" name="otp[]" pattern="[0-9]{1}" oninput="handleInput(4, event)" onkeydown="handleBackspace(4, event)" disabled>
                                        <input type="text" class="form-control otp-field otp__field__5" maxlength="1" name="otp[]" pattern="[0-9]{1}" oninput="handleInput(5, event)" onkeydown="handleBackspace(5, event)" disabled>
                                        <input type="text" class="form-control otp-field otp__field__6" maxlength="1" name="otp[]" pattern="[0-9]{1}" oninput="handleInput(6, event)" onkeydown="handleBackspace(6, event)" disabled>
                                    </div>
                                    @error('otp')
                                        <span class="text-danger">{{ $message }}</span>
                                    @enderror
                                </div>
                                @if(isDemoMode())
                                <h6>{{ __('taxido::front.demo_otp') }}</h6>
                                @endif
                                <button type="submit" class="btn gradient-bg-color otp-btn verifyBtn spinner-btn" disabled>{{ __('taxido::front.verify') }}</button>
                                <h6 class="new-account">{{ __('taxido::front.not_receive_otp') }} <a href="#" id="resend-otp">{{ __('taxido::front.resent_otp') }}</a></h6>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection

@push('scripts')
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

    (function($) {
        "use strict";
        $(document).ready(function() {
            $('#resend-otp').click(function(e) {
                e.preventDefault();
                const emailOrPhone = $('input[name="email_or_phone"]').val();
                const countryCode = $('input[name="country_code"]').val();
                $.ajax({
                    url: '{{ route('front.cab.login_with_credential') }}',
                    method: 'POST',
                    data: {
                        email_or_phone: emailOrPhone,
                        country_code: countryCode,
                        _token: '{{ csrf_token() }}'
                    },
                    success: function(response) {
                        if (response.success) {
                            toastr.success("{{ __('taxido::front.otp_resent_successfully') }}");
                            $('.otp-field').val('').prop('disabled', true);
                            $('.otp__field__1').prop('disabled', false).focus();
                            $('.verifyBtn').prop('disabled', true);
                        } else {
                            toastr.error(response.message || "{{ __('taxido::front.failed_resent_otp') }}");
                        }
                    },
                    error: function(xhr) {
                        toastr.error(xhr.responseJSON.message || "{{ __('taxido::front.failed_resent_otp') }}");
                    }
                });
            });
        });
    })(jQuery);
</script>
@endpush
