<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($onboarding) ? __('taxido::static.onboardings.edit') : __('taxido::static.onboardings.add') }}
                            ({{ request('locale', app()->getLocale()) }})</h3>
                    </div>
                    @isset($onboarding)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('taxido::static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route('admin.onboarding.edit', ['onboarding' => $onboarding->id, 'locale' => $lang->locale]) }}"
                                                class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                target="_blank"><img
                                                src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                                class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route('admin.onboarding.edit', ['onboarding' => $onboarding->id, 'locale' => Session::get('locale', 'en')]) }}"
                                                class="language-switcher active" target="blank"><img
                                                src="{{ asset('admin/images/flags/LR.png') }}" alt="">English<i
                                                class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @endforelse
                                </ul>
                            </div>
                        </div>
                    @endisset
                    <input type="hidden" name="locale" value="{{ request('locale') }}">
                    <div class="form-group row">
                        <label class="col-md-2" for="onboarding_image_id">{{ __('taxido::static.onboardings.image') }}<span>
                                *</span><i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="*Upload image size 375x504px recommended"></i></label>
                        <div class="col-md-10">
                            <div class="form-group">
                                <x-image :name="'onboarding_image_id'" :data="isset($onboarding->onboarding_image)
                                    ? $onboarding?->onboarding_image
                                    : old('onboarding_image_id')" :text="' '"
                                    :multiple="false"></x-image>
                                @error('onboarding_image_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2"
                            for="title">{{ __('taxido::static.onboardings.title') }}<span>*</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <input class="form-control" type="text" name="title" id="title"
                                    value="{{ isset($onboarding->title) ? $onboarding->getTranslation('title', request('locale', app()->getLocale())) : old('title') }}"
                                    placeholder="{{ __('taxido::static.onboardings.enter_title') }} ({{ request('locale', app()->getLocale()) }})">
                                <i class="ri-file-copy-line copy-icon" data-target="#title"></i>
                            </div>
                            @error('title')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="description">{{ __('taxido::static.onboardings.description') }}
                            <span>
                                *</span></label>
                            <div class="col-md-10">
                            <div class="position-relative">
                                <textarea class="form-control"
                                    placeholder="{{ __('taxido::static.onboardings.enter_description') }} ({{ request('locale', app()->getLocale()) }})"
                                    rows="4" id="description" name="description" cols="50">{{ isset($onboarding->description) ? $onboarding->getTranslation('description', request('locale', app()->getLocale())) : old('description') }}</textarea><i class="ri-file-copy-line copy-icon"
                                    data-target="#description"></i>
                            </div>
                        </div>
                        @error('description')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="status">{{ __('taxido::static.status') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="status" value="0">
                                    <input class="form-check-input" type="checkbox" name="status" id=""
                                        value="1" @checked(@$onboarding?->status ?? true)>
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
                                    <i class="ri-save-line text-white lh-1"></i> {{ __('taxido::static.save') }}
                                </button>
                                <button type="submit" name="save_and_exit" class="btn btn-primary spinner-btn">
                                    <i
                                        class="ri-expand-left-line text-white lh-1"></i>{{ __('taxido::static.save_and_exit') }}
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

            $('#onboardingForm').validate({
                ignore: [],
                rules: {
                    "name": "required",
                    "title": {
                        "minlength": 4,
                        "maxlength": 30
                    },
                    "description": {
                        "minlength": 20,
                        "maxlength": 150
                    },
                }
            });
        })(jQuery);
    </script>
@endpush
