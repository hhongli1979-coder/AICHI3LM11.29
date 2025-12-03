@extends('auth.master')
@section('title', __('static.reset_password'))
@section('content')
<section class="auth-page">
    <div class="container">
        <div class="auth-main">
            <div class="auth-card">
                <div class="text-center">
                    @if (isset(getSettings()['general']['light_logo_image']))
                    <img class="login-img" src="{{ getSettings()['general']['light_logo_image']?->original_url }}" alt="logo">
                    @else
                    <h2>{{ env('APP_NAME') }}</h2>
                    @endif
                </div>
                <div class="welcome">
                    <h3>{{ __('static.reset_password') }}</h3>
                    <p>{{ __('static.create_password') }}</p>
                </div>
                <div class="main">
                    <form id="resetForm" action="{{route('password.update')}}" method="POST">
                        @csrf
                        <input type="hidden" name="token" value="{{ $token }}">
                        <div class="form-group">
                            <i class="ri-mail-line divider"></i>
                            <div class="position-relative">
                                <input class="form-control" value="{{ old('email') }}" id="email" type="email" name="email" placeholder="{{__('static.enter_email')}}">
                            </div>
                            @error('email')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                        <div class="form-group">
                            <i class="ri-lock-line divider"></i>
                            <div class="position-relative">
                                <input class="form-control input-icon" id="password" type="password" name="password" placeholder="{{ __('static.enter_password') }}">
                                <i class="ri-eye-line toggle-password"></i>
                            </div>
                            @error('password')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                        <div class="form-group">
                            <i class="ri-lock-line divider"></i>
                            <div class="position-relative">
                                <input class="form-control input-icon" id="confirm-password" type="password" name="password_confirmation" placeholder="{{ __('static.enter_confirm_password') }}">
                                <i class="ri-eye-line toggle-password"></i>
                            </div>
                            @error('password_confirmation')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                        <div class="form-button">
                            <button type="submit" class="btn btn-solid justify-content-center w-100 spinner-btn mt-0">
                                {{ __('static.reset_password') }}
                            </button>
                        </div>
                    </form>
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
            $('#resetForm').validate({
                rules: {
                    email: {
                        required: true,
                    },
                    password: {
                        required: true,
                    },
                    password_confirmation: {
                        required: true,
                        equalTo: "#password"
                    }
                }
            });
        });
    })(jQuery);
</script>
@endpush
