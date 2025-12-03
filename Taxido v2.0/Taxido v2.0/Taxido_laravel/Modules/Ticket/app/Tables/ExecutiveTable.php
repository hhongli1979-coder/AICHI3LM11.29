<?php

namespace Modules\Ticket\Tables;

use Illuminate\Http\Request;
use Modules\Ticket\Models\Executive;

class ExecutiveTable
{
    protected $executive;
    protected $request;

    public function __construct(Request $request)
    {
        $this->executive = new Executive();
        $this->request = $request;
    }

    public function getExecutive()
    {
        return $this->executive;
    }

    public function getData()
    {
        $executives = $this->getExecutive();

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $executives->whereNull('deleted_at')->where('status', true)->orderByDesc('created_at')->paginate($this->request?->paginate);
                case 'deactive':
                    return $executives->whereNull('deleted_at')->where('status', false)->orderByDesc('created_at')->paginate($this->request?->paginate);
                case 'trash':
                    return $executives->withTrashed()->whereNotNull('deleted_at')->orderByDesc('created_at')->paginate($this->request?->paginate);
            }
        }

        if (isset($this->request->s)) {
            return $executives->withTrashed()->where(function ($query) {
                $query->where('name', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhere('email', 'LIKE', "%" . $this->request->s . "%");
            })->orderByDesc('created_at')->paginate($this->request?->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            $orderBy = $this->request->orderby === 'date' ? 'created_at' : $this->request->orderby;
            return $executives->orderBy($orderBy, $this->request->order)->paginate($this->request?->paginate);
        }

        return $executives->whereNull('deleted_at')->orderByDesc('created_at')->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $executives = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $executives->each(function ($executive) {
            if (isDemoModeEnabled()) {
                $executive->email = __('static.demo_mode');
            }
            $executive->date = formatDateBySetting($executive->created_at);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Name', 'field' => 'name', 'route' => 'admin.executive.edit', 'imageField' => 'profile_image_id', 'placeholderLetter' => true, 'action' => true, 'sortable' => true],
                ['title' => 'Email', 'field' => 'email', 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.executive.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true],
                ['title' => 'Action', 'type' => 'action', 'sortable' => false, 'permission' => ['ticket.executive.edit', 'ticket.executive.destroy']],
            ],
            'data' => $executives,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.executive.edit', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'ticket.executive.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.executive.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'ticket.executive.destroy'],
                ['title' => 'Restore', 'route' => 'admin.executive.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'ticket.executive.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.executive.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'ticket.executive.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->getExecutive()?->whereNull('deleted_at')->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->getExecutive()?->whereNull('deleted_at')->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->getExecutive()?->whereNull('deleted_at')->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->getExecutive()?->withTrashed()?->whereNotNull('deleted_at')?->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'ticket.executive.edit'],
                ['title' => 'Deactive', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'ticket.executive.edit'],
                ['title' => 'Move to Trash', 'action' => 'trash', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'ticket.executive.destroy'],
                ['title' => 'Restore', 'action' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'ticket.executive.restore'],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'ticket.executive.forceDelete'],
            ],
            'actionButtons' => [
                ['icon' => 'ri-eye-line', 'route' => 'admin.report.show', 'class' => 'dark-icon-box', 'permission' => 'ticket.executive.edit'],
            ],
            'total' => $executives->count(),
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
            case 'trash':
                $this->trashHandler();
                break;
            case 'restore':
                $this->restoreHandler();
                break;
            case 'delete':
                $this->deleteHandler();
                break;
        }
    }

    public function activeHandler(): void
    {
        $this->executive->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->executive->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashHandler(): void
    {
        $this->executive->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->executive->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->executive->whereIn('id', $this->request->ids)->forceDelete();
    }
}
