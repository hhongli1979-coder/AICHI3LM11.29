<?php

namespace App\Tables;

use App\Models\Faq;
use Illuminate\Http\Request;

class FaqTable
{
    protected $faq;
    protected $request;

    public function __construct(Request $request)
    {
        $this->faq = new Faq();
        $this->request = $request;
    }
    public function getData()
    {
        $faqs = $this->faq;
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'trash':
                    $faqs = $faqs->withTrashed()?->whereNotNull('deleted_at');
            }
        }

        if ($this->request->has('s')) {
            return $faqs->withTrashed()->where('title', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $faqs->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $faqs?->latest()?->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $faqs = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $faqs->each(function ($faq) {
            $faq->title = $faq->getTranslation('title', app()->getLocale());
            $faq->description = $faq->getTranslation('description', app()->getLocale());
            $faq->date = $faq->created_at->format('Y-m-d h:i:s A');
            $faq->date = formatDateBySetting($faq->created_at);

        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Title', 'field' => 'title', 'imageField' => null, 'action' => true, 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $faqs,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.faq.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'faq.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.faq.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'faq.destroy'],
                ['title' => 'Restore', 'route' => 'admin.faq.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'faq.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.faq.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'faq.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->faq->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->faq->withTrashed()?->whereNotNull('deleted_at')?->count()],
            ],
            'bulkactions' => [
                ['title' => 'Move to Trash', 'permission' => 'faq.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'faq.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'faq.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $this->faq->count(),
        ];

        return $tableConfig;
    }

    public function bulkActionHandler()
    {
        switch ($this->request->action) {
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

    public function trashedHandler(): void
    {
        $this->faq->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->faq->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->faq->whereIn('id', $this->request->ids)->forceDelete();
    }
}
