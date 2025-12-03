@extends('admin.layouts.master')
@section('title', __('static.systems.about'))
@section('content')
    <div class="row g-xl-4 g-3">
        <div class="col-xl-9">
            <div class="left-part">
                <!-- PHP Configuration Section -->
                <div class="contentbox">
                    <div class="accordion system-accordion" id="phpConfig">
                        <div class="inside">
                            <div class="accordion-item">
                                <div class="accordion-header contentbox-title pb-0">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#phpConfigCollapse" aria-expanded="false"
                                        aria-controls="phpConfigCollapse">
                                        <h3>{{ __('static.systems.php_config') }}</h3>
                                    </button>
                                </div>
                                <div id="phpConfigCollapse" class="accordion-collapse collapse show"
                                    data-bs-parent="#phpConfig">
                                    <div class="accordion-body table-main table-about">
                                        <div class="table-responsive custom-scrollbar">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th>{{ __('static.systems.config_name') }}</th>
                                                        <th>{{ __('static.systems.current') }}</th>
                                                        <th>{{ __('static.systems.recommended') }}</th>
                                                        <th>{{ __('static.systems.status') }}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    @foreach ($prerequisites['configurations'] as $name => $config)
                                                        <tr>
                                                            <td>{{ ucfirst(str_replace('_', ' ', $name)) }}</td>
                                                            <td>{{ $config['current'] }}</td>
                                                            <td>{{ $config['recommended'] }}</td>
                                                            <td>
                                                                <span
                                                                    class="{{ ($config['status'] ?? 'N/A') === '✓' ? 'true' : 'false' }}">{{ $config['status'] ?? 'N/A' }}</span>
                                                            </td>
                                                        </tr>
                                                    @endforeach
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Extensions Section -->
                <div class="contentbox">
                    <div class="accordion system-accordion" id="extension">
                        <div class="inside">
                            <div class="accordion-item">
                                <div class="accordion-header contentbox-title pb-0">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#extensionCollapse" aria-expanded="false"
                                        aria-controls="extensionCollapse">
                                        <h3>{{ __('static.systems.extensions') }}</h3>
                                    </button>
                                </div>
                                <div id="extensionCollapse" class="accordion-collapse collapse show"
                                    data-bs-parent="#extension">
                                    <div class="accordion-body table-main table-about">
                                        <div class="table-responsive custom-scrollbar">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th>{{ __('static.systems.extension_name') }}</th>
                                                        <th>{{ __('static.systems.status') }}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    @foreach ($prerequisites['extensions'] as $name => $config)
                                                        <tr>
                                                            <td>{{ ucfirst($name) }}</td>
                                                            <td>
                                                                <span
                                                                    class="{{ ($config['status'] ?? 'N/A') === '✓' ? 'true' : 'false' }}">{{ $config['status'] ?? 'N/A' }}</span>
                                                            </td>
                                                        </tr>
                                                    @endforeach
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-3">
            <div class="p-sticky">
                <!-- Server Info Section -->
                <div class="contentbox">
                    <div class="accordion system-accordion" id="serverInfo">
                        <div class="inside">
                            <div class="accordion-item">
                                <div class="accordion-header contentbox-title pb-0">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#serverInfoCollapse" aria-expanded="false"
                                        aria-controls="serverInfoCollapse">
                                        <h3>{{ __('static.systems.server_info') }}</h3>
                                    </button>
                                </div>
                                <div id="serverInfoCollapse" class="accordion-collapse collapse show"
                                    data-bs-parent="#serverInfo">
                                    <div class="accordion-body table-main table-about">
                                        <div class="table-responsive custom-scrollbar">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th>{{ __('static.systems.name') }}</th>
                                                        <th>{{ __('static.systems.current') }}</th>
                                                        <th>{{ __('static.systems.recommended') }}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    @foreach ($prerequisites['version'] as $name => $config)
                                                        <tr>
                                                            <td>{{ ucfirst($name) }}</td>
                                                            <td>{{ $config['current'] }}</td>
                                                            <td>{{ $config['recommended'] }}</td>
                                                        </tr>
                                                    @endforeach
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- File and Folder Permissions Section -->
                <div class="contentbox">
                    <div class="accordion system-accordion" id="fileFolderPermission">
                        <div class="inside">
                            <div class="accordion-item">
                                <div class="accordion-header contentbox-title pb-0">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#fileFolderPermissionCollapse" aria-expanded="false"
                                        aria-controls="fileFolderPermissionCollapse">
                                        <h3>{{ __('static.systems.file_folder_permissions') }}</h3>
                                    </button>
                                </div>
                                <div id="fileFolderPermissionCollapse" class="accordion-collapse collapse show"
                                    data-bs-parent="#fileFolderPermission">
                                    <div class="accordion-body table-main table-about">
                                        <div class="table-responsive custom-scrollbar">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th>{{ __('static.systems.file_folder') }}</th>
                                                        <th>{!! __('static.systems.status') !!}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    @foreach ($prerequisites['file_permissions'] as $item => $config)
                                                        <tr>
                                                            <td>{{ $config['display_name'] }}</td>
                                                            <td>
                                                                <span
                                                                    class="{{ ($config['status'] ?? 'N/A') === '✓' ? 'true' : 'false' }}">{{ $config['status'] ?? 'N/A' }}</span>
                                                            </td>
                                                        </tr>
                                                    @endforeach
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
