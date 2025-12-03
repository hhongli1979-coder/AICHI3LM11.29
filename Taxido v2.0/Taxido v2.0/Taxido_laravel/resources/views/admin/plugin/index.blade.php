@use('Nwidart\Modules\Facades\Module')
@extends('admin.layouts.master')
@section('title', __('static.plugins.plugins'))
@push('css')
<!-- Dropzone css-->
<link rel="stylesheet" type="text/css" href="{{ asset('css/vendors/dropzone.css') }}">
@endpush
@section('content')
<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <div class="contentbox-subtitle">
                <h3>{{ __('static.plugins.plugins') }}</h3>
                <a href="javascript:void(0)" class="btn btn-outline addNewMedia">{{ __('static.plugins.upload_plugin') }}</a>
            </div>
        </div>
        <div class="media-dropzone mt-4 p-0">
            <form action="{{ route('admin.plugin.store') }}" method="POST" class="digits files form-container dropzone" id="plugin-dropzone">
                @csrf
                <div class="upload-files-container">
                    <div class="dz-message needsclick">
                        <span class="upload-icon"><i class="ri-upload-2-line"></i></span>
                        <h3>{{ __('static.plugins.drop_zip_file') }}</h3>
                        <button type="button" class="browse-files mb-2">{{ __('static.plugins.select_files') }}</button>
                    </div>
                    <button type="button" class="upload-button" id="submit-files">{{ __('static.plugins.upload') }}</button>
                </div>
                <i class="ri-close-line media-close"></i>
            </form>
        </div>
        <x-table
            :columns="$tableConfig['columns']"
            :data="$tableConfig['data']"
            :filters="$tableConfig['filters']"
            :actions="$tableConfig['actions']"
            :total="$tableConfig['total']"
            :bulkactions="$tableConfig['bulkactions']"
            :search="true">
        </x-table>
    </div>
</div>
@endsection

@push('scripts')
    <script type="text/javascript" src="{{ asset('js/dropzone/dropzone.js') }}"></script>
    <script type="text/javascript" src="{{ asset('js/dropzone/dropzone-script.js') }}"></script>
    <script>
        (function($) {
            Dropzone.autoDiscover = false;
            var $pluginDropzone = $('.media-dropzone');
            var $countSelectedItems = $('#count-selected-items');
            var $csrfToken = $('meta[name="csrf-token"]').attr('content');

            // Toggle media dropzone visibility
            $('.addNewMedia, .media-close').on('click', function() {
                $('.media-dropzone').toggleClass('show');
            });

            DropzoneComponents.init();

            // Init dropzone instance
            Dropzone.autoDiscover = false
            const myDropzone = new Dropzone('#plugin-dropzone', {
                autoProcessQueue: false
            })

            // Submit
            const $button = document.getElementById('submit-files')
            $button.addEventListener('click', function() {
                // Retrieve selected files
                const acceptedFiles = myDropzone.getAcceptedFiles()
                for (let i = 0; i < acceptedFiles.length; i++) {
                    setTimeout(function() {
                        myDropzone.processFile(acceptedFiles[i])
                    }, i * 2000)
                }
            })

            // Listen for success event
            myDropzone.on("success", function(file) {
                if (myDropzone.getQueuedFiles().length === 0 && myDropzone.getUploadingFiles().length === 0) {
                    window.location.reload();
                }
            });
        })(jQuery);
    </script>
@endpush
