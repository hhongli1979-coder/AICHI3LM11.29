<!-- Header section start -->
@use('App\Models\Language')
@use('App\Models\LandingPage')
@php
    $locale = Session::get('front-locale', getDefaultLangLocale());
    $landingPage = LandingPage::first()?->toArray($locale) ?? [];
    $content = $landingPage['content'] ?? [];
    $flag = Language::where('locale', Session::get('front-locale', getDefaultLangLocale()))->pluck('flag')->first();
@endphp
@if (@$content['header']['status'] == 1)
    <header class="wow fadeIn">
        <div class="container">
            <div class="top-header">
                <div class="header-left">
                    <button class="navbar-toggler btn">
                        <i class="ri-menu-line"></i>
                    </button>
                    <a href="{{ route('home') }}" class="logo-box">
                        @if (file_exists_public(@$content['header']['logo']))
                            <img class="img-fluid" alt="Logo" src="{{ asset(@$content['header']['logo']) }}"
                                loading="lazy">
                        @endif
                    </a>
                </div>
                <div class="header-middle">
                    <div class="menu-title">
                        <h3>Menu</h3>
                        <a href="#!" class="close-menu"><i class="ri-close-line"></i></a>
                    </div>
                    <ul class="navbar-nav">
                        @forelse ($content['header']['menus'] ?? [] as $menu)
                            <li class="nav-item">
                                @if ($menu === 'Raise Ticket')
                                    <a class="nav-link" href="{{ route('ticket.form') }}">{{ $menu }}</a>
                                @else
                                    @if (Route::is('home'))
                                        <a class="nav-link" href="#{{ Str::slug($menu) }}">{{ $menu }}</a>
                                    @else
                                        <a class="nav-link"
                                            href="{{ route('home') }}#{{ Str::slug($menu) }}">{{ $menu }}</a>
                                    @endif
                                @endif
                            </li>
                        @empty
                        @endforelse
                    </ul>
                </div>
                <div class="header-right">
                    <div class="dropdown language-dropdown">
                        @php
                            $currentLocale = Session::get('locale', app()->getLocale());
                            $currentLang = getLanguageByLocale($currentLocale);
                        @endphp

                        <button class="btn language-btn" data-bs-toggle="dropdown" aria-expanded="false">
                            <img class="img-fluid" loading="lazy" alt="flag-image"
                                src="{{ $currentLang?->flag ?? asset('images/flags/default.png') }}">
                            <span>{{ strtoupper($currentLang?->locale ?? 'EN') }}</span>
                        </button>

                        <ul class="dropdown-menu">
                            @forelse (getLanguages() as $lang)
                                <li>
                                    <a class="dropdown-item @if ($lang->locale === $currentLocale) active @endif"
                                        href="{{ route('lang', $lang->locale) }}" data-lng="{{ $lang->locale }}">
                                        <img class="img-fluid" loading="lazy" alt="flag-image"
                                            src="{{ $lang->flag ?? asset('images/flags/default.png') }}">
                                        <span>({{ strtoupper($lang->locale) }})</span>
                                    </a>
                                </li>
                            @empty
                                <li>
                                    <a class="dropdown-item" href="{{ route('lang', 'en') }}" data-lng="en">
                                        <img class="img-fluid" src="{{ asset('images/flags/US.png') }}" loading="lazy">
                                        <span>{{ __('static.english') }}</span>
                                    </a>
                                </li>
                            @endforelse
                        </ul>
                    </div>
                    <button class="btn dark-light-mode" id="dark-mode" aria-label="Toggle dark mode"
                        aria-pressed="false">
                        <i class="ri-moon-line light-mode"></i>
                        <i class="ri-sun-line dark-mode"></i>
                    </button>
                    <a href="{{ auth()->check() ? route('front.cab.ride.create') : route('front.cab.login.index') }}"
                        class="btn gradient-bg-color ticket-btn">
                        <i class="ri-coupon-2-line d-sm-none"></i>
                        <span class="d-sm-block d-none">{{ @$content['header']['btn_text'] }}</span>
                    </a>
                </div>
            </div>
            <a href="#!" class="overlay" aria-label="Read more about this article"></a>
    </header>
@endif
<!-- Header section end -->
