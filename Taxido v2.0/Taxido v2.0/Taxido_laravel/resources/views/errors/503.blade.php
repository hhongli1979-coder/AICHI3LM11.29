@php
    $settings = getSettings();
@endphp

<!DOCTYPE html>
<html>

<head>
    <title>Be right back.</title>
    <!-- Font link -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">

    <!-- bootstrap css -->
    <link rel="stylesheet" id="rtl-link" type="text/css" href="{{ asset('front/css/vendors/bootstrap.css') }}">

    <style>
        /* body {
            background-image: url("../../../front/images/background/bg.jpg");
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            height: 100vh;
            width: 100vw;
        } */
    </style>
</head>

<body class="maintenance-body">
    {!! $settings['maintenance']['content'] !!}

</body>

</html>
