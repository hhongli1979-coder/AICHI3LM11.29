@use('Modules\Ticket\Models\Priority')
@use('Modules\Ticket\Models\Status')
@use('Modules\Ticket\Models\Message')
@php
    $priorities = Priority::where('status', true)?->get(['id', 'name', 'color', 'slug']);
    $statuses = Status::where('status', true)?->get(['id', 'name']);
    $settings = tx_getSettings();
    $replies = Message::where('ticket_id', $ticket->id)->orderBy('id', 'desc')->get()->load('media');

@endphp
@extends('admin.layouts.master')
@section('title', __('ticket::static.ticket.ticket'))
@section('content')
    <div class="row g-xl-4 g-3">
        <div class="col-xl-4">
            <div class="p-sticky">
                @if (auth()->user()->hasRole('admin'))
                    <div class="contentbox">
                        <div class="inside">
                            <div class="contentbox-title">
                                <h3>{{ __('ticket::static.assign_ticket.assign') }}</h3>
                            </div>
                            <div class="form-group row">
                                <div class="col-12 select-label-error">
                                    <select class="assign-select select-2 form-control"
                                        data-placeholder="{{ __('ticket::static.assign_ticket.executive') }}" multiple>
                                        <option class="select-placeholder" value=""></option>
                                        <option value="{{ auth()->user()->id }}"
                                            @if (isset($ticket?->assigned_tickets) &&
                                                    in_array(auth()->user()->id, $ticket?->assigned_tickets->pluck('id')->toArray())) selected @endif></i> Me </option>
                                        @foreach ($users as $key => $user)
                                            <option value="{{ $user->id }}"
                                                @if (isset($ticket?->assigned_tickets) && in_array($user->id, $ticket?->assigned_tickets->pluck('id')->toArray())) selected @endif>{{ $user['name'] }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-12">
                                    <div class="submit-btn">
                                        <button type="submit" name="save" id="assign-user"
                                            class="btn btn-solid spinner-btn">
                                            {{ __('ticket::static.assign_ticket.assign_btn') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                @endif
                <div class="contentbox">
                    <div class="inside">
                        <div class="contentbox-title">
                            <h3>{{ __('ticket::static.user_detail.title') }}</h3>
                        </div>
                        <div class="customer-detail">
                            <div class="profile">
                                @if ($ticket?->user?->profile_image)
                                    <img src="{{ $ticket?->user?->profile_image?->original_url }}" alt="">
                                @else
                                    <div class="initial-letter">
                                        <span>{{ strtoupper($ticket?->user?->name[0]) }}</span>
                                    </div>
                                @endif
                                <div class="profile-name">
                                    <h4>{{ $ticket?->name ?? $ticket?->user?->name }}</h4>
                                    <p>{{ $ticket?->email ?? $ticket?->user?->email }}</p>
                                </div>
                            </div>
                            <ul class="detail-list">
                                <li class="detail-item">
                                    <h5>{{ __('ticket::static.user_detail.name') }}</h5>
                                    <span>{{ $ticket?->name ?? $ticket?->user?->name }}</span>
                                </li>
                                <li class="detail-item">
                                    <h5>{{ __('ticket::static.user_detail.email') }}</h5>
                                    <span>{{ $ticket?->email ?? $ticket?->user?->email }}</span>
                                </li>
                                <li class="detail-item">
                                    <h5>{{ __('ticket::static.user_detail.phone') }}</h5>
                                    <span>
                                        @if ($ticket?->user?->phone)
                                            + ({{ $ticket?->user?->country_code }}) {{ $ticket?->user?->phone }}
                                        @else
                                            -
                                        @endif
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                @if (getCurrentRoleName() == 'admin' || getCurrentRoleName() == 'executive')
                    <div class="contentbox">
                        <div class="inside">
                            <div class="contentbox-title">
                                <h3>{{ __('ticket::static.ticket_notes.title') }}</h3>
                            </div>
                            <div class="customer-detail">
                                @if ($ticket?->note)
                                    <div class="detail-card">
                                        <ul class="detail-list">
                                            <li class="detail-item">
                                                <span class="note-warning">{{ $ticket?->note }}</span>
                                            </li>
                                        </ul>
                                    </div>
                                @else
                                    <div class="profile">
                                        <img src="{{ asset('/images/notes.png') }}" alt="" class="img"
                                            height="100px">
                                        <div class="profile-name">
                                            <h4>{{ __('ticket::static.ticket_notes.no_notes_yet') }}</h4>
                                            <p>{{ __('ticket::static.ticket_notes.add_note') }}</p>
                                        </div>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                @endif
            </div>
        </div>
        <div class="col-xl-8">
            <div class="left-part p-sticky">
                <div class="contentbox">
                    <div class="inside">
                        <div class="contentbox-title">
                            <div class="contentbox-subtitle">
                                <h3>{{ $ticket?->ticket_number . ' - ' . $ticket?->subject }}</h3>
                            </div>

                            <div class="submit-btn action-btn">
                                @if (
                                    (isset($ticket?->assigned_tickets) &&
                                        in_array(auth()->user()->id, $ticket?->assigned_tickets->pluck('id')->toArray())) ||
                                        !isset($ticket?->assigned_tickets))
                                    <button type="submit" class="btn gray" id="ticket-reply">
                                        <i class="ri-reply-line"></i>
                                    </button>
                                @endif
                                @can('ticket.ticket.destroy')
                                    <button type="submit" name="save" class="btn secondary" data-bs-toggle="modal"
                                        data-bs-target="#confirmation">
                                        <i class="ri-delete-bin-6-line"></i>
                                    </button>
                                @endcan
                            </div>
                        </div>
                        <div class="ticket-content">
                            <div class="row g-3">
                                <div class="col-12">
                                    <h6 class="created-time">
                                        <span
                                            class="name">{{ 'Created At : ' . $ticket?->created_at->format('Y-m-d h:i A') }}</span>
                                        <span
                                            class="badge badge-{{ $ticket?->priority->color }}">{{ $ticket?->priority->name }}</span>
                                    </h6>
                                </div>
                                <div class="col-12 m-0">
                                    <form id="replyForm" action="{{ route('admin.reply.store') }}" method="POST"
                                        enctype="multipart/form-data">
                                        @csrf
                                        @method('POST')
                                        <div id="ticket-reply-box" class="response-form" style="display: none">
                                            <input type="hidden" name="ticket_id" value="{{ $ticket?->id }}">
                                            <input type="hidden" name="reply_id" value="{{ auth()->user()->id }}">
                                            <div class="form-group mb-3">
                                                <textarea class="form-control" name="message" id="message"
                                                    placeholder="{{ __('ticket::static.ticket.enter_description') }}"></textarea>
                                                @error('message')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong class="message-error">{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                            <div class="form-group mb-3 select-label-error">
                                                <select class="select-ticket-status select-2 form-control"
                                                    name="ticket_status" data-placeholder="{{ __('Select status') }}">
                                                    <option class="select-placeholder" value=""></option>
                                                    @foreach ($statuses as $status)
                                                        <option value="{{ $status->id }}"
                                                            @if ($ticket?->ticketStatus->id == $status->id) selected @endif>
                                                            {{ $status->name }}</option>
                                                    @endforeach
                                                </select>
                                                @error('status')
                                                    <span class="invalid-feedback d-block" role="alert">
                                                        <strong class="message-error">{{ $message }}</strong>
                                                    </span>
                                                @enderror
                                            </div>
                                            <div class="upload-file-container">
                                                <label for="image">{{ __('ticket::static.ticket.upload') }} <span
                                                        class="text-danger">({{ __('ticket::static.ticket.upload_span') }}
                                                        {{ $settings['storage_configuration']['max_file_upload'] }})</span></label>
                                                <div class="upload-file">
                                                    <input type="file" class="form-control" name="image[]"
                                                        id="image-upload"
                                                        data-max="{{ $settings['storage_configuration']['max_file_upload'] }}"
                                                        data-types="{{ implode(',', $settings['storage_configuration']['supported_file_types']) }}"
                                                        data-size="{{ $settings['storage_configuration']['max_file_upload_size'] }}"
                                                        multiple>
                                                    <button type="submit" class="btn btn-outline spinner-btn">
                                                        <i class="ri-reply-line"></i>{{ __('Send') }}
                                                    </button>
                                                </div>
                                            </div>
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong class="image-upload-error"></strong>
                                            </span>
                                        </div>
                                    </form>
                                </div>
                                <div class="col-12">
                                    <div class="ticket-contentbox">
                                        <ul class="reply-box">
                                            @foreach ($replies as $reply)
                                                <li>
                                                    <div class="profile-box">
                                                        <div class="profile-img">
                                                            @if ($reply->created_by?->profile_image)
                                                                <img src="{{ $reply?->created_by?->profile_image?->original_url }}"
                                                                    alt="">
                                                            @else
                                                                <div class="initial-letter">
                                                                    <span>{{ strtoupper($reply?->created_by?->name[0]) }}</span>
                                                                </div>
                                                            @endif
                                                        </div>
                                                        <h5>{{ $reply?->created_by?->name ?? $reply?->ticket?->email }}
                                                            <span>({{ $reply?->created_at->diffForHumans() }})</span>
                                                        </h5>
                                                        @if ($ticket?->ticketStatus->name !== 'Closed')
                                                            <div class="dropdown ticket-dropdown ms-auto">
                                                                <button type="button" class="btn dropdown-toggle"
                                                                    data-bs-toggle="dropdown">
                                                                    <i class="ri-more-2-fill"></i>
                                                                </button>
                                                                <div class="dropdown-menu dropdown-menu-end">
                                                                    <a class="dropdown-item" href="#"
                                                                        id="ticket-reply">{{ __('ticket::static.ticket.reply') }}</a>
                                                                </div>
                                                            </div>
                                                        @endif
                                                    </div>
                                                    <div class="comment-div">
                                                        <div class="comment comment-box">
                                                            <div class="comment-text" id="comment-{{ $reply?->id }}">
                                                                {!! $reply?->message !!}
                                                            </div>
                                                            <a href="javascript:void(0);" class="read-more"
                                                                data-toggle="comment-{{ $reply?->id }}"
                                                                style="display: none;">
                                                                {{ __('ticket::static.ticket.read_more') }}
                                                            </a>
                                                            <a href="javascript:void(0);" class="read-less"
                                                                data-toggle="comment-{{ $reply?->id }}"
                                                                style="display: none;">
                                                                {{ __('ticket::static.ticket.read_less') }}
                                                            </a>
                                                            @php
                                                                $images = $reply->getMedia('attachment');
                                                                $attachmentCounts = $images->count();
                                                            @endphp
                                                            @if ($attachmentCounts > 0)
                                                                <div class="attachemnt-counts mt-2">
                                                                    <p>{{ $attachmentCounts }} Attachments</p>
                                                                </div>
                                                            @endif
                                                            <div class="attachment-box mt-2">
                                                                @foreach ($images as $image)
                                                                    @php
                                                                        $sizeInKB = number_format(
                                                                            $image->size / 1024,
                                                                            2,
                                                                        );
                                                                        $sizeInMB = number_format(
                                                                            $image->size / (1024 * 1024),
                                                                            2,
                                                                        );
                                                                    @endphp
                                                                    <div class="d-flex">
                                                                        <a href="{{ route('admin.ticket.file.download', ['mediaId' => $image->id]) }}"
                                                                            class="btn btn-outline">
                                                                            {{ $image->name }}
                                                                            <i class="ri-arrow-down-circle-line"></i>
                                                                        </a>
                                                                        <small class="text-gray"
                                                                            style="font-size: 0.9em;">Size:
                                                                            {{ $sizeInKB }} KB ({{ $sizeInMB }}
                                                                            MB)</small>
                                                                    </div>
                                                                @endforeach
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            @endforeach
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="contentbox">
                    <div class="inside">
                        <div class="contentbox-title">
                            <h3>{{ __('ticket::static.ticket_information.title') }}</h3>
                        </div>
                        <div class="detail-card">
                            <ul class="detail-list">
                                <li class="detail-item">
                                    <h5>{{ __('ticket::static.ticket_information.ticket_id') }}</h5>
                                    <span class="bg-light-primary">
                                        #{{ $ticket?->ticket_number }}
                                    </span>
                                </li>
                                <li class="detail-item">
                                    <h5>{{ __('ticket::static.ticket_information.ticket_department') }}</h5>
                                    <span>{{ $ticket?->department->name }}</span>
                                </li>
                                <li class="detail-item">
                                    <h5>{{ __('ticket::static.ticket_information.ticket_priority') }}</h5>
                                    <span
                                        class="badge badge-{{ $ticket?->priority->color }}">{{ $ticket?->priority->name }}</span>
                                </li>
                                <li class="detail-item">
                                    <h5>{{ __('ticket::static.ticket_information.ticket_open_date') }}</h5>
                                    <span>{{ $ticket?->created_at->format('Y-m-d') }}</span>
                                </li>
                                <li class="detail-item">
                                    <h5>{{ __('ticket::static.ticket_information.ticket_status') }}</h5>
                                    <span
                                        class="badge badge-{{ $ticket?->ticketStatus->color }}">{{ $ticket?->ticketStatus->name }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade assign-modal" id="assign">
        <div class="modal-dialog modal-dialog-centered modal-md">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ __('ticket::static.assign_ticket.assign') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-start">
                    <form action="{{ route('admin.ticket.assign') }}" method="post">
                        @csrf
                        @method('POST')
                        <input type="hidden" name="user_id" id="user_id" value="">
                        <input type="hidden" name="ticket_id" value="{{ $ticket?->id }}">
                        <div class="form-group row">
                            <label class="col-md-2"
                                for="message">{{ __('ticket::static.assign_ticket.message') }}</label>
                            <div class="col-md-10">
                                <textarea class="form-control" rows="3" name="note"
                                    placeholder="{{ __('ticket::static.assign_ticket.enter_message') }}"></textarea>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2"
                                for="priority_id">{{ __('ticket::static.assign_ticket.priority') }}</label>
                            <div class="col-md-10 select-label-error">
                                <select class="select-2 form-control" name="priority_id">
                                    @foreach ($priorities as $priority)
                                        <option value="{{ $priority->id }}"
                                            @if ($ticket?->priority->id == $priority->id) selected @endif>{{ $priority->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-12">
                                <div class="submit-btn">
                                    <button type="submit" name="save" class="btn btn-solid spinner-btn">
                                        {{ __('ticket::static.assign_ticket.assign_btn') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade text-center-modal delete-modal" id="confirmation">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <form action="{{ route('admin.ticket.destroy', $ticket?->id) }}" method="get" id="delete-form">
                    @csrf
                    <div class="modal-body confirmation-data delete-data">
                        <div class="main-img">
                            <div class="delete-icon">
                                <i class="ri-delete-bin-line"></i>
                            </div>
                        </div>
                        <div class="text-center">
                            <h4 class="modal-title"> {{ __('ticket::static.delete_message') }}</h4>
                            <p>{{ __('ticket::static.delete_note') }}</p>
                        </div>
                        <div class="button-box d-flex">
                            <button type="button" class="btn btn-secondary"
                                data-bs-dismiss="modal">{{ __('Cancel') }}</button>
                            <button type="submit" class="btn btn-primary delete spinner-btn"
                                data-delete-id="">{{ __('Delete') }}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Rating Modal -->
    <div class="modal fade" id="ratingModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ratingModalLabel">{{ __('ticket::static.rating.rate_agents') }}</h5>
                    <button type="button" class="close" data-bs-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="ratingForm" action="{{ route('admin.rating.store') }}" method="POST">
                        @csrf
                        @method('POST')
                        <input type="hidden" name="ticket_id" value="{{ $ticket?->id }}">
                        <div class="form-group row">
                            <label class="col-md-2" for="rating">Executives:</label>
                            <div class="col-md-10 select-label-error">
                                <select class="select-2 form-control" name="rating" id="rating"
                                    data-placeholder="Select Ratings">
                                    <option class="select-placeholder" value=""></option>
                                    @forelse ([1 => '1 Star', 2 => '2 Star', 3 => '3 Star', 4 => '4 Star', 5 => '5 Star' ] as $key => $option)
                                        <option value={{ $key }}>{{ $option }}</option>
                                    @empty
                                        <option value="" disabled></option>
                                    @endforelse
                                </select>
                                @error('rating')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-12">
                                <div class="submit-btn">
                                    <button type="submit" name="save" class="btn btn-solid spinner-btn">
                                        {{ __('ticket::static.submit') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('scripts')
    <script>
        (function($) {
            "use strict";
            $('#ratingForm').validate({
                rules: {
                    "rating": {
                        required: true,
                        number: true,
                        range: [1, 5]
                    }

                },
                messages: {
                    "rating": {
                        required: "Please select a rating for agents.",
                        number: "Please select a valid rating.",
                        range: "Rating must be between 1 and 5."
                    }
                },
            });
            $(document).ready(function() {
                $(document).on('click', '#ticket-reply', function() {
                    $('#ticket-reply-box').show();
                });

                $(document).on('click', '#assign-user', function() {
                    const modal = new bootstrap.Modal(document.getElementById('assign'));
                    modal.show();
                    let selectedUsers = $('.assign-select').val();
                    $('#user_id').val(selectedUsers);
                });

                $(document).on('change', '#image-upload', function() {
                    var files = $(this)[0];


                    var maxSize = $(this).data('size');
                    console.log('max size is', maxSize);

                    var maxFiles = $(this).data('max');
                    console.log('max files is', maxFiles);

                    var allowedTypes = $(this).data('types').split(',').map(function(type) {
                        return type.trim().toLowerCase();
                    });

                    var fileCount = files.files.length;
                    console.log('file  count is', fileCount);

                    console.log(files.files.length > maxFiles);

                    if (files.files.length > maxFiles) {
                        $('.invalid-feedback').show();
                        $('.image-upload-error').text('You can only upload up to ' + maxFiles +
                            ' files.');
                        $(this).val('');
                    } else {
                        for (var i = 0; i < fileCount; i++) {
                            var file = files.files[i];
                            console.log('file in the array', file);

                            var fileExtension = file.name.split('.').pop().toLowerCase();
                            var fileSize = file.size;

                            if (!allowedTypes.includes(fileExtension)) {
                                $('.invalid-feedback').show();
                                $('.image-upload-error').text('File "' + file.name +
                                    '" has an invalid extension. Allowed extensions are: ' +
                                    allowedTypes.join(', ') + '.');
                            }

                            if (fileSize > maxSize) {
                                $('.invalid-feedback').show();
                                $('.image-upload-error').text('File "' + file.name +
                                    '" exceeds the maximum size of ' + (maxSize / 1024 / 1024)
                                    .toFixed(2) + ' MB.');
                            }
                        }
                    }

                });

                $(document).ready(function() {
                    function checkOverflow(element) {
                        return element.scrollHeight > element.clientHeight;
                    }

                    $('.comment').each(function() {
                        var $commentText = $(this).find('.comment-text');
                        var $readMore = $(this).find('.read-more');
                        var $readLess = $(this).find('.read-less');

                        if (checkOverflow($commentText[0])) {
                            $readMore.show();
                        }

                        $readMore.click(function() {
                            $commentText.addClass('expanded');
                            $readMore.hide();
                            $readLess.show();
                        });

                        $readLess.click(function() {
                            $commentText.removeClass('expanded');
                            $readMore.show();
                            $readLess.hide();
                        });
                    });
                });

                $(document).ready(function() {
                    var userRole = "{{ getCurrentRoleName() }}";

                    $('#replyForm').on('submit', function(event) {
                        event.preventDefault();

                        const form = $(this);
                        // let message = $(this).find('textarea[name="message"]').val().trim();
                        // if (message === '') {
                        //     event.preventDefault(); // Stop the form from submitting
                        //     alert('The message field is required!'); // Show an error message
                        // }

                        let message = form.find('textarea[name="message"]').val();
                        message = message.replace(/<\/?p>/g, "");
                        form.find('textarea[name="message"]').val(message);
                        const formData = new FormData(this);

                        const submitButton = form.find('button[type="submit"]');
                        submitButton.prop('disabled', true);
                        submitButton.html('<i class="ri-loader-line ri-spin"></i> Sending...');

                        $.ajax({
                            url: form.attr('action'),
                            type: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function(response) {
                                checkTicketRatings({{ $ticket?->id }});
                            },
                            error: function(xhr) {
                                console.log('An error occurred:', xhr.responseText);
                            }
                        });
                    });

                    function checkTicketRatings(ticketID) {
                        $.ajax({
                            url: '{{ url('admin/rating/ticket-status') }}/' + ticketID,
                            type: 'GET',
                            success: function(response) {
                                if (response == true) {
                                    if (userRole === 'user') {
                                        const modal = new bootstrap.Modal(document
                                            .getElementById('ratingModal'));
                                        modal.show();
                                    }
                                } else {
                                    location.reload();
                                }
                            }
                        });
                    }

                    function getRatings(ticketID) {

                        $.ajax({
                            url: '{{ url('admin/rating/ticket-status') }}/' + ticketID,
                            type: 'GET',
                            success: function(response) {
                                if (response == true) {
                                    if (userRole === 'user') {
                                        const modal = new bootstrap.Modal(document
                                            .getElementById('ratingModal'));
                                        modal.show();
                                    }
                                }
                            }
                        });
                    }

                    setTimeout(function() {
                        getRatings({{ $ticket?->id }})
                    }, 200000);
                });
            });
        })(jQuery);



        (function($) {
            "use strict";
            $('#replyForm').validate({
                rules: {
                    "message": {
                        required: true,
                    }

                },
                messages: {
                    "message": {
                        required: "Description  is Required",
                    }
                },
            })
        })(jQuery);
        // // Add an event listener to the form on submission.
        // $('#replyForm').on('submit', function(event) {
        //     let message = $(this).find('textarea[name="message"]').val().trim(); // Use .trim() to remove whitespace

        //     // Check if the message is empty or only contains whitespace
        //     if (message === '') {
        //         event.preventDefault(); // Stop the form from submitting
        //         alert('The message field is required!'); // Show an error message

        //         // You could also add custom styling to an error message element
        //         // For example: $('#error-message').text('Please enter a message.').show();
        //     }
        // });
    </script>
@endpush
