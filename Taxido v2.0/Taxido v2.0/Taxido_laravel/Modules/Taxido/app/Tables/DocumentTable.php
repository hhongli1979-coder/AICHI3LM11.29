<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Document;

class DocumentTable
{
    protected $document;

    protected $request;

    public function __construct(Request $request)
    {
        $this->document = new Document();
        $this->request = $request;
    }

    public function getData()
    {
        $documents = $this->document->query(); 

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $documents = $documents->where('status', true);
                    break;
                case 'deactive':
                    $documents = $documents->where('status', false);
                    break;
                case 'trash':
                    $documents = $documents->withTrashed()->whereNotNull('deleted_at');
                    break;
            }
        }

        if ($this->request->has('s')) {
            return $documents->withTrashed()->where('name', 'LIKE', "%" . $this->request->s . "%")->orWhere('type', 'LIKE', "%" . $this->request->s . "%")->orderBy('created_at', 'DESC')->paginate($this->request?->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $documents->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $documents->orderBy('created_at', 'DESC')->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $documents = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $documents->each(function ($document) {
            $locale = app()->getLocale();
            $document->title = $document->getTranslation('name', $locale);
            $document->date = formatDateBySetting($document->created_at);

        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Name', 'field' => 'name', 'imageField' => null, 'action' => true, 'sortable' => true],
                ['title' => 'Type', 'field' => 'type', 'imageField' => null, 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.document.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $documents,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.document.edit', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'document.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.document.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'document.destroy'],
                ['title' => 'Restore', 'route' => 'admin.document.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'document.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.document.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'document.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->document->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->document->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->document->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->document->withTrashed()?->whereNotNull('deleted_at')?->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'document.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'document.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'document.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'document.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'document.forceDelete', 'whenFilter' => ['trash']],

            ],
            'total' => $this->document->count(),
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
        $this->document->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->document->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->document->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->document->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->document->whereIn('id', $this->request->ids)->forceDelete();
    }
}
