<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\CancellationReason;

class CancellationReasonTable
{
    protected $cancellationReason;
    protected $request;

    public function __construct(Request $request)
    {
        $this->cancellationReason = new CancellationReason();
        $this->request = $request;
    }

    public function getData()
    {
        $cancellationReasons = $this->cancellationReason->query();

        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $cancellationReasons->where('status', true)->orderBy('created_at', 'DESC')->paginate($this->request?->paginate);
                case 'deactive':
                    return $cancellationReasons->where('status', false)->orderBy('created_at', 'DESC')->paginate($this->request?->paginate);
                case 'trash':
                    return $cancellationReasons->withTrashed()->whereNotNull('deleted_at')->orderBy('created_at', 'DESC')->paginate($this->request?->paginate);
            }
        }

        if ($this->request->has('s')) {
            return $cancellationReasons->withTrashed()->where('title', 'LIKE', "%" . $this->request->s . "%")->orderBy('created_at', 'DESC')->paginate($this->request?->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $cancellationReasons->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $cancellationReasons->whereNull('deleted_at')->orderBy('created_at', 'DESC')->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $cancellationReasons = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $cancellationReasons->each(function ($cancellationReason) {
            $locale = app()->getLocale();
            $cancellationReason->title = $cancellationReason->getTranslation('title', $locale);
            $cancellationReason->date = formatDateBySetting($cancellationReason->created_at);
        });

        $tableConfig = [
            'columns'     => [
                ['title' => 'Title', 'field' => 'title', 'imageField' => 'icon_image_id', 'action' => true, 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.cancellation-reason.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $cancellationReasons,
            'actions'     => [
                ['title' => 'Edit', 'route' => 'admin.cancellation-reason.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'cancellation_reason.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.cancellation-reason.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'cancellation_reason.destroy'],
                ['title' => 'Restore', 'route' => 'admin.cancellation-reason.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'cancellation_reason.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.cancellation-reason.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'cancellation_reason.forceDelete'],
            ],
            'filters'     => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->cancellationReason->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->cancellationReason->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->cancellationReason->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->cancellationReason->withTrashed()?->whereNotNull('deleted_at')?->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'cancellation_reason.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'cancellation_reason.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'cancellation_reason.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'cancellation_reason.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'cancellation_reason.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total'       => $this->cancellationReason->count(),
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
        $this->cancellationReason->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->cancellationReason->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->cancellationReason->whereIn('id', $this->request->ids)->delete();
    }
    public function restoreHandler(): void
    {
        $this->cancellationReason->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->cancellationReason->whereIn('id', $this->request->ids)->forceDelete();
    }
}
