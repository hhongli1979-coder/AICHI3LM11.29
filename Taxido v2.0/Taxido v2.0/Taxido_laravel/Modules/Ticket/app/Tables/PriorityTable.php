<?php

namespace Modules\Ticket\Tables;

use Illuminate\Http\Request;
use Modules\Ticket\Models\Priority;

class PriorityTable
{
    protected $priority;
    protected $request;

    public function __construct(Request $request)
    {
        $this->priority = new Priority();
        $this->request = $request;
    }

    public function getData()
    {
        $priorities = $this->priority;

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $priorities->where('status', true)->paginate($this->request->paginate);
                case 'deactive':
                    return $priorities->where('status', false)->paginate($this->request->paginate);
                case 'trash':
                    return $priorities->withTrashed()->whereNotNull('deleted_at')->paginate($this->request->paginate);
            }
        }

        if ($this->request->has('s')) {
            return $priorities->withTrashed()->where('name', 'LIKE', "%" . $this->request->s . "%")->paginate($this->request->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            if ($this->request->orderby == 'date') {
                return $priorities->orderBy('created_at', $this->request->order)->paginate($this->request->paginate);
            }
            return $priorities->orderBy($this->request->orderby, $this->request->order)->paginate($this->request->paginate);
        }

        return $priorities->whereNull('deleted_at')->paginate($this->request->paginate);
    }

    public function generate()
    {
        $priorities = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $priorities->each(function ($priority) {
            $priority->name = $priority->getTranslation('name', app()->getLocale());
            $priority->date = formatDateBySetting($priority->created_at);
            $priority->response_resolve = $priority->response_in . ' ' . $priority->response_value_in . ' - ' . $priority->resolve_in . ' ' . $priority->resolve_value_in;
        });

        // Table Configuration
        $tableConfig = [
            'columns' => [
                ['title' => 'Name', 'field' => 'name', 'action' => true, 'sortable' => true, 'type' => 'badge', 'colorClasses' => tx_getPriorityColorClasses()],
                ['title' => 'Response - Resolve', 'field' => 'response_resolve', 'action' => false, 'sortable' => false],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.priority.status', 'type' => 'status', 'sortable' => false],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true],
                ['title' => 'Action', 'type' => 'action', 'permission' => ['ticket.priority.edit', 'ticket.priority.forceDelete'], 'sortable' => false],
            ],
            'data' => $priorities,
            'actions' => [],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->priority->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->priority->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->priority->where('status', false)->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'action' => 'active', 'permission' => 'ticket.priority.edit', 'whenFilter' => ['all', 'active', 'deactive'],],
                ['title' => 'Deactive', 'action' => 'deactive', 'permission' => 'ticket.priority.edit', 'whenFilter' => ['all', 'active', 'deactive']],
            ],
            'actionButtons' => [
                ['icon' => 'ri-edit-line', 'route' => 'admin.priority.edit', 'class' => 'dark-icon-box', 'permission' => 'ticket.priority.edit', 'isTranslate' => true],
            ],
            'modalActionButtons' => [
                ['icon' => 'ri-delete-bin-5-line', 'route' => 'admin.priority.forceDelete', 'permission' => 'ticket.priority.forceDelete', 'class' => 'danger-icon-box', 'modalId' => 'deleteModal', 'modalTitle' => 'Delete Item ?', 'modalDesc' => "This Item Will Be Deleted Permanently. You Can't Undo This Action. ", "modalMethod" => "DELETE", "modalBtnText" => 'Delete'],
            ],
            'total' => $this->priority->count(),
        ];

        return $tableConfig;
    }

    public function bulkActionHandler()
    {
        switch ($this->request->action) {
            case 'active':
                $this->activeHandler();
                break;
            case 'deactive':
                $this->deactiveHandler();
                break;
        }
    }

    public function activeHandler(): void
    {
        $this->priority->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->priority->whereIn('id', $this->request->ids)->update(['status' => false]);
    }
}
