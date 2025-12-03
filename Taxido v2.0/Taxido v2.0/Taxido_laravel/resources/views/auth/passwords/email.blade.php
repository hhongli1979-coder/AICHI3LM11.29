@extends('auth.master')
@section('title', __('static.forgot_password'))
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
                    <h3>{{ __('static.forgot_password') }}</h3>
                    <p>{{ __('static.reset_password') }}</p>
                </div>
                <div class="main">
                    <form id="emailForm" action="{{ route('password.email') }}" method='POST'>
                        @csrf
                        <div class="form-group">
                            <i class="ri-mail-line divider"></i>
                            <div class="position-relative">
                                <input type="email" class="form-control" id="email" name="email" placeholder="{{ __('static.enter_email') }}">
                            </div>
                            @error('email')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                        <div class="form-button">
                            <button type="submit" class="btn btn-solid justify-content-center w-100 spinner-btn mt-0">
                                {{ __('static.link') }}
                            </button>
                        </div>
                        <a href="{{ route('login') }}" class="backward">
                            <i class="ri-arrow-left-line"></i>
                            {{ __('static.back') }}
                        </a>
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
            $('#emailForm').validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                }
            });
        });
    })(jQuery);
</script>
@endpush
