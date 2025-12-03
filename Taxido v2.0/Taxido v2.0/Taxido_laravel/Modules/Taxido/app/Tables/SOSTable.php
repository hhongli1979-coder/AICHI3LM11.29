<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\SOS;

class SOSTable
{
    protected $sos;
    protected $request;

    public function __construct(Request $request)
    {
        $this->sos = new SOS();
        $this->request = $request;
    }

    public function getData()
    {
        $sos = $this->sos->query(); 

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $sos = $sos->where('status', true);
                    break;
                case 'deactive':
                    $sos = $sos->where('status', false);
                    break;
                case 'trash':
                    $sos = $sos->withTrashed()->whereNotNull('deleted_at');
                    break;
            }
        }

        if ($this->request->has('s')) {
            return $sos->withTrashed()->where('title', 'LIKE', "%" . $this->request->s . "%")->orderBy('created_at', 'DESC')->paginate($this->request?->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $sos->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $sos->orderBy('created_at', 'DESC')->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $sos = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $sos->each(function ($sos) {
            $sos->title = $sos->getTranslation('title', app()->getLocale());
            $sos->date = formatDateBySetting($sos->created_at);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Title', 'field' => 'title', 'imageField' => 'sos_image_id','placeholderLetter' => true, 'action' => true, 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.sos.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $sos,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.sos.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'sos.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.sos.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'sos.destroy'],
                ['title' => 'Restore', 'route' => 'admin.sos.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'sos.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.sos.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'sos.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->sos->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->sos->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->sos->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->sos->withTrashed()?->whereNotNull('deleted_at')?->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'sos.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'sos.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'sos.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'sos.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'sos.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $this->sos->count(),
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
        $this->sos->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->sos->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->sos->whereIn('id', $this->request->ids)->delete();
    }
    
    public function restoreHandler(): void
    {
        $this->sos->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->sos->whereIn('id', $this->request->ids)->forceDelete();
    }
}
