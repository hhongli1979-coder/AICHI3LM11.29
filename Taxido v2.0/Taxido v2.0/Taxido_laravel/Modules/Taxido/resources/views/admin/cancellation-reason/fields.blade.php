<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($cancellationReason) ? __('taxido::static.cancellation-reasons.edit') : __('taxido::static.cancellation-reasons.add') }}
                            ({{ request('locale', app()->getLocale()) }})
                        </h3>
                    </div>
                    @isset($cancellationReason)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('taxido::static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route('admin.cancellation-reason.edit', ['cancellation_reason' => $cancellationReason->id, 'locale' => $lang->locale]) }}"
                                            class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                            target="_blank"><img
                                            src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                            alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                            class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route('admin.cancellation-reason.edit', ['cancellation_reason' => $cancellationReason->id, 'locale' => Session::get('locale', 'en')]) }}"
                                            class="language-switcher active" target="blank"><img
                                            src="{{ asset('admin/images/flags/LR.png') }}" alt="">English<i
                                            class="ri-arrow-right-up-line"></i>
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
                            for="icon_image_id">{{ __('taxido::static.cancellation-reasons.image') }}</label>
                        <div class="col-md-10">
                            <div class="form-group">
                                <x-image :name="'icon_image_id'" :data="isset($cancellationReason->icon_image)
                                    ? $cancellationReason?->icon_image
                                    : old('icon_image_id')" :text="' '"
                                    :multiple="false"></x-image>
                                @error('icon_image_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2"
                            for="title">{{ __('taxido::static.cancellation-reasons.title') }}<span> *</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <input class="form-control" type="text" name="title" id="title"
                                    value="{{ isset($cancellationReason->title) ? $cancellationReason->getTranslation('title', request('locale', app()->getLocale())) : old('title') }}"
                                    placeholder="{{ __('taxido::static.cancellation-reasons.enter_title') }} ({{ request('locale', app()->getLocale()) }})"><i
                                    class="ri-file-copy-line copy-icon" data-target="#title"></i>
                            </div>
                            @error('title')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="for">{{ __('taxido::static.cancellation-reasons.for') }}<span> *</span></label>
                        <div class="col-md-10 select-label-error">
                            <select class="select-2 form-control" id="for" name="for"
                                data-placeholder="{{ __('taxido::static.cancellation-reasons.select_type') }}">
                                <option class="select-placeholder" value=""></option>
                                @foreach (['rider' => 'Rider', 'driver' => 'Driver'] as $key => $option)
                                    <option class="option" value="{{ $key }}"
                                        @if (old('for', $cancellationReason->for ?? '') == $key) selected @endif>{{ $option }}
                                    </option>
                                @endforeach
                            </select>
                            @error('for')
                                <div class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </div>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="ride_start">{{ __('taxido::static.cancellation-reasons.ride_start') }}<span> *</span></label>
                        <div class="col-md-10 select-label-error">
                            <select class="select-2 form-control" id="ride_start" name="ride_start"
                                data-placeholder="{{ __('taxido::static.cancellation-reasons.select_ride_start') }}">
                                <option class="select-placeholder" value=""></option>
                                @foreach (['before' => 'Before', 'after' => 'After'] as $key => $option)
                                    <option class="option" value="{{ $key }}"
                                        @if (old('ride_start', $cancellationReason->ride_start ?? '') == $key) selected @endif>{{ $option }}
                                    </option>
                                @endforeach
                            </select>
                            @error('ride_start')
                                <div class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </div>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="role">{{ __('taxido::static.status') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="status" value="0">
                                    <input class="form-check-input" type="checkbox" name="status" id=""
                                        value="1" @checked(@$cancellationReason?->status ?? true)>
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
            $('#cancellationReasonForm').validate({
                rules: {
                    "title": "required",
                    "for" : "required",
                    "ride_start" : "required"
                }
            });
        })(jQuery);
    </script>
@endpush
