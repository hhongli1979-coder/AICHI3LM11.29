@use('Modules\Taxido\Models\ServiceCategory')
@php
    $serviceCategories = ServiceCategory::where('status', true)?->get(['id', 'name']);
@endphp
<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($plan) ? __('taxido::static.plans.edit') : __('taxido::static.plans.add') }}
                            ({{ request('locale', app()->getLocale()) }})
                        </h3>
                    </div>
                    @isset($plan)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('taxido::static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route('admin.plan.edit', ['plan' => $plan->id, 'locale' => $lang->locale]) }}"
                                                class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                target="_blank"><img
                                                    src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                    alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                                    class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route('admin.plan.edit', ['plan' => $plan->id, 'locale' => Session::get('locale', 'en')]) }}"
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
                        <label class="col-md-2"
                            for="name">{{ __('taxido::static.plans.name') }}<span>*</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <input class="form-control" type="text" name="name" id="name"
                                    value="{{ isset($plan->name) ? $plan->getTranslation('name', request('locale', app()->getLocale())) : old('name') }}"
                                    placeholder="{{ __('taxido::static.plans.enter_name') }} ({{ request('locale', app()->getLocale()) }})">
                                <i class="ri-file-copy-line copy-icon" data-target="#name"></i>
                            </div>
                            @error('name')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div id="description-group">
                        @if (!empty(old('description', $plan->description ?? [])))
                            @foreach (old('description', $plan->description ?? []) as $descriptionDetail)
                                <div class="form-group row">
                                    <label class="col-md-2" for="description">
                                        {{ __('taxido::static.plans.description') }}<span>
                                            *</span>
                                    </label>
                                    <div class="col-md-10">
                                        <div class="description-fields">
                                            <input class="form-control" type="text" name="description[]"
                                                placeholder="{{ __('taxido::static.plans.enter_description') }}"
                                                value="{{ $descriptionDetail }}">
                                            <button type="button" class="btn btn-danger remove-description">
                                                <i class="ri-delete-bin-line"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        @else
                            <div class="form-group row">
                                <label class="col-md-2" for="description">
                                    {{ __('taxido::static.plans.description') }}
                                </label>
                                <div class="col-md-10">
                                    <div class="description-fields">
                                        <input class="form-control" type="text" name="description[]"
                                            placeholder="{{ __('taxido::static.plans.enter_description') }}">
                                        <button type="button" class="btn remove-description">
                                            <i class="ri-delete-bin-line text-danger"></i>

                                        </button>
                                    </div>
                                </div>
                            </div>
                        @endif
                    </div>
                    <div class="added-button mb-sm-4 mb-3">
                        <button type="button" id="add-description" class="btn btn-primary mt-0 ms-auto">
                            {{ __('taxido::static.plans.add_description') }}
                        </button>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="duration">{{ __('taxido::static.plans.duration') }} <span
                                class="required-span">*</span></label>
                        <div class="col-md-10 error-div select-dropdown d-flex flex-column-reverse">
                            <select class="select-2 form-control" id="duration" name="duration"
                                data-placeholder="{{ __('taxido::static.plans.select_duration') }}">
                                <option class="select-placeholder" value=""></option>
                                @foreach (['daily' => 'Daily', 'weekly' => 'Weekly','monthly' => 'Monthly', 'yearly' => 'Yearly'] as $key => $option)
                                    <option class="option" value="{{ $key }}"
                                        @if (old('duration', $plan->duration ?? old('duration')) == $key) selected @endif>{{ $option }}</option>
                                @endforeach
                            </select>
                            @error('duration')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row amount">
                        <label class="col-md-2" for="price">{{ __('taxido::static.plans.price') }} <span class="required-span">*</span></label>
                        <div class="col-md-10">
                            <input class='form-control' type="number" min="1" name="price" id="price" value="{{ $plan->price ?? old('price') }}" placeholder="{{ __('taxido::static.plans.enter_plan_price') }}">
                            @error('price')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row" id="service-category-selection">
                        <label class="col-md-2"
                            for="serviceCategory">{{ __('taxido::static.plans.select_service_category') }}</label>
                        <div class="col-md-10">
                            <select class="form-control select-2" name="service_categories[]"
                                data-placeholder="{{ __('taxido::static.plans.select_service_categories') }}"
                                multiple>
                                @foreach ($serviceCategories as $index => $serviceCategory)
                                    <option value="{{ $serviceCategory->id }}"
                                        @if (@$plan?->service_categories) @if (in_array($serviceCategory->id, $plan->service_categories->pluck('id')->toArray()))
                                                selected @endif
                                    @elseif (old('service_categories.' . $index) == $serviceCategory->id) selected @endif>
                                        {{ $serviceCategory->name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('service_categories')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="plan">{{ __('taxido::static.plans.status') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="status" value="0">
                                    <input class="form-check-input" type="checkbox" name="status" id=""
                                        value="1" @checked(@$plan?->status ?? true)>
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
                                    <i class="ri-expand-left-line text-white lh-1"></i>{{ __('taxido::static.save_and_exit') }}
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

            // Change Password Form
            $('#planForm').validate({
                rules: {
                    "name": "required",
                    "price": "required",
                    "duration": "required"
                }
            });

            $(document).ready(function() {
                const MAX_DESCRIPTIONS = 5;

                function toggleRemoveButtons() {
                    if ($('#description-group .form-group').length === 1) {
                        $('#description-group .remove-description').hide();
                    } else {
                        $('#description-group .remove-description').show();
                    }
                }

                $('#add-description').on('click', function() {
                    const descriptionCount = $('#description-group .form-group').length;

                    if (descriptionCount >= MAX_DESCRIPTIONS) {

                        toastr.warning("{{ __('taxido::static.plans.message') }}");
                        return;
                    }

                    var newDescriptionField = $('#description-group .form-group:first').clone();
                    newDescriptionField.find('input').val('');
                    $('#description-group').append(newDescriptionField);
                    toggleRemoveButtons();
                });

                $(document).on('click', '.remove-description', function() {
                    $(this).closest('.form-group').remove();
                    toggleRemoveButtons();
                });

                toggleRemoveButtons();
            });
        })(jQuery);
    </script>
@endpush
