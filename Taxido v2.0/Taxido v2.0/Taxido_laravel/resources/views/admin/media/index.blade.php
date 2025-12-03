@extends('admin.layouts.master')
@section('title', __('static.media.media'))
@push('css')
<link rel="stylesheet" type="text/css" href="{{ asset('css/vendors/dropzone.css') }}">
@endpush
@section('content')
<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <div class="contentbox-subtitle">
                <h3>{{ __('static.media.media_library') }}</h3>
                <a href="javascript:void(0)" class="btn btn-outline addNewMedia"><i class="ri-add-line"></i>
                    {{ __('static.media.add_new') }}</a>
            </div>
        </div>
        <div class="media-dropzone p-0">
            <form action="{{ route('admin.media.store') }}" method="POST" class="digits files form-container dropzone"
                id="media-dropzone">
                @csrf
                <div class="upload-files-container">
                    <div class="dz-message needsclick">
                        <span class="upload-icon"><i class="ri-upload-2-line"></i></span>
                        <h3>{{ __('static.media.drop_files_to_upload') }}</h3>
                        <div class="flex-center gap-2">
                            <button type="button" class="browse-files">{{ __('static.media.select_files') }}</button>
                        </div>
                    </div>
                </div>
                <i class="ri-close-line media-close"></i>
            </form>
        </div>
        <div class="media-main">
            <div class="table-top-panel bg-grey-part mode-select">
                <div class="top-part">
                    <div class="top-part-left m-0">
                        <div class="media-grid-view">
                            <a href="{{ url()->current() . '?mode=list' }}"
                                class="view-list @if (!request()->filled('mode') || (request()->filled('mode') && request()->mode == 'list')) current @endif">
                                <i class="ri-table-view"></i>
                            </a>
                            <a href="{{ url()->current() . '?mode=grid' }}"
                                class="view-grid @if (request()->filled('mode') && request()->mode == 'grid') current @endif">
                                <i class="ri-layout-grid-line"></i>
                            </a>
                        </div>
                        <form class="search-form d-flex align-items-center gap-2 m-0">
                            <div>
                                <input type="hidden" name="mode" value="{{ request()->mode }}">
                                <input type="hidden" name="s" value="{{ request()->s }}">
                                <select class="form-select" name="type">
                                    <option value="" {{ request()->type == '' ? 'selected' : '' }}>
                                        {{ __('static.media.all_media') }}
                                    </option>
                                    <option value="image" {{ request()->type == 'image' ? 'selected' : '' }}>
                                        {{ __('static.media.images') }}
                                    </option>
                                    <option value="audio" {{ request()->type == 'audio' ? 'selected' : '' }}>
                                        {{ __('static.media.audio') }}
                                    </option>
                                    <option value="video" {{ request()->type == 'video' ? 'selected' : '' }}>
                                        {{ __('static.media.video') }}
                                    </option>
                                    <option value="text" {{ request()->type == 'text' ? 'selected' : '' }}>
                                        {{ __('static.media.documents') }}
                                    </option>
                                </select>
                            </div>
                            <button type="submit"
                                class="btn btn-outline applyAction">{{ __('static.media.apply') }}</button>
                        </form>
                        @if (request()->filled('mode') && request()->mode == 'grid')
                        @endif
                        @if (request()->filled('mode') && request()->mode == 'grid' && $files->isNotEmpty())
                        <button type="submit" class="btn btn-outline applyAction"
                            id="Bulk_select">{{ __('Bulk select') }}</button>
                        @endif
                        <a href="javascript:void(0)" id="multiDeleteBtn" class="btn btn-solid d-none"
                            data-url="{{ route('admin.media.deleteAll') }}">
                            {{ __('static.media.delete_permanently') }}<span id="count-selected-items">(0)</span>
                        </a>
                        <a href="javascript:void(0)" id="CancelButton" class="btn btn-outline d-none">
                            {{ __('static.cancel') }}
                        </a>
                        <a href="javascript:void(0)" id="deleteAllButton" class="btn btn-outline d-none">
                            {{ __('static.deleteAll') }}
                        </a>
                    </div>
                    <div class="top-part-right mb-0">
                        <form class="search-form d-flex align-items-center gap-2 m-0">
                            <input type="hidden" name="mode" value="{{ request()->mode }}">
                            <input type="hidden" name="type" value="{{ request()->type }}">
                            <input type="text" id="search-image" name="s" value="{{ request()->s }}"
                                class="form-control search-input">
                            <button type="submit" class="btn btn-outline search-input search-image">{{ __('static.media.search') }}</button>
                            <button type="button" class="btn btn-primary" id="clear" style="display: none">{{ __('static.clear') }}</button>
                            <i class="ri-search-line" icon-name="search-normal-2"></i>
                        </form>
                    </div>
                </div>
            </div>
            @if (request()->filled('mode') && request()->mode == 'grid')
            <div class="media-wrapper custom-scrollbar">
                <div
                    class="row row-cols-xxl-6 row-cols-xl-5 row-cols-lg-4 row-cols-sm-3 row-cols-2 g-sm-3 g-2 media-card">
                    @forelse($files as $key => $file)
                    <div class="media card">
                        <input type="checkbox" class="form-check-input" name="attachment"
                            id="attachment-list-{{ $key }}" value="{{ $file?->id }}" disabled>
                        <button type="button" class="btn media-modal-btn" data-bs-toggle="modal"
                            data-bs-target="#mediaModal{{ $file?->id }}">
                        </button>
                        <label for="attachment-list-{{ $key }}" class="opacity">
                            <div class="media-image ratio ratio-1x1">
                                <img src="{{ substr($file?->mime_type, 0, 5) == 'image'
                                                ? getImageUrl($file->original_url)
                                                : asset($file?->mime_type !== null ? getMediaMimeTypePathByType($file?->mime_type) : 'images/file-icon/default.png') }}"
                                    alt="avatar" class="view-img" loading="lazy" decoding="async">
                            </div>
                            @if (substr($file->mime_type, 0, 5) != 'image')
                            <div class="filename">
                                <div>{{ $file?->file_name }}</div>
                            </div>
                            @endif
                        </label>
                    </div>
                    @empty
                    <div class="no-data-detail">
                        <img class="h-auto" src="{{ asset('images/no-data.png') }}" loading="lazy" alt="no-data">
                        <div class="data-not-found">
                            <span>{{ __('static.media.media_not_found') }}</span>
                        </div>
                    </div>
                    @endforelse
                </div>
            </div>
            <div class="pagination-container mt-4">
                {{ $files?->appends(['mode' => 'grid'])?->links() }}
            </div>
            @else
            <div class="media-table mt-4">
                <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']"
                    :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                    :bulkactions="$tableConfig['bulkactions']" :search="false">
                </x-table>
            </div>
            @endif
        </div>
    </div>
</div>

<!-- Modal -->
@if (request()->filled('mode') && request()->mode == 'grid')
@foreach ($files as $key => $file)
<div class="modal fade media-modal-box" id="mediaModal{{ $file?->id }}" tabindex="-1"
    aria-labelledby="mediaModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="mediaModalLabel">{{ __('static.attachment_details') }}</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="media-attachment-detail row g-3">
                    <div class="col-lg-6">
                        <div class="left-image-box">
                            @php
                            $mimeTypePrefix = substr($file->mime_type, 0, 5);
                            @endphp
                            @if ($mimeTypePrefix == 'image')
                            <img src="{{ getImageUrl($file->original_url) }}" loading="lazy" alt="avatar"
                                class="view-img" decoding="async">
                            @elseif ($mimeTypePrefix == 'audio')
                            <audio controls class="view-audio" autoplay>
                                <source src="{{ $file->original_url }}" type="{{ $file->mime_type }}">
                                {{ __('static.media.audio_not_supported') }}
                            </audio>
                            @elseif ($mimeTypePrefix == 'video')
                            <video controls class="view-video" autoplay muted>
                                <source src="{{ $file->original_url }}" type="{{ $file->mime_type }}">
                                {{ __('static.media.video_not_supported') }}
                            </video>
                            @else
                            <img src="{{ asset($file?->mime_type !== null ? getMediaMimeTypePathByType($file?->mime_type) : 'images/file-icon/default.png') }}"
                                alt="default" class="view-img" loading="lazy">
                            @endif
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <table class="product-page-width">
                            <tbody>
                                <tr>
                                    <td><span>{{ __('static.media.uploaded_by') }} :</span></td>
                                    <td>
                                        <p><a href="#!"></a>{{ $file?->created_by?->name }}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><span>{{ __('static.media.uploaded_to') }} :</span></td>
                                    <td class="txt-success">
                                        <p><a href="#!"></a>{{ $file?->name }}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><span>{{ __('static.media.file_name') }} :</span></td>
                                    <td>
                                        <p>{{ $file?->file_name }}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><span>{{ __('static.media.file_type') }} :</span></td>
                                    <td>
                                        <p>{{ $file?->mime_type }}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><span>{{ __('static.media.file_size') }} :</span></td>
                                    <td>
                                        <p>{{ convertFileSize($file?->size) }}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="attachment-info">
                            <div class="settings">
                                <form action="{{ route('admin.media.update', $file->id) }}" method="post" class="m-0">
                                    @method('PUT')
                                    @csrf
                                    <div class="form-group row g-lg-4 g-3">
                                        {{-- <div class="col-sm-12">
                                                    <label for="alternative">{{ __('static.media.alternative_text') }}</label>
                                        <div class="position-relative">
                                            <textarea class="form-control" name="alternative" id=""
                                                rows="2">{{ $file->alternative_text }}</textarea>
                                        </div>
                                        <p>
                                            <a href="" class="text-primary fw-500">{{
                                                            __('static.media.learn_description') }}</a>
                                            {{ __('static.media.leave_empty') }}
                                        </p>
                                    </div> --}}
                                    <div class="col-sm-6">
                                        <label for="title">{{ __('static.media.title') }}</label>
                                        <div class="position-relative">
                                            <input class="form-control" type="title" name="title"
                                                value="{{ $file?->name }}">
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <label for="file_url">{{ __('static.media.file_url') }}:</label>
                                        <div class="position-relative file-url">
                                            <input class="form-control" type="text" name="file_url"
                                                value="{{ $file?->original_url }}" id="copyUrl-{{ $key }}" readonly>
                                            <button type="button" class="btn copy-btn copyUrl">copy</button>
                                        </div>
                                    </div>
                            </div>

                            <!-- Move the submit button inside the form -->
                            <div class="submit-btn">
                                <button type="submit" name="save" class="btn btn-solid spinner-btn">
                                    {{ __('static.save') }}
                                </button>
                            </div>
                            </form>
                        </div>

                        <ul class="info-action">
                            <li class="download">
                                <a href="{{ $file?->original_url }}"
                                    download>{{ __('static.media.download_file') }}</a>
                            </li>
                            <li class="delete">
                                <a
                                    href="{{ route('admin.media.forceDelete', $file->id) }}">{{ __('static.media.delete_permanently') }}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
@endforeach
@endif
@endsection

@push('scripts')
<!-- Dropzone js -->
<script></script>
<script>
    (function($) {
        // Cache frequently accessed elements
        var $mediaDropzone = $('.media-dropzone');
        var $countSelectedItems = $('#count-selected-items');
        var $multiDeleteBtn = $('#multiDeleteBtn');
        var $csrfToken = $('meta[name="csrf-token"]').attr('content');
        var $BulkSelect = $('#Bulk_select');
        var $CancelButton = $('#CancelButton');
        var $deleteAllButton = $('#deleteAllButton');
        var $copyUrl = $('.copyUrl');
        // Toggle media dropzone visibility
        $('.addNewMedia, .media-close').on('click', function() {
            $mediaDropzone.toggleClass('show');
        });

        DropzoneComponents.init();

        // Init dropzone instance
        Dropzone.autoDiscover = false
        const myDropzone = new Dropzone('#media-dropzone', {
            autoProcessQueue: true,
            parallelUploads: 1, // Process one file at a time to avoid overwhelming the server
            init: function() {
                this.on("addedfile", function(file) {
                    // Optionally, you can add a message or visual feedback here
                    console.log("File added: " + file.name);
                });
                this.on("success", function(file) {
                    // Reload the page when all files are uploaded
                    if (this.getQueuedFiles().length === 0 && this.getUploadingFiles().length === 0) {
                        window.location.reload();
                    }
                });
            }
        })

        function getQueryParam(param) {
            var urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }

        var mode = getQueryParam('mode');

        if (mode && mode === 'grid') {
            $BulkSelect.show();
        } else {
            $BulkSelect.hide();
        }

        myDropzone.on("success", function(file) {
            if (myDropzone.getQueuedFiles().length === 0 && myDropzone.getUploadingFiles().length === 0) {
                window.location.reload();
            }
        });


        /** Delete Media **/
        // Track selected items and update UI
        var selectedItems = [];
        $('input[name="attachment"]').on('change', function() {

            var itemId = $(this).val();
            if ($(this).is(':checked')) {
                selectedItems.push(itemId);
            } else {
                selectedItems = selectedItems.filter(item => item !== itemId);
            }

            if (selectedItems.length > 0) {
                $countSelectedItems.text('(' + selectedItems.length + ')');
                $multiDeleteBtn.removeClass('d-none');
            } else {
                $multiDeleteBtn.addClass('d-none');
            }
        });


        $deleteAllButton.on('click', function(e) {
            selectedItems = [];

            $('.form-check-input').each(function() {
                $(this).prop('checked', true);
                var itemId = $(this).val();
                if (!selectedItems.includes(itemId)) {
                    selectedItems.push(itemId);
                }
            });

            if (selectedItems.length > 0) {
                $countSelectedItems.text('(' + selectedItems.length + ')');
                $multiDeleteBtn.removeClass('d-none');
            } else {
                $multiDeleteBtn.addClass('d-none');
            }
        });

        $multiDeleteBtn.on('click', function(e) {
            e.preventDefault();

            var url = $(this).data('url');
            if (selectedItems.length > 0) {

                $.ajax({
                    type: 'POST',
                    url: url,
                    data: {
                        ids: selectedItems,
                    },
                    headers: {
                        'X-CSRF-TOKEN': $csrfToken
                    },
                    success: function(data) {

                        window.location.reload();
                    },
                });
            }
        });

        $BulkSelect.on('click', function(e) {
            selectedItems = [];
            $(".form-check-input").prop("disabled", false);
            $(".media-modal-btn").prop("disabled", true);

            $('.opacity').addClass('opacity-65');
            $('#CancelButton').removeClass('d-none');
            $('#deleteAllButton').removeClass('d-none');

            $('.ri-table-view, .ri-layout-grid-line, .form-select, .applyAction').addClass('d-none');
        })

        $CancelButton.on('click', function(e) {

            $('.form-check-input:checked').each(function() {
                var checkboxId = $(this).attr('id');
                $('#' + checkboxId).prop('checked', false);
            });

            $multiDeleteBtn.addClass('d-none');
            $('#CancelButton').addClass('d-none');
            $('#deleteAllButton').addClass('d-none');
            $('.opacity').removeClass('opacity-65');
            $('.ri-table-view, .ri-layout-grid-line, .form-select, .applyAction').removeClass('d-none');

            $(".form-check-input").prop("disabled", true);
            $(".media-modal-btn").prop("disabled", false);
        })

        $copyUrl.on('click', function(e) {
            const id = $(this).siblings('input').attr('id');
            const $input = $('#' + id);
            $input.select();
            document.execCommand('copy');
        })

        // Clear the input field when the user navigates back in the browser
        $(window).on('popstate', function() {
            if (!getUrlParameter('s')) {
                $('.search-input').val('');
            }
        });

        $('#clear').click(function() {
            $('.search-input').val('');
            window.location.href = window.location.pathname;
        });

        if ($('.search-input').val().trim() !== '') {
            $('#clear').show();
        }

    })(jQuery);
</script>
@endpush
