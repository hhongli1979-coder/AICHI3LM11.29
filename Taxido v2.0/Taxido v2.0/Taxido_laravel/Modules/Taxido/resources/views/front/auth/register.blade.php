@extends('front.layouts.master')
@section('title', __('taxido::front.register'))
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
                            <h3>{{ __('taxido::front.create_account') }}</h3>
                            <h6>{{ __('taxido::front.sign_up_minutes') }}</h6>
                            <form method="POST" action="{{ route('front.cab.register.store') }}" id="registerForm">
                                @csrf
                                <div class="form-box form-icon">
                                    <div class="position-relative">
                                        <i class="ri-user-line"></i>
                                        <input type="text" class="form-control" name="name" placeholder="{{ __('taxido::front.full_name') }}" value="{{ old('name') }}">
                                        @error('name')
                                            <span class="text-danger">{{ $message }}</span>
                                        @enderror
                                    </div>
                                </div>
                                <div class="form-box form-icon">
                                    <div class="position-relative">
                                        <i class="ri-mail-line"></i>
                                        <input type="email" class="form-control" name="email" placeholder="{{ __('taxido::front.enter_email') }}" value="{{ old('email') }}">
                                        @error('email')
                                            <span class="text-danger">{{ $message }}</span>
                                        @enderror
                                    </div>
                                </div>
                                <div class="form-box">
                                    {{-- <label for="phoneNumber" class="form-label">{{ __('taxido::front.phone_number') }}</label> --}}
                                    <div class="number-mail-box">
                                        <div class="country-code-section">
                                            <select class="select-2 form-control select-country-code" id="select-country-code" name="country_code">
                                                @foreach (getCountryCodes() as $option)
                                                    <option class="option" value="{{ $option->calling_code }}"
                                                        data-image="{{ asset('images/flags/' . $option->flag) }}"
                                                        @selected($option->calling_code == old('country_code', $rider?->country_code ?? '1'))>
                                                        {{ $option->calling_code }}
                                                    </option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="col-sm-12-full">
                                            <input type="number" name="phone" class="form-control" id="phoneNumber"
                                                value="{{ old('phone', $rider?->phone ?? '') }}"
                                                placeholder="{{ __('taxido::front.enter_phone_number') }}" required>
                                        </div>
                                        @error('phone')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                                <div class="form-box form-icon">
                                    <div class="position-relative">
                                        <i class="ri-lock-2-line"></i>
                                        <input type="password" class="form-control" name="password" id="password" placeholder="{{ __('taxido::front.enter_password') }}">
                                        <i class="ri-eye-line toggle-password right-icon"></i>
                                        @error('password')
                                            <span class="text-danger">{{ $message }}</span>
                                        @enderror
                                    </div>
                                </div>
                                <div class="form-box form-icon">
                                    <div class="position-relative">
                                        <i class="ri-lock-2-line"></i>
                                        <input type="password" class="form-control" name="password_confirmation" placeholder="{{ __('taxido::front.enter_confirm_password') }}">
                                        <i class="ri-eye-line toggle-password right-icon"></i>
                                        @error('password_confirmation')
                                            <span class="text-danger">{{ $message }}</span>
                                        @enderror
                                    </div>
                                </div>
                                <button type="submit" class="btn gradient-bg-color otp-btn spinner-btn">{{ __('taxido::front.sign_up') }} </button>
                            </form>

                            <div class="or-box">
                                <span>{{ __('taxido::front.or') }}</span>
                            </div>

                            <h6 class="new-account mt-0 flex-column">{{ __('taxido::front.already_have_account') }} 
                                <a href="{{ route('front.cab.login.index') }}">{{ __('taxido::front.sign_in') }}</a>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
@push('scripts')
    <script>
        (function($) {
            "use strict";
            $(document).ready(function() {
                $('#registerForm').validate({
                    rules: {
                        name: {
                            required: true
                        },
                        email: {
                            required: true,
                            email: true 
                        },
                        phone: {
                            required: true,
                            number: true,
                            minlength: 6,
                            maxlength: 15
                        },
                        country_code: {
                            required: true
                        },
                        password: {
                            required: true,
                            minlength: 8
                        },
                        password_confirmation: {
                            required: true,
                            equalTo: "#password"
                        }
                    },
                    messages: {
                        name: {
                            required: "Please enter your full name."
                        },
                        email: {
                            required: "Please enter your email address.",
                            email: "Please enter a valid email address."
                        },
                        phone: {
                            required: "Please enter your phone number.",
                            number: "Please enter a valid phone number.",
                            minlength: "Phone number must be at least 6 digits.",
                            maxlength: "Phone number cannot exceed 15 digits."
                        },
                        country_code: {
                            required: "Please select a country code."
                        },
                        password: {
                            required: "Please enter a password.",
                            minlength: "Your password must be at least 8 characters long."
                        },
                        password_confirmation: {
                            required: "Please confirm your password.",
                            equalTo: "Passwords do not match."
                        },
                    }
                });
            });
        })(jQuery);
    </script>
    <script>
        $(document).ready(function () {
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
            });
    </script>
@endpush