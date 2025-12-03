@use('App\Helpers\Helpers')
@use('App\Enums\RoleEnum')
@php
    $filter = request()->filled('filter') ? request()->filter : 'all';
    $roleName = getCurrentRoleName();
    $isTrashed = isset($row['deleted_at']) && !empty($row['deleted_at']);
    $mimeImageMapping = [
        'application/pdf' => 'images/file-icon/pdf.png',
        'text/csv' => 'images/file-icon/csv.png',
        'application/msword' => 'images/file-icon/word.png',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'images/file-icon/word.png',
        'application/vnd.ms-excel' => 'images/file-icon/xls.png',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'images/file-icon/xls.png',
        'application/vnd.ms-powerpoint' => 'images/file-icon/folder.png',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'images/file-icon/folder.png',
        'text/plain' => 'images/file-icon/txt.png',
        'audio/mpeg' => 'images/file-icon/sound.png',
        'audio/wav' => 'images/file-icon/sound.png',
        'audio/ogg' => 'images/file-icon/sound.png',
        'video/mp4' => 'images/file-icon/video.png',
        'video/webm' => 'images/file-icon/video.png',
        'video/ogg' => 'images/file-icon/video.png',
        'application/zip' => 'images/file-icon/zip.png',
        'application/x-tar' => 'images/file-icon/zip.png',
        'application/gzip' => 'images/file-icon/zip.png',
    ];
@endphp
<td>
    @if (!empty($column['type']))
        @if (isset($column['field']) && $column['type'] == 'status')
            @can(@$action['permission'])
                <label class="switch switch-sm">
                    <input id="status-{{ $row['id'] }}"
                        @if (isset($column['route'])) data-route="{{ route($column['route'], $row['id']) }}" @endif
                        class="form-check-input toggle-class" value="1" type="checkbox"
                        @if ($row[$column['field']]) checked @endif @if (request('filter') === 'trash' ||
                                !auth()->user()->can(@$column['permission'])) disabled @endif>
                    <span class="switch-state"></span>
                </label>
            @endcan

            @cannot(@$action['permission'])
                <i class="ri-lock-line"></i>
            @endcannot
        @elseif (isset($column['field']) && $column['type'] == 'is_verified')
            @can(@$action['permission'])
                <label class="switch switch-sm">
                    <input id="is_verified-{{ $row['id'] }}"
                        @if (isset($column['route'])) data-route="{{ route($column['route'], $row['id']) }}" @endif
                        class="form-check-input toggle-class {{ $row[$column['field']] }}" value="1" type="checkbox"
                        @if ($row[$column['field']]) checked @endif>
                    <span class="switch-state"></span>
                </label>
            @endcan
            @cannot(@$action['permission'])
                <i class="ri-lock-line"></i>
            @endcannot
        @elseif (isset($column['field']) && $column['type'] == 'avatar')
            @if ($row[$column['field']])
                @php
                    $users = $row[$column['field']];
                    $totalUsers = count($users);
                    $maxVisible = 3;
                @endphp
                <div class="avatar-group">
                    @if(is_array($users))
                        @if(count($users))
                            @foreach ($users as $index => $user)
                                @if ($index < $maxVisible)
                                    <div class="avatar">
                                        @if ($user->profile_image_id)
                                            <img src="{{ $user->profile_image?->original_url }}" alt="image" class="table-image">
                                        @else
                                            <div class="initial-letter">{{ substr($user->name, 0, 1) }}</div>
                                        @endif
                                    </div>
                                @endif
                            @endforeach
                            <div class="">
                                @php
                                    $remaining = $totalUsers - $maxVisible;
                                @endphp
                                @if ($remaining > 0)
                                    +{{ $remaining }}
                                @endif
                            </div>
                        @else
                             <div>N/A</div>
                        @endif
                    @else
                        <div>N/A</div>
                    @endif
                </div>
            @else
                <div>N/A</div>
            @endif
        @elseif (isset($column['field']) && $column['type'] == 'badge')
            @if (isset($column['colorClasses']))

                @if (isset($column['colorClasses'][$row[$column['field']]]))
                    <div class="badge badge-{{ $column['colorClasses'][$row[$column['field']]] }}">
                        {{ $row[$column['field']] }}
                    </div>
                @endif
            @else
                @isset($column['badge_type'])
                    @if ($column['badge_type'] == 'light')
                        <span class="bg-light-primary">
                            {{ $row[$column['field']] }}
                        </span>
                    @else
                        <div class="badge badge-primary">
                            {{ $row[$column['field']] }}
                        </div>
                    @endif
                @else
                    <div class="badge badge-primary">
                        {{ $row[$column['field']] }}
                    </div>
                @endisset
            @endif
        @elseif((isset($actionButtons) || isset($modalActionButtons) || isset($viewActionBox)) && $column['type'] == 'action')
            @if (!empty($actionButtons) || !empty($modalActionButtons) || isset($viewActionBox))
                <div class="action-box">
                    @if (!$isTrashed)
                        @if (is_array($actionButtons))
                            @foreach ($actionButtons as $actionButton)
                                @can($actionButton['permission'])
                                    <div class="icon-box">
                                        <a href="{{ isset($actionButton['route']) ? route($actionButton['route'], $row[$actionButton['field'] ?? 'id']) . (isset($actionButton['isTranslate']) && $actionButton['isTranslate'] ? '?locale=' . app()->getLocale() : '') : 'javascript:void(0)' }}"
                                            class="{{ $actionButton['class'] ?? '' }}">
                                            @isset($actionButton['icon'])
                                                <i class="{{ $actionButton['icon'] }}" data-bs-toggle="tooltip"
                                                    data-bs-placement="bottom" title="{{ @$actionButton['tooltip'] }}"></i>
                                            @endisset
                                        </a>
                                    </div>
                                @endcan
                            @endforeach
                        @endif
                        @if (is_array($modalActionButtons))
                            @foreach ($modalActionButtons as $modalActionButton)
                                @if (!$system_reserved)
                                    @can($modalActionButton['permission'])
                                        {{-- Check if not trashed --}}
                                        <div class="modal-icon-box">
                                            <a href="javascript:void(0)" data-bs-toggle="modal"
                                                data-route="{{ route($modalActionButton['route'], $row['id']) }}"
                                                class="{{ $modalActionButton['class'] ?? '' }}"
                                                data-bs-target="#{{ $modalActionButton['modalId'] ?? '' }}"
                                                data-id="{{ $row['id'] }}">
                                                @isset($modalActionButton['icon'])
                                                    <i class="{{ $modalActionButton['icon'] }}"></i>
                                                @endisset
                                            </a>
                                            <div class="modal fade text-center-modal delete-modal"
                                                id="{{ $modalActionButton['modalId'] ?? '' }}" tabindex="-1"
                                                aria-labelledby="{{ $modalActionButton['modalId'] ?? '' }}Label"
                                                aria-hidden="true">
                                                <div class="modal-dialog modal-dialog-centered">
                                                    <div class="modal-content">
                                                        <form method="{{ $modalActionButton['modalMethod'] }}"
                                                            action="{{ route($modalActionButton['route'], $row['id']) }}">
                                                            @csrf
                                                            @method($modalActionButton['modalMethod'])
                                                            <div class="modal-body confirmation-data delete-data">
                                                                @isset($modalActionButton['icon'])
                                                                    <div class="main-img">
                                                                        <div class="delete-icon">
                                                                            <i class="{{ $modalActionButton['icon'] }}"></i>
                                                                        </div>
                                                                    </div>
                                                                @endisset
                                                                @isset($modalActionButton['modalTitle'])
                                                                    <h4 class="modal-title">
                                                                        {{ $modalActionButton['modalTitle'] }}
                                                                    </h4>
                                                                @endisset
                                                                @isset($modalActionButton['modalDesc'])
                                                                    <p>{{ $modalActionButton['modalDesc'] }}</p>
                                                                @endisset
                                                                <div class="button-box d-flex">
                                                                    <button type="button"
                                                                        class="btn cancel btn-light me-2 rejected"
                                                                        data-bs-dismiss="modal">{{ __('static.cancel') }}</button>
                                                                    @isset($modalActionButton['modalBtnText'])
                                                                        <button class="btn btn-secondary delete delete-btn"
                                                                            type="submit">{{ $modalActionButton['modalBtnText'] }}</button>
                                                                    @endisset
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    @endcan
                                @endif
                            @endforeach
                        @endif
                        @if ($viewActionBox)
                            @includeIf($viewActionBox['view'], [$viewActionBox['field'] => $row])
                        @endif
                    @else
                        <i class="ri-lock-line"></i>
                    @endif
                </div>
            @endif
        @endif
    @else
        <div @if (isset($column['action']) && $column['action']) class="d-flex align-items-center gap-2" @endif>

            @if (isset($column['imageField']) && $row[$column['imageField']])
                @php
                    $attachment = getMedia($row[$column['imageField']]);
                    $imageUrl = getImageUrl($attachment?->original_url);
                @endphp
                <img class="table-image" src="{{ $imageUrl }}" alt="image">
            @elseif(isset($column['imageUrl']))
                <img class="table-image" src="{{ getImageUrl($row[$column['imageUrl']]) }}" alt="image">
            @elseif(isset($column['placeholderImage']))
                <img class="table-image" src="{{ getImageUrl(asset($column['placeholder'])) }}" alt="placeholder">
            @elseif(isset($column['placeholderLetter']))
                <div class="initial-letter">{{ substr($row[$column['field']], 0, 1) }}</div>
            @elseif(isset($column['mediaImage']))
                @php
                    $file = getMedia($row[$column['mediaImage']]);
                @endphp

                <img src="{{ substr($file?->mime_type, 0, 5) == 'image'
                    ? getImageUrl($file->original_url)
                    : asset($file?->mime_type !== null ? @$mimeImageMapping[$file?->mime_type] : 'images/nodata1.webp') }}"
                    alt="avatar" class="table-image" loading="lazy">
            @endif
            @if (isset($column['action']) && $column['action'])
                <div class="user-detail">
                    @if (isset($column['route']) && $filter != 'trash')
                        <a href="{{ route($column['route'], $row['id']) }}">{{ $row[$column['field']] }}</a>
                    @else
                        {{ $row[$column['field']] }}
                    @endif
                    @php
                        $renderableActions = collect($actions)
                            ->filter(function ($action) use ($filter, $row) {
                                $passesFilter =
                                    empty($action['whenFilter']) ||
                                    (!empty($action['whenFilter']) && in_array($filter, $action['whenFilter']));
                                $passesStatus =
                                    !isset($action['whenStatus']) ||
                                    (isset($action['whenStatus']) && $action['whenStatus'] == $row['status']);
                                $hasPermission = auth()?->user()?->can($action['permission']);
                                return $passesFilter && $passesStatus && $hasPermission;
                            })
                            ?->isNotEmpty();
                    @endphp


                    @if ($renderableActions)
                        <ul class="row-actions">
                            @foreach ($actions as $action)
                                @if (empty($action['whenFilter']) || (!empty($action['whenFilter']) && in_array($filter, $action['whenFilter'])))
                                    @if (!isset($action['whenStatus']) || (isset($action['whenStatus']) && $action['whenStatus'] == $row['status']))
                                        <li class="{{ $action['class'] }}">
                                            @can($action['permission'])
                                                @if (isset($action['route']))
                                                    @if (isset($action['isTranslate']))
                                                        @php
                                                            $route =
                                                                route($action['route'], $row['id']) .
                                                                '?locale=' .
                                                                app()->getLocale();
                                                        @endphp
                                                        <a
                                                            href="{{ $route }}"><span>{{ $action['title'] }}</span></a>
                                                    @else
                                                        <a
                                                            href="{{ route($action['route'], $row['id']) }}"><span>{{ $action['title'] }}</span></a>
                                                        {{--
                                                 @if ($action['class'] == 'delete')
                                                <a href="button" class="permanentDeleteBtn" data-bs-toggle="modal" data-bs-target="#deletePermanentConfirmation" data-url="{{ route($action['route'], $row['id']) }}"><span>{{ $action['title'] }}</span></a>
                                            @else
                                            @endif --}}
                                                    @endif
                                                @elseif (isset($action['action']) && isset($action['field']))
                                                    @if ($action['action'] == 'download')
                                                        <a href="{{ getMedia($row[$action['field']])?->original_url }}"
                                                            download>
                                                            <span>{{ $action['title'] }}</span>
                                                        </a>
                                                    @elseif ($action['action'] == 'copy')
                                                        <a href="{{ getMedia($row[$action['field']])?->original_url }}"
                                                            class="copy-link"
                                                            onclick="copyToClipboard(event, '{{ getMedia($row[$action['field']])?->original_url }}')">
                                                            <span>{{ $action['title'] }}</span>
                                                        </a>
                                                    @endif
                                                @endif
                                            @endcan
                                        </li>
                                    @endif
                                @endif
                            @endforeach
                        </ul>
                    @endif
                </div>
            @elseif(!isset($column['profile_image']) && !isset($column['email']))
                {{ $row[$column['field']] }}
            @endif
            @if (isset($column['profile_image']) && isset($column['email']))
                <div class="d-flex align-items-center gap-2 user-name">
                    @if (getMedia($row[$column['profile_image']])?->original_url)
                        <img class="table-image-detail"
                            src="{{ getMedia($row[$column['profile_image']])?->original_url }}" alt="image"
                            class="table-image">
                    @else
                        <div class="initial-letter">{{ substr($row[$column['field']], 0, 1) }}</div>
                    @endif
                    <div class="user-details">
                        <div>
                            @if (isset($column['route']))
                                @if ($row[$column['profile_id']])
                                    @php
                                        $route = route($column['route'], $row[$column['profile_id']]);
                                    @endphp
                                    <a href="{{ $route }}" class="user-name">{{ $row[$column['field']] }}</a>
                                @else
                                    <h5 class="user-name">{{ $row[$column['field']] }}</h5>
                                @endif
                            @else
                                <h5 class="user-name">{{ $row[$column['field']] }}</h5>
                            @endif
                            <h6 class="user-email">{{ $row[$column['email']] }}</h6>
                        </div>
                        <i class="ri-file-copy-line" id="copy-icon-{{ str_replace(' ', '-', $row[$column['field']]) }}"
                            data-email="{{ $row[$column['email']] }}"></i>
                    </div>
                </div>
            @endif
        </div>
    @endif
</td>

@push('scripts')
    <script>
        function copyToClipboard(event, text) {
            event.preventDefault();

            const tempInput = document.createElement('textarea');
            tempInput.style.position = 'absolute';
            tempInput.style.left = '-9999px';
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            tempInput.setSelectionRange(0, 99999);
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            toastr.success("{{ __('static.toastr.url_copied') }}");
        }
        var email =
            "{{ isset($column['email']) && isset($column['profile_image']) ? str_replace(' ', '-', $row[$column['field']]) : '' }}";
        var copyIcon = '#copy-icon-' + email;

        $(document).on('click', copyIcon, function() {
            const $icon = $(this);
            const email = $icon.data('email');
            const originalClass = $icon.attr('class');

            navigator.clipboard.writeText(email).then(() => {

                $icon.removeClass('ri-file-copy-line').addClass('ri-check-line');

                setTimeout(() => {
                    $icon.removeClass('ri-check-line').addClass('ri-file-copy-line');
                }, 700);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });

        $(document).ready(function() {
            $('a[data-bs-toggle="modal"]').on('click', function() {
                var route = $(this).data('route');
                var modalId = $(this).data('bs-target');
                $(modalId).find('form').attr('action', route);
            });
        });
    </script>
@endpush
