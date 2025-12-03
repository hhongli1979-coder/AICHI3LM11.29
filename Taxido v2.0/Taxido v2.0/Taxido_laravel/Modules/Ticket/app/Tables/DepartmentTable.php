<?php

namespace Modules\Ticket\Tables;

use Illuminate\Http\Request;
use Modules\Ticket\Models\Department;

class DepartmentTable
{
  protected $department;
  protected $request;

  public function __construct(Request $request)
  {
    $this->department = new Department();
    $this->request = $request;
  }

  public function getData()
  {
    $departments = $this->department;
    if ($this->request->has('filter')) {
      switch ($this->request->filter) {
        case 'active':
          return $departments->where('status', true)->paginate($this->request?->paginate);
        case 'deactive':
          return $departments->where('status', false)->paginate($this->request?->paginate);
        case 'trash':
          return $departments->withTrashed()?->whereNotNull('deleted_at')?->paginate($this->request?->paginate);
      }
    }

    if ($this->request->has('s')) {
      return $departments->withTrashed()->where('name', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
    }

    if ($this->request->has('orderby') && $this->request->has('order')) {
      if ($this->request->orderby == 'date') {
        return $departments->orderBy('created_at', $this->request->order)->paginate($this->request?->paginate);
      }
      return $departments->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
    }

    return $departments->whereNull('deleted_at')->paginate($this->request?->paginate);
  }


  public function generate()
  {
    $departments = $this->getData();
    if ($this->request->has('action') && $this->request->has('ids')) {
      $this->bulkActionHandler();
    }

    $departments->each(function ($departments) {
      $departments->name = $departments->getTranslation('name', app()->getLocale());
      $departments->executives = $departments->assigned_executives;
      $departments->date = formatDateBySetting($departments->created_at);

    });

    $tableConfig = [
      'columns' => [
        ['title' => 'Name', 'field' => 'name', 'action' => true, 'sortable' => true],
        ['title' => 'Executives', 'field' => 'executives', 'type' => 'avatar', 'sortable' => false],
        ['title' => 'Status', 'field' => 'status', 'route' => 'admin.department.status', 'type' => 'status', 'sortable' => false],
        ['title' => 'Created At', 'field' => 'date', 'sortable' => false],
        ['title' => 'Action', 'type' => 'action', 'sortable' => false, 'permission' => ['ticket.department.show', 'ticket.department.edit', 'ticket.department.forceDelete'],],
      ],
      'data' => $departments,
      'actions' => [],
      'filters' => [
        ['title' => 'All', 'slug' => 'all', 'count' => $this->department->count()],
        ['title' => 'Active', 'slug' => 'active', 'count' => $this->department->where('status', true)->count()],
        ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->department->where('status', false)->count()],
      ],
      'bulkactions' => [
        ['title' => 'Active', 'action' => 'active', 'permission' => 'ticket.department.edit', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Deactive', 'action' => 'deactive', 'permission' => 'ticket.department.edit', 'whenFilter' => ['all', 'active', 'deactive']],
      ],
      'actionButtons' => [
        ['icon' => 'ri-ticket-2-line', 'route' => 'admin.department.show', 'class' => 'dark-icon-box', 'permission' => 'ticket.department.show'],
        ['title' => 'Edit', 'icon' => 'ri-edit-line', 'route' => 'admin.department.edit', 'class' => 'dark-icon-box', 'permission' => 'ticket.department.edit', 'isTranslate' => true],
      ],
      'modalActionButtons' => [
        ['icon' => 'ri-delete-bin-5-line', 'route' => 'admin.department.forceDelete', 'permission' => 'ticket.department.forceDelete', 'class' => 'danger-icon-box', 'modalId' => 'deleteModal', 'modalTitle' => 'Delete Item ?', 'modalDesc' => "This Item Will Be Deleted Permanently. You Can't Undo This Action. ", "modalMethod" => "DELETE", "modalBtnText" => 'Delete'],
      ],
      'total' => $this->department->count()
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
    $this->department->whereIn('id', $this->request->ids)->update(['status' => true]);
  }

  public function deactiveHandler(): void
  {
    $this->department->whereIn('id', $this->request->ids)->update(['status' => false]);
  }
}
