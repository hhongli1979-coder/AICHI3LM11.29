@component('mail::message')
    <h1>{{ __('Verify Email') }}</h1>
    {{ __('OTP') }}
    <h2>{{ $token }}</h2>
@endcomponent
