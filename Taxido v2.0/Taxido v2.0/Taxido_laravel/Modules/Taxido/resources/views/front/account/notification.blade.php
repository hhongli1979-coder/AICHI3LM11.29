@extends('taxido::front.account.master')
@section('title', __('taxido::front.notifications'))
@section('detailBox')
<div class="dashboard-details-box">
    <div class="dashboard-title">
        <h3>{{ __('taxido::front.notification') }}</h3>
        <form action="{{ route('front.cab.notifications.markAsRead') }}" method="POST" style="display: inline;">
            @csrf
            <a class="btn p-0">
                <i class="ri-check-double-line"></i>
                {{ __('taxido::front.mark_as_all_read') }}
            </a>
        </form>
    </div>
    <ul class="notification-list">
        @php
            $notifications = auth()->user()->notifications()->paginate(10);
        @endphp
        @forelse ($notifications as $notification)
            <li class="@if (!$notification->read_at) unread @endif">
                <i class="ri-time-line"></i>
                <div class="notification-content">
                    <p>{{ $notification->data['message'] }}
                    <span>{{ $notification->created_at->format('Y-m-d h:i:s A') }}</span></p>
                </div>
            </li>
        @empty
            <div class="dashboard-no-data">
                <svg>
                    <use xlink:href="{{ asset('images/dashboard/front/notification.svg#notification') }}"></use>
                </svg>
                <h6>{{ __('taxido::front.notifications_not_found') }}</h6>
            </div>
        @endforelse
    </ul>
    @if($notifications->count())
        @if($notifications->lastPage() > 1)
            <div class="pagination-main">
                <ul class="pagination-box">
                    {!! $notifications->links() !!}
                </ul>
            </div>
        @endif
    @endif
</div>
@endsection
@push('scripts')
<script>
    $(document).ready(function() {
        "use strict";
    
        setTimeout(markAllRead, 5000); 
    
        $('#mark-all-read').on('click', markAllRead);
    
        function markAllRead() {
            $.ajax({
                url: "{{ route('front.cab.notifications.markAsRead') }}",
                type: 'POST',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
                success: function(response) {
                    $('.notification-list li.unread').removeClass('unread');
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        }
    });
    </script>
@endpush
