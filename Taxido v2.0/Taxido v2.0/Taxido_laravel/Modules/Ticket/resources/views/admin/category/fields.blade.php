<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <h3>{{ isset($cat->name) ? __('ticket::static.categories.edit_category') : __('ticket::static.categories.add_category') }}
                ({{ app()->getLocale() }})
            </h3>
        </div>
        @isset($cat)
            <div class="form-group row">
                <label class="col-md-2" for="name">{{ __('ticket::static.language.languages') }}</label>
                <div class="col-md-10">
                    <ul class="language-list">
                        @forelse (getLanguages() as $lang)
                            <li>
                                <a href="{{ route('admin.ticket.category.edit', ['category' => $cat->id, 'locale' => $lang->locale]) }}"
                                    class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                    target="_blank"><img
                                        src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                        alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                        class="ri-arrow-right-up-line"></i></a>
                            </li>
                        @empty
                            <li>
                                <a href="{{ route('admin.ticket.category.edit', ['category' => $cat->id, 'locale' => Session::get('locale', 'en')]) }}"
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
            <label class="col-md-2" for="name">{{ __('ticket::static.categories.name') }} <span> *</span> </label>
            <div class="col-md-10">
                <div class="position-relative">
                    <input class="form-control" type="text" name="name" id="name"
                        value="{{ isset($cat->name) ? $cat->getTranslation('name', request('locale', app()->getLocale())) : old('name') }}"
                        placeholder="{{ __('ticket::static.categories.enter_name') }}({{ request('locale', app()->getLocale()) }})"
                        required><i class="ri-file-copy-line copy-icon" data-target="#name"></i>
                </div>
                @error('name')
                    <span class="invalid-feedback d-block" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>

        <div class="form-group row slug-blog">
            <label class="col-md-2" for="slug">{{ __('ticket::static.categories.slug') }} <span> *</span></label>
            <div class="col-md-10 input-group mobile-input-group">
                <span class="input-group-text"> {{ url('category') }}/</span>
                <input class="form-control" type="text" id="slug" name="slug"
                    placeholder="{{ __('ticket::static.categories.enter_slug') }}"
                    value="{{ isset($cat->slug) ? $cat->slug : old('slug') }}" disabled>
                <div id="slug-loader" class="spinner-border" role="status" style="display: none;">
                </div>
            </div>
        </div>

        <div class="form-group row">
            <label class="col-md-2" for="description">{{ __('ticket::static.categories.description') }}</label>
            <div class="col-md-10">
                <div class="position-relative">
                    <textarea class="form-control" rows="4" name="description" cols="80" id="description"
                        placeholder="{{ __('ticket::static.categories.enter_description') }}({{ request('locale', app()->getLocale()) }})">{{ isset($cat->description) ? $cat->getTranslation('description', request('locale', app()->getLocale())) : old('description') }}</textarea><i class="ri-file-copy-line copy-icon" data-target="#description"></i>
                </div>
                @error('description')
                    <span class="invalid-feedback d-block" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>
        <div class="form-group row">
            <label class="col-md-2" for="parent_id">{{ __('ticket::static.categories.parent') }}</label>
            <div class="col-md-10 select-label-error">
                <select class="form-select select-2" name="parent_id"
                    data-placeholder="{{ __('ticket::static.categories.select_parent') }}">
                    <option class="option" value="" selected></option>
                    @foreach ($parents as $key => $category)
                        <option class="option" @if ($key == @$cat?->id) disabled @endif
                            @selected(old('parent_id', @$cat->parent_id) == $key) value="{{ $key }}">{{ $category }}
                        </option>
                    @endforeach
                </select>
                @error('parent_id')
                    <span class="invalid-feedback d-block" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>
        <div class="form-group row">
            <label class="col-md-2" class="col-12"
                for="category_image_id">{{ __('ticket::static.categories.image') }}</label>
            <div class="col-md-10">
                <div class="form-group">
                    <x-image :name="'category_image_id'" :data="isset($cat->category_image) ? $cat?->category_image : old('category_image_id')" :text="''" :multiple="false">
                    </x-image>
                    @error('category_image_id')
                        <span class="invalid-feedback d-block" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>
            </div>
        </div>

        <div class="form-group row">
            <label class="col-md-2" for="meta_title">{{ __('ticket::static.categories.meta_title') }} </label>
            <div class="col-md-10">
                <input class="form-control" type="text" name="meta_title"
                    placeholder="{{ __('ticket::static.categories.enter_meta_title') }}"
                    value="{{ isset($cat->meta_title) ? $cat->meta_title : old('meta_title') }}">
                @error('meta_title')
                    <span class="invalid-feedback d-block" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>

        <div class="form-group row">
            <label class="col-md-2" for="meta_description">{{ __('ticket::static.categories.meta_description') }}
            </label>
            <div class="col-md-10">
                <textarea class="form-control" rows="4" name="meta_description"
                    placeholder="{{ __('ticket::static.categories.enter_meta_description') }}" cols="80">{{ isset($cat->meta_description) ? $cat->meta_description : old('meta_description') }}</textarea>
                @error('meta_description')
                    <span class="invalid-feedback d-block" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>
        <div class="form-group row">
            <label class="col-md-2"
                for="category_meta_image_id">{{ __('ticket::static.categories.meta_image') }}</label>
            <div class="col-md-10">
                <div class="form-group">
                    <x-image :name="'category_meta_image_id'" :data="isset($cat->category_meta_image)
                        ? $cat?->category_meta_image
                        : old('category_meta_image_id')" :text="' '" :multiple="false"></x-image>
                    @error('category_meta_image_id')
                        <span class="invalid-feedback d-block" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-md-2" for="">{{ __('ticket::static.categories.status') }}</label>
            <div class="col-md-10">
                <div class="editor-space">
                    <label class="switch">
                        <input class="form-control" type="hidden" name="status" value="0">
                        <input class="form-check-input" type="checkbox" name="status" id=""
                            value="1" @checked(@$cat?->status ?? true)>
                        <span class="switch-state"></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="submit-btn">
            <button type="submit" name="save" class="btn btn-solid spinner-btn">
                <i class="ri-save-line text-white lh-1"></i> {{ __('static.save') }}
            </button>
            <button type="submit" name="save_and_exit" class="btn btn-solid spinner-btn">
                <i
                    class="ri-expand-left-line text-white lh-1"></i>{{ __('static.save_and_exit') }}
            </button>
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
                $('#categoryForm').validate({
                    rules: {
                        "name": "required",
                        "slug": "required",
                    }
                });

                const fetchSlug = debounce(function() {
                    var nameField = $(this);
                    var slugField = $('#slug');
                    var loader = $('#slug-loader');
                    var saveButton = $('button[type="submit"]');

                    saveButton.prop('disabled', true);

                    loader.show();
                    slugField.prop('disabled', true);

                    var url = "{{ route('admin.ticket.category.slug') }}";
                    $.ajax({
                        url: url + "?name=" + encodeURIComponent(nameField.val()),
                        type: 'GET',
                        success: function(data) {
                            slugField.val(data.slug);
                        },
                        complete: function() {
                            loader.hide();
                            slugField.prop('disabled', false);
                            saveButton.prop('disabled', false);
                        },
                        error: function() {
                            loader.hide();
                            slugField.prop('disabled', false);
                            saveButton.prop('disabled', false);
                        }
                    });
                }, 500);

                $('#name').on('input', fetchSlug);
            });
        })(jQuery);
    </script>
@endpush
