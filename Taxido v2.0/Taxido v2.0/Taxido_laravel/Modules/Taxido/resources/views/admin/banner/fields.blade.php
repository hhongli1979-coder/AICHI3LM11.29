@use('Modules\Taxido\Models\Service')
@php
    $services = Service::where('status', true)?->get(['id', 'name']);
@endphp
<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($banner) ? __('taxido::static.banners.edit') : __('taxido::static.banners.add') }}
                            ({{ request('locale', app()->getLocale()) }})
                        </h3>
                    </div>
                    @isset($banner)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('taxido::static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route('admin.banner.edit', ['banner' => $banner->id, 'locale' => $lang->locale]) }}"
                                                class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                target="_blank"><img
                                                src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                                class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route('admin.banner.edit', ['banner' => $banner->id, 'locale' => Session::get('locale', 'en')]) }}"
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
                        <label class="col-md-2" for="banner_image_id">{{ __('taxido::static.banners.image') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <div class="form-group">
                                <x-image :name="'banner_image_id'" :data="isset($banner->banner_image)
                                    ? $banner?->banner_image
                                    : old('banner_image_id')" :text=" __('taxido::static.banners.recommended')"
                                    :multiple="false"></x-image>
                                @error('banner_image_id')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                         
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2"
                            for="title">{{ __('taxido::static.banners.title') }}<span>*</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <input class="form-control" type="text" name="title" id="title"
                                    value="{{ isset($banner->title) ? $banner->getTranslation('title', request('locale', app()->getLocale())) : old('title') }}"
                                    placeholder="{{ __('taxido::static.banners.enter_title') }} ({{ request('locale', app()->getLocale()) }})">
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
                        <label class="col-md-2" for="order">{{ __('taxido::static.banners.order') }}<span>
                                *</span></label>
                        <div class="col-md-10">
                            <input class="form-control" type="number" name="order"
                                value="{{ isset($banner->order) ? $banner->order : old('order') }}"
                                placeholder="{{ __('taxido::static.banners.enter_order') }}">
                            @error('order')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2"
                            for="zone">{{ __('taxido::static.service_categories.services') }} <span>
                                *</span></label>
                        <div class="col-md-10 select-label-error">
                            <select class="form-control select-2 service" name="services[]"
                                data-placeholder="{{ __('taxido::static.service_categories.select_services') }}"
                                multiple>
                                @foreach ($services as $service)
                                    <option value="{{ $service->id }}"
                                        @if (isset($banner->services) && in_array($service->id, $banner->services->pluck('id')->toArray())) 
                                            selected 
                                        @elseif (old('services') && in_array($service->id, old('services'))) 
                                            selected 
                                        @endif>
                                        {{ $service->name }}
                                    </option>
                                @endforeach
                            </select>

                            @error('services')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="banner">{{ __('taxido::static.banners.status') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="status" value="0">
                                    <input class="form-check-input" type="checkbox" name="status" id=""
                                        value="1" @checked(@$banner?->status ?? true)>
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
        
        $('#bannerForm').validate({
            rules: {
                "title": "required",
                "order": "required",
                "banner_image_id": "required",
                "services[]": "required"
            }
        });        
    })(jQuery);
</script>
@endpush
