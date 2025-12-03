<?php

namespace Modules\Ticket\Repositories\Admin;

use Modules\Ticket\Models\Status;
use Modules\Ticket\Models\Ticket;
use Modules\Ticket\Enums\RoleEnum;
use Modules\Ticket\Models\Dashboard;
use Modules\Ticket\Models\Department;
use Prettus\Repository\Eloquent\BaseRepository;

class DashboardRepository extends BaseRepository
{
    protected $ticket_status;
    protected $department;
    protected $tickets;

    public function model()
    {
        $this->ticket_status = new Status();
        $this->department    = new Department();
        $this->tickets       = new Ticket();
        return Dashboard::class;
    }

    public function index($request)
    {



        $sort = $request->input('sort', 'this_year');

        $startDate = $request->input('start');
        $endDate   = $request->input('end');

        $dateRange = tx_getDate($sort, $startDate, $endDate);

        $statusChart     = $this->barChart($dateRange, $sort);
        $departmentChart = $this->pieChart($dateRange, $sort);

        return view('ticket::admin.ticket.dashboard', [
            'statusChart'     => $statusChart,
            'departmentChart' => $departmentChart,
        ]);
    }

    public function ticketCounts($date, $sort, $status = null, $department = null)
    {
        $roleName = getCurrentRoleName();
        $userId   = getCurrentUserId();

        $query = $this->tickets->newQuery()->whereNull('deleted_at');

        if ($roleName == RoleEnum::Executive) {
            $query->where('user_id', $userId);
        }

        if ($status) {
            $query->where('ticket_status_id', $status);
        }

        if ($department) {
            $query->where('department_id', $department);
        }

        $dateRange = tx_getDate($sort);
        $startDate = $date['start'] ?? null;
        $endDate   = $date['end'] ?? null;

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        return $query->count();
    }

    public function barChart($date, $sort)
    {
        $ticketStatuses = $this->ticket_status->whereNull('deleted_at')->get();

        $labels = $ticketStatuses->pluck('name');
        $values = $ticketStatuses->map(fn($status) => $this->ticketCounts($date, $sort, status: $status->id));

        return [
            'labels' => $labels,
            'values' => $values,
        ];
    }

    public function pieChart($date, $sort)
    {
        $departments = $this->department->whereNull('deleted_at')->get();

        $labels = $departments->pluck('name');
        $values = $departments->map(fn($department) => $this->ticketCounts($date, $sort, department: $department->id));

        return [
            'labels' => $labels,
            'values' => $values,
        ];
    }
}
