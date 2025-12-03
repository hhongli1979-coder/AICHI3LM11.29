@use('App\Models\Category')
@php
    $categories = Category::whereNull('deleted_at')->latest()->get();
    $recentCategories = Category::whereNull('deleted_at')->latest()->paginate(10);
@endphp
@if (isset($categories))
    <li class="control-section accordion-section add-page" id="add-page">
        <h3 class="accordion-section-title hndle" tabindex="0"> {{ __('static.categories.categories') }}<span
                class="screen-reader-text">{{ __('static.categories.press_return_or_enter_to_expand') }}</span></h3>
        <div class="accordion-section-content">
            <div class="inside">
                <div id="tabs-panel-posttype-post-most-recent" class="tabs-panel tabs-panel-active menu-item-tab"
                    role="region" aria-label="Most Recent" tabindex="0">
                    <ul class="nav nav-tabs" id="menuItemTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="most-recent-category-tab" data-bs-toggle="tab"
                                data-bs-target="#most-category-recent" type="button" role="tab"
                                aria-controls="most-recent"
                                aria-selected="true">{{ __('static.categories.most_recent') }}</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="view-all-category-tab" data-bs-toggle="tab"
                                data-bs-target="#view-all-category" type="button" role="tab"
                                aria-controls="view-all"
                                aria-selected="false">{{ __('static.categories.view_all') }}</button>
                        </li>
                    </ul>
                    <div class="tab-content tab-content-scroll" id="menuItemCategoryContent">
                        <div class="tab-pane fade show active custom-scrollbar" id="most-category-recent"
                            role="tabpanel" aria-labelledby="most-recent-category-tab">
                            <ul id="postchecklist-most-recent" class="categorychecklist form-no-clear">
                                @forelse ($recentCategories as $category)
                                    <li>
                                        <label class="menu-item-title">
                                            <input data-id="{{ $category?->id }}"
                                                id="custom-menu-item-widget-name-{{ $category?->id }}" type="checkbox"
                                                class="menu-item-checkbox" name="label"
                                                value="{{ $category?->name }}"> {{ $category?->name }}
                                        </label>
                                        <input type="hidden" class="custom-menu-item"
                                            id="custom-menu-item-widget-url-{{ $category?->id }}" name="url"
                                            value="{{ $category?->slug }}">
                                    </li>
                                @empty
                                    <li>

                                        <div class="no-data mt-3">
                                            <img src="{{ url('/images/no-data.png') }}" alt="">
                                            <h6 class="mt-2">{{ __('static.categories.no_category_found') }}</h6>
                                        </div>
                                    </li>
                                @endforelse
                            </ul>
                        </div>
                        <div class="tab-pane fade custom-scrollbar" id="view-all-category" role="tabpanel">
                            <ul id="postchecklist-view-all" class="categorychecklist form-no-clear">
                                @forelse ($categories as $category)
                                    <li><label class="menu-item-title"><input data-id="{{ $category?->id }}"
                                                id="custom-menu-item-widget-name-{{ $category?->id }}" type="checkbox"
                                                class="menu-item-checkbox" name="label"
                                                value="{{ $category?->name }}"> {{ $category?->name }}</label><input
                                            type="hidden" class="custom-menu-item"
                                            id="custom-menu-item-widget-url-{{ $category?->id }}" name="url"
                                            value="{{ $category?->slug }}"></li>
                                @empty
                                    <li>

                                        <div class="no-data mt-3">
                                            <img src="{{ url('/images/no-data.png') }}" alt="">
                                            <h6 class="mt-2">{{ __('static.categories.no_category_found') }}</h6>
                                        </div>
                                    </li>
                                @endforelse
                            </ul>
                        </div>
                    </div>
                    <div class="button-controls">
                        <div class="form-check p-0 float-start">
                            <input type="checkbox" class="form-check-input checkAll" id="select-all" disabled>
                            <label for="select-all" class="m-0">{{ __('static.categories.select_all') }}</label>
                        </div>
                        <a href="javascript:void(0)" onclick="addCustomMenuWidget()"
                            class="button-secondary submit-add-to-menu float-end right">
                            {{ __('static.categories.add_menu_item') }}
                        </a>
                        <span class="spinner" id="spincustomu"></span>
                    </div>
                </div>
            </div>
        </div>
    </li>
@endif
