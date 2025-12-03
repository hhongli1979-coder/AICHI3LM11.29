<div class="row g-xl-4 g-3">
    <div class="col-xl-10 col-xxl-8 mx-auto">
        <div class="left-part">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ isset($document) ? __('taxido::static.documents.edit') : __('taxido::static.documents.add_document') }}
                            ({{ request('locale', app()->getLocale()) }})</h3>
                    </div>

                    @isset($document)
                        <div class="form-group row">
                            <label class="col-md-2" for="name">{{ __('taxido::static.language.languages') }}</label>
                            <div class="col-md-10">
                                <ul class="language-list">
                                    @forelse (getLanguages() as $lang)
                                        <li>
                                            <a href="{{ route('admin.document.edit', ['document' => $document->id, 'locale' => $lang->locale]) }}"
                                                class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                                target="_blank"><img
                                                    src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                                    alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                                    class="ri-arrow-right-up-line"></i></a>
                                        </li>
                                    @empty
                                        <li>
                                            <a href="{{ route('admin.document.edit', ['document' => $document->id, 'locale' => Session::get('locale', 'en')]) }}"
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
                        <label class="col-md-2" for="name">{{ __('taxido::static.documents.name') }} <span>
                                *</span></label>
                        <div class="col-md-10">
                            <div class="position-relative">
                                <input class="form-control" type="text" id="name" name="name"
                                    placeholder="{{ __('taxido::static.documents.enter_name') }} ({{ request('locale', app()->getLocale()) }})"
                                    value="{{ isset($document->name) ? $document->getTranslation('name', request('locale', app()->getLocale())) : old('name') }}"
                                    required><i class="ri-file-copy-line copy-icon" data-target="#name"></i>
                            </div>
                            @error('name')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>


                    <div class="form-group row">
                        <label class="col-md-2" for="type">{{ __('taxido::static.documents.type') }}<span>
                                *</span></label>
                        <div class="col-md-10 select-label-error">
                            <select class="select-2 form-control" id="type" name="type" required
                                data-placeholder="{{ __('taxido::static.documents.select_type') }}">
                                <option class="select-placeholder" value=""></option>
                                @foreach (['driver' => 'Driver', 'vehicle' => 'Vehicle', 'fleet_manager' => 'Fleet Manager'] as $key => $option)
                                    <option class="option" value="{{ $key }}"
                                        @if (old('type', $document->type ?? '') == $key) selected @endif>{{ $option }}
                                    </option>
                                @endforeach
                            </select>
                            @error('type')
                                <div class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </div>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2"
                            for="is_required">{{ __('taxido::static.documents.is_required') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="is_required" value="0">
                                    <input class="form-check-input" type="checkbox" name="is_required" id=""
                                        value="1" @checked(@$document?->is_required ?? false)>
                                    <span class="switch-state"></span>
                                </label>
                            </div>
                            @error('is_required')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2"
                            for="need_expired_date">{{ __('taxido::static.documents.need_expired_date') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="need_expired_date" value="0">
                                    <input class="form-check-input" type="checkbox" name="need_expired_date" id=""
                                        value="1" @checked(@$document?->need_expired_date ?? false)>
                                    <span class="switch-state"></span>
                                </label>
                            </div>
                            @error('need_expired_date')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-md-2" for="document">{{ __('taxido::static.status') }}</label>
                        <div class="col-md-10">
                            <div class="editor-space">
                                <label class="switch">
                                    <input class="form-control" type="hidden" name="status" value="0">
                                    <input class="form-check-input" type="checkbox" name="status" id=""
                                        value="1" @checked(@$document?->status ?? true)>
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
            $('#documentForm').validate(
                rules: {
                    "name": "required"
                }
            );
        })(jQuery);
    </script>
@endpush
