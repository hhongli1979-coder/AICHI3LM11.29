<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="author" content="pixelstrap">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="shortcut icon"
        href="{{ getSettings()['general']['favicon_image']?->original_url ?? asset('favicon.ico') }}"
        type="image/x-icon">
    <link rel="shortcut icon"
        href="{{ getSettings()['general']['favicon_image']?->original_url ?? asset('favicon.ico') }}"
        type="image/x-icon">
    <title>@yield('title') | {{ env('APP_NAME') }}</title>

    <!-- Google font-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">

    <!-- Font Awesome-->
    <link rel="stylesheet" type="text/css" href="{{ asset('css/vendors/font-awesome.css') }}">
    <!-- Bootstrap css-->
    <link rel="stylesheet" type="text/css" href="{{ asset('css/vendors/bootstrap.css') }}">
    <!-- Animated css-->
    <link rel="stylesheet" type="text/css" href="{{ asset('css/vendors/animate.css') }}">
    <!-- Remixicon css-->
    <link rel="stylesheet" type="text/css" href="{{ asset('css/vendors/remixicon.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/vendors/select2.css') }}">

    <!-- Main css-->
    @vite(['resources/scss/admin.scss'])
    @include('inc.style')

</head>

<body>
    <div class="page-wrapper">
        @yield('content')
    </div>

    <!-- latest jquery -->
    <script src="{{ asset('js/jquery-3.7.1.min.js') }}"></script>

    <!-- Bootstrap js -->
    <script src="{{ asset('js/bootstrap/bootstrap.min.js') }}" defer></script>

    <!-- JQuery Validation js -->
    <script src="{{ asset('js/jquery.validate.min.js') }}" defer></script>
    <script src="{{ asset('js/additional-methods.min.js') }}" defer></script>

    <!-- Select2 -->
    <script src="{{ asset('js/select2.full.min.js') }}" defer></script>

    @vite(['resources/js/script.js'])

    @stack('scripts')
</body>

</html>
