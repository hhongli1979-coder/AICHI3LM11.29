<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ session('dir', 'ltr') }}">
<head>
    @include('admin.layouts.partials.head')

    @include('admin.layouts.partials.css')

    <!-- Main css-->
    <title>@yield('title') - {{ config('app.title') }}</title>
    @vite(['resources/scss/admin.scss'])
    @stack('css')
    @include('inc.style')
</head>

<body class="theme {{ session('dir', 'ltr') }} {{ session('theme', '') }}">
    <div class="page-wrapper">
        @includeIf('admin.layouts.partials.header')
        <div class="page-body-wrapper">
            @includeIf('admin.layouts.partials.sidebar')
                <div class="page-body">
                    <div class="container-fluid px-0">
                        @yield('content')
                    </div>
                </div>
            @includeIf('admin.layouts.partials.footer')
        </div>
    </div>
    @includeIf('inc.files')
    @include('admin.layouts.partials.script')
    @vite(['resources/js/script.js'])
    @stack('scripts')
    @includeIf('inc.alerts')
</body>

</html>
