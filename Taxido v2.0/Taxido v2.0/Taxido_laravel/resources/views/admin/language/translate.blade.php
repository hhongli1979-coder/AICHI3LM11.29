@extends('admin.layouts.master')
@section('title', __('static.languages.translate'))
@section('content')
    <div class="row">
        <div class="m-auto col-xl-10 col-xxl-8">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <div class="contentbox-subtitle">
                            <h3>{{ __('static.languages.translate') }}</h3>
                        </div>
                    </div>
                    <form class="" action="{{ route('admin.language.translate.update', ['id' => request()->id, 'file' => $file]) }}" method="POST">
                        @csrf
                        @method('POST')
                        <div class="form-group row">
                            <label class="col-3" for="locale">{{ __('static.languages.select_translate_file') }}</label>
                            <div class="col-9">
                                <select class="form-select select-2" name="file" id="file-select" onchange="updateURL()">
                                    data-placeholder="{{ __('Select Locale') }}">
                                    <option></option>
                                    @foreach ($allFiles as $fileName)
                                        <option value="{{ $fileName }}"
                                            @if ($fileName === @$file) selected @endif>
                                            {{ ucfirst($fileName) }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('locale')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group title-panel">
                            <div class="row">
                                <label class="col-3 mb-0">
                                    {{ __('static.key') }}
                                </label>
                                <label class="col-9 mb-0">
                                    {{ __('static.value') }}
                                </label>
                            </div>
                        </div>
                        <div class="table-responsive language-table custom-scroll">
                            @foreach ($translations as $key => $value)
                                @include('admin.language.trans-fields', ['key' => $key, 'value' => $value])
                            @endforeach
                            <div class="form-group row">
                                <div class="col-12">
                                    <div class="submit-btn">
                                        <button type="submit" name="save" class="btn btn-solid">
                                            {{ __('static.save') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="pagination">
                            {{ $translations->links() }}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('scripts')
    <script>
        "use strict";

        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('file-select').addEventListener('change', updateURL);
        });

        function updateURL() {
            const file = document.getElementById('file-select').value;
            const url = `{{ route('admin.language.translate', ['id' => 'ID', 'file' => 'FILE']) }}`
                .replace('ID', `{{ request()?->id }}`)
                .replace('FILE', file);

            window.location.href = url;
        }
    </script>
@endpush
