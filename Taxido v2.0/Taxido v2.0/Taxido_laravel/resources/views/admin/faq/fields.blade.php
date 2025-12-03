<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="accordion-sec">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($faq) ? __('static.faqs.edit_faq') : __('static.faqs.add_faq') }}
                            ({{ request('locale', app()->getLocale()) }})
                        </h3>
                    </div>
                    @isset($faq)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route('admin.faq.edit', ['faq' => $faq->id, 'locale' => $lang->locale]) }}"
                                                class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                target="_blank"><img
                                                    src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                    alt="">
                                                {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                                    class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route('admin.faq.edit', ['faq' => $faq->id, 'locale' => Session::get('locale', 'en')]) }}"
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
                    <form id="faqForm" method="POST"
                        action="{{ isset($faq) ? route('admin.faq.update', $faq->id) : route('admin.faq.store') }}">
                        @csrf
                        @if (isset($faq))
                            @method('PUT')
                        @endif
                        <div class="accordion" id="accordionExample">
                            @if (isset($faq))
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="heading0">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapse0" aria-expanded="true" aria-controls="collapse0">
                                            {{ __('static.faqs.faq_prefix') }} #1
                                            <i class="ri-arrow-up-s-line"></i>
                                        </button>
                                    </h2>
                                    <div id="collapse0" class="accordion-collapse collapse show"
                                        aria-labelledby="heading0" data-bs-parent="#accordionExample">
                                        <div class="accordion-body">
                                            <div class="form-group row">
                                                <label class="col-md-2" for="title0">{{ __('static.faqs.title') }}
                                                    <span>
                                                        *</span></label>
                                                <div class="col-md-10">
                                                    <input class="form-control" type="text" name="title"
                                                        id="title0"
                                                        placeholder="{{ __('static.faqs.enter_title') }}({{ request('locale', app()->getLocale()) }})"
                                                        value="{{ isset($faq->title) ? $faq->getTranslation('title', request('locale', app()->getLocale())) : old('title') }}"
                                                        required>
                                                </div>
                                            </div>
                                            <div class="col-md-10">
                                                <textarea class="form-control" rows="6" name="description" id="description0"
                                                    placeholder="{{ __('static.faqs.enter_description') }}({{ request('locale', app()->getLocale()) }})">
                                                                    {{ isset($faq->description) ? trim($faq->getTranslation('description', request('locale', app()->getLocale()))) : old('description') }}
                                                                </textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @else
                                <!-- Initial FAQ section -->
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="heading0">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapse0" aria-expanded="true" aria-controls="collapse0">
                                            {{ __('static.faqs.faq_prefix') }} #1
                                            <i class="ri-arrow-up-s-line"></i>
                                        </button>
                                    </h2>
                                    <div id="collapse0" class="accordion-collapse collapse show"
                                        aria-labelledby="heading0" data-bs-parent="#accordionExample">
                                        <div class="accordion-body">
                                            <div class="form-group row">
                                                <label class="col-md-2" for="title0">{{ __('static.faqs.title') }}
                                                    <span>
                                                        *</span></label>
                                                <div class="col-md-10">
                                                    <input class="form-control" type="text" name="faqs[0][title]"
                                                        id="title0"
                                                        placeholder="{{ __('static.faqs.enter_title') }}({{ request('locale', app()->getLocale()) }})"
                                                        required>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-2"
                                                    for="description0">{{ __('static.faqs.description') }}</label>
                                                <div class="col-md-10">
                                                    <textarea class="form-control" rows="6" name="faqs[0][description]" id="description0"
                                                        placeholder="{{ __('static.faqs.enter_description') }}({{ request('locale', app()->getLocale()) }})"></textarea>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <div class="col-12">
                                                    <div class="submit-btn">
                                                        <button type="button"
                                                            class="btn remove-faq">{{ __('static.faqs.delete') }}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @endif
                        </div>
                        <div class="col-md-12 mt-4">
                            <div class="form-group-row">
                                <div class="submit-btn">
                                    @if (!isset($faq))
                                        <button type="button" id="add-faq"
                                            class="btn btn-outline">{{ __('static.faqs.add_faq') }}</button>
                                    @endif
                                    <button type="submit" name="save" class="btn btn-solid spinner-btn">
                                        <i class="ri-save-line text-white lh-1"></i>{{ __('static.save') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
    <script>
        (function($) {
            "use strict";
            (function($) {
                "use strict";
                $(document).ready(function() {

                    $("#faqForm").validate({
                        ignore: [],
                        rules: {

                            "faqs[][title]": "required",
                            "faqs[][description]": "required"
                        }
                    });

                    let faqIndex = 1;
                    let faqStates = {};

                    function addFaqSection() {
                        var inputGroup = $('.accordion-item').first().clone();

                        var newId = 'collapse' + faqIndex;
                        var newHeadingId = 'heading' + faqIndex;

                        inputGroup.find('.accordion-button')
                            .attr('data-bs-target', '#' + newId)
                            .attr('aria-controls', newId)
                            .text("{{ __('static.faqs.faq_prefix') }} #" + (faqIndex + 1));


                        inputGroup.find('.accordion-button i.ri-arrow-up-s-line').remove();
                        var newIcon = $('<i>').addClass('ri-arrow-up-s-line');
                        inputGroup.find('.accordion-button').append(newIcon);

                        inputGroup.find('.accordion-collapse')
                            .attr('id', newId)
                            .attr('aria-labelledby', newHeadingId)
                            .collapse('show');

                        inputGroup.find('input[name^="faqs"]').each(function() {
                            var oldName = $(this).attr('name');
                            var newName = oldName.replace(/\[\d+\]/, '[' + faqIndex + ']');
                            $(this).attr('name', newName).attr('id', 'title' + faqIndex).val('');
                        });

                        inputGroup.find('textarea[name^="faqs"]').each(function() {
                            var oldName = $(this).attr('name');
                            var newName = oldName.replace(/\[\d+\]/, '[' + faqIndex + ']');
                            $(this).attr('name', newName).attr('id', 'description' + faqIndex).val(
                                '');
                        });

                        inputGroup.find('.is-invalid').removeClass('is-invalid');

                        $('#accordionExample').append(inputGroup);

                        faqStates[newId] = {
                            open: true
                        };

                        faqIndex++;

                        toggleDeleteButton();
                    }

                    function toggleDeleteButton() {
                        $('.remove-faq').each(function() {
                            if ($('.accordion-item').length > 1) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        });
                    }

                    function openFirstInvalidFaq() {
                        $('.accordion-item').each(function() {
                            if ($(this).find('.is-invalid').length > 0) {
                                const targetId = $(this).find('.accordion-button').attr(
                                    'data-bs-target');
                                $(targetId).collapse('show');
                                return false;
                            }
                        });
                    }

                    $('#add-faq').on('click', function() {
                        var allInputsFilled = true;

                        $('.accordion-item').each(function() {
                            var title = $(this).find('input[name^="faqs"][name$="[title]"]')
                                .val()?.trim();
                            var description = $(this).find(
                                    'textarea[name^="faqs"][name$="[description]"]').val()
                                ?.trim();
                            if (title === '') {
                                allInputsFilled = false;
                                $(this).find('input[name^="faqs"][name$="[title]"]')
                                    .addClass('is-invalid');
                            } else {
                                $(this).find('input[name^="faqs"][name$="[title]"]')
                                    .removeClass('is-invalid');
                            }
                            if (description === '') {
                                allInputsFilled = false;
                                $(this).find(
                                        'textarea[name^="faqs"][name$="[description]"]')
                                    .addClass('is-invalid');
                            } else {
                                $(this).find(
                                        'textarea[name^="faqs"][name$="[description]"]')
                                    .removeClass('is-invalid');
                            }
                        });

                        if (!allInputsFilled) {
                            openFirstInvalidFaq();
                            return;
                        }

                        $('.accordion-collapse').collapse('hide');
                        addFaqSection();
                    });

                    $(document).on('click', '.remove-faq', function() {
                        if ($('.accordion-item').length > 1) {
                            var targetCollapse = $(this).closest('.accordion-item').find(
                                '.accordion-collapse').attr('id');
                            faqStates[targetCollapse] = {
                                open: false
                            };
                            $(this).closest('.accordion-item').remove();
                            toggleDeleteButton();
                        }
                    });

                    toggleDeleteButton();

                    $('#accordionExample').on('click', '.accordion-button', function() {
                        var targetCollapse = $(this).attr('data-bs-target');
                        var $collapse = $(targetCollapse);

                        if ($collapse.hasClass('show')) {
                            $collapse.collapse('hide');
                            faqStates[targetCollapse] = {
                                open: false
                            };
                        } else {
                            $collapse.collapse('show');
                            faqStates[targetCollapse] = {
                                open: true
                            };
                        }
                    });

                    function restoreFaqStates() {
                        $.each(faqStates, function(id, state) {
                            if (state.open) {
                                $('#' + id).collapse('show');
                            } else {
                                $('#' + id).collapse('hide');
                            }
                        });
                    }

                    restoreFaqStates();
                });
            })(jQuery);

        })(jQuery);
    </script>
@endpush
