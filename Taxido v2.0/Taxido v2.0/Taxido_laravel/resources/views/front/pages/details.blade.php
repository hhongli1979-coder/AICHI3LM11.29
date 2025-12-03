@extends('front.layouts.master')

@php
    $locale = Session::get('front-locale',getDefaultLangLocale());
@endphp

@section('title', __('static.pages.page'))
@section('content')

    <body>
        <section class="privacy-policy-details-section section-b-space">
            <div class="container">
                <div class="page-title">
                    <h2>{{ $page->title }}</h2>
                    <h6>{{ $page->created_at->format('jS F Y') }}</h6>
                </div>

                <div class="page-content">
                    {!! $page->content !!}
                </div>
            </div>
        </section>
    </body>
@endsection
