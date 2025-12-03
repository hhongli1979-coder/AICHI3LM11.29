<!-- latest jquery -->
<script src="{{ asset('js/jquery-3.7.1.min.js') }}"></script>

<!-- Bootstrap js -->
<script defer src="{{ asset('js/bootstrap/bootstrap.bundle.js') }}"></script>
<script defer src="{{ asset('js/bootstrap/popper.min.js') }}"></script>

<!-- Select2 -->
<script src="{{ asset('js/select2.full.min.js') }}"></script>

<!-- Dark Mode -->
<script defer src="{{ asset('js/dark-mode.js') }}"></script>

<!-- Sidebar menu js -->
<script defer src="{{ asset('js/sidebar-menu.js') }}"></script>

<!-- JQuery Validation js -->
<script src="{{ asset('js/jquery.validate.min.js') }}"></script>

<!-- Editor js -->
<script src="{{ asset('js/tinymce/jquery.tinymce.min.js') }}"></script>
<script src="{{ asset('js/tinymce/tinymce.min.js') }}"></script>

<!-- Toaster Js -->
<script src="{{ asset('js/toastr.min.js') }}"></script>
<script defer src="{{ asset('js/slick/slick.min.js') }}"></script>

<!-- Dropzone js -->
<script type="text/javascript" src="{{ asset('js/dropzone/dropzone.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/dropzone/dropzone-script.js') }}"></script>

<script>
    $(document).ready(function() {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


        $('.nextBtn, .submitBtn').on('click', function() {
            if (!$(this).parents('form').valid()) {
                var ele = $("#" + $(this).parents('form').attr('id') + " :input.error:first");
                var errorEle = $("#" + $(this).parents('form').attr('id') + " :input.error:first");

                var tabToShow = ele.closest('.tab-pane');
                $('.nav-tabs a[href="#' + tabToShow.attr('id') + '"]').tab('show');

                $("#" + $(this).parents('form').attr('id') + " .tab-pane").each(function() {
                    var tabId = $(this).attr('id');
                    var hasErrors = $(this).find(':input.error').length > 0;
                    var icon = $("#" + $(this).parents('form').attr('id') +
                        ' .nav-tabs a[href="#' + tabId + '"]').find('i.errorIcon');
                    if (hasErrors) {
                        icon.show();
                    } else {
                        icon.hide();
                    }
                });

            } else {
                if ($(this).attr('type') == 'button') {
                    showNextVisibleTab($('.nav-tabs .active'));
                }
            }

            $(".error").each(function() {
                if (!$(this).text()) {
                    $(this).removeClass('error');
                }
            });
        });

        $('.previousBtn').on('click', function() {
            showPreviousVisibleTab($('.nav-tabs .active'));
        });

        function showPreviousVisibleTab(currentTab) {
            var prevTab = currentTab.parent().prev().find('.nav-link');
            if (prevTab.is(':visible')) {
                $('.nav-tabs a[href="' + prevTab.attr('href') + '"]').tab('show');
            } else {
                showPreviousVisibleTab(prevTab);
            }
        }

        function showNextVisibleTab(currentTab) {
            var nextTab = currentTab.parent().next().find('.nav-link');
            if (nextTab.is(':visible')) {
                $('.nav-tabs a[href="' + nextTab.attr('href') + '"]').tab('show');
            } else {
                showNextVisibleTab(nextTab);
            }
        }

        $('.cleaning').on('click', function() {
            $.ajax({
                url: "{{ route('admin.clear.cache') }}",
                method: 'GET',
                success: function() {
                    //
                }
            });
        });

        $('.copy-icon').on('click', function(e) {
            e.preventDefault();
            const $input = $($(this).data('target'));
            $input.select();
            document.execCommand('copy');
            const $icon = $(this);
            const originalClass = $icon.attr('class');
            $icon.removeClass('ri-file-copy-line').addClass('ri-check-line');
            setTimeout(() => {
                $icon.removeClass('ri-check-line').addClass('ri-file-copy-line');
            }, 700);
        });
    });

</script>
