@extends('admin.layouts.master')

@section('title', __('static.system_tools.backup'))

@section('content')
    <div class="contentbox">
        <div class="inside">
            <div class="contentbox-title">
                <div class="contentbox-subtitle">
                    <h3>{{ __('static.system_tools.backup') }}</h3>
                    @can('system-tool.create')
                        <button type="button" id="add-backup" class="btn btn-outline">
                            <i class="ri-add-line"></i> {{ __('static.system_tools.create_backup') }}
                        </button>
                    @endcan
                </div>
            </div>

            <!-- Add Backup Modal -->
            <div class="modal fade confirmation-modal" id="confirmation">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header text-center">
                            <h5 class="modal-title m-0">{{ __('static.system_tools.create_backup') }}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form action="{{ route('admin.backup.store') }}" method="POST">
                            @csrf
                            @method('POST')
                            <div class="modal-body text-start backup-form">
                                <div class="floating-label form-group">
                                    <input type="text" id="title" class="form-control" name="title"
                                        placeholder=" ">
                                    <label>{{ __('static.system_tools.title') }}</label>
                                    @error('title')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                                <div class="floating-label form-group">
                                    <textarea id="floating-name" class="form-control" rows="3" name="description" placeholder="" cols="80"></textarea>
                                    <label for="description">{{ __('static.system_tools.description') }}</label>
                                    @error('description')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong></strong>
                                        </span>
                                    @enderror
                                </div>

                                <div class="form-group">
                                    <label for="backup_type">{{ __('static.system_tools.backup_type') }}</label>
                                    <div>
                                        <select class="form-control select-2" name="backup_type" id="backup_type">
                                            <option value="db">{{ __('static.system_tools.db') }}</option>
                                            <option value="media">{{ __('static.system_tools.media') }}</option>
                                            <option value="files">{{ __('static.system_tools.files') }}</option>
                                            <option value="both">{{ __('static.system_tools.both') }}</option>
                                        </select>
                                        @error('backup_type')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <div class="submit-btn">
                                    <button type="submit" name="save" class="btn btn-solid spinner-btn">
                                        {{ __('static.submit') }}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class="table-main email-template-table template-table m-0">
                <div class="table-responsive custom-scrollbar m-0">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ __('static.notify_templates.title') }}</th>
                                <th>{{ __('static.notify_templates.description') }}</th>
                                <th>{{ __('static.created_at') }}</th>
                                <th>{{ __('static.notify_templates.action') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($backups as $backup)
                                <tr>
                                    <td>{{ $backup->title }}</td>
                                    <td>{{ $backup->description }}</td>
                                    <td>{{ $backup->created_at->format('Y-m-d h:i:s A') }}</td>
                                    <td>                           
                                        <div class="icon-box d-inline-flex gap-2">
                                            <div class="d-flex gap-2">
                                                @if (!empty($backup->file_path['db']))
                                                    <div>
                                                        <a href="{{ route('admin.backup.downloadDbBackup', $backup->id) }}"
                                                            class="dark-icon-box" data-bs-toggle="tooltip" title="Database">
                                                            <i class="ri-download-2-line" alt="no-data"></i>
                                                        </a>
                                                    </div>
                                                @endif
                                                @if (!empty($backup->file_path['files']))
                                                    <div>
                                                        <a href="{{ route('admin.backup.downloadFilesBackup', $backup->id) }}"
                                                            class="dark-icon-box" data-bs-toggle="tooltip" title="Files">
                                                            <i class="ri-file-download-line" alt="no-data"></i>
                                                        </a>
                                                    </div>
                                                @endif
                                                @if (!empty($backup->file_path['media']))
                                                    <div>
                                                        <a href="{{ route('admin.backup.downoadUploadsBackup', $backup->id) }}"
                                                            class="dark-icon-box" data-bs-toggle="tooltip" title="Media">
                                                            <i class="ri-folder-download-line" alt="no-data"></i>
                                                        </a>
                                                    </div>
                                                @endif
                                            </div>
                                            <div class="d-flex gap-2">
                                                @if (!empty($backup->file_path['db']) && !empty($backup->file_path['media']))
                                                    <div>
                                                        <a href="javascript:void(0)" class="dark-icon-box"
                                                            data-bs-toggle="tooltip" title="Restore"
                                                            onclick="showRestoreModal('{{ route('admin.backup.restoreBackup', $backup->id) }}')">
                                                            <i class="ri-arrow-turn-forward-line" alt="no-data"></i>
                                                        </a>
                                                    </div>
                                                @endif
                                                @if (!empty($backup->file_path))
                                                    <div>
                                                        <a href="javascript:void(0)" class="dark-icon-box"
                                                            data-bs-toggle="tooltip" title="Delete Backup"
                                                            onclick="showDeleteModal('{{ route('admin.backup.deleteBackup', $backup->id) }}')">
                                                            <i class="ri-delete-bin-line" alt="no-data"></i>
                                                        </a>
                                                    </div>
                                                @endif
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Modal -->
    <div class="modal fade delete-modal" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-start confirmation-data delete-data">
                    <div class="main-img">
                        <div class="delete-icon">
                            <img src="{{ asset('images/info-circle.svg') }}" />
                        </div>
                    </div>
                    <h4 class="modal-title">{{ __('static.system_tools.confirm_delete_backup') }}</h4>
                    <p>{{ __('static.system_tools.delete_backup_warning_message') }}</p>
                    <div class="d-flex">
                        <input type="hidden" id="inputType" name="type" value="">
                        <button type="button" class="btn cancel btn-light me-2 w-100" data-bs-dismiss="modal">
                            <a href="" class="btn-close"></a>{{ __('static.cancel') }}
                        </button>
                        <form id="deleteForm" class="w-100" action="" method="POST">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-secondary delete spinner-btn delete-btn">
                                <i class="ri-delete-bin-5-line"></i>{{ __('static.delete') }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Restore Modal -->
    <div class="modal fade restore-modal" id="restoreModal" tabindex="-1" aria-labelledby="restoreModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-start confirmation-data restore-data">
                    <div class="main-img">
                        <div class="restore-icon">
                            <img src="{{ asset('images/info-circle.svg') }}" />
                        </div>
                    </div>
                    <h4 class="modal-title">{{ __('static.system_tools.confirm_restore_backup') }}</h4>
                    <p>{{ __('static.system_tools.restore_backup_warning_message') }}</p>
                    <div class="d-flex">
                        <input type="hidden" id="inputType" name="type" value="">
                        <button type="button" class="btn cancel btn-light me-2 w-100" data-bs-dismiss="modal">
                            <a href="" class="btn-close"></a>{{ __('static.cancel') }}
                        </button>
                        <form id="restoreForm" class="w-100" action="" method="POST">
                            @csrf
                            @method('GET')
                            <button type="submit" class="btn btn-secondary restore spinner-btn restore-btn">
                                <i class="ri-arrow-turn-forward-line"></i>{{ __('static.submit') }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

@push('scripts')
    <script>
        
        $(document).ready(function() {
            $('#add-backup').on('click', function() {
                var myModal = new bootstrap.Modal(document.getElementById("confirmation"), {});
                myModal.show();
            });
        });

        // Show Restore Modal
        function showRestoreModal(restoreUrl) {
            $('#restoreForm').attr('action', restoreUrl);
            $('#restoreModal').modal('show');
        }

        // Show Delete Modal
        function showDeleteModal(deleteUrl) {
            $('#deleteForm').attr('action', deleteUrl);
            $('#deleteModal').modal('show');
        }
    </script>
@endpush
