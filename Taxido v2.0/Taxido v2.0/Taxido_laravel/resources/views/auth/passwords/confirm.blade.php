@extends('auth.master')
@section('title', __('auth.confirm_password'))
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
                    <h3>{{__('static.users.confirm_password')}}</h3>
                    <p>{{__('static.users.please_confirm_password')}}</p>
                </div>
                <div class="main">
                    <form id="confirmForm" action="{{ route('password.confirm') }}" method="POST">
                        @csrf
                        <div class="form-group">
                            <i class="ri-mail-line divider"></i>
                            <div class="position-relative">
                                <input class="form-control input-icon" id="password" type="password" name="password" placeholder="Enter password">
                            </div>
                            @error('password')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                            @enderror
                        </div>
                        @if (Route::has('password.request'))
                        <a href="{{ route('password.request') }}" class="forgot-pass">{{ __('static.users.forgot_password')}}</a>
                        @endif
                        <div class="form-button">
                            <button type="submit" name="save" class="btn btn-solid justify-content-center w-100 spinner-btn mt-0">
                               {{__('static.users.confirm_password')}}
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
            $('#confirmForm').validate({
                rules: {
                    password: {
                        required: true,
                    }
                }
            });
        });
    })(jQuery);
</script>
@endpush
