<div class="row g-xl-4 g-3">
    <div class="col-xl-9">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($page) ? __('static.pages.edit_page') : __('static.pages.add') }}
                            ({{ request('locale', app()->getLocale()) }})</h3>
                    </div>
                    @isset($page)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route('admin.page.edit', ['page' => $page->id, 'locale' => $lang->locale]) }}"
                                                class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                target="_blank"><img
                                                    src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                    alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                                    class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route('admin.page.edit', ['page' => $page->id, 'locale' => Session::get('locale', 'en')]) }}"
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
                        <label class="col-md-2" for="title">{{ __('static.pages.title') }} <span> *</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <input class="form-control" type="text" name="title" id="title"
                                    value="{{ isset($page->title) ? $page->getTranslation('title', request('locale', app()->getLocale())) : old('title') }}"
                                    placeholder="{{ __('static.pages.enter_title') }} ({{ request('locale', app()->getLocale()) }})"><i
                                    class="ri-file-copy-line copy-icon" data-target="#title"></i>
                            </div>
                            @error('title')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row slug-blog">
                        <label class="col-md-2" for="slug">{{ __('static.pages.slug') }}</label>
                        <div class="col-md-10 input-group mobile-input-group">
                            <span class="input-group-text"> {{ url('page') }}/</span>
                            <input class="form-control" type="text" id="slug" name="slug"
                                placeholder="{{ __('static.pages.enter_slug') }}"
                                value="{{ isset($page->slug) ? $page->slug : old('slug') }}" disabled>
                            <div id="slug-loader" class="spinner-border" role="status" style="display: none;">
                            </div>
                        </div>
                    </div>

                    <div class="form-group row amount-input">
                        <label class="col-md-2" for="content">{{ __('static.pages.content') }} <span> *</span></label>
                        <div class="col-md-10 select-label-error">
                            <textarea class="form-control content" name="content" id="content"
                                placeholder="{{ __('static.pages.enter_content') }}({{ request('locale', app()->getLocale()) }})">
                                {{ isset($page->content) ? $page->getTranslation('content', request('locale', app()->getLocale())) : old('content') }}
                            </textarea>
                            @error('content')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                </div>
            </div>
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ __('static.pages.search_engine_optimization_(SEO)') }}</h3>
                        <div class="header-action">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="meta_title">{{ __('static.pages.meta_title') }} </label>
                        <div class="col-md-10">
                            <input class="form-control" type="text" name="meta_title"
                                value="{{ isset($page->meta_title) ? $page->meta_title : old('meta_title') }}"
                                placeholder="{{ __('static.pages.enter_meta_title') }}">
                            @error('meta_title')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2"
                            for="meta_description">{{ __('static.pages.meta_description') }}</label>
                        <div class="col-md-10">
                            <textarea class="form-control" rows="4" name="meta_description"
                                placeholder="{{ __('static.pages.enter_meta_description') }}" cols="80">{{ isset($page->meta_description) ? $page->meta_description : old('meta_description') }}</textarea>
                            @error('meta_description')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="page_meta_image_id">{{ __('static.pages.meta_image') }}</label>
                        <div class="col-md-10">
                            <div class="form-group">
                                <x-image :name="'page_meta_image_id'" :data="isset($page->meta_image) ? $page?->meta_image : old('page_meta_image_id')" :text="' '"
                                    :multiple="false"></x-image>
                                @error('page_meta_image_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-xl-3">
        <div class="p-sticky">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ __('static.pages.publish') }}</h3>
                    </div>
                    <div class="form-group row">
                        <div class="col-12">
                            <div class="row g-3">
                                <div class="col-12">
                                    <div class="d-flex align-items-center gap-2 icon-position">
                                        <button type="submit" name="save" class="btn btn-primary">
                                            <i class="ri-save-line text-white lh-1"></i> {{ __('static.save') }}
                                        </button>
                                        <button type="submit" name="save_and_exit"
                                            class="btn btn-primary spinner-btn">
                                            <i
                                                class="ri-expand-left-line text-white lh-1"></i>{{ __('static.save_and_exit') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ __('static.pages.additional_info') }}</h3>
                    </div>
                    <div class="row g-3">
                        <div class="col-xl-12 col-md-4 col-sm-6">
                            <div class="form-group row">
                                <label class="col-12" for="status">{{ __('static.pages.status') }} </label>
                                <div class="col-12">
                                    <div class="switch-field form-control">
                                        <input type="radio" name="status" id="feature_active" checked
                                            value="1" @checked(boolval(@$page?->status ?? true) == true) />
                                        <label for="feature_active">{{ __('static.active') }}</label>
                                        <input type="radio" name="status" id="feature_deactive" value="0"
                                            @checked(boolval(@$page?->status ?? true) == false) />
                                        <label for="feature_deactive">{{ __('static.deactive') }} </label>
                                    </div>
                                </div>
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

            function debounce(func, delay) {
                let timeout;
                return function(...args) {
                    const context = this;
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(context, args), delay);
                };
            }

            $(document).ready(function() {
                $('#pageForm').validate({
                    rules: {
                        "title": "required",
                        "slug": "required",
                        "content": "required",
                    }
                });

                const fetchSlug = debounce(function() {
                    const title = $('#title').val();
                    const url = "{{ route('admin.page.slug') }}";
                    const saveButton = $('button[type="submit"]');

                    saveButton.prop('disabled', true);

                    $('#slug').prop('disabled', true);
                    $('#slug-loader').show();

                    $.ajax({
                        url: url + "?title=" + encodeURIComponent(title),
                        type: 'GET',
                        success: function(data) {
                            $('#slug').val(data.slug);
                        },
                        complete: function() {
                            $('#slug').prop('disabled', false);
                            $('#slug-loader').hide();
                            saveButton.prop('disabled', false);
                        },
                        error: function() {
                            $('#slug').prop('disabled', false);
                            $('#slug-loader').hide();
                            saveButton.prop('disabled', false);
                        }
                    });
                }, 500);

                $('#title').on('input', fetchSlug);
            });

        })(jQuery);
    </script>
@endpush
