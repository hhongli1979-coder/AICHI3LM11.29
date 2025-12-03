<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\ServiceCategory;

class ServiceCategoryTable
{
  protected $serviceCategory;
  protected $request;

  public function __construct(Request $request)
  {
    $this->serviceCategory = new ServiceCategory();
    $this->request = $request;
  }

  public function getData()
  {
    $reqService = request()->service;
    if($reqService) {
      $serviceId = getServiceIdBySlug($reqService);
      if($serviceId) {
        $this->serviceCategory = $this->serviceCategory->where('service_id', $serviceId);
      }
    }

    $serviceCategories = $this->serviceCategory;

    if ($this->request->has('filter')) {
      switch ($this->request->filter) {
        case 'active':
          $serviceCategories = $serviceCategories->where('status', true);
          break;
        case 'deactive':
          $serviceCategories = $serviceCategories->where('status', false);
          break;
      }
    }

    if ($this->request->has('s')) {
      return $serviceCategories->withTrashed()?->where('name', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
    }

    if ($this->request->has('orderby') && $this->request->has('order')) {
      return $serviceCategories->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
    }

    return $serviceCategories->paginate($this->request?->paginate);
  }

  public function generate()
  {
    $serviceCategories = $this->getData();
    if ($this->request->has('action') && $this->request->has('ids')) {
      $this->bulkActionHandler();
    }

    $serviceCategories->each(function ($serviceCategory) {
 
      $serviceCategory->name = $serviceCategory->getTranslation('name', app()->getLocale());
      $serviceCategory->description = $serviceCategory->getTranslation('description', app()->getLocale());
      $serviceCategory->services = $serviceCategory->service?->name;
      $serviceCategory->date = formatDateBySetting($serviceCategory->created_at);
      $serviceCategory->type = ucfirst($serviceCategory->type);
    });

    $reqService = request()->service;
    $serviceId = getServiceIdBySlug($reqService);
    $availableServiceCategories = ServiceCategory::where('service_id', $serviceId)->paginate($this->request?->paginate);

    $tableConfig = [
      'columns' => [
        ['title' => 'Name', 'field' => 'name', 'imageField' => 'service_category_image_id', 'action' => true, 'sortable' => true],
        ['title' => 'Service', 'field' => 'services', 'sortable' => false],
        ['title' => 'Status', 'field' => 'status', 'route' => 'admin.service-category.status', 'type' => 'status', 'sortable' => true],
        ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at']
      ],
      'data' => $serviceCategories,

      'actions' => [
        ['title' => 'Edit',  'route' => getServiceCategoryEditRoute(), 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'service_category.edit'],
        ['title' => 'Restore', 'route' => 'admin.service-category.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'service_category.restore'],
      ],
      'filters' => [
        ['title' => 'All', 'slug' => 'all', 'count' => $availableServiceCategories->count()],
        ['title' => 'Active', 'slug' => 'active', 'count' => $availableServiceCategories->where('status', true)->count()],
        ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $availableServiceCategories->where('status', false)->count()],
      ],
      'bulkactions' => [
        ['title' => 'Active', 'permission' => 'service_category.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Deactive', 'permission' => 'service_category.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
      ],
      'total' => $serviceCategories->count()
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
    $this->serviceCategory->whereIn('id', $this->request->ids)->update(['status' => true]);
  }

  public function deactiveHandler(): void
  {
    $this->serviceCategory->whereIn('id', $this->request->ids)->update(['status' => false]);
  }
}
