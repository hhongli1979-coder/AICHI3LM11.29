@extends('front.layouts.master')

@push('css')
<!-- aos css -->
<link rel="preload" as="style" href="{{ asset('front/css/aos.css') }}"
    onload="this.onload=null;this.rel='stylesheet'">

<!-- wow animate css link -->
<link rel="stylesheet" href="{{ asset('front/css/vendors/wow.css') }}" media="print" onload="this.media='all'">
<link rel="stylesheet" type="text/css" href="{{ asset('front/css/vendors/wow-animate.css') }}" media="print"
    onload="this.media='all'">
@endpush
@section('title', __('static.landing_pages.landing_page'))
@section('content')
    @php
        $classes = ['ride-box', 'user-box', 'driver-box', 'rating-box', 'ride-box'];
        $blogs = getBlogsByIds(@$content['blog']['blogs'] ?? []);
        $faqs = getFaqsByIds(@$content['faq']['faqs'] ?? []);
        $half = ceil(count($faqs) / 2);
        $testimonials = getTestimonialByIds(@$content['testimonial']['testimonials'] ?? []);
    @endphp
    @if ((int) $content['home']['status'])
        <section class="home-section" id="{{ __('static.landing_pages.home_id') }}">
            <div class="container">
                <div class="home-contain">
                    <h1 class="wow fadeInUp" data-wow-delay="0.2s">{{ @$content['home']['title'] }}</h1>
                    <p class="wow fadeInUp " data-wow-delay="0.5s">{{ @$content['home']['description'] }}</p>
                    <div class="home-group">
                        @forelse ($content['home']['button'] as $button)
                            @if ($button['type'] == 'gradient')
                            <a href="{{ $button['url'] ?? '#' }}" target="_blank" class="btn gradient-bg-color wow fadeInUp" data-wow-delay="0.7s">
                                {{ $button['text'] }}
                            </a>
                            @else
                                <a href="{{ $button['url'] ?? '#' }}" target="_blank" class="btn gradient-border-color wow fadeInUp" data-wow-delay="0.8s">
                                    {{ $button['text'] }}
                                </a>
                            @endif
                        @empty
                        @endforelse
                    </div>
                </div>
                <div class="phone-image">
                    @if (file_exists_public(@$content['home']['right_phone_image']))
                        <div class="phone-1 wow fadeInUp" data-wow-delay="1.05s">
                            <img class="img-fluid mobile-phone" alt="home-phone" src="{{ asset(@$content['home']['right_phone_image']) }}" loading="lazy">
                        </div>
                    @endif
                    @if (file_exists_public(@$content['home']['left_phone_image']))
                        <div class="phone-2 wow fadeInUp" data-wow-delay="1.2s">
                            <img class="img-fluid mobile-phone" alt="home-phone" src="{{ asset(@$content['home']['left_phone_image']) }}" loading="lazy">
                        </div>
                    @endif
                </div>
            </div>
        </section>
    @endif
    <!-- Home Section End -->

    <!-- Experience section start -->
    @if ($content['statistics']['status'] == 1)
        <section class="experience-section overflow-hidden">
            <div class="container">
                <div class="title">
                    <h2 class="wow fadeInDown">{{ @$content['statistics']['title'] }}</h2>
                    <div class="d-inline-block">
                        <p class="wow fadeInDown" data-wow-delay="0.2s">{{ @$content['statistics']['description'] }}</p>
                    </div>
                </div>
                <div class="row experience-row g-sm-4 g-3">
                    @forelse($content['statistics']['counters'] ?? [] as $index => $counter)
                        <div class="col-xl-3 col-sm-6 wow fadeIn" data-wow-delay="0.4s">
                            <div class="experience-box {{ $classes[$index % count($classes)] }}">
                                <div class="experience-img">
                                    @if (file_exists_public(@$counter['icon']))
                                        <img src="{{ asset(@$counter['icon']) }}" class="img-fluid" loading="lazy"/>
                                    @endif
                                </div>
                                <div class="experience-content">
                                    <h4>{{ @$counter['text'] }}</h4>
                                    <p>{{ @$counter['description'] }}</p>
                                    <h3><span class="counter" data-target="{{ number_format(@$counter['count'], @$counter['count'] % 1 ? 1 : 0, '.', '') }}">0</span></h3>
                                </div>
                            </div>
                        </div>
                    @empty
                    @endforelse
                </div>
            </div>
        </section>
    @endif
    <!-- Experience section end -->

    <!-- Best choice section start -->
    @if ($content['feature']['status'] == 1)
        <section class=" best-choice-section description section-b-space overflow-hidden" id="{{ __('static.landing_pages.why_taxido_id') }}">
            <div class="container">
                <div class="title">
                    <h2 class="wow fadeInDown">{{ @$content['feature']['title'] }}</h2>
                    <div class="d-inline-block">
                        <p class="wow fadeInDown" data-wow-delay="0.2s">{{ @$content['feature']['description'] }}</p>
                    </div>
                </div>
                <div class="row g-md-4 g-3">
                    @forelse ($content['feature']['images'] ?? [] as $index => $image)
                        <div class="col-xl-4 col-md-6 wow fadeInUp" data-wow-delay="{{ 0.55 + $index * 0.05 }}s">
                            <div class="best-choice-box">
                                @if (file_exists_public(@$image['image']))
                                    <img class="img-fluid" alt="map-gif" src="{{ @asset($image['image']) }}" loading="lazy">
                                @endif
                                <div class="best-choice-content">
                                    <h4>{{ @$image['title'] }}</h4>
                                    <p>{{ @$image['description'] }}</p>
                                </div>
                            </div>
                        </div>
                    @empty
                    @endforelse
                </div>
            </div>
        </section>
    @endif
    <!-- Best choice section end -->

    <!-- Rides screen section start -->
    @if ($content['ride']['status'] == 1)
        <section class="ride-screen-section2 section-b-space" id="{{ __('static.landing_pages.how_it_works_id') }}">
            <div class="container">
                <div class="title">
                    <h2 class="text-white">{{ @$content['ride']['title'] }}</h2>
                    <div class="d-inline-block">
                        <p class="dark-layout">{{ @$content['ride']['description'] }}</p>
                    </div>
                </div>
                <div class="row justify-content-between gy-lg-0 gy-4">
                    <div class="col-xl-4 col-lg-5 mx-auto overflow-hidden position-relative">
                        <div class="mobile-screen-image">
                            <img class="img-fluid" alt="screen-mockup" src="{{ asset('front/images/screen.png') }}" loading="lazy">
                            <div class="swiper screen-image-slider">
                                <div class="swiper-wrapper">
                                    @forelse ($content['ride']['step'] as $step)
                                        <div class="swiper-slide">
                                            @if (file_exists_public($step['image']))
                                                <img class="img-fluid" alt="screen-img" src="{{ asset($step['image']) }}" loading="lazy">
                                            @endif
                                        </div>
                                    @empty
                                    @endforelse
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="screen-content-list">
                            <div class="swiper screen-content-slider">
                                <div class="swiper-wrapper">
                                    @forelse ($content['ride']['step'] as $index => $step)
                                        <div class="swiper-slide">
                                            <div>
                                                <div class="screen-content-box">
                                                    <h4>{{ str_pad($index + 1, 2, '0', STR_PAD_LEFT) }}</h4>
                                                    <h3>{{ $step['title'] }}</h3>
                                                    <p>{{ $step['description'] }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    @empty
                                    @endforelse
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    @endif
    <!-- Rides screen section end -->

    <!-- FAQ section start -->
    @if ($content['faq']['status'] == 1)
        <section class="faq-section" id="{{ __('static.landing_pages.faqs_id') }}">
            <div class="container">
                <div class="title">
                    <h2 class="wow fadeInDown">{{ $content['faq']['title'] }}</h2>
                    <div class="d-inline-block">
                        <p class="wow fadeInDown" data-wow-delay="0.2s">{{ $content['faq']['sub_title'] }}</p>
                    </div>
                </div>
                <div class="row gy-lg-0 gy-3">
                    <div class="col-lg-6">
                        <div class="accordion faq-accordion">
                            @forelse ($faqs as $index => $faq)
                                @if ($index < $half)
                                    <div class="accordion-item wow fadeInUp" data-wow-delay="{{ 0.45 + $index * 0.05 }}s">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button {{ $index === 0 ? '' : 'collapsed' }}"
                                                data-bs-toggle="collapse" data-bs-target="#faq{{ $index + 1 }}">
                                                {{ $faq['title'] }}
                                            </button>
                                        </h2>
                                        <div id="faq{{ $index + 1 }}"
                                            class="accordion-collapse collapse {{ $index === 0 ? 'show' : '' }}">
                                            <div class="accordion-body">
                                                <p>{{ $faq['description'] }}</p>
                                            </div>
                                        </div>
                                    </div>
                                @endif
                            @empty
                            @endforelse
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="accordion faq-accordion">
                            @forelse ($faqs as $index => $faq)
                                @if ($index >= $half)
                                    <div class="accordion-item wow fadeInUp"
                                        data-wow-delay="{{ 0.45 + $index * 0.05 }}s">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button  {{ $index == $half ? '' : 'collapsed' }}"
                                                data-bs-toggle="collapse" data-bs-target="#faq{{ $index + 1 }}">
                                                {{ $faq['title'] }}
                                            </button>
                                        </h2>
                                        <div id="faq{{ $index + 1 }}"
                                            class="accordion-collapse collapse {{ $index == $half ? 'show' : '' }}">
                                            <div class="accordion-body">
                                                <p>{{ $faq['description'] }}</p>
                                            </div>
                                        </div>
                                    </div>
                                @endif
                            @empty
                                <div class="no-data-found">
                                    <img class="img-fluid" src="{{ asset('front/images/faq_not_found.svg') }}" loading="lazy">
                                </div>
                            @endforelse
                        </div>
                    </div>
                </div>
            </div>
        </section>
    @endif

    <!-- FAQ section end -->

    <!-- Blog section start -->
    @if ($content['blog']['status'] == 1)
        <section class="blog-section section-b-space" id="{{ __('static.landing_pages.blogs_id') }}">
            <div class="container">
                <div class="title">
                    <h2 class="wow fadeInDown">{{ $content['blog']['title'] }}</h2>
                    <div class="d-inline-block">
                        <p class="wow fadeInDown" data-wow-delay="0.2s">{{ $content['blog']['sub_title'] }}</p>
                        <a href="{{ route('web.blog.index') }}">{{ __('static.landing_pages.view_all') }} <i class="ri-arrow-right-s-line"></i></a>
                    </div>
                </div>

                <div class="swiper blog-swiper pagination-box">
                    <div class="swiper-wrapper">

                        @forelse ($blogs as $index => $blog)
                            <div class="swiper-slide wow fadeInUp" data-wow-delay="0.35s">
                                <div class="blog-box">
                                    <div class="blog-image">

                                        <a href="{{ route('blog.slug', @$blog['slug']) }}"><img class="img-fluid"
                                                src="{{ asset($blog['blog_thumbnail']['original_url'] ?? '') }}"
                                                alt="{{@$blog['slug']}}" loading="lazy"></a>
                                    </div>
                                    <div class="blog-content">
                                        <a href="{{ route('blog.slug', @$blog['slug']) }}">
                                            <h5>{{ $blog['title'] ?? '' }} </h5>
                                        </a>
                                        <p>{{ $blog['description'] ?? '' }}</p>
                                        <div class="blog-bottom">
                                            <h6><i class="ri-calendar-line"></i>
                                                {{ $blog['created_at'] ? \Carbon\Carbon::parse($blog['created_at'])->format('d M, Y') : '' }}
                                            </h6>
                                            <a href="{{ route('blog.slug', @$blog['slug']) }}">{{ __('static.landing_pages.know_more') }} <i
                                                    class="ri-arrow-right-s-line"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @empty
                            <div class="no-data-found">
                                <img class="img-fluid" src="{{ asset('front/images/blog_not_found.svg') }}" loading="lazy">
                            </div>
                        @endforelse
                    </div>
                    <div class="swiper-pagination wow fadeInUp" data-wow-delay="0.65s"></div>
                </div>
            </div>
        </section>
    @endif

    <!-- Blog section end -->

    <!-- Comment section start -->
    @if ($content['testimonial']['status'] == 1)
        <section class="comment-section section-b-space wow fadeIn" id="{{ __('static.landing_pages.testimonials_id') }}">
            <div class="container">
                <div class="title">
                    <h2 class="wow fadeInDown" data-wow-delay="0.2s">{{ @$content['testimonial']['title'] }}</h2>
                    <div class="d-inline-block">
                        <p class="wow fadeInDown" data-wow-delay="0.4s">{{ @$content['testimonial']['sub_title'] }}</p>
                    </div>
                </div>

                <div class="swiper comment-slider pagination-box">
                    <div class="swiper-wrapper wow fadeInUp" data-wow-delay="0.5s">
                        @forelse ($testimonials as $index => $testimonial)
                            <div class="swiper-slide">
                                <div class="comment-box">
                                    <div class="top-comment">
                                        <img class="img-fluid" alt="{{ $testimonial?->title }}"
                                            src="{{ asset($testimonial?->profile_image?->asset_url ?? '') }}" loading="lazy">

                                        <h5>{{ $testimonial?->title }}</h5>
                                    </div>
                                    <p class="comment-contain">{{ $testimonial?->description }}</p>
                                    <div class="rating-box">
                                        <h6>
                                            <svg>
                                                <use xlink:href="{{ asset('front/images/star.svg#star') }}">
                                            </svg>
                                            ({{ number_format($testimonial?->rating, 1) }})
                                        </h6>

                                        <svg class="quotes-icon">
                                            <use xlink:href="{{ asset('front/images/quotes-right.svg#quotes-right') }}">
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        @empty
                            <div class="no-data-found">
                                <img class="img-fluid" src="{{ asset('front/images/testimonial_not_found.svg') }}" loading="lazy">
                            </div>
                        @endforelse
                    </div>
                    <div class="swiper-pagination"></div>
                </div>
            </div>
        </section>
    @endif
@endsection

@push('scripts')
<!-- WOW JS -->
<script src="{{ asset('front/js/wow.js') }}"></script>
<script>
    $(document).ready(function() {
        new WOW().init();

        $(window).on('load', function() {
            setTimeout(function() {
                $('#fullScreenLoader').fadeOut('slow', function() {
                    $(this).remove();
                });
            }, 3500);
        });
    });
</script>
@endpush
