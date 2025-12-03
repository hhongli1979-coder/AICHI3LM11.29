<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Notice;

class NoticeTable
{
    protected $notice;
    protected $request;

    public function __construct(Request $request)
    {
        $this->notice = new Notice();
        $this->request = $request;
    }

    public function getData()
    {
        $notices = $this->notice;
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $notices->where('status', true)->paginate($this->request?->paginate);
                case 'deactive':
                    return $notices->where('status', false)->paginate($this->request?->paginate);
                case 'trash':
                    return $notices->withTrashed()?->whereNotNull('deleted_at')?->paginate($this->request?->paginate);
            }
        }

        if ($this->request->has('s')) {
            return $notices->withTrashed()->where(function ($query) {
                $query->where('message', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhere('color', 'LIKE', "%" . $this->request->s . "%");
            })->paginate($this->request->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $notices->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

    return $notices->whereNull('deleted_at')->orderBy('created_at', 'desc')->paginate($this->request?->paginate);
    }

    public function getNoticeColor()
    {
        return [
            'Primary' => 'primary',
            'Secondary' => 'secondary',
            'Success' => 'success',
            'Danger' => 'danger',
            'Info' => 'info',
            'Light' => 'light',
            'Dark' => 'dark',
            'Warning' => 'warning'
        ];
    }

    public function generate()
    {
        $notices = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $notices->each(function ($notice) {
            $notice->title = $notice->getTranslation('message', app()->getLocale());
            $notice->color = ucfirst($notice?->color);
            $notice->date = formatDateBySetting($notice->created_at);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Message', 'field' => 'message', 'action' => true, 'sortable' => true],
                ['title' => 'Color', 'field' => 'color', 'sortable' => true, 'type' => 'badge', 'colorClasses' => $this->getNoticeColor()],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.notice.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => false],
            ],
            'data' => $notices,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.notice.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'notice.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.notice.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'notice.destroy'],
                ['title' => 'Restore', 'route' => 'admin.notice.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'notice.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.notice.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'notice.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->notice->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->notice->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->notice->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->notice->withTrashed()?->whereNotNull('deleted_at')?->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'notice.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'notice.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'notice.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'notice.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'notice.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $this->notice->count(),
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
            case 'trashed':
                $this->trashedHandler();
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
        $this->notice->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->notice->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->notice->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->notice->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->notice->whereIn('id', $this->request->ids)->forceDelete();
    }
}

