@use('App\Models\Page')
@use('App\Models\LandingPage')
@php
    $locale = Session::get('front-locale', getDefaultLangLocale());
    $landingPage = LandingPage::first()?->toArray($locale) ?? [];
    $content = $landingPage['content'] ?? [];
@endphp
@if (@$content['footer']['status'] == 1)
    <footer class="footer-section">
        <div class="top-footer">
            <div class="container">
                <div class="row justify-content-between gy-sm-0 gy-4">
                    <div class="col-lg-4 col-md-8 col-sm-7">
                        <div class="logo-box">
                            <a href="#!" class="footer-logo wow fadeInUp">
                                @if(file_exists_public(@$content['footer']['footer_logo']))
                                <img class="img-fluid" alt="footer-logo"
                                    src="{{ asset(@$content['footer']['footer_logo']) }}">@endif
                            </a>
                            <p class="wow fadeInUp" data-wow-delay="0.2s">{{ $content['footer']['description'] }}</p>
                        </div>

                        <div class="footer-form wow fadeInUp" data-wow-delay="0.3s">
                            <form method="POST" action="{{ route('newsletter') }}">
                                @csrf
                                <label for="email"
                                    class="form-label">{{ $content['footer']['newsletter']['label'] }}</label>
                                <div class="form-group">
                                    <input type="email" class="form-control" id="email" name="email"
                                        placeholder="{{ $content['footer']['newsletter']['placeholder'] }}" required>
                                    <button type="submit" class="btn gradient-bg-color">
                                        {{ $content['footer']['newsletter']['button_text'] }}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <ul class="store-list">
                            <li class="wow fadeInUp" data-wow-delay="0.5s">
                                <a href="{{ $content['footer']['play_store_url'] }}" target="_blank">
                                    <img class="img-fluid" alt="store-1" src="{{ asset('front/images/store/1.svg') }}">
                                </a>
                            </li>
                            <li class="wow fadeInUp" data-wow-delay="0.6s">
                                <a href="{{ $content['footer']['app_store_url'] }}" target="_blank">
                                    <img class="img-fluid" alt="store-2" src="{{ asset('front/images/store/2.svg') }}">
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="col-lg-2 col-md-3 col-sm-4">
                        @isset($content['footer']['pages'])
                            @php
                                $pages = Page::whereIn('id', $content['footer']['pages'] )?->paginate(5);
                            @endphp
                            <div class="footer-content wow fadeInUp" data-wow-delay="0.8s">
                                <div class="footer-title">
                                    <h4>Pages</h4>
                                </div>
                                <ul class="content-list">
                                    @foreach ($pages as $page)
                                    <li>
                                        <a href="{{ route('page.slug', $page->slug) }}">{{ $page->title }}</a>
                                    </li>
                                    @endforeach
                                </ul>
                            </div>
                        @endisset
                    </div>

                    <div class="col-lg-5 position-relative d-none d-lg-block">
                        <div class="footer-image">
                            @if(file_exists_public(@$content['footer']['right_image']))
                            <img class="img-fluid wow fadeInUp" alt="footer-phone"
                                src="{{ asset(@$content['footer']['right_image']) }}" data-wow-delay="0.98s">
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="sub-footer">
            <div class="container">
                <div class="row gy-md-0 gy-3">
                    <div class="col-md-6">
                        <h6>{{ $content['footer']['copyright'] ?? '© Your Company' }} {{ date('Y') }}</h6>
                    </div>
                    <div class="col-md-6">
                        <ul class="social-list">
                            @if(!empty($content['footer']['social']['facebook']))
                            <li>
                                <a href="{{ $content['footer']['social']['facebook'] }}" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                                    <i class="ri-facebook-line"></i>
                                </a>
                            </li>
                            @endif

                            @if(!empty($content['footer']['social']['google']))
                            <li>
                                <a href="{{ $content['footer']['social']['google'] }}" aria-label="Google" target="_blank" rel="noopener noreferrer">
                                    <i class="ri-google-line"></i>
                                </a>
                            </li>
                            @endif

                            @if(!empty($content['footer']['social']['instagram']))
                            <li>
                                <a href="{{ $content['footer']['social']['instagram'] }}" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                                    <i class="ri-instagram-line"></i>
                                </a>
                            </li>
                            @endif

                            @if(!empty($content['footer']['social']['twitter']))
                            <li>
                                <a href="{{ $content['footer']['social']['twitter'] }}" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                                    <i class="ri-twitter-x-line"></i>
                                </a>
                            </li>
                            @endif

                            @if(!empty($content['footer']['social']['whatsapp']))
                            <li>
                                <a href="{{ $content['footer']['social']['whatsapp'] }}" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                                    <i class="ri-whatsapp-line"></i>
                                </a>
                            </li>
                            @endif

                            @if(!empty($content['footer']['social']['linkedin']))
                            <li>
                                <a href="{{ $content['footer']['social']['linkedin'] }}" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                                    <i class="ri-linkedin-line"></i>
                                </a>
                            </li>
                            @endif
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </footer>
@endif
<!-- Footer end -->
