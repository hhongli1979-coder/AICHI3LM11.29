<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Banner;

class BannerTable
{
    protected $banner;
    protected $request;

    public function __construct(Request $request)
    {
        $this->banner = new Banner();
        $this->request = $request;
    }
    public function getData()
    {
        $banners = $this->banner;
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $banners->where('status', true)->paginate($this->request?->paginate);
                case 'deactive':
                    return $banners->where('status', false)->paginate($this->request?->paginate);
                case 'trash':
                    return $banners->withTrashed()?->whereNotNull('deleted_at')?->paginate($this->request?->paginate);
            }
        }

        if ($this->request->has('s')) {
            return $banners->withTrashed()->where('title', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $banners->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $banners->whereNull('deleted_at')->paginate($this->request?->paginate);


        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $banners = $banners->withTrashed()->where(function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', "%{$searchTerm}%")
                    ->orWhereHas('services', function ($query) use ($searchTerm) {
                        $query->where('name', 'LIKE', "%{$searchTerm}%");
                    });
            });
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            $banners = $banners->orderBy($this->request->orderby, $this->request->order);
        } else {
            $banners = $banners->latest();
        }

        return $banners->paginate($this->request->paginate);
    }

    public function generate()
    {
        $banners = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $banners->each(function ($banner) {
            $banner->banner_image_id = $banner->getTranslation('banner_image_id', app()->getLocale());
            $banner->title = $banner->getTranslation('title', app()->getLocale());
            $banner->services = $banner->services()->pluck('name')->implode(', ');
            $banner->date = formatDateBySetting($banner->created_at);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Title', 'field' => 'title', 'imageField' => 'banner_image_id', 'action' => true, 'sortable' => true],
                ['title' => 'Services', 'field' => 'services', 'sortable' => false],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.banner.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
            ],
            'data' => $banners,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.banner.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'banner.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.banner.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'banner.destroy'],
                ['title' => 'Restore', 'route' => 'admin.banner.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'banner.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.banner.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'banner.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->banner->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->banner->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->banner->where('status', false)->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->banner->withTrashed()?->whereNotNull('deleted_at')?->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'banner.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Deactive', 'permission' => 'banner.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to Trash', 'permission' => 'banner.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'banner.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'banner.forceDelete', 'whenFilter' => ['trash']],
            ],
            'total' => $this->banner->count(),
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
        $this->banner->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->banner->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashedHandler(): void
    {
        $this->banner->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->banner->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->banner->whereIn('id', $this->request->ids)->forceDelete();
    }
}
