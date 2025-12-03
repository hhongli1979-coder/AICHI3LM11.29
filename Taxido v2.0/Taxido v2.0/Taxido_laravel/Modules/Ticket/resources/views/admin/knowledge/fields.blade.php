@use('Modules\Ticket\Models\Tag')
@use('Modules\Ticket\Models\Category')
@php
    $tags = Tag::where('status', true)?->get(['id', 'name']);
    $categories = Category::whereNull('parent_id')
        ?->with([
            'childs' => function ($query) {
                $query->where('status', true);
            },
        ])
        ->get();
@endphp
<div class="col-xl-9">
    <div class="left-part">
        <div class="contentbox">
            <div class="inside">
                <div class="contentbox-title">
                    <h3>{{ isset($knowledge) ? __('ticket::static.knowledge.edit') : __('ticket::static.knowledge.add') }}
                    </h3>
                </div>
                @isset($knowledge)
                    <div class="form-group row">
                        <label class="col-md-2" for="name">{{ __('ticket::static.language.languages') }}</label>
                        <div class="col-md-10">
                            <ul class="language-list">
                                @forelse (getLanguages() as $lang)
                                    <li>
                                        <a href="{{ route('admin.knowledge.edit', ['knowledge' => $knowledge->id, 'locale' => $lang->locale]) }}"
                                            class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                            target="_blank"><img
                                                src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                                class="ri-arrow-right-up-line"></i></a>
                                    </li>
                                @empty
                                    <li>
                                        <a href="{{ route('admin.knowledge.edit', ['knowledge' => $knowledge->id, 'locale' => Session::get('locale', 'en')]) }}"
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
                    <label class="col-md-2" for="title">{{ __('ticket::static.knowledge.title') }} <span> *</span>
                    </label>
                    <div class="col-md-10">
                        <div class="position-relative">
                            <input class="form-control" type="text" name="title" id="title"
                                value="{{ isset($knowledge->title) ? $knowledge->getTranslation('title', request('locale', app()->getLocale())) : old('title') }}"
                                placeholder="{{ __('ticket::static.knowledge.enter_title') }} ({{ request('locale', app()->getLocale()) }})"
                                required><i class="ri-file-copy-line copy-icon" data-target="#title"></i>
                        </div>
                        @error('title')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>
                </div>

                <div class="form-group row slug-blog">
                    <label class="col-md-2" for="slug">{{ __('ticket::static.knowledge.slug') }}<span>
                            *</span></label>
                    <div class="col-md-10 input-group mobile-input-group">
                        <span class="input-group-text"> {{ url('knowledge') }}/</span>
                        <input class="form-control" type="text" id="slug" name="slug"
                            placeholder="{{ __('ticket::static.knowledge.enter_slug') }}"
                            value="{{ isset($knowledge->slug) ? $knowledge->slug : old('slug') }}" disabled>
                        <div id="slug-loader" class="spinner-border" role="status" style="display: none;">
                        </div>
                    </div>
                </div>

                <div class="form-group row amount-input">
                    <label class="col-md-2" for="description">{{ __('ticket::static.knowledge.description') }} </label>
                    <div class="col-md-10">
                        <div class="position-relative">
                            <textarea class="form-control" rows="4" name="description" id="description"
                                placeholder="{{ __('ticket::static.knowledge.enter_description') }} ({{ request('locale', app()->getLocale()) }})"
                                cols="80">{{ isset($knowledge->description) ? $knowledge->getTranslation('description', request('locale', app()->getLocale())) : old('description') }}</textarea><i class="ri-file-copy-line copy-icon"
                                data-target="#description"></i>
                        </div>
                    </div>
                    @error('description')
                        <span class="invalid-feedback d-block" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>

                <div class="form-group row amount-input">
                    <label class="col-md-2" for="content">{{ __('ticket::static.knowledge.content') }} </label>
                    <div class="col-md-10 select-label-error">
                        <textarea class="form-control content" name="content"
                            placeholder="{{ __('ticket::static.knowledge.enter_content') }} ({{ request('locale', app()->getLocale()) }})"
                            required>{{ isset($knowledge->content) ? $knowledge->getTranslation('content', request('locale', app()->getLocale())) : old('content') }}
                        </textarea>
                    </div>
                    @error('content')
                        <span class="invalid-feedback d-block" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>

                <div class="form-group row">
                    <label class="col-md-2" for="knowledge_thumbnail_id">{{ __('ticket::static.knowledge.thumbnail') }}
                        <span> *</span></label>
                    <div class="col-md-10">
                        <div class="form-group">
                            <x-image :name="'knowledge_thumbnail_id'" :data="isset($knowledge->knowledge_thumbnail)
                                ? $knowledge?->knowledge_thumbnail
                                : old('knowledge_thumbnail_id')" :text="' '" :multiple="false"></x-image>
                            @error('knowledge_thumbnail_id')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="contentbox">
            <div class="inside">
                <div class="contentbox-title">
                    <h3>{{ __('ticket::static.knowledge.search_engine_optimization_(SEO)') }}</h3>
                    <div class="header-action">
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-md-2" for="meta_title">{{ __('ticket::static.knowledge.meta_title') }} </label>
                    <div class="col-md-10">
                        <input class="form-control" type="text" name="meta_title"
                            placeholder="{{ __('ticket::static.knowledge.enter_meta_title') }}"
                            value="{{ isset($knowledge->meta_title) ? $knowledge->meta_title : old('meta_title') }}">
                        @error('meta_title')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-md-2"
                        for="meta_description">{{ __('ticket::static.knowledge.meta_description') }} </label>
                    <div class="col-md-10">
                        <textarea class="form-control" rows="4" name="meta_description"
                            placeholder="{{ __('ticket::static.knowledge.enter_meta_description') }}" cols="80">{{ isset($knowledge->meta_description) ? $knowledge->meta_description : old('meta_description') }}</textarea>
                        @error('meta_description')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-md-2"
                        for="knowledge_meta_image_id">{{ __('ticket::static.knowledge.meta_image') }}</label>
                    <div class="col-md-10">
                        <div class="form-group">
                            <x-image :name="'knowledge_meta_image_id'" :data="isset($knowledge->knowledge_meta_image)
                                ? $knowledge?->knowledge_meta_image
                                : old('knowledge_meta_image_id')" :text="' '" :multiple="false"></x-image>
                            @error('knowledge_meta_image_id')
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
                    <h3>{{ __('ticket::static.knowledge.publish') }}</h3>
                </div>
                <div class="form-group row">
                    <div class="col-12">
                        <div class="row g-3">
                            <div class="col-12">
                                <div class="d-flex align-items-center gap-2 icon-position">
                                    <button type="submit" name="save" class="btn btn-primary">
                                        <i class="ri-save-line text-white lh-1"></i> {{ __('ticket::static.save') }}
                                    </button>
                                    <button type="submit" name="save_and_exit" class="btn btn-primary spinner-btn">
                                        <i
                                            class="ri-expand-left-line text-white lh-1"></i>{{ __('ticket::static.save_and_exit') }}
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
                <div class="contentbox-title flip">
                    <h3>{{ __('ticket::static.knowledge.additional_info') }}</h3>
                </div>
                <div class="slide">
                    <div class="form-group row">
                        <label class="col-12" for="categories">{{ __('ticket::static.categories.categories') }}
                            <span>*</span></label>
                        <div class="col-12 select-label-error">
                            <span class="text-gray category-note mt-1">
                                {{ __('ticket::static.knowledge.no_categories_message') }}
                                <a href="{{ @route('admin.ticket.category.index') }}" class="text-primary">
                                    <b>{{ __('ticket::static.here') }}</b>
                                </a>
                            </span>
                            <ul class="categorychecklist custom-scrollbar category">
                                @foreach ($categories as $category)
                                    <li class="category-list">
                                        <div class="form-check">
                                            <input type="checkbox" id="categories-{{ $category->id }}"
                                                data-id="{{ $category->id }}"
                                                data-parent="{{ $category->parent_id }}" name="categories[]"
                                                class="form-check-input" value="{{ $category->id }}"
                                                @checked(isset($knowledge) ? $knowledge->categories->pluck('id')->contains($category->id) : false) required>
                                            <label for="categories-{{ $category->id }}">{{ $category->name }}</label>
                                        </div>
                                        @if (!$category?->childs?->isEmpty())
                                            <ul>
                                                @include('components.category', [
                                                    'childs' => $category?->childs,
                                                ])
                                            </ul>
                                        @endif
                                    </li>
                                @endforeach
                                @if ($categories->isEmpty())
                                    <div class="no-data mt-3">
                                        <img src="{{ url('/images/no-data.png') }}" alt="">
                                        <h6 class="mt-2">{{ __('ticket::static.categories.no_category_found') }}
                                        </h6>
                                    </div>
                                @endif
                            </ul>
                            @error('categories')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-12" for="tags">{{ __('ticket::static.knowledge.tags') }}<span>
                                *</span></label>
                        <div class="col-12 select-label-error">
                            <span class="text-gray mt-1">
                                {{ __('ticket::static.knowledge.no_tags_message') }}
                                <a href="{{ @route('admin.ticket.tag.index') }}" class="text-primary">
                                    <b>{{ __('ticket::static.here') }}</b>
                                </a>
                            </span>
                            <select class="form-control select-2 tag" name="tags[]"
                                data-placeholder="{{ __('ticket::static.knowledge.select_tags') }}" multiple>
                                @foreach ($tags as $index => $tag)
                                    <option value="{{ $tag->id }}"
                                        @if (isset($knowledge->tags)) @if (in_array($tag->id, $knowledge->tags->pluck('id')->toArray()))
                                        selected @endif
                                    @elseif (old('tags.' . $index) == $tag->id) selected @endif>
                                        {{ $tag->name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('tags')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="contentbox">
            <div class="inside">
                <div class="contentbox-title">
                    <h3>{{ __('ticket::static.knowledge.status_header') }}</h3>
                </div>
                <div class="row g-3">
                    <div class="col-xl-12 col-md-4 col-sm-6">
                        <div class="form-group row">
                            <label class="col-12" for="status">{{ __('ticket::static.knowledge.status') }} </label>
                            <div class="col-12">
                                <div class="switch-field form-control">
                                    <input value="1" type="radio" name="status" id="status_active"
                                        @checked(boolval(@$knowledge?->status ?? true) == true) />
                                    <label for="status_active">{{ __('ticket::static.active') }}</label>
                                    <input value="0" type="radio" name="status" id="status_deactive"
                                        @checked(boolval(@$knowledge?->status ?? true) == false) />
                                    <label for="status_deactive">{{ __('ticket::static.deactive') }}</label>
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
                $('#knowledgeForm').validate({
                    rules: {
                        "title": "required",
                        "slug": "required",
                        "content": "required",
                        "categories[]": "required",
                        "tags[]": "required",
                    }
                });

                const fetchSlug = debounce(function() {
                    const title = $('#title').val();
                    const url = "{{ route('admin.knowledge.slug') }}";
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
