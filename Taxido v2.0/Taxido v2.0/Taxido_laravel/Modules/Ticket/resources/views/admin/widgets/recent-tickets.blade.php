@use('Modules\Ticket\Models\Ticket')
@use('App\Enums\RoleEnum')
@php
    $dateRange = getStartAndEndDate(request('sort'), request('start'), request('end'));
    $start_date = $dateRange['start'] ?? null;
    $end_date = $dateRange['end'] ?? null;
    $tickets = Ticket::orderby('created_at')
        ->limit(3)
        ?->whereBetween('created_at', [$start_date, $end_date])
        ?->get();
@endphp

@can('ticket.ticket.index')
        <div class="col-xl-6">
            <div class="card ticket-height">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('ticket::static.widget.recent_tickets') }}</h5>
                        </div>
                        <a
                            href="{{ route('admin.ticket.index') }}"><span>{{ __('ticket::static.widget.view_all_tickets') }}</span></a>
                    </div>
                </div>
                <div class="card-body top-drivers recent-rides pending-tickets p-0">
                    <div class="table-responsive h-custom-scrollbar">
                        <table class="table display" style="width:100%">
                            <thead>
                                <tr>
                                    <th>{{ __('ticket::static.widget.ticket_number') }}</th>
                                    <th>{{ __('ticket::static.widget.created_by') }}</th>
                                    <th>{{ __('ticket::static.widget.created_at') }}</th>
                                    <th>{{ __('ticket::static.widget.priority') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($tickets as $ticket)
                                    <tr>
                                        <td>
                                            <span class="bg-light-primary">#{{ $ticket->ticket_number }}</span>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center user-name">
                                                @if ($ticket->user)
                                                    @if ($ticket->user->profile_image?->original_url)
                                                        <img src="{{ $ticket->user->profile_image->original_url }}"
                                                            alt="">
                                                    @else
                                                        <div class="user-initials">
                                                            {{ strtoupper(substr($ticket->user->name, 0, 1)) }}
                                                        </div>
                                                    @endif
                                                    <div class="flex-grow-1">
                                                        <h5>{{ $ticket->user->name }}</h5>
                                                        <span>{{ isDemoModeEnabled() ? __('ticket::static.demo_mode') : $ticket->user->email }}</span>
                                                    </div>
                                                @else
                                                    <div class="user-initials">
                                                        {{ strtoupper(substr($ticket->name, 0, 1)) }}
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <h5>{{ $ticket->name }}</h5>
                                                        <span>{{ isDemoModeEnabled() ? __('ticket::static.demo_mode') : $ticket->email }}</span>
                                                    </div>
                                                @endif
                                            </div>
                                        </td>
                                        <td>{{ $ticket->created_at->format('Y-m-d, h:i A') }}</td>
                                        <td>{{ $ticket->priority->name }}</td>
                                    </tr>
                                @empty
                                    <tr class="table-not-found">
                                        <div class="table-no-data">
                                            <img src = "{{ asset('images/dashboard/data-not-found.svg') }}"
                                                class="img-fluid" alt="data not found">
                                            <h6 class="text-center">
                                                {{ __('ticket::static.widget.no_data_available') }}</h6>
                                        </div>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
@endcan
