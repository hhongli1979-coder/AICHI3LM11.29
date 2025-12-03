<?php

namespace Modules\Ticket\Tables;

use Illuminate\Http\Request;
use Modules\Ticket\Models\Status;

class StatusTable
{
    protected $status;
    protected $request;

    public function __construct(Request $request)
    {
        $this->status = new Status();
        $this->request = $request;
    }

    public function getData()
    {
        $statuses = $this->status;
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $statuses->where('status', true)->paginate($this->request?->paginate);
                case 'deactive':
                    return $statuses->where('status', false)->paginate($this->request?->paginate);
                case 'trash':
                    return $statuses->withTrashed()?->whereNotNull('deleted_at')?->paginate($this->request?->paginate);
            }
        }

        if ($this->request->has('s')) {
            return $statuses->withTrashed()->where('name', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            if ($this->request->orderby == 'date') {
                return $statuses->orderBy('created_at', $this->request->order)?->paginate($this->request?->paginate);
            }
            return $statuses->orderBy($this->request->orderby, $this->request->order)?->paginate($this->request?->paginate);
        }

        return $statuses->whereNull('deleted_at')->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $statuses = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $statuses->each(function ($status) {
            $status->name = $status->getTranslation('name', app()->getLocale());
            $status->date = formatDateBySetting($status->created_at);

            $status->date = $status->created_at->format('Y-m-d h:i:s A');
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Name', 'field' => 'name', 'type' => 'badge', 'colorClasses' => tx_getStatusColorClasses(), 'action' => true, 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.status.status', 'type' => 'status', 'sortable' => false],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true],
                ['title' => 'Action', 'type' => 'action', 'sortable' => false, 'permission' => ['ticket.status.edit', 'ticket.status.forceDelete']],
            ],
            'data' => $statuses,
            'actions' => [],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->status->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->status->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->status->where('status', false)->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'action' => 'active', 'permission' => 'ticket.status.edit', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'action' => 'deactive', 'permission' => 'ticket.status.edit', 'whenFilter' => ['all', 'active', 'deactive']],
            ],
            'actionButtons' => [
                ['icon' => 'ri-edit-line', 'route' => 'admin.status.edit', 'class' => 'dark-icon-box', 'permission' => 'ticket.status.edit', 'isTranslate' => true],
            ],
            'modalActionButtons' => [
                ['icon' => 'ri-delete-bin-5-line', 'route' => 'admin.status.forceDelete', 'permission' => 'ticket.status.forceDelete', 'class' => 'danger-icon-box', 'modalId' => 'deleteModal', 'modalTitle' => 'Delete Item ?', 'modalDesc' => "This Item Will Be Deleted Permanently. You Can't Undo This Action. ", "modalMethod" => "DELETE", "modalBtnText" => 'Delete'],
            ],
            'total' => $this->status->count(),
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
        $this->status->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->status->whereIn('id', $this->request->ids)->update(['status' => false]);
    }
}
