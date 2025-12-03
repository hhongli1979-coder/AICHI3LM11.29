<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($service) ? __('taxido::static.services.edit') : __('taxido::static.services.add') }}
                            ({{ request('locale', app()->getLocale()) }})</h3>
                    </div>
                    @isset($service)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('taxido::static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route('admin.service.edit', ['service' => $service->id, 'locale' => $lang->locale]) }}"
                                                class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                target="_blank"><img
                                                    src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                    alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                                    class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route('admin.service.edit', ['service' => $service->id, 'locale' => Session::get('locale', 'en')]) }}"
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
                            for="service_image_id">{{ __('taxido::static.services.image') }}<i class="ri-error-warning-line" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="*Upload image size 170x110px recommended"></i></label>
                        <div class="col-md-10">
                            <div class="form-group">
                                <x-image :name="'service_image_id'" :data="isset($service->service_image)
                                    ? $service?->service_image
                                    : old('service_image_id')" :text="''"
                                    :multiple="false"></x-image>
                                @error('service_image_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="service_icon_id">{{ __('taxido::static.services.icon') }}</label>
                        <div class="col-md-10">
                            <div class="form-group">
                                <x-image :name="'service_icon_id'" :data="isset($service->service_icon)
                                    ? $service?->service_icon
                                    : old('service_icon_id')" :text="''"
                                    :multiple="false"></x-image>
                                @error('service_icon_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="name">{{ __('taxido::static.services.name') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <input class="form-control" type="text" id="name" name="name"
                                    value="{{ isset($service->name) ? $service->getTranslation('name', request('locale', app()->getLocale())) : old('name') }}"
                                    placeholder="{{ __('taxido::static.services.enter_name') }} ({{ request('locale', app()->getLocale()) }})"><i
                                    class="ri-file-copy-line copy-icon" data-target="#name"></i>
                            </div>
                            @error('name')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="type">{{ __('taxido::static.services.type') }}<span>
                                *</span></label>
                        <div class="col-md-10 select-label-error">
                            <select class="select-2 form-control" id="type" name="type"
                                data-placeholder="{{ __('taxido::static.services.select_type') }}">
                                <option class="select-placeholder" value=""></option>
                                @foreach (['cab' => 'Cab', 'parcel' => 'Parcel', 'freight' => 'Freight', 'ambulance' => 'Ambulance'] as $key => $option)
                                    <option class="option" value="{{ $key }}"
                                        @if (old('type', $service->type ?? '') == $key) selected @endif>{{ $option }}</option>
                                @endforeach
                            </select>
                            @error('type')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="status">{{ __('taxido::static.status') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="status" value="0">
                                    <input class="form-check-input" type="checkbox" name="status" id=""
                                        value="1" @checked(@$service?->status ?? true)>
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
                                <button type="submit" name="save" class="btn btn-solid spinner-btn">
                                    {{ __('taxido::static.services.save') }}
                                </button>
                                <button type="submit" name="save_and_exit" class="btn btn-solid spinner-btn">
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

            $('#serviceForm').validate({
                ignore: [],
                rules: {
                    "name": "required",
                    "type": "required"
                }
            });
        })(jQuery);
    </script>
@endpush
