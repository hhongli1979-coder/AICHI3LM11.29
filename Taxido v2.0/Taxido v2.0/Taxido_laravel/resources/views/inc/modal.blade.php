@if (isset($export))
    <div class="modal fade" id="exportModal" tabindex="-1" aria-labelledby="exportModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exportModalLabel">{{ __('static.export.export') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="exportForm" class="m-0" method="GET" action="{{ route($routes ?? '') }}">
                    <div class="modal-body export-data">
                        @php
                         $queryParams = request()->query();
                        @endphp

                        @foreach ($queryParams as $key => $value)
                            <input type="hidden" name="{{ $key }}" value="{{ $value }}">
                        @endforeach

                        <div class="main-img p-0">
                            <img src="{{ asset('images/export.svg') }}" />
                        </div>
                        <div class="form-group mb-0">
                            <label for="exportFormat">{{ __('static.export.select_export_format') }}</label>
                            <select id="exportFormat" name="format" class="form-select">
                                <option value="csv">{{ __('static.export.csv') }}</option>
                                <option value="excel">{{ __('static.export.excel') }}</option>
                            </select>
                        </div>
                        <div class="d-flex justify-content-end modal-footer">
                            <button type="button" class="btn btn-primary"
                                data-bs-dismiss="modal">{{ __('static.export.close') }}</button>
                            <button type="submit" class="btn btn-primary"
                                id="exportBtn">{{ __('static.export.export') }}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    @push('scripts')
        <script>
            $(document).ready(function() {
                $('button[data-bs-toggle="modal"]').on('click', function() {
                    var modalId = $(this).data('bs-target');
                    var route = $(this).data('route');
                    $('#exportForm').attr('action', route);
                });

                $('#exportForm').on('submit', function(event) {
                    event.preventDefault();
                    var form = $(this);
                    var exportBtn = $('#exportBtn');
                    $('#exportModal').modal('hide');
                    form[0].submit();
                });
            });
        </script>
    @endpush
@endif

@if (isset($import))
    <div class="modal fade import-modal" id="importModal">
        <div class="modal-dialog modal-dialog-centered modal-md">
            <div class="modal-content">
                <form id="importForm" method="POST" action="{{ route($route ?? '') }}" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body upload-report">
                        <div class="form-group mb-0 upload-title">
                            <div class="d-flex">
                                <div class="import-icon">
                                    <svg>
                                        <use xlink:href="{{ asset('images/import.svg#import') }}"></use>
                                    </svg>
                                </div>
                                <div class="upload-file">
                                    <h4 for="file">{{ __('static.import.import') }}</h4>
                                    <label for="file">{{ __('static.import.upload_instruction') }}</label>
                                </div>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="modal">
                                <i class="ri-close-line"></i>
                            </button>
                        </div>
                        <div class="import-tab analytics-section">
                            <ul class="nav nav-tabs horizontal-tab custom-scroll" id="account" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link active" id="local-file-tab" data-bs-toggle="tab"
                                        href="#local-file" role="tab" aria-controls="local-file"
                                        aria-selected="false">
                                        {{ __('static.import.local_files') }} </a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="direct-link-tab" data-bs-toggle="tab" href="#direct-link"
                                        role="tab" aria-controls="direct-link" aria-selected="false">
                                        {{ __('static.import.google_shit_link') }}</a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content" id="myTabContent">
                            <div class="tab-pane fade show active" id="local-file">
                                <div class="form-group">
                                    <input type="file" name="fileImport-1" id="importFile" class="form-control"
                                        style="display: none;">
                                </div>
                                <div class="file-upload-box">
                                    <div class="form-group">
                                        <div class="drop-area file-browse-button">
                                            <img src="{{ asset('images/upload.svg') }}" class="img-fluid" />
                                            <h5 class="file-instruction">{{ __('static.import.drag_drop') }}
                                            </h5>
                                            <span>{{ __('static.import.private_message') }}</span>
                                            <button class="btn">{{ __('static.import.select_files') }}</button>
                                            <input type="hidden" name="active_tab" value="local-file">
                                        </div>
                                    </div>
                                    <input class="file-browse-input" type="file" name="fileImport" hidden>
                                </div>
                                <ul class="file-list h-custom-scrollbar"></ul>
                            </div>
                        </div>
                        <div class="tab-content" id="myTabContent">
                            <div class="tab-pane fade" id="direct-link">
                                <div class="form-group">
                                    <input type="file" name="file" id="importFile-2" class="form-control"
                                        accept=".csv" style="display: none;">
                                </div>
                                <div class="file-upload-box">
                                    <div class="form-group">
                                        <div class="drop-area file-browse-button">
                                            <img src="{{ asset('images/googlesheet.svg') }}" />
                                            <h5 class="file-instruction">{{ __('static.import.enter_link') }}
                                            </h5>
                                            <span>{{ __('static.import.private_message') }}</span>
                                            <div class="import-link">
                                                <input type="text" name="google_sheet_url" class="form-control"
                                                    placeholder="https://docs.google.com/spreadsheets/.."
                                                    value="">
                                            </div>
                                        </div>
                                    </div>
                                    <input class="file-browse-input" type="file" hidden>
                                </div>
                                <ul class="file-list h-custom-scrollbar"></ul>

                            </div>
                        </div>

                        <p class="common-content">{{ __('static.import.example_csv') }} <a
                                href="{{ asset(@$example_file) }}" download class="text-primary fw-bold"> {{ __('static.import.example_csv_here') }}
                            </a>{{ __('static.import.example_csvv') }} <a href="{{ asset(@$instruction_file) }}" download
                                class="text-primary fw-bold"> {{ __('static.import.example_csv_instructions') }} </a>{{ __('static.import.example_csvvv') }}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn"
                            data-bs-dismiss="modal">{{ __('static.import.cancel') }}</button>
                        <button type="submit" class="btn btn-primary spinner-btn"
                            id="importSubmitBtn">{{ __('static.import.import') }}</button>

                    </div>
                </form>
            </div>
        </div>
    </div>
@endif

@push('scripts')
    <script>
        const fileList = document.querySelector(".file-list");
        const fileBrowseButton = document.querySelector(".file-browse-button");
        const fileBrowseInput = document.querySelector(".file-browse-input");
        const fileUploadBox = document.querySelector(".file-upload-box");
        const fileCompletedStatus = document.querySelector(".file-completed-status");

        let totalFiles = 0;
        let completedFiles = 0;

        // Function to create HTML for each file item
        const createFileItemHTML = (file, uniqueIdentifier) => {
            // Extracting file name, size, and extension
            const {
                name,
                size
            } = file;
            const extension = name.split(".").pop();
            const formattedFileSize = size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(2)} MB` :
                `${(size / 1024).toFixed(2)} KB`;

            // Generating HTML for file item
            return `
                <li class="file-item" id="file-item-${uniqueIdentifier}">
                    <div class="file-extension">${extension}</div>
                    <div class="file-content-wrapper">
                    <div class="file-content">
                        <div class="file-details">
                        <h5 class="file-name">${name}</h5>
                        <div class="file-info">
                            <small class="file-size">0 MB / ${formattedFileSize}</small>
                            <small class="file-divider">•</small>
                            <small class="file-status">Uploading...</small>
                        </div>
                        </div>
                        </div>
                        <div class="file-progress-bar">
                            <div class="file-progress"></div>
                            <i class="ri-delete-bin-6-line cancel-button"></i>
                        </div>
                    </div>
                </li>`;
        }
        const handleFileUploading = (file, uniqueIdentifier) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append("file", file);

            // Adding progress event listener to the ajax request
            xhr.upload.addEventListener("progress", (e) => {
                // Updating progress bar and file size element
                const fileProgress = document.querySelector(`#file-item-${uniqueIdentifier} .file-progress`);
                const fileSize = document.querySelector(`#file-item-${uniqueIdentifier} .file-size`);

                // Formatting the uploading or total file size into KB or MB accordingly
                const formattedFileSize = file.size >= 1024 * 1024 ?
                    `${(e.loaded / (1024 * 1024)).toFixed(2)} MB / ${(e.total / (1024 * 1024)).toFixed(2)} MB` :
                    `${(e.loaded / 1024).toFixed(2)} KB / ${(e.total / 1024).toFixed(2)} KB`;

                const progress = Math.round((e.loaded / e.total) * 100);
                fileProgress.style.width = `${progress}%`;
                fileSize.innerText = formattedFileSize;
            });

            // Opening connection to the server API endpoint "api.php" and sending the form data
            xhr.open("POST", "api.php", true);
            xhr.send(formData);

            return xhr;
        }

        const handleSelectedFiles = ([...files]) => {
            if (files.length === 0) return;

            // Clear the existing file list to ensure only one <li> is present
            fileList.innerHTML = "";

            totalFiles = files.length;
            completedFiles = 0;

            files.forEach((file, index) => {
                const uniqueIdentifier = Date.now() + index;

                // Generate file item HTML
                const fileItemHTML = createFileItemHTML(file, uniqueIdentifier);
                fileList.insertAdjacentHTML("afterbegin", fileItemHTML);

                const currentFileItem = document.querySelector(`#file-item-${uniqueIdentifier}`);
                const cancelFileUploadButton = currentFileItem.querySelector(".cancel-button");

                // Function to update file status
                const updateFileStatus = (status, color) => {
                    currentFileItem.querySelector(".file-status").innerText = status;
                    currentFileItem.querySelector(".file-status").style.color = color;
                };

                // Check if the file is a CSV
                if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
                    updateFileStatus("Cancelled", "#E3413F");

                    // Remove the <li> when cancel is clicked
                    cancelFileUploadButton.addEventListener("click", () => {
                        currentFileItem.remove();
                        totalFiles--;
                        fileCompletedStatus.innerText =
                            `${completedFiles} / ${totalFiles} files completed`;
                    });

                    return;
                }

                // Handle valid CSV file upload
                const xhr = handleFileUploading(file, uniqueIdentifier);

                xhr.addEventListener("readystatechange", () => {
                    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        completedFiles++;
                        updateFileStatus("Completed", "#00B125");
                        fileCompletedStatus.innerText =
                            `${completedFiles} / ${totalFiles} files completed`;
                    }
                });

                cancelFileUploadButton.addEventListener("click", () => {
                    xhr.abort();
                    updateFileStatus("Cancelled", "#E3413F");
                    currentFileItem.remove();
                    totalFiles--;
                    fileCompletedStatus.innerText = `${completedFiles} / ${totalFiles} files completed`;
                });

                xhr.addEventListener("error", () => {
                    updateFileStatus("Error", "#E3413F");
                    alert("An error occurred during the file upload!");
                });
            });

            fileCompletedStatus.innerText = `${completedFiles} / ${totalFiles} files completed`;
        };

        // Function to handle file drop event
        fileUploadBox.addEventListener("drop", (e) => {
            e.preventDefault();
            handleSelectedFiles(e.dataTransfer.files);
            fileUploadBox.classList.remove("active");
            fileUploadBox.querySelector(".file-instruction").innerText = "Drag files here";
        });

        // Function to handle file dragover event
        fileUploadBox.addEventListener("dragover", (e) => {
            e.preventDefault();
            fileUploadBox.classList.add("active");
            fileUploadBox.querySelector(".file-instruction").innerText = "Release to upload";
        });

        // Function to handle file dragleave event
        fileUploadBox.addEventListener("dragleave", (e) => {
            e.preventDefault();
            fileUploadBox.classList.remove("active");
            fileUploadBox.querySelector(".file-instruction").innerText = "Drag files here";
        });

        fileBrowseInput.addEventListener("change", (e) => handleSelectedFiles(e.target.files));
        fileBrowseButton.addEventListener("click", () => fileBrowseInput.click());

        fileBrowseButton.addEventListener("click", (e) => {
            e.preventDefault();

            if (fileBrowseInput.disabled) return;

            fileBrowseInput = true;
            fileBrowseInput.value = "";
            fileBrowseInput.click();

            // Enable the file input after the file selection process is completed
            fileBrowseInput.addEventListener("change", () => {
                fileBrowseInput = true;
            });
        });

        $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function(e) {
            const activeTab = $(e.target).attr('href').replace('#', '');

            $('#importModal').find('input[name="active_tab"]').val(activeTab);
        });
    </script>
@endpush
