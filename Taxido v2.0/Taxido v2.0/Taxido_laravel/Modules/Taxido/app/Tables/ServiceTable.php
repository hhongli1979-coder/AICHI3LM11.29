<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Service;

class ServiceTable
{
    protected $service;
    protected $request;

    public function __construct(Request $request)
    {
        $this->service = new Service();
        $this->request = $request;
    }

    public function getData()
    {
        $services = $this->service;
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    $services = $services->where('status', true);
                    break;
                case 'deactive':
                    $services = $services->where('status', false);
                    break;
            }
        }

        if ($this->request->has('s')) {
            return $services->withTrashed()->where(function ($query) {
                $query->where('name', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhere('type', 'LIKE', "%" . $this->request->s . "%");
            })->paginate($this->request->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $services->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $services->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $services = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $services->each(function ($service) {
            $locale = app()->getLocale();
            $service->name = $service->getTranslation('name', $locale);
            $service->date = formatDateBySetting($service->created_at);
            $service->type = ucfirst($service->type);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Title', 'field' => 'name', 'imageField' => 'service_image_id', 'action' => true, 'sortable' => true],
                ['title' => 'Type', 'field' => 'type', 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.service.status', 'type' => 'status', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at']
            ],
            'data' => $services,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.service.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'service.edit'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->service->count()],
                ['title' => 'Active', 'slug' => 'active', 'count' => $this->service->where('status', true)->count()],
                ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->service->where('status', false)->count()],
            ],
            'bulkactions' => [
                ['title' => 'Active', 'permission' => 'service.edit', 'action' => 'active'],
                ['title' => 'Deactive', 'permission' => 'service.edit', 'action' => 'deactive'],
            ],
            'total' => $this->service->count()
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
        $this->service->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->service->whereIn('id', $this->request->ids)->update(['status' => false]);
    }
}
