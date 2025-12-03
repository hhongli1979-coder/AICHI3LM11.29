<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title flip">
                        <h3>{{ isset($testimonial) ? __('static.testimonials.edit_testimonial') : __('static.testimonials.add_testimonial') }}
                            ({{ app()->getLocale() }})
                        </h3>
                    </div>
                    @isset($testimonial)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route('admin.testimonial.edit', ['testimonial' => $testimonial->id, 'locale' => $lang->locale]) }}"
                                                class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                target="_blank">
                                                <img src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                    alt="">
                                                {{ @$lang?->name }} ({{ @$lang?->locale }})
                                                <i class="ri-arrow-right-up-line"></i>
                                            </a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route('admin.testimonial.edit', ['testimonial' => $testimonial->id, 'locale' => Session::get('locale', 'en')]) }}"
                                                class="language-switcher active" target="blank">
                                                <img src="{{ asset('admin/images/flags/LR.png') }}" alt="">
                                                English
                                                <i class="ri-arrow-right-up-line"></i>
                                            </a>
                                        </li>
                                    @endforelse
                                </ul>
                            </div>
                        </div>
                    @endisset
                    <input type="hidden" name="locale" value="{{ request('locale') }}">
                    <div class="form-group row">
                        <label class="col-md-2"
                            for="profile_image_id">{{ __('static.testimonials.user_image') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <div class="form-group">
                                <x-image :name="'profile_image_id'" :data="isset($testimonial->profile_image)
                                    ? $testimonial?->profile_image
                                    : old('profile_image_id')" :text="' '"
                                    :multiple="false"></x-image>
                                @error('profile_image_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="title">{{ __('static.testimonials.title') }} <span>
                                *</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <input class="form-control" type="text" id="title" name="title"
                                    value="{{ isset($testimonial->title) ? $testimonial->getTranslation('title', request('locale', app()->getLocale())) : old('title') }}"
                                    placeholder="{{ __('static.testimonials.enter_title') }} ({{ request('locale', app()->getLocale()) }})"
                                    required><i class="ri-file-copy-line copy-icon" data-target="#title"></i>
                            </div>
                            @error('title')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="rating">{{ __('static.testimonials.rating') }} <span>
                                *</span></label>
                        <div class="col-md-10">
                            <input class="form-control" type="number" name="rating" id="rating"
                                placeholder="{{ __('static.testimonials.enter_rating') }}"
                                value="{{ isset($testimonial->rating) ? $testimonial->rating : old('rating') }}"
                                min="1" max="5" required>
                            @error('rating')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="description">{{ __('static.testimonials.description') }} <span> *</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <textarea class="form-control" rows="2" name="description"
                                    placeholder="{{ __('static.testimonials.enter_testimonial_description') }} ({{ request('locale', app()->getLocale()) }})"
                                    cols="80">{{ isset($testimonial->description) ? $testimonial->getTranslation('description', request('locale', app()->getLocale())) : old('description') }}</textarea><i class="ri-file-copy-line copy-icon"
                                    data-target="#description"></i>
                            </div>
                            @error('description')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="role">{{ __('static.status') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="status" value="0">
                                    <input class="form-check-input" type="checkbox" name="status" id=""
                                        value="1" @checked(@$testimonial?->status ?? true)>
                                    <span class="switch-state"></span>
                                </label>
                            </div>
                            @error('status')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <div class="col-12">
                            <div class="submit-btn">
                                <button type="submit" name="save" class="btn btn-primary spinner-btn">
                                    <i class="ri-save-line text-white lh-1"></i> {{ __('static.save') }}
                                </button>
                                <button type="submit" name="save_and_exit" class="btn btn-primary spinner-btn">
                                    <i class="ri-expand-left-line text-white lh-1"></i>{{ __('static.save_and_exit') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@push('scripts')
    <script>
        (function($) {
            "use strict";
            $('#testimonialForm').validate({
                rules: {
                    "title": "required",
                    "rating": {
                        "required": true,
                        "minlength": 1,
                        "maxlength": 5
                    },
                    "description": "required",
                    "profile_image_id": "required",
                }
            });
        })(jQuery);
    </script>
@endpush
