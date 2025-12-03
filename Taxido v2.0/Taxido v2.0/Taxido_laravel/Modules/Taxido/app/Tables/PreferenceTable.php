<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Preference;

class PreferenceTable
{
    protected $preference;
    protected $request;

    public function __construct(Request $request)
    {
        $this->preference = new Preference();
        $this->request = $request;
    }
    public function getData()
    {
        $preferences = $this->preference;
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $preferences->where('status', true)->paginate($this->request?->paginate);
                case 'deactive':
                    return $preferences->where('status', false)->paginate($this->request?->paginate);
                case 'trash':
                    return $preferences->withTrashed()?->whereNotNull('deleted_at')?->paginate($this->request?->paginate);
            }
        }

        if ($this->request->has('s')) {
            return $preferences->withTrashed()->where('title', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $preferences->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $preferences->whereNull('deleted_at')->paginate($this->request?->paginate);


        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $preferences = $preferences->withTrashed()->where(function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', "%{$searchTerm}%")
                    ->orWhereHas('services', function ($query) use ($searchTerm) {
                        $query->where('name', 'LIKE', "%{$searchTerm}%");
                    });
            });
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            $preferences = $preferences->orderBy($this->request->orderby, $this->request->order);
        } else {
            $preferences = $preferences->latest();
        }

        return $preferences->paginate($this->request->paginate);
    }

    public function generate()
    {
        $preferences = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $preferences->each(function ($preference) {
            $preference->name = $preference->getTranslation('name', app()->getLocale());
            $preference->date = formatDateBySetting($preference->created_at);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Name', 'field' => 'name', 'imageField' => 'icon_image_id', 'action' => true, 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.preference.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $preferences,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.preference.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'preference.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.preference.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'preference.destroy'],
                ['title' => 'Restore', 'route' => 'admin.preference.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'preference.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.preference.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'preference.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->preference->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->preference->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->preference->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->preference->withTrashed()?->whereNotNull('deleted_at')?->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'preference.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'preference.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'preference.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'preference.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'preference.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $this->preference->count(),
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
        $this->preference->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->preference->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->preference->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->preference->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->preference->whereIn('id', $this->request->ids)->forceDelete();
    }
}
