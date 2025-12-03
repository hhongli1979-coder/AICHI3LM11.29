@push('css')
    <!-- Dropzone css-->
    <link rel="stylesheet" type="text/css" href="{{ asset('css/vendors/dropzone.css') }}">
@endpush

<div class="modal fade media-modal" id="mediaModel" tabindex="-1" role="dialog" aria-labelledby="mediaModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="mb-0">{{ __('static.media.media') }}</h3>
                <button type="button" class="btn btn-close" data-bs-dismiss="modal">
                    <span class="lnr lnr-cross"></span>
                </button>
            </div>
            <div class="modal-body">
                <ul class="nav nav-tabs" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link upload-image" data-bs-toggle="tab" data-bs-target="#upload">
                            {{ __('static.media.upload_files') }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active select_image" data-bs-toggle="tab" data-bs-target="#select">
                            {{ __('static.media.media_library') }}
                        </a>
                    </li>
                </ul>
                <div class="tab-content mt-3">
                    <div class="tab-pane fade show active" id="select">
                        <div class="select-top-panel">
                            <div>
                                <div class="d-flex align-items-center gap-2">
                                    <select class="form-select" id="sortby-image">
                                        <option value="newest">{{ __('static.media.sort_by_newest') }}</option>
                                        <option value="oldest">{{ __('static.media.sort_by_oldest') }}</option>
                                        <option value="smallest">{{ __('static.media.sort_by_smallest') }}</option>
                                        <option value="largest">{{ __('static.media.sort_by_largest') }}</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <form class="search-form mb-0">
                                    <input type="text" id="search-image"
                                        class="form-control search-input search-image">
                                    <i class="ri-search-line"></i>
                                </form>
                            </div>
                        </div>
                        <div class="content-section ratio2_3 custom-scrollbar">
                            <div class="media-loader-wrapper" style="display:none;">
                                <div class="loader"></div>
                            </div>
                            <div id="custom-media"
                                class="row row-cols-xxl-6 row-cols-xl-5 row-cols-lg-4 row-cols-sm-3 row-cols-2 g-sm-3 g-2 upload-card media-files">
                            </div>
                            <nav aria-label="Media Pagination">
                                <ul class="pagination justify-content-center mt-3" id="pagination-media"></ul>
                            </nav>
                        </div>
                    </div>
                    <div class="tab-pane fade position-relative" id="upload">
                        <form action="{{ route('admin.media.store') }}" method="POST'"
                            class="dropzone digits form-container" id="myDropzone">
                            @csrf
                            <div class="upload-files-container">
                                <div class="dz-message needsclick">
                                    <span class="upload-icon"><i class="ri-upload-2-line"></i></span>
                                    <h3>{{ __('static.media.drop_files_to_upload') }}</h3>
                                    <button type="button"
                                        class="browse-files">{{ __('static.media.select_file') }}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="right-part">
                    <a href="javascript:void(0)" class="btn btn-solid select-media btn-add" data-bs-dismiss="modal">
                        {{ __('static.media.add_media') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
(function($) {
    "use strict";

    // === PRESERVE ORIGINAL STRUCTURE ===
    window.Media = {
        data: [],
        selectedFiles: [],
        values: [],
        multiple: false,
        id: null,
        name: null
    };

    // === NEW: Per-field storage to fix conflict ===
    if (!window.MediaStorage) window.MediaStorage = {};

    let currentFieldKey = null;

    function getFieldKey() {
        return currentFieldKey;
    }

    function initField(key, name, multiple) {
        if (!window.MediaStorage[key]) {
            window.MediaStorage[key] = {
                name: name,
                multiple: multiple,
                values: []
            };
        }
        currentFieldKey = key;
        Media.name = name;
        Media.multiple = multiple;
        Media.values = window.MediaStorage[key].values;
    }

    function saveField() {
        if (currentFieldKey && window.MediaStorage[currentFieldKey]) {
            window.MediaStorage[currentFieldKey].values = Media.values;
        }
    }

    // === ORIGINAL setBGImage (unchanged) ===
    function setBGImage() {
        $(".bg-img").parent().addClass('bg-size');
        $('.bg-img').each(function() {
            var el = $(this),
                src = el.attr('src'),
                parent = el.parent();
            parent.css({
                'background-image': 'url(' + src + ')',
                'background-size': 'cover',
                'background-position': 'center',
                'display': 'block'
            });
            el.hide();
        });
    }

    // === FIXED: Open modal with field isolation ===
    $(document).on('click', '.media-manager', function() {
        const fieldKey = $(this).data('field-id') || $(this).attr('data-name');
        const name = $(this).attr('data-name');
        const multiple = Boolean($(this).attr('data-multiple'));

        initField(fieldKey, name, multiple);
        $('#mediaModel').modal('show');
        fetchMedia();
    });

    // === ORIGINAL select-file logic (now safe) ===
    $(document).on('click', '.select-file', function() {
        var id = parseInt($(this).val());
        var isChecked = $(this).prop('checked');

        if (Media.multiple) {
            var index = Media.values.findIndex(function(item) {
                return item.name === Media.name;
            });
            if (index !== -1) {
                if (isChecked) {
                    if (!Media.values[index].id.includes(id)) {
                        Media.values[index].id.push(id);
                    }
                } else {
                    var idIndex = Media.values[index].id.indexOf(id);
                    if (idIndex !== -1) {
                        Media.values[index].id.splice(idIndex, 1);
                        if (Media.values[index].id.length === 0) {
                            Media.values.splice(index, 1);
                        }
                    }
                }
            } else {
                if (isChecked) {
                    Media.values.push({
                        name: Media.name,
                        id: [id]
                    });
                }
            }
        } else {
            var existingIndex = Media.values.findIndex(function(item) {
                return item.name === Media.name;
            });
            if (existingIndex !== -1) {
                Media.values[existingIndex].id = isChecked ? [id] : [];
            } else {
                if (isChecked) {
                    Media.values.push({
                        name: Media.name,
                        id: [id]
                    });
                }
            }
        }
        saveField();
        updateSelectedMedia();
    });

    // === ORIGINAL remove-media (safe now) ===
    $(document).on('click', '.remove-media', function() {
        Media.name = $(this).attr('data-name');
        let id = parseInt($(this).attr('data-id'));
        var index = Media.values.findIndex(function(item) {
            return item.name === Media.name;
        });

        if (Media.values[index]) {
            let indexToRemove = Media.values[index].id.indexOf(id);
            if (indexToRemove !== -1) {
                Media.values[index].id.splice(indexToRemove, 1);
            }
        }
        $('#attachment-' + id).prop('checked', false);
        saveField();
        updateSelectedMedia();
    });

    // === ORIGINAL updateSelectedMedia (unchanged) ===
    function updateSelectedMedia() {
        var html = '';
        var valIndex = Media.values.findIndex(function(item) {
            return item.name === Media.name;
        });
        Media.selectedFiles = Media.values[valIndex]?.id.length ? Media.data.filter(function(obj) {
            return Media.values[valIndex].id.includes(obj.id);
        }) : [];

        Media.selectedFiles.forEach((data) => {
            html += '<li class="selected-media">';
            html += '<div class="image-list-detail">';
            html += '<input type="hidden" name="' + Media.name + '" value="' + data.id + '">';
            html += '<img src="' + data.original_url + '" class="img-fluid">';
            html += '<a href="javascript:void(0)" class="remove-media" data-id="' + data.id +
                '" data-name="' + Media.name + '">';
            html += '<i class="ri-close-line remove-icon"></i>';
            html += '</a>';
            html += '</div>';
            html += '</li>';
        });
        $('ul.image-select-list[data-name="' + Media.name + '"]').html(html);
        setBGImage();
    }

    // === ORIGINAL fetchMedia (100% unchanged) ===
    function fetchMedia(page = 1) {
        $('.media-loader-wrapper').show();
        $.ajax({
            type: 'GET',
            url: "{{ route('admin.media.ajax') }}",
            dataType: 'json',
            data: {
                'search': $('#search-image').val() || '',
                'sort': $('#sortby-image').val() || '',
                'page': page,
            },
            success: function(res) {
                var html = '';
                Media.data = res.data;
                if (Media.data.length) {
                    $("#custom-media").removeClass('h-100');
                    var imageIds = $('input[name="' + Media.name + '"]').map(function() {
                        return parseInt($(this).val());
                    }).get();
                    Media.data.forEach((data) => {
                        html += '<div class="card modal-card">';
                        html += '<input type="' + (Media.multiple ? 'checkbox' : 'radio') +
                            '" class="select-file form-check-input" name="attachment" id="attachment-' +
                            data.id + '" value="' + data.id + '"' + (imageIds.includes(data.id) ? ' checked' : '') + '>';
                        html += '<label for="attachment-' + data.id + '">';
                        const imageUrl = data?.mime_type?.startsWith('image') ?
                            data.original_url :
                            (data?.mime_type?.startsWith('audio') ?
                                '{{ asset('images/audio.svg') }}' :
                                (data?.mime_type?.startsWith('video') ?
                                    '{{ asset('images/video.svg') }}' :
                                    '{{ asset('images/nodata1.webp') }}'
                                ));
                        html += `<div class="ratio ratio-1x1"><img src="${imageUrl}" class="view-img" alt="media"></div>`;
                        !data?.mime_type?.startsWith('image') ? html += `<div class="filename"><div>` + data.file_name + `</div></div>` : "";
                        html += '</label>';
                        html += '</div>';
                    });
                } else {
                    $("#custom-media").addClass('h-100');
                    html += '<div class="d-flex flex-column no-data-detail w-100">';
                    html += '<div class="data-not-found">';
                    html += '<div class="no-data"><img src="{{ asset('images/no-data.png') }}" class="img-lg" alt="no-data">';
                    html += '<span>Media Not Found</span>';
                    html += '</div></div></div>';
                }
                $('.media-files').html(html);
                setBGImage();
                $('.pagination').html(res.pagination);
            },
            complete: function() {
                $('.media-loader-wrapper').hide();
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    // === ORIGINAL event listeners (unchanged) ===
    $(document).on('keyup', '#search-image', function(e) {
        e.preventDefault();
        fetchMedia();
    });

    $(document).on('change', '#sortby-image', function(e) {
        e.preventDefault();
        fetchMedia();
    });

    $(document).on('click', '#pagination-media a', function(e) {
        e.preventDefault();
        const url = $(this).attr('href');
        const page = new URLSearchParams(url.split('?')[1]).get('page');
        fetchMedia(page);
    });

    // === ORIGINAL Dropzone (unchanged) ===
    Dropzone.options.myDropzone = {
        init: function() {
            this.on("success", function(file, response) {
                $('.nav-link.select_image').tab('show');
                this.removeAllFiles();
                fetchMedia();
            });
            this.on("error", function(file, responseText) {
                var status = $(file.previewElement).find('.dz-error-message');
                status.text(responseText.message);
                status.show();
                var msgContainer = $(file.previewElement).find('.dz-image');
                msgContainer.css({ "border": "2px solid #d90101" });
            });
        }
    };

    // === Apply selection when closing modal ===
    $(document).on('click', '.select-media', function() {
        saveField();
        updateSelectedMedia();
    });

})(jQuery);
</script>
@endpush
