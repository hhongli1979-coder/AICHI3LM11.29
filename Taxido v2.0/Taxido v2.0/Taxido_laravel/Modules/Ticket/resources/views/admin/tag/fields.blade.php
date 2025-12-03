<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <h3>{{ isset($tag) ? __('ticket::static.tags.edit_tag') : __('ticket::static.tags.add_tag') }}
                ({{ app()->getLocale() }})</h3>
            @if (!Request::is('admin/ticket/tag'))
                <a href="{{ route('admin.ticket.tag.index') }}"
                    class="btn btn-primary">{{ __('ticket::static.tags.add_tag') }}</a>
            @endif
        </div>
        @isset($tag)
            <div class="form-group row">
                <label class="col-md-2" for="name">{{ __('ticket::static.language.languages') }}</label>
                <div class="col-md-10">
                    <ul class="language-list">
                        @forelse (getLanguages() as $lang)
                            <li>
                                <a href="{{ route('admin.tag.edit', ['tag' => $tag->id, 'locale' => $lang->locale]) }}"
                                    class="language-switcher {{ request('locale') === $lang->locale ? 'active' : '' }}"
                                    target="_blank"><img
                                        src="{{ @$lang?->flag ?? asset('admin/images/No-image-found.jpg') }}"
                                        alt=""> {{ @$lang?->name }} ({{ @$lang?->locale }})<i
                                        class="ri-arrow-right-up-line"></i></a>
                            </li>
                        @empty
                            <li>
                                <a href="{{ route('admin.tag.edit', ['tag' => $tag->id, 'locale' => Session::get('locale', 'en')]) }}"
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
            <label class="col-12" for="name">{{ __('ticket::static.tags.name') }} <span> *</span> </label>
            <div class="col-12">
                <div class="position-relative">
                    <input class="form-control" type="text" name="name" id="name"
                        value="{{ isset($tag->name) ? $tag->getTranslation('name', request('locale', app()->getLocale())) : old('name') }}"
                        placeholder="{{ __('ticket::static.tags.enter_name') }} ({{ request('locale', app()->getLocale()) }})"><i
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
            <label class="col-12" for="description">{{ __('ticket::static.tags.description') }}</label>
            <div class="col-12">
                <div class="position-relative">
                    <textarea class="form-control" rows="4" id="description" name="description" cols="80"
                        placeholder="{{ __('ticket::static.tags.description') }}({{ request('locale', app()->getLocale()) }})">{{ isset($tag->description) ? $tag->getTranslation('description', request('locale', app()->getLocale())) : old('description') }}</textarea><i class="ri-file-copy-line copy-icon" data-target="#description"></i>
                </div>
                @error('description')
                    <span class="invalid-feedback d-block" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>
        <div class="form-group row">
            <label class="col-12" for="status">{{ __('ticket::static.tags.status') }}</label>
            <div class="col-12">
                <div class="editor-space">
                    <label class="switch">
                        <input class="form-control" type="hidden" name="status" value="0">
                        <input class="form-check-input" type="checkbox" name="status" id="" value="1"
                            @checked(@$tag?->status ?? true)>
                        <span class="switch-state"></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <div class="col-12">
                <div class="submit-btn">
                    <button type="submit" name="save" class="btn btn-primary spinner-btn">
                        <i class="ri-save-line text-white lh-1"></i> {{ __('ticket::static.save') }}
                    </button>
                    <button type="submit" name="save_and_exit" class="btn btn-primary spinner-btn">
                        <i class="ri-expand-left-line text-white lh-1"></i>{{ __('ticket::static.save_and_exit') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
@push('scripts')
    <script>
        (function($) {
            "use strict";
            $('#tagForm').validate({
                rules: {
                    "name": "required",
                }
            });
        })(jQuery);
    </script>
@endpush
