@use('Modules\Taxido\Models\Zone')
@php
    $zones = Zone::where('status', true)?->get(['id', 'name']);
@endphp
<div class="row">
    <div class="row g-xl-4 g-3">
        <div class="col-xl-10 col-xxl-8 mx-auto">
            <div class="left-part">
                <div class="contentbox">
                    <div class="inside">
                        <div class="contentbox-title">
                            <h3>{{ isset($sos) ? __('taxido::static.soses.edit') : __('taxido::static.soses.add') }}
                                ({{ request('locale', app()->getLocale()) }})</h3>
                        </div>

                        @isset($sos)
                            <div class="form-group row">
                                <label class="col-md-2" for="name">{{ __('taxido::static.language.languages') }}</label>
                                <div class="col-md-10">
                                    <ul class="language-list">
                                        @forelse (getLanguages() as $lang)
                                            <li>
                                                <a href="{{ route('admin.sos.edit', ['sos' => $sos->id, 'locale' => $lang->locale]) }}"
                                                    class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                    target="_blank"><img
                                                        src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                        alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                                        class="ri-arrow-right-up-line"></i></a>
                                            </li>
                                        @empty
                                            <li>
                                                <a href="{{ route('admin.sos.edit', ['sos' => $sos->id, 'locale' => Session::get('locale', 'en')]) }}"
                                                    class="language-switcher active" target="blank"><img
                                                        src="{{ asset('admin/images/flags/LR.png') }}"
                                                        alt="">English<i class="ri-arrow-right-up-line"></i></a>
                                            </li>
                                        @endforelse
                                    </ul>
                                </div>
                            </div>
                        @endisset
                        <input type="hidden" name="locale" value="{{ request('locale') }}">
                        <div class="form-group row">
                            <label class="col-md-2"
                                for="sos_image_id">{{ __('taxido::static.soses.sos_image') }}</label>
                            <div class="col-md-10">
                                <div class="form-group">
                                    <x-image :name="'sos_image_id'" :data="isset($sos->sos_image) ? $sos?->sos_image : old('sos_image_id')" :text="''"
                                        :multiple="false"></x-image>
                                    @error('sos_image_id')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2" for="title">{{ __('taxido::static.soses.title') }} <span>
                                    *</span></label>
                            <div class="col-md-10">
                                <div class="position-relative">
                                    <input class="form-control" id="title" type="text" name="title"
                                        value="{{ isset($sos->title) ? $sos->getTranslation('title', request('locale', app()->getLocale())) : old('title') }}"
                                        placeholder="{{ __('taxido::static.soses.enter_title') }} ({{ request('locale', app()->getLocale()) }})"><i
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
                            <label class="col-md-2" for="phone">{{ __('taxido::static.soses.phone') }}
                                <span>*</span></label>
                            <div class="col-md-10">
                                <div class="input-group mb-3 phone-detail">
                                    <div class="col-sm-1">
                                        <select class="select-2 form-control" id="select-country-code"
                                            name="country_code">
                                            @foreach (getCountryCodes() as $option)
                                                <option class="option" value="{{ $option->calling_code }}"
                                                    data-image="{{ asset('images/flags/' . $option->flag) }}"
                                                    @selected($option->calling_code == old('country_code', $sos->country_code ?? 1))>
                                                    {{ $option->calling_code }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="col-sm-11">
                                        <input class="form-control" type="number" name="phone"
                                            value="{{ isset($sos->phone) ? $sos->phone : old('phone') }}"
                                            placeholder="{{ __('taxido::static.soses.enter_phone') }}">
                                    </div>
                                    @error('phone')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2" for="zone">{{ __('taxido::static.soses.zones') }} <span>
                                    *</span></label>
                            <div class="col-md-10 select-label-error">
                            <span class="text-gray mt-1">
                                    {{ __('taxido::static.soses.no_zones_message') }}
                                    <a href="{{ @route('admin.zone.index') }}" class="text-primary">
                                        <b>{{ __('taxido::static.here') }}</b>
                                    </a>
                                </span>
                                <select class="form-control select-2 zone" name="zones[]"
                                    data-placeholder="{{ __('taxido::static.soses.select_zones') }}" multiple>
                                    @foreach ($zones as $index => $zone)
                                        <option value="{{ $zone->id }}"
                                            @if (isset($sos->zones)) @if (in_array($zone->id, $sos->zones->pluck('id')->toArray()))
                                    selected @endif
                                        @elseif (old('zones.' . $index) == $zone->id) selected @endif>
                                            {{ $zone->name }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('zones')
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
                                            value="1" @checked(@$sos?->status ?? true)>
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
</div>
@push('scripts')
    <script>
        (function($) {
            "use strict";
            $('#sosForm').validate({
                rules: {
                    "title": "required",
                    "sos_image_id": "required",
                    "phone": {
                        "required": true,
                        "minlength": 6,
                        "maxlength": 15
                    },
                    "zones[]": "required"
                }
            });
        })(jQuery);
    </script>
@endpush
