@use('App\Models\Language')
@php
    $locale = Session::get('front-locale', getDefaultLangLocale());
    $lang = Language::where('locale', Session::get('front-locale', getDefaultLangLocale()))?->whereNull('deleted_at')->first();
@endphp

<!DOCTYPE html>
<html lang="{{ Session::get('front-locale', getDefaultLangLocale()) }}">

<head>
    @include('front.layouts.head')
    @include('front.layouts.style')
</head>

<body class="theme {{ $lang->is_rtl ? 'rtl' : 'ltr' }} {{ session('front_theme', '') }}">
    @include('front.layouts.header')

    @yield('content')

    @if ($settings['activation']['preloader_enabled'] ?? false)
    <div class="loader-box" id="fullScreenLoader">
        <img class="img-fluid" alt="loader-image"
             src="{{ $settings['appearance']['preloader_image']?->original_url ?? asset('front/images/preloader.gif') }}">
    </div>
    @endif

    <!-- Loader End -->

    @include('front.layouts.footer')
    @include('front.layouts.script')
    @stack('scripts')
    @includeIf('inc.alerts')
</body>
</html>
