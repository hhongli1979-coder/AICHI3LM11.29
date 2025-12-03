@php
use App\Enums\RoleEnum;
use Modules\Taxido\Enums\RoleEnum as ModuleRole;
$settings = getSettings();
$roleCredentials = getRoleCredentials();
@endphp
@extends('auth.master')
@section('title', __('static.login'))
@section('content')
<section class="auth-page">
    @if (env('APP_VERSION'))
    <span class="ms-auto d-flex badge badge-version-primary">{{ __('static.version') }}{{ env('APP_VERSION') }}</span>
    @endif
    <div class="container">
        <div class="auth-main">
            <div class="auth-card">
                <div class="text-center">
                    @if (isset(getSettings()['general']['light_logo_image']))
                    <img class="login-img" src="{{ getSettings()['general']['light_logo_image']?->original_url }}" alt="logo" loading="lazy">
                    @else
                    <h2>{{ config('app.name') }}</h2>
                    @endif
                </div>
                <div class="welcome">
                    <h3>{{ __('static.welcome', ['appName' => config('app.name')]) }}</h3>
                    <p>{{ __('static.information') }}</p>
                </div>
                @error('login')
                <div>
                    <span class="invalid-feedback d-block" role="alert">
                    <strong>{{ $message }}</strong>
                </div>
                </span>
                @enderror
                <div class="main">
                    <form id="loginForm" action="{{ route('login') }}" method='POST'>
                        @csrf
                        <div class="form-group">
                            <i class="ri-mail-line divider"></i>
                            <div class="position-relative">
                                <input type="email" class="form-control" id="email" name="email" placeholder="{{ __('static.enter_email') }}" required>
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
                                <input type="password" class="form-control input-icon" id="password" name="password"
                                    placeholder="{{ __('static.enter_password') }}" required>
                                <i class="ri-eye-line toggle-password"></i>
                            </div>
                            @error('password')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                        @if (Route::has('password.request'))
                        <div class="form-terms form-group">
                            <div class="d-flex align-items-center">
                                <div class="form-check p-0">
                                    <input type="checkbox" class="item-checkbox form-check-input me-2" id="remember">
                                    <label for="remember">{{ __('static.remember_me') }}</label>
                                </div>
                            </div>
                            <a href="{{ route('password.request') }}" class="forgot-pass">{{ __('static.users.lost_your_password') }}</a>
                        </div>
                        @endif
                        <button type="submit" class="btn btn-solid justify-content-center w-100 spinner-btn mt-0">
                            {{ __('static.login') }}
                        </button>
                    </form>
                </div>
                @isset($settings['activation']['default_credentials'])
                @if ((int) $settings['activation']['default_credentials'])
                <div class="demo-credential">
                    @foreach ($roleCredentials as $role)
                    <button class="btn btn-solid default-credentials" data-email="{{ $role['email'] }}" data-password="{{ $role['password'] ?? '123456789' }}">
                        {{ ucfirst($role['role']) }}
                    </button>
                    @endforeach
                </div>
                @endif
                @endisset
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
            $('#loginForm').validate({
                rules: {
                    email: {
                        required: true,
                        email: true,
                    },
                    password: {
                        required: true
                    },
                }
            });

            $(".default-credentials").click(function() {
                $("#email").val("");
                $("#password").val("");
                var email = $(this).data("email");
                var password = $(this).data("password");
                $("#email").val(email);
                $("#password").val(password);
            });
        });
    })(jQuery);
</script>
@endpush
