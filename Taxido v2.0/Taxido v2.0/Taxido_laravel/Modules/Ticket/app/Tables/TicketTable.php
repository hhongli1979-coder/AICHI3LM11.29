<?php
namespace Modules\Ticket\Tables;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Modules\Ticket\Enums\RoleEnum;
use Modules\Ticket\Events\TicketStatusEvent;
use Modules\Ticket\Models\Status;
use Modules\Ticket\Models\Ticket;

class TicketTable
{
    protected $ticket;
    protected $request;
    protected $ticket_status;

    public function __construct(Request $request)
    {
        $this->ticket_status = new Status();
        $this->ticket        = new Ticket();
        $this->request       = $request;
    }

    public function getData()
    {
        $roleName = getCurrentRoleName();
        $userId   = getCurrentUserId();
        $query    = $this->applyRoleFilter($roleName, $userId);

        if ($this->request->has('filter')) {
            $query = $this->applyFilter($query);
        }

        if ($this->request->has('department')) {
            $query = $query->where('department_id', $this->request->department);
        }

        if ($this->request->has('s')) {
            $query = $this->applySearchFilter($query);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            $query = $this->applyOrderFilter($query);
        } else {
            $query = $query->orderBy('created_at', 'desc');
        }

        return $query->paginate($this->request?->paginate ?? 10);
    }

    private function applyRoleFilter($roleName, $userId)
    {
        if ($roleName == RoleEnum::ADMIN) {
            return $this->ticket;
        } elseif ($roleName == RoleEnum::USER) {
            return $this->ticket->where('user_id', $userId);
        } elseif ($roleName == RoleEnum::Executive) {
            return $this->ticket->getTicketsForCurrentUser();
        } else {
            return $this->ticket->where('created_by_id', Auth::id());
        }
    }

    private function applyFilter($query)
    {
        if ($this->request->filter == 'all') {
            return $query;
        } else {
            $ticket_status_id = $this->ticket_status->whereNull('deleted_at')
                ->where('slug', $this->request->filter)
                ->pluck('id')
                ->first();
            return $query->where('ticket_status_id', $ticket_status_id);
        }
    }

    private function applySearchFilter($query)
    {
        return $query->withTrashed()->where(function ($q) {
            $q->where('name', 'LIKE', "%" . $this->request->s . "%")
                ->orWhere('ticket_number', 'LIKE', "%" . $this->request->s . "%")
                ->orWhere('subject', 'LIKE', "%" . $this->request->s . "%");
        });
    }

    private function applyOrderFilter($query)
    {
        return $query->orderBy($this->request->orderby, $this->request->order);
    }

    public function generate()
    {
        $tickets  = $this->getData();
        $roleName = getCurrentRoleName();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $tickets->each(function ($ticket) use ($roleName) {
            $ticket->date = formatDateBySetting($ticket->created_at);
            $ticket->date             = $ticket->created_at->format('Y-m-d h:i:s A');
            $ticket->name  = $ticket->name ?? $ticket->user?->name;
            $ticket->ticket_number    = "#{$ticket->ticket_number}";
            $ticket->user_email       = isDemoModeEnabled() ? __('static.demo_mode') : ($ticket?->user->email ?? null);
            $ticket->user_profile     = $ticket?->user->profile_image_id ?? null;
            $ticket->department       = $ticket->department()->pluck('name')->implode(', ');
            $ticket->priority         = $ticket->priority()->pluck('name')->implode(', ');
            $ticket->ticket_status_id = $ticket->ticketStatus()->pluck('name')->implode(', ');
            if ($roleName == RoleEnum::ADMIN) {
                $ticket->assign_to = [];
                if(!$ticket->assigned_tickets?->isEmpty()) {
                    $ticket->assign_to = $ticket->assigned_tickets;
                }
            }
        });

        $tableConfig = [
            'columns'            => $this->getColumns($roleName),
            'data'               => $tickets,
            'actions'            => $this->getActions(),
            'filters'            => $this->getFilters($roleName),
            'bulkactions'        => $this->getBulkActions(),
            'actionButtons'      => $this->getActionButtons(),
            'modalActionButtons' => $this->getModalActionButtons(),
            'total'              => $tickets->total(),
        ];

        return $tableConfig;
    }

    private function getColumns($roleName)
    {
        $columns = [
            ['title' => 'Ticket ID', 'field' => 'ticket_number', 'action' => true, 'sortable' => true, 'type' => 'badge', 'badge_type' => 'light'],
            ['title' => 'User', 'field' => 'name', 'email' => 'user_email', 'profile_image' => 'user_profile', 'sortable' => true],
            ['title' => 'Subject', 'field' => 'subject', 'sortable' => true],
            ['title' => 'Priority', 'field' => 'priority', 'type' => 'badge', 'colorClasses' => tx_getPriorityColorClasses(), 'sortable' => true],
            ['title' => 'Department', 'field' => 'department', 'sortable' => true],
            ['title' => 'Status', 'field' => 'ticket_status_id', 'type' => 'badge', 'colorClasses' => tx_getStatusColorClasses(), 'route' => 'admin.ticket.status', 'sortable' => true],
        ];

        if ($roleName == RoleEnum::ADMIN) {
            $columns[] = ['title' => 'Assign To', 'field' => 'assign_to', 'type' => 'avatar', 'sortable' => false];
        }
        if ($roleName == RoleEnum::Executive) {
            $columns[] = ['title' => 'Note', 'field' => 'note', 'sortable' => false];
        }

        $columns[] = ['title' => 'Created At', 'field' => 'date', 'sortable' => true];
        $columns[] = ['title' => 'Action', 'type' => 'action', 'email' => 'email', 'sortable' => false, 'permission' => ['ticket.ticket.reply', 'ticket.ticket.destroy'], 'action' => true];

        return $columns;
    }

    private function getActions()
    {
        return [];
    }

    private function getFilters($roleName)
    {
        $statuses  = $this->ticket_status->whereNull('deleted_at')->take(6)->get(['id', 'name', 'slug']);
        $userId    = getCurrentUserId();
        $baseQuery = $this->applyRoleFilter($roleName, $userId)->whereNull('deleted_at');

        $filters = [
            ['title' => 'All', 'slug' => 'all', 'count' => (clone $baseQuery)->count()],
        ];

        foreach ($statuses as $status) {
            $count     = (clone $baseQuery)->where('ticket_status_id', $status->id)->count();
            $filters[] = [
                'title' => $status->name,
                'slug'  => $status->slug,
                'count' => $count,
            ];
        }

        return $filters;
    }

    private function getBulkActions()
    {
        $statuses    = $this->ticket_status->whereNull('deleted_at')->take(6)->get(['name', 'slug']);
        $bulkActions = [];

        foreach ($statuses as $status) {
            $bulkActions[] = ['title' => $status->name, 'action' => $status->slug];
        }

        return $bulkActions;
    }

    private function getActionButtons()
    {
        return [
            ['icon' => 'ri-ticket-2-line', 'route' => 'admin.ticket.reply', 'class' => 'dark-icon-box', 'permission' => 'ticket.ticket.reply'],
        ];
    }

    private function getModalActionButtons()
    {
        return [
            ['icon' => 'ri-delete-bin-5-line', 'route' => 'admin.ticket.forceDelete', 'permission' => 'ticket.ticket.forceDelete', 'class' => 'danger-icon-box', 'modalId' => 'deleteModal', 'modalTitle' => 'Delete Item ?', 'modalDesc' => "This Item Will Be Deleted Permanently. You Can't Undo This Action.", 'modalMethod' => 'DELETE', 'modalBtnText' => 'Delete'],
        ];
    }

    public function bulkActionHandler()
    {
        $this->TicketStatusHandler();
    }

    public function TicketStatusHandler(): void
    {
        $ticket_status_id = $this->ticket_status->whereNull('deleted_at')
            ->where('slug', $this->request->action)
            ->pluck('id')
            ->first();
        $this->ticket->whereIn('id', $this->request->ids)->update(['ticket_status_id' => $ticket_status_id]);

        foreach ($this->request->ids as $ticket_id) {
            $ticket = $this->ticket->find($ticket_id);
            event(new TicketStatusEvent($ticket));
        }
    }

    public function getAssignedUser($user_id)
    {
        if ($user_id) {
            return User::whereIn('id', $user_id)->whereNull('deleted_at')->get();
        }

        return [];
    }
}
