<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Dispatcher;

class DispatcherTable
{
    protected $dispatcher;
    protected $request;

    public function __construct(Request $request)
    {
        $this->dispatcher = new Dispatcher();
        $this->request = $request;
    }

    public function getDispatchers()
    {
        return $this->dispatcher;
    }

    public function getData()
    {
        $dispatchers = $this->getDispatchers();

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $dispatchers = $dispatchers->whereNull('deleted_at')->where('status', true);
                    break;
                case 'deactive':
                    $dispatchers = $dispatchers->whereNull('deleted_at')->where('status', false);
                    break;
                case 'trash':
                    return $dispatchers->withTrashed()?->whereNotNull('deleted_at')?->paginate($this->request?->paginate);
                    break;
            }
        }

        if (isset($this->request->s)) {
            return $dispatchers->withTrashed()->where('name', 'LIKE', "%" . $this->request->s . "%")
                ->orWhere('email', 'LIKE', "%" . $this->request->s . "%")->orWhere('phone', 'LIKE', "%" . $this->request->s . "%" )->paginate($this->request?->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $dispatchers->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $dispatchers->whereNull('deleted_at')?->latest()->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $dispatchers = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        // Eager loading RelationShip
        $dispatchers->each(function ($dispatcher) {
            $dispatcher->role_name = ucfirst($dispatcher->roles->pluck('name')->implode(', '));
        });

        $dispatchers->each(function ($dispatcher) {
            $dispatcher->date = formatDateBySetting($dispatcher->created_at);

        });

        $tableConfig = [
            'columns'     => [
                ['title' => 'Name', 'field' => 'name', 'action' => true, 'imageField' => 'profile_image_id', 'placeholderLetter' => true, 'sortable' => true, 'email' => 'email'],
                ['title' => 'Email', 'field' => 'email', 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.dispatcher.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'users.created_at'],
            ],
            'data' => $dispatchers,
            'actions'     => [
                ['title' => 'Edit', 'route' => 'admin.dispatcher.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'dispatcher.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.dispatcher.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'dispatcher.destroy'],
                ['title' => 'Restore', 'route' => 'admin.dispatcher.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'dispatcher.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.dispatcher.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'dispatcher.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->dispatcher->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->dispatcher->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->dispatcher->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->dispatcher->withTrashed()?->whereNotNull('deleted_at')?->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'dispatcher.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'dispatcher.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'dispatcher.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'dispatcher.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'dispatcher.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $this->dispatcher->count(),
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
        $this->dispatcher->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->dispatcher->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->dispatcher->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->dispatcher->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->dispatcher->whereIn('id', $this->request->ids)->forceDelete();
    }
}
