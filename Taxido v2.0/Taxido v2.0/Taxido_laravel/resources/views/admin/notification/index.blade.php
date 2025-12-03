@endphp
@extends('admin.layouts.master')
@section('title', __('static.notifications.notification'))
@section('content')
    <div class="row">
        <div class="col-xl-10 col-xxl-8 mx-auto">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <div class="contentbox-subtitle">
                            <h3>{{ __('static.notifications.notification') }}</h3>
                        </div>
                        @if ($notifications->count())
                            <a href="#!" class="btn btn-solid more-action" id="clear-all">
                                <i class="ri-delete-bin-line"></i>{{ __('static.notifications.all_clear') }}
                            </a>
                        @endif
                    </div>
                    <ul class="notification-setting" id="notification-list">
                        @forelse($notifications as $notification)
                            <li class="{{ $notification->read_at ? '' : 'unread' }}" data-id="{{ $notification->id }}">
                                <h4>{{ $notification->data['message'] ?? 'No message' }}</h4>
                                <h5>
                                    <i class="ri-time-line"></i>
                                    {{ $notification->created_at->format('Y-m-d h:i:s A') }}
                                </h5>
                            </li>
                        @empty
                            <div class="no-data mt-3">
                                <img src="{{ url('/images/no-data.png') }}" alt="" class="w-25 h-auto">
                                <h6 class="mt-2">{{ __('static.notifications.no_notification_found') }}</h6>
                            </div>
                        @endforelse
                    </ul>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        $(document).ready(function() {
            setTimeout(function() {
                let unreadNotifications = $('#notification-list li.unread').map(function() {
                    return $(this).data('id');
                }).get();

                if (unreadNotifications.length) {
                    $.post("{{ route('admin.notifications.markAsRead') }}", {
                        ids: unreadNotifications,
                        _token: '{{ csrf_token() }}'
                    }).done(function(response) {
                        if (response.status === 'success') {
                            $('#notification-list li.unread').removeClass('unread');
                        }
                    });
                }
            }, 2000);

            $('#clear-all').on('click', function(e) {
                e.preventDefault();

                $.post("{{ route('admin.notifications.clearAll') }}", {
                    _token: '{{ csrf_token() }}'
                }).done(function(response) {
                    if (response.status === 'success') {
                        $('#notification-list').empty();
                        $('.no-data-detail').show();
                        $('#clear-all').hide();
                    }
                });
            });

            if (!$('#notification-list li').length) {
                $('.no-data-detail').show();
            }
        });
    </script>
@endpush
