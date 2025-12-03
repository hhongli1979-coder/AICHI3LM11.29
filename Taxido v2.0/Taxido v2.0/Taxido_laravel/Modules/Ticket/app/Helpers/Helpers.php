<?php

use Carbon\Carbon;
use App\Models\User;
use Modules\Ticket\Models\Status;
use Modules\Ticket\Models\Ticket;
use Modules\Ticket\Enums\RoleEnum;
use Modules\Ticket\Models\Setting;
use Modules\Ticket\Models\Priority;
use Modules\Ticket\Models\Department;
use Modules\Ticket\Models\Executive;

if (!function_exists('tx_getSettings')) {
    function tx_getSettings()
    {
        return Setting::pluck('values')?->first();
    }
}

if (!function_exists('tx_getUser')) {
    function tx_getUser()
    {
        return User::whereHas('roles', function ($q) {
            $q->where('name', 'user');
        })?->first();
    }
}

if (!function_exists('tx_getStatusColorClasses')) {
    function tx_getStatusColorClasses()
    {
        return Status::withTrashed()->get()->mapWithKeys(function ($status) {
            return [
                $status->getTranslation('name', app()->getLocale()) => $status->color,
            ];
        })->toArray();
    }
}

if (!function_exists('tx_getPriorityColorClasses')) {
    function tx_getPriorityColorClasses()
    {
        return Priority::withTrashed()->get()->mapWithKeys(function ($priority) {
            return [
                $priority->getTranslation('name', app()->getLocale()) => $priority->color,
            ];
        })->toArray();
    }
}

if (!function_exists('tx_getDate')) {
    function tx_getDate($sort, $startDate = null, $endDate = null)
    {
        $startCurrentDate = Carbon::now();
        $endCurrentDate = Carbon::now();

        switch ($sort) {
            case 'today':
                return [
                    'start' => $startCurrentDate->startOfDay(),
                    'end' => $endCurrentDate->endOfDay(),
                ];

            case 'this_week':
                return [
                    'start' => $startCurrentDate->startOfWeek(),
                    'end' => $endCurrentDate->endOfWeek(),
                ];

            case 'this_month':
                return [
                    'start' => $startCurrentDate->startOfMonth(),
                    'end' => $endCurrentDate->endOfMonth(),
                ];

            case 'this_year':
                return [
                    'start' => $startCurrentDate->startOfYear(),
                    'end' => $endCurrentDate->endOfYear(),
                ];

            case 'custom':
                if ($startDate && $endDate) {
                    return [
                        'start' => Carbon::createFromFormat('m-d-Y', $startDate)->startOfDay(),
                        'end' => Carbon::createFromFormat('m-d-Y', $endDate)->endOfDay(),
                    ];
                }
                break;

            default:
                return [
                    'start' => $startCurrentDate->startOfMonth(),
                    'end' => $endCurrentDate->endOfMonth(),
                ];
        }
    }
}


if (!function_exists('tx_getTicketStatusByName')) {
    function tx_getTicketStatusByName($slug)
    {
        return Status::where('slug', $slug)->pluck('id')->first();
    }
}


if (!function_exists('tx_getDateFilter')) {
    function tx_getDateFilter($query, $date, $sort)
    {
        if ($date) {
            $formattedStartDate = $date['start']->format('Y-m-d');
            $formattedEndDate = $date['end']->format('Y-m-d');

            if ($sort === 'today') {
                $query->whereDate('created_at', $formattedStartDate);
            } elseif ($sort === 'this_week') {
                $query->whereBetween('created_at', [$formattedStartDate, $formattedEndDate]);
            } elseif ($sort === 'this_month') {
                $query->whereBetween('created_at', [$formattedStartDate, $formattedEndDate]);
            } elseif ($sort === 'this_year') {
                $query->whereBetween('created_at', [$formattedStartDate, $formattedEndDate]);
            } elseif ($sort === 'custom') {
                $query->whereBetween('created_at', [$formattedStartDate, $formattedEndDate]);
            }
        }
        return $query;
    }
}

if (!function_exists('tx_getUsersCount')) {
    function tx_getUsersCount()
    {
        $query = User::whereNull('deleted_at')
            ->whereHas('roles', function ($query) {
                $query->where('name', '=', RoleEnum::USER);
            });

        $date = tx_getDate(request()->input('sort'), request()->input('start'), request()->input('end'));
        $query = tx_getDateFilter($query, $date, request()->input('sort'));

        return $query->count();
    }
}

if (!function_exists('tx_getDepartmentsCount')) {
    function tx_getDepartmentsCount()
    {
        $query = Department::whereNull('deleted_at');

        $date = tx_getDate(request()->input('sort'), request()->input('start'), request()->input('end'));
        $query = tx_getDateFilter($query, $date, request()->input('sort'));

        return $query->count();
    }
}

if (!function_exists('tx_getTicketsCount')) {
    function tx_getTicketsCount()
    {
        $ticket = new Ticket();
        $userId = getCurrentUserId();
        $query = $ticket->whereNull('deleted_at');

        $roleName = getCurrentRoleName();
        if ($roleName == RoleEnum::Executive) {
            $query = $ticket->getTicketsForCurrentUser();
        }

        if ($roleName == RoleEnum::USER) {
            $query = $query->where('user_id', $userId);
        }

        $date = tx_getDate(request()->input('sort'), request()->input('start'), request()->input('end'));
        $query = tx_getDateFilter($query, $date, request()->input('sort'));

        return $query->count();
    }
}


if (!function_exists('tx_getOpenTicketsCount')) {
    function tx_getOpenTicketsCount()
    {
        $ticket = new Ticket();
        $userId = getCurrentUserId();
        $roleName = getCurrentRoleName();

        if ($roleName == RoleEnum::Executive) {
            $ticket = $ticket->getTicketsForCurrentUser();
        }

        if ($roleName == RoleEnum::USER) {
            $ticket = $ticket->where('user_id', $userId);
        }

        $ticketStatusId = tx_getTicketStatusByName('open');
        $query = $ticket->where('ticket_status_id', $ticketStatusId)->whereNull('deleted_at');

        $date = tx_getDate(request()->input('sort'), request()->input('start'), request()->input('end'));
        $query = tx_getDateFilter($query, $date, request()->input('sort'));

        return $query->count();
    }
}

if (!function_exists('tx_getClosedTicketsCount')) {
    function tx_getClosedTicketsCount()
    {
        $ticket = new Ticket();
        $userId = getCurrentUserId();
        $roleName = getCurrentRoleName();

        if ($roleName == RoleEnum::Executive) {
            $ticket = $ticket->getTicketsForCurrentUser();
        }

        if ($roleName == RoleEnum::USER) {
            $ticket = $ticket->where('user_id', $userId);
        }

        $ticketStatusId = tx_getTicketStatusByName('closed');
        $query = $ticket->where('ticket_status_id', $ticketStatusId)->whereNull('deleted_at');

        $date = tx_getDate(request()->input('sort'));
        $query = tx_getDateFilter($query, $date, request()->input('sort'));

        return $query->count();
    }
}

if (!function_exists('tx_getSolvedTicketsCount')) {
    function tx_getSolvedTicketsCount()
    {
        $ticket = new Ticket();
        $userId = getCurrentUserId();
        $roleName = getCurrentRoleName();

        if ($roleName == RoleEnum::Executive) {
            $ticket = $ticket->getTicketsForCurrentUser();
        }

        if ($roleName == RoleEnum::USER) {
            $ticket = $ticket->where('user_id', $userId);
        }

        $ticketStatusId = tx_getTicketStatusByName('solved');
        $query = $ticket->where('ticket_status_id', $ticketStatusId)->whereNull('deleted_at');

        $date = tx_getDate(request()->input('sort'));
        $query = tx_getDateFilter($query, $date, request()->input('sort'));

        return $query->count();
    }
}

if (!function_exists('tx_getHoldTicketsCount')) {
    function tx_getHoldTicketsCount()
    {
        $ticket = new Ticket();
        $userId = getCurrentUserId();
        $roleName = getCurrentRoleName();

        if ($roleName == RoleEnum::Executive) {
            $ticket = $ticket->getTicketsForCurrentUser();
        }

        if ($roleName == RoleEnum::USER) {
            $ticket = $ticket->where('user_id', $userId);
        }

        $ticketStatusId = tx_getTicketStatusByName('hold');
        $query = $ticket->where('ticket_status_id', $ticketStatusId)->whereNull('deleted_at');

        $date = tx_getDate(request()->input('sort'));
        $query = tx_getDateFilter($query, $date, request()->input('sort'));

        return $query->count();
    }
}

if (!function_exists('tx_getPendingTicketsCount')) {
    function tx_getPendingTicketsCount()
    {
        $ticket = new Ticket();
        $userId = getCurrentUserId();
        $roleName = getCurrentRoleName();

        if ($roleName == RoleEnum::Executive) {
            $ticket = $ticket->getTicketsForCurrentUser();
        }

        if ($roleName == RoleEnum::USER) {
            $ticket = $ticket->where('user_id', $userId);
        }

        $ticketStatusId = tx_getTicketStatusByName('pending');
        $query = $ticket->where('ticket_status_id', $ticketStatusId)->whereNull('deleted_at');

        $date = tx_getDate(request()->input('sort'));
        $query = tx_getDateFilter($query, $date, request()->input('sort'));

        return $query->count();
    }
}

if (!function_exists('tx_getLatestTickets')) {
    function tx_getLatestTickets()
    {
        $userId = getCurrentUserId();
        $roleName = getCurrentRoleName();

        $query = Ticket::whereNull('deleted_at')->latest()->limit(5);

        if ($roleName == RoleEnum::USER) {
            $query->where('user_id', $userId);
        }

        $date = tx_getDate(request()->input('sort'));
        $query = tx_getDateFilter($query, $date, request()->input('sort'));

        return $query->get();
    }
}


if (!function_exists('getTopExecutives')) {
    function getTopExecutives($start_date = null, $end_date = null)
    {
        $executives = Executive::where('status', true)
            ->withCount('tickets')
            ->get();


            $executiveRatings = [];
            foreach ($executives as $executive) {
                $rating = $executive->rative;
                if ($rating > 0) {
                    $executiveRatings[] = [
                        'name' => $executive->name,
                        'ratings' => $rating,
                        'tickets_handled' => $executive->tickets_count,
                        'profile_image_url' => $executive->profile_image?->original_url ?? '',
                        'email' => $executive->email,
                    ];
                }
        }

        return $executiveRatings;
    }
}
