(function ($) {
    "use strict";

    // Ensure the document is fully loaded before executing the scripts
    $(document).ready(function () {

        // Setup CSRF In Ajax
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        if ($.fn.select2) {
            // Single select dropdown select2
            $(".select-2").select2();

            // Multiple select dropdown select2
            $('.select2-multiple').select2({
                tags: false,
                tokenSeparators: [',', ' '],
            });

            // Append Country Flag
            $('#select-country-code').select2({
                templateResult: function (data) {
                    if (!data.id) {
                        return data.text;
                    }
                    var $result = $('<span><img src="' + $(data.element).data('image') + '" class="flag-img" /> +' + data.text.trim() + '</span>');
                    return $result;
                },
                templateSelection: function (selection) {
                    if (selection.text == ' ') {
                        return selection.text;
                    }
                    return ' + ' + selection.text;
                }
            });
        }

        // $('.loader-wrapper').fadeOut('slow', function () {
        //     $(this).remove();
        // });

        $('.btn.spinner-btn').click(function (e) {
            e.preventDefault();

            const form = $(this).closest('form');
            const button = $(this);
            const buttonName = button.attr('name');
            form.find('input[name="_clicked_button"]').remove();

            form.append(`<input type="hidden" name="${buttonName}" value="1">`);

            $('.invalid-feedback').removeClass('d-block');

            if (form.valid()) {
                button.prop('disabled', true);
                button.append('<span class="spinner"></span>');
                form.submit();
            }
        });

        $(window).on('pageshow', function () {
            $('.add-spinner').prop('disabled', false);
            $('.add-spinner .spinner').remove();
        });

        $('.add-spinner').click(function (e) {

            e.preventDefault();
            const $this = $(this);
            $this.prop('disabled', true);
            $this.find('.spinner').remove();
            $this.append('<span class="spinner"></span>');

            const redirectUrl = $this.data('url');
            window.location.href = redirectUrl;
        });

        $(".mobile-toggle").click(function () {
            $(".nav-menus").toggleClass("open");
        });

        $(".mobile-search").click(function () {
            $(".form-control-plaintext").toggleClass("open");
        });

        $(".form-control-plaintext").on("keyup", function (e) {
            if (e.target.value.trim()) {
                $("body").addClass("offcanvas");
            } else {
                $("body").removeClass("offcanvas");
            }
        });

        if ($.fn.tinymce) {
            // tinymce
            tinymce.init({
                selector: '.content',
                setup: function (editor) {
                    editor.on('init change', function () {
                        editor.save();
                    });
                },
                plugins: [
                    "lists link anchor",
                    "visualblocks code fullscreen",
                    "table paste"
                ],
                toolbar: [
                    'undo redo |bold italic underline strikethrough | formatselect | forecolor backcolor code table',
                ],
                menubar: false,
                branding: false,
                placeholder: 'Enter Content...',
            });
        }

        if ($.fn.tinymce) {
            // tinymce-image-embed
            tinymce.init({
                selector: '.image-embed-content',
                setup: function (editor) {
                    editor.on('init change', function () {
                        editor.save();
                    });
                },
                plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste"
                ],
                toolbar: [
                    "insertfile undo redo | styleselect | bold italic underline strikethrough | formatselect | forecolor backcolor code table | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image ",
                ],
                image_title: true,
                file_picker_types: 'image',
                relative_urls: false,
                remove_script_host: false,
                images_upload_handler: function (blobInfo, success, failure) {
                    var formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename());
                    var $csrfToken = $('meta[name="csrf-token"]').attr('content');

                    $.ajax({
                        url: "/admin/media/upload",
                        type: 'POST',
                        data: formData,
                        headers: {
                            'X-CSRF-TOKEN': $csrfToken
                        },
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            if (response.location) {
                                success(response.location);
                            } else {
                                failure('Invalid JSON response');
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            failure('Image upload failed: ' + textStatus + ' - ' + errorThrown);
                        }
                    });
                },
                menubar: false,
                branding: false,
                placeholder: 'Enter Content...',
            });
        }

        // Toggle Password
        $('.toggle-password').on('click', function () {
            var input = $(this).closest('.position-relative').find('input');
            var span = $(this).closest('.toggle-password').find('span');

            if (input.attr('type') === 'password') {
                input.attr('type', 'text');
                $(this).removeClass('ri-eye-line').addClass('ri-eye-off-line');
                if (span && span.length > 0) {
                    span.html('Hide');
                }
            } else {
                input.attr('type', 'password');
                $(this).removeClass('ri-eye-off-line').addClass('ri-eye-line');
                if (span && span.length > 0) {
                    span.html('Show');
                }
            }
        });

        // Image to background js
        $(".bg-img").parent().addClass('bg-size');
        $('.bg-img').each(function () {
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

        // Category selection
        $('input[name="categories[]"]').on('click', function () {
            let id = $(this).attr('data-id');
            let parent = $(this).attr('data-parent');
            let isChecked = $(this).prop('checked');

            // Function to check/uncheck parent categories
            function checkParentCategories(parentId, isChecked) {
                $(`input[data-id="${parentId}"]`).prop('checked', isChecked);
                let parentCategory = $(`input[data-id="${parentId}"]`).attr('data-parent');
                if (parentCategory !== "0") {
                    checkParentCategories(parentCategory, isChecked);
                }
            }

            // Function to check/uncheck child categories
            function checkChildCategories(parentId, isChecked) {
                $(`input[data-parent="${parentId}"]`).prop('checked', isChecked);
                $(`input[data-parent="${parentId}"]`).each(function () {
                    let childId = $(this).attr('data-id');
                    checkChildCategories(childId, isChecked);
                });
            }

            if (isChecked) {
                // Check all parent categories
                checkParentCategories(parent, true);
                // Uncheck same level siblings
                $(`input[data-parent="${parent}"]`).not(`[data-id="${id}"]`).prop('checked', false);
            } else {
                // Uncheck all child categories
                checkChildCategories(id, false);
            }
        });

    });

    $(document).ready(function () {
        const optionFormat = (item) => {
            if (!item.id) {
                return item.text;
            }

            const imageUrl = item.element.getAttribute('image');
            const subTitle = item.element.getAttribute('sub-title');
            const text = item.text.trim();
            const initialLetter = text.charAt(0).toUpperCase();
            let html = `
            <div class="selected-item d-flex align-items-center">
        `;

            if (imageUrl) {
                html += `
                <img src="${imageUrl}" class="rounded-circle mr-2" style="width: 40px; height: 40px; object-fit: cover;" alt="${text}"/>
            `;
            } else {
                html += `
                <div class="initial-letter rounded-circle flex-center mr-2" style="width: 40px; height: 40px; background-color: #ccc; color: #fff;">
                    ${initialLetter}
                </div>
            `;
            }

            html += `
                <div class="detail">
                    <h6 class="">${text}</h6>
                    <p class=" small">${subTitle || ''}</p>
                </div>
            </div>
        `;

            const span = document.createElement('span');
            span.innerHTML = html;
            return span;
        };

        $('.user-dropdown').select2({
            placeholder: "Select an option",
            templateSelection: optionFormat,
            templateResult: optionFormat
        });

        const SquareImageoptionFormat = (item) => {
            if (!item.id) {
                return item.text;
            }

            const imageUrl = item.element.getAttribute('image');
            const subTitle = item.element.getAttribute('sub-title');
            const text = item.text.trim();
            const initialLetter = text.charAt(0).toUpperCase();
            let html = `
            <div class="selected-item d-flex align-items-center">
        `;

            if (imageUrl) {
                html += `
                <img src="${imageUrl}" style="width: 40px; height: 40px;" alt="${text}"/>
            `;
            } else {
                html += `
                <div class="initial-letter rounded-circle flex-center mr-2">
                    ${initialLetter}
                </div>
            `;
            }

            html += `
                <div class="detail">
                    <h6 class="">${text}</h6>
                    <p class=" small">${subTitle || ''}</p>
                </div>
            </div>
        `;

            const span = document.createElement('span');
            span.innerHTML = html;
            return span;
        };

        $('.sqaure-image-dropdown').select2({
            placeholder: "Select an option",
            templateSelection: SquareImageoptionFormat,
            templateResult: SquareImageoptionFormat
        });
    });

})(jQuery);
